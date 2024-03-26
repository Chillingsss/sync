<?php
$servername = "127.0.0.1";
$username = "root";
$password = "pelino";
$database = "db_socialmedia";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$response = array();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $firstname = $_POST["reg-firstname"];
    $middlename = $_POST["reg-middlename"];
    $lastname = $_POST["reg-lastname"];
    $email = $_POST["reg-email"];
    $cpnumber = $_POST["reg-cpnumber"];
    $username = $_POST["reg-username"];
    $password = $_POST["reg-password"];
    $retypePassword = $_POST['reg-retype-password'];

    // Check if email or username already exists
    $checkQuery = "SELECT * FROM tbl_users WHERE email='$email' OR username='$username'";
    $checkResult = $conn->query($checkQuery);

    if ($checkResult->num_rows > 0) {
        $response["status"] = "error";
        $response["message"] = "Email or username already exists.";
    } else {
        // Insert new record if email and username are unique
        $sql = "INSERT INTO tbl_users (firstname, middlename, lastname, email, cpnumber, username, password)
                VALUES ('$firstname', '$middlename', '$lastname', '$email', '$cpnumber', '$username', '$password')";

        if ($conn->query($sql) === TRUE) {
            $response["status"] = "success";
            $response["message"] = "New record created successfully";
        } else {
            $response["status"] = "error";
            $response["message"] = "Error: " . $sql . "<br>" . $conn->error;
            $response["query"] = $sql;
        }
    }
}

echo json_encode($response);

$conn->close();
