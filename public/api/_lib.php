<?php
// Hàm dùng chung cho API quản trị. Chạy được trên PHP 7.4+ (hosting cPanel/LiteSpeed).

if (basename($_SERVER['SCRIPT_FILENAME'] ?? '') === basename(__FILE__)) {
    http_response_code(404);
    exit;
}

const LCA_PLACEHOLDER = 'DOI-MAT-KHAU-NAY';
const LCA_MAX_BODY = 2 * 1024 * 1024;       // 2 MB nội dung
const LCA_MAX_UPLOAD = 5 * 1024 * 1024;     // 5 MB mỗi ảnh
const LCA_KEEP_BACKUPS = 30;
const LCA_SESSION_TTL = 8 * 3600;           // tự đăng xuất sau 8 giờ không dùng
const LCA_MAX_ATTEMPTS = 5;
const LCA_LOCK_SECONDS = 15 * 60;

if (is_file(__DIR__ . '/config.php')) {
    require __DIR__ . '/config.php';
}

function lca_json($data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, max-age=0');
    header('X-LiteSpeed-Cache-Control: no-cache');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function lca_fail(string $message, int $status = 400): void
{
    lca_json(['error' => $message], $status);
}

function lca_configured(): bool
{
    return defined('ADMIN_PASSWORD')
        && is_string(ADMIN_PASSWORD)
        && ADMIN_PASSWORD !== LCA_PLACEHOLDER
        && strlen(ADMIN_PASSWORD) >= 10;
}

/**
 * Thư mục lưu dữ liệu. Ưu tiên nằm NGOÀI public_html để không truy cập được từ web
 * và không bị ghi đè khi tải lại bản build; nếu hosting không cho thì dùng api/data có chặn truy cập.
 */
function lca_data_dir(): string
{
    static $dir = null;
    if ($dir !== null) return $dir;

    $candidates = [];
    if (getenv('LCA_DATA_DIR')) $candidates[] = rtrim(getenv('LCA_DATA_DIR'), '/\\');
    $candidates[] = dirname(__DIR__, 2) . '/lamchuai-data';
    $candidates[] = __DIR__ . '/data';

    foreach ($candidates as $c) {
        if ((is_dir($c) || @mkdir($c, 0750, true)) && is_writable($c)) {
            if ($c === __DIR__ . '/data' && !is_file("$c/.htaccess")) {
                @file_put_contents("$c/.htaccess", "Require all denied\n");
                @file_put_contents("$c/index.html", '');
            }
            @mkdir("$c/backups", 0750, true);
            return $dir = $c;
        }
    }
    lca_fail('Máy chủ không cho phép ghi dữ liệu. Hãy kiểm tra quyền thư mục.', 500);
    return '';
}

function lca_content_file(): string
{
    return lca_data_dir() . '/content.json';
}

/** Ghi file an toàn: ghi ra file tạm rồi đổi tên, tránh file hỏng khi lỗi giữa chừng. */
function lca_write(string $path, string $data): void
{
    $tmp = $path . '.' . bin2hex(random_bytes(4)) . '.tmp';
    if (file_put_contents($tmp, $data, LOCK_EX) === false || !rename($tmp, $path)) {
        @unlink($tmp);
        lca_fail('Không ghi được dữ liệu lên máy chủ.', 500);
    }
}

function lca_is_https(): bool
{
    return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || ($_SERVER['SERVER_PORT'] ?? '') === '443'
        || strtolower($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';
}

function lca_start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) return;
    session_name('lca_admin');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => lca_is_https(),
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_start();
}

function lca_logged_in(): bool
{
    lca_start_session();
    $ok = !empty($_SESSION['lca_admin']) && (time() - (int)($_SESSION['lca_seen'] ?? 0)) < LCA_SESSION_TTL;
    if ($ok) $_SESSION['lca_seen'] = time();
    return $ok;
}

/** Chặn yêu cầu từ trang khác: bắt buộc header X-LCA và Origin (nếu có) phải cùng tên miền. */
function lca_require_same_origin(): void
{
    if (($_SERVER['HTTP_X_LCA'] ?? '') !== '1') lca_fail('Yêu cầu không hợp lệ.', 403);
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin !== '') {
        // HTTP_HOST có thể kèm cổng (localhost:8080) nên so sánh phần tên máy.
        $host = parse_url('http://' . ($_SERVER['HTTP_HOST'] ?? ''), PHP_URL_HOST);
        if (parse_url($origin, PHP_URL_HOST) !== $host) lca_fail('Yêu cầu không hợp lệ.', 403);
    }
}

function lca_read_json_body(): array
{
    $raw = file_get_contents('php://input', false, null, 0, LCA_MAX_BODY + 1);
    if ($raw === false || strlen($raw) > LCA_MAX_BODY) lca_fail('Nội dung quá lớn.', 413);
    $data = json_decode($raw, true);
    if (!is_array($data)) lca_fail('Dữ liệu gửi lên không hợp lệ.');
    return $data;
}

/* ---------- Giới hạn số lần đăng nhập sai theo IP ---------- */

/** $fn nhận danh sách lượt thử, trả về [kết quả, danh sách mới]; file được khóa trong lúc chạy. */
function lca_attempts(callable $fn)
{
    $path = lca_data_dir() . '/attempts.json';
    $fh = fopen($path, 'c+');
    if (!$fh) return $fn([])[0];
    flock($fh, LOCK_EX);
    $all = json_decode(stream_get_contents($fh) ?: '{}', true) ?: [];
    $now = time();
    foreach ($all as $k => $v) {
        if (($v['until'] ?? 0) < $now && $now - ($v['first'] ?? 0) > LCA_LOCK_SECONDS) unset($all[$k]);
    }
    [$result, $all] = $fn($all);
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode($all));
    flock($fh, LOCK_UN);
    fclose($fh);
    return $result;
}

function lca_client_key(): string
{
    return hash('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown');
}
