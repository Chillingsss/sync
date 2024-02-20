<?php
$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "db_socialmedia";

session_start();

if (!isset($_SESSION['id'])) {
    header('Location: login.html');
    exit();
}

$loggedInUserId = $_SESSION['id']; // Assuming the user ID is stored in the session

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

$sql = "SELECT 
        uploads.id AS postId,
        uploads.filename,
        uploads.upload_date,
        uploads.caption
        FROM uploads
        WHERE uploads.userID = :loggedInUserId
        ORDER BY uploads.upload_date DESC";

$stmt = $conn->prepare($sql);
$stmt->bindParam(':loggedInUserId', $loggedInUserId, PDO::PARAM_INT);
$stmt->execute();
$posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Output the posts data as JSON
header('Content-Type: application/json');
echo json_encode($posts);
?>