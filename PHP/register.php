<?php
$servername = "127.0.0.1";
$username = "root";
$password = ""; // If you haven't set a password, leave it empty
$database = "db_socialmedia";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $firstname = $_POST["reg-firstname"];
    $middlename = $_POST["reg-middlename"];
    $lastname = $_POST["reg-lastname"];
    $email = $_POST["reg-email"];
    $cpnumber = $_POST["reg-cpnumber"];
    $username = $_POST["reg-username"];
    $password = password_hash($_POST["reg-password"], PASSWORD_DEFAULT);

    $sql = "INSERT INTO tbl_users (firstname, middlename, lastname, email, cpnumber, username, password)
            VALUES ('$firstname', '$middlename', '$lastname', '$email', '$cpnumber', '$username', '$password')";

    if ($conn->query($sql) === TRUE) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>