<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$dataFile = __DIR__ . '/../data/orders.json';
if (!file_exists(dirname($dataFile))) {
    mkdir(dirname($dataFile), 0775, true);
}
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode([], JSON_PRETTY_PRINT));
}

function readOrders($path) {
    $raw = @file_get_contents($path);
    $decoded = $raw ? json_decode($raw, true) : [];
    return is_array($decoded) ? $decoded : [];
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $orderId = isset($_GET['id']) ? trim($_GET['id']) : '';
    $orders = readOrders($dataFile);
    if ($orderId !== '') {
        foreach ($orders as $order) {
            if (isset($order['orderId']) && strcasecmp($order['orderId'], $orderId) === 0) {
                echo json_encode(['ok' => true, 'order' => $order]);
                exit;
            }
        }
        http_response_code(404);
        echo json_encode(['ok' => false, 'error' => 'Order not found']);
        exit;
    }
    echo json_encode(['ok' => true, 'count' => count($orders)]);
    exit;
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!is_array($input) || empty($input['items']) || empty($input['customer'])) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Invalid order payload']);
        exit;
    }

    $orderId = 'TV-' . date('Y') . '-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 5));
    $order = [
        'orderId' => $orderId,
        'status' => 'Confirmed',
        'createdAt' => date('c'),
        'customer' => [
            'name' => htmlspecialchars(trim($input['customer']['name'] ?? ''), ENT_QUOTES, 'UTF-8'),
            'phone' => htmlspecialchars(trim($input['customer']['phone'] ?? ''), ENT_QUOTES, 'UTF-8'),
            'email' => htmlspecialchars(trim($input['customer']['email'] ?? ''), ENT_QUOTES, 'UTF-8'),
            'address' => htmlspecialchars(trim($input['customer']['address'] ?? ''), ENT_QUOTES, 'UTF-8'),
            'city' => htmlspecialchars(trim($input['customer']['city'] ?? ''), ENT_QUOTES, 'UTF-8'),
            'pincode' => htmlspecialchars(trim($input['customer']['pincode'] ?? ''), ENT_QUOTES, 'UTF-8'),
        ],
        'paymentMethod' => htmlspecialchars(trim($input['paymentMethod'] ?? 'UPI'), ENT_QUOTES, 'UTF-8'),
        'promoCode' => htmlspecialchars(trim($input['promoCode'] ?? ''), ENT_QUOTES, 'UTF-8'),
        'items' => $input['items'],
        'totals' => $input['totals'] ?? [],
    ];

    $orders = readOrders($dataFile);
    array_unshift($orders, $order);
    file_put_contents($dataFile, json_encode($orders, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    echo json_encode(['ok' => true, 'order' => $order]);
    exit;
}

http_response_code(405);
echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
