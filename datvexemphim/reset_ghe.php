<?php
// Script để xóa dữ liệu ghế cũ và test lại
// Chạy: php reset_ghe.php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Xóa tất cả ghế
\App\Models\Ghe::truncate();

echo "✅ Đã xóa toàn bộ dữ liệu ghế. API sẽ tự động tạo lại khi truy cập.\n";
echo "👉 Bây giờ hãy truy cập: http://localhost:8000/api/suat-chieu/1/ghe\n";
