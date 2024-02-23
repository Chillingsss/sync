<?php
$servername = "127.0.0.1";
$username = "root";
$password = "pelino"; // If you haven't set a password, leave it empty
$database = "db_socialmedia";


$conn = new mysqli($servername, $username, $password, $database);


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
    $password = password_hash($_POST["reg-password"], PASSWORD_DEFAULT);
    $retypePassword = $_POST['reg-retype-password'];

    $sql = "INSERT INTO tbl_users (firstname, middlename, lastname, email, cpnumber, username, password)
            VALUES ('$firstname', '$middlename', '$lastname', '$email', '$cpnumber', '$username', '$password')";

    $result = $conn->query($sql);

    if ($result === TRUE) {
        $response["status"] = "success";
        $response["message"] = "New record created successfully";
    } else {
        $response["status"] = "error";
        $response["message"] = "Error: " . $sql . "<br>" . $conn->error;
        $response["query"] = $sql; // Add the actual query to the response for debugging
    }

}

echo json_encode($response); // Send JSON response

$conn->close();
?>