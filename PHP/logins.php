<?php
session_start();

$servername = "127.0.0.1";
$username = "root";
$password = ""; // If you haven't set a password, leave it empty
$database = "user_registration";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["login-username"];
    $password = $_POST["login-password"];

    $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();

        if (password_verify($password, $row["password"])) {
            // Set user details in the session
            $_SESSION["userDetails"] = [
                "id" => $row["id"],
                "firstname" => $row["firstname"],
                "middlename" => $row["middlename"],
                "lastname" => $row["lastname"],
                "username" => $row["username"]
            ];

            // Set login status in the session
            $_SESSION["isLoggedIn"] = true;

            // Return a JSON response with user details and redirect
            $response = [
                "status" => "success",
                "userDetails" => $_SESSION["userDetails"],
                "redirect" => "dashboard.html"
            ];

            // Set appropriate headers
            header('Content-Type: application/json');
            return json_encode($response);
        } else {
            // Return a JSON response for incorrect password
            $response = ["status" => "error", "message" => "Incorrect password"];

            // Set appropriate headers
            header('Content-Type: application/json');
            return json_encode($response);
        }
    } else {
        // Return a JSON response for user not found
        $response = ["status" => "error", "message" => "User not found"];

        // Set appropriate headers
        header('Content-Type: application/json');
        return json_encode($response);
    }

    $stmt->close();
}

$conn->close();
?>