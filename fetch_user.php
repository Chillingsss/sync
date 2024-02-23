<?php
header('Content-Type: application/json');

// Your database connection logic
$servername = "127.0.0.1";
$username = "root";
$password = "pelino";
$dbname = "db_socialmedia";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["error" => "Connection failed: " . $e->getMessage()]);
    exit;
}

// Retrieve userId from the query parameters
$userId = isset($_GET['userId']) ? $_GET['userId'] : '';

// Fetch user details from the database based on userId
$sql = "SELECT firstname FROM tbl_users WHERE id = :userId";
$stmt = $conn->prepare($sql);
$stmt->bindParam(':userId', $userId);
$stmt->execute();

// Fetch the user details as an associative array
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// Close the database connection
$conn = null;

// Return user details as JSON
echo json_encode($user);
?>