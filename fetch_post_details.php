<?php
$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "db_socialmedia";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

$sql = "SELECT 
        posts.id,
        posts.filename,
        posts.upload_date,
        posts.caption,
        posts.userID,
        tbl_users.firstname
        FROM posts
        INNER JOIN tbl_users ON tbl_users.id = posts.userID
        ORDER BY posts.upload_date DESC";

$stmt = $conn->prepare($sql);
$stmt->execute();
$posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($posts);

$conn = null;
?>