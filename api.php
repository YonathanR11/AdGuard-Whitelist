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
    $inHeader = true;
    
    foreach ($lines as $line) {
        $trimmed = trim($line);
        if (strpos($trimmed, '@@') === 0) {
            $rules[] = $trimmed;
            $inHeader = false;
        } elseif ($inHeader && ($trimmed !== '' || count($header) > 0)) {
            $header[] = $line;
        }
    }
    
    // Remove trailing empty lines from header
    while (count($header) > 0 && trim($header[count($header) - 1]) === '') {
        array_pop($header);
    }
    
    return [
        'header' => implode("\n", $header),
        'rules' => $rules
    ];
}

function writeWhitelist($header, $rules) {
    global $whitelistFile;
    $content = $header . "\n\n" . implode("\n", $rules) . "\n";
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
                    // Check for duplicates
                    if (in_array($newRule, $data['rules'])) {
                        echo json_encode(['success' => false, 'error' => 'Rule already exists']);
                        break;
                    }
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
                    // Check if the new rule is different from the current one
                    if ($data['rules'][$index] !== $newRule) {
                        // Check for duplicates with other rules
                        foreach ($data['rules'] as $i => $rule) {
                            if ($i !== $index && $rule === $newRule) {
                                echo json_encode(['success' => false, 'error' => 'Rule already exists']);
                                break 2;
                            }
                        }
                    }
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
