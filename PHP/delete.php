<?php
session_start();

$servername = "127.0.0.1";
$username = "root";
$password = "";
$database = "user_registration";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the user is logged in
if (isset($_SESSION["userDetails"])) {
    $userId = $_SESSION["userDetails"]["id"];

    // Perform cleanup in the database
    $sql = "DELETE FROM users WHERE id = '$userId'";
    if ($conn->query($sql) === TRUE) {
        // Unset all session variables
        session_unset();

        // Destroy the session
        session_destroy();

        echo "Account deleted successfully";
    } else {
        echo "Error deleting account: " . $conn->error;
    }
} else {
    echo "User not logged in";
}

$conn->close();
?>