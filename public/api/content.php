<?php
// Trả về nội dung trang đã xuất bản (công khai, chỉ đọc).
require __DIR__ . '/_lib.php';

$file = lca_content_file();
if (!is_file($file)) lca_json(['error' => 'Chưa có nội dung xuất bản.'], 404);

http_response_code(200);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('X-LiteSpeed-Cache-Control: no-cache');
header('X-Content-Type-Options: nosniff');
readfile($file);
