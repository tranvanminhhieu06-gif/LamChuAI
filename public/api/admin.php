<?php
// API cho trang /admin: đăng nhập, xuất bản nội dung, xem phiên bản cũ, tải ảnh.
require __DIR__ . '/_lib.php';

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($action === 'status') {
    lca_json(['configured' => lca_configured(), 'loggedIn' => lca_configured() && lca_logged_in()]);
}

lca_require_same_origin();
if (!lca_configured()) lca_fail('Chưa đặt mật khẩu quản trị trong api/config.php.', 503);

/* ---------- Đăng nhập / đăng xuất ---------- */

if ($action === 'login' && $method === 'POST') {
    $key = lca_client_key();
    $now = time();
    $locked = lca_attempts(function ($all) use ($key, $now) {
        return [($all[$key]['until'] ?? 0) > $now ? $all[$key]['until'] : 0, $all];
    });
    if ($locked) {
        lca_fail('Sai quá nhiều lần. Thử lại sau ' . ceil(($locked - $now) / 60) . ' phút.', 429);
    }

    $password = lca_read_json_body()['password'] ?? '';
    if (is_string($password) && hash_equals(ADMIN_PASSWORD, $password)) {
        lca_attempts(function ($all) use ($key) {
            unset($all[$key]);
            return [null, $all];
        });
        lca_start_session();
        session_regenerate_id(true);
        $_SESSION['lca_admin'] = true;
        $_SESSION['lca_seen'] = time();
        lca_json(['ok' => true]);
    }

    sleep(1); // làm chậm dò mật khẩu
    $left = lca_attempts(function ($all) use ($key, $now) {
        $a = $all[$key] ?? ['count' => 0, 'first' => $now, 'until' => 0];
        $a['count']++;
        if ($a['count'] >= LCA_MAX_ATTEMPTS) {
            $a = ['count' => 0, 'first' => $now, 'until' => $now + LCA_LOCK_SECONDS];
        }
        $all[$key] = $a;
        return [$a['until'] ? 0 : LCA_MAX_ATTEMPTS - $a['count'], $all];
    });
    lca_fail($left ? "Sai mật khẩu. Còn $left lần thử." : 'Sai quá nhiều lần. Thử lại sau 15 phút.', $left ? 401 : 429);
}

if ($action === 'logout' && $method === 'POST') {
    lca_start_session();
    $_SESSION = [];
    session_destroy();
    lca_json(['ok' => true]);
}

/* ---------- Các thao tác cần đăng nhập ---------- */

if (!lca_logged_in()) lca_fail('Bạn cần đăng nhập lại.', 401);

if ($action === 'save' && $method === 'POST') {
    $content = lca_read_json_body()['content'] ?? null;
    if (!is_array($content) || !isset($content['blocks']) || !is_array($content['blocks'])
        || !is_array($content['theme'] ?? null) || !is_array($content['site'] ?? null)) {
        lca_fail('Nội dung không đúng định dạng.');
    }
    $content['version'] = 1;
    $content['updatedAt'] = gmdate('c');
    $json = json_encode($content, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) lca_fail('Nội dung không đúng định dạng.');

    $file = lca_content_file();
    $dir = lca_data_dir() . '/backups';
    if (is_file($file)) {
        $name = 'content-' . date('Ymd-His') . '-' . bin2hex(random_bytes(2)) . '.json';
        @copy($file, "$dir/$name");
        $old = glob("$dir/content-*.json") ?: [];
        rsort($old);
        foreach (array_slice($old, LCA_KEEP_BACKUPS) as $f) @unlink($f);
    }
    lca_write($file, $json);
    lca_json(['ok' => true, 'updatedAt' => $content['updatedAt']]);
}

if ($action === 'backups') {
    $files = glob(lca_data_dir() . '/backups/content-*.json') ?: [];
    rsort($files);
    $items = array_map(function ($f) {
        return ['name' => basename($f), 'time' => date('c', filemtime($f)), 'size' => filesize($f)];
    }, $files);
    lca_json(['items' => $items]);
}

if ($action === 'backup') {
    $name = $_GET['name'] ?? '';
    if (!preg_match('/^content-\d{8}-\d{6}-[a-f0-9]{4}\.json$/', $name)) lca_fail('Tên phiên bản không hợp lệ.');
    $path = lca_data_dir() . "/backups/$name";
    if (!is_file($path)) lca_fail('Không tìm thấy phiên bản này.', 404);
    $data = json_decode(file_get_contents($path), true);
    lca_json($data ?: (object)[]);
}

if ($action === 'upload' && $method === 'POST') {
    $f = $_FILES['file'] ?? null;
    if (!$f || ($f['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        $tooBig = in_array($f['error'] ?? 0, [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true);
        lca_fail($tooBig ? 'Ảnh vượt quá giới hạn dung lượng của hosting.' : 'Không nhận được file ảnh.');
    }
    if ($f['size'] > LCA_MAX_UPLOAD) lca_fail('Ảnh tối đa 5 MB.');

    // Kiểm tra nội dung thật của file, không tin phần mở rộng do người dùng gửi.
    $info = @getimagesize($f['tmp_name']);
    $types = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_GIF => 'gif', IMAGETYPE_WEBP => 'webp'];
    if (!$info || !isset($types[$info[2]])) lca_fail('Chỉ nhận ảnh JPG, PNG, WEBP hoặc GIF.');

    $root = dirname(__DIR__);
    $sub = date('Y/m');
    $dir = "$root/uploads/$sub";
    if (!is_dir($dir) && !@mkdir($dir, 0755, true)) lca_fail('Không tạo được thư mục uploads.', 500);
    $guard = "$root/uploads/.htaccess";
    if (!is_file($guard)) {
        @file_put_contents($guard, "<FilesMatch \"\\.(php\\d?|phtml|phar|pl|py|cgi|sh)$\">\n  Require all denied\n</FilesMatch>\n");
    }

    $name = date('His') . '-' . bin2hex(random_bytes(6)) . '.' . $types[$info[2]];
    if (!move_uploaded_file($f['tmp_name'], "$dir/$name")) lca_fail('Lưu ảnh thất bại.', 500);
    @chmod("$dir/$name", 0644);
    lca_json(['url' => "/uploads/$sub/$name"]);
}

lca_fail('Thao tác không được hỗ trợ.', 404);
