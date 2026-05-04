<?php

// Generate a secure Reverb app key
$length = 32;
$bytes = random_bytes($length);
$key = bin2hex($bytes);

echo "Generated Reverb App Key: " . $key . "\n";

// Also generate a secret
$secretLength = 32;
$secretBytes = random_bytes($secretLength);
$secret = bin2hex($secretBytes);

echo "Generated Reverb App Secret: " . $secret . "\n";

// Generate app ID
$appId = 'app-' . uniqid();
echo "Generated Reverb App ID: " . $appId . "\n";
