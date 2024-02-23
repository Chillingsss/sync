<?php
header('Content-Type: application/json');

// Your database connection logic (similar to what you've done in your previous PHP files)
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

// Assuming you have received the postId and comment in the POST request
$comment_userID = isset($_POST['comment_userID']) ? $_POST['comment_userID'] : '';
$comment_message = isset($_POST['comment_message']) ? $_POST['comment_message'] : '';
$comment_uploadId = isset($_POST['comment_uploadId']) ? $_POST['comment_uploadId'] : '';

// Insert the comment into the database
$sql = "INSERT INTO tbl_comment (comment_userID, comment_message, comment_uploadId) VALUES (:comment_userID, :comment_message, :comment_uploadId)";
$stmt = $conn->prepare($sql);
$stmt->bindParam(':comment_userID', $comment_userID);
$stmt->bindParam(':comment_message', $comment_message);
$stmt->bindParam(':comment_uploadId', $comment_uploadId);

try {
    $stmt->execute();
    echo json_encode(["message" => "Comment added successfully!"]);
} catch (PDOException $e) {
    echo json_encode(["error" => "Error adding comment: " . $e->getMessage()]);
}

// Close the database connection
$conn = null;
?>