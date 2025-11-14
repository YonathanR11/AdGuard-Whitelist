<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$whitelistFile = 'whitelist.txt';

function readWhitelist() {
    global $whitelistFile;
    if (!file_exists($whitelistFile)) {
        return ['header' => '', 'rules' => []];
    }
    
    $content = file_get_contents($whitelistFile);
    $lines = explode("\n", $content);
    
    $header = [];
    $rules = [];
    
    foreach ($lines as $line) {
        if (strpos($line, '@@') === 0) {
            $rules[] = trim($line);
        } else {
            $header[] = $line;
        }
    }
    
    return [
        'header' => implode("\n", $header),
        'rules' => $rules
    ];
}

function writeWhitelist($header, $rules) {
    global $whitelistFile;
    $content = $header . "\n" . implode("\n", $rules) . "\n";
    return file_put_contents($whitelistFile, $content);
}

function updateLastModified($header) {
    $lines = explode("\n", $header);
    $today = date('Y-m-d');
    $version = date('Y.m.d');
    
    foreach ($lines as &$line) {
        if (strpos($line, '! Last modified:') === 0) {
            $line = '! Last modified: ' . $today;
        } elseif (strpos($line, '! Version:') === 0) {
            $line = '! Version: ' . $version;
        }
    }
    
    return implode("\n", $lines);
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $data = readWhitelist();
        echo json_encode($data);
        break;
        
    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        $action = $input['action'] ?? '';
        
        $data = readWhitelist();
        
        switch ($action) {
            case 'add':
                $newRule = trim($input['rule'] ?? '');
                if ($newRule && strpos($newRule, '@@') === 0) {
                    $data['rules'][] = $newRule;
                    $data['header'] = updateLastModified($data['header']);
                    writeWhitelist($data['header'], $data['rules']);
                    echo json_encode(['success' => true, 'data' => $data]);
                } else {
                    echo json_encode(['success' => false, 'error' => 'Invalid rule format']);
                }
                break;
                
            case 'edit':
                $index = $input['index'] ?? -1;
                $newRule = trim($input['rule'] ?? '');
                if ($index >= 0 && $index < count($data['rules']) && $newRule && strpos($newRule, '@@') === 0) {
                    $data['rules'][$index] = $newRule;
                    $data['header'] = updateLastModified($data['header']);
                    writeWhitelist($data['header'], $data['rules']);
                    echo json_encode(['success' => true, 'data' => $data]);
                } else {
                    echo json_encode(['success' => false, 'error' => 'Invalid index or rule format']);
                }
                break;
                
            case 'delete':
                $index = $input['index'] ?? -1;
                if ($index >= 0 && $index < count($data['rules'])) {
                    array_splice($data['rules'], $index, 1);
                    $data['header'] = updateLastModified($data['header']);
                    writeWhitelist($data['header'], $data['rules']);
                    echo json_encode(['success' => true, 'data' => $data]);
                } else {
                    echo json_encode(['success' => false, 'error' => 'Invalid index']);
                }
                break;
                
            default:
                echo json_encode(['success' => false, 'error' => 'Invalid action']);
        }
        break;
        
    default:
        echo json_encode(['success' => false, 'error' => 'Method not allowed']);
}
?>
