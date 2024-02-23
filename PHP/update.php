<?php
session_start();

class Update
{
    function update($json)
    {
        $json = json_decode($json, true);
        $servername = "127.0.0.1";
        $username = "root";
        $password = "pelino"; // If you haven't set a password, leave it empty
        $database = "user_registration";

        $conn = new mysqli($servername, $username, $password, $database);

        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            // Check if user is logged in
            if (isset($_SESSION["userDetails"])) {
                $userId = $_SESSION["userDetails"]["id"];

                // Get updated details from the POST data
                $updatedFirstname = $json["updated-firstname"];
                $updatedMiddlename = $json["updated-middlename"];
                $updatedLastname = $json["updated-lastname"];

                // Update user details in the database using prepared statement
                $stmt = $conn->prepare("UPDATE users SET firstname=?, middlename=?, lastname=? WHERE id=?");
                $stmt->bind_param("sssi", $updatedFirstname, $updatedMiddlename, $updatedLastname, $userId);

                if ($stmt->execute()) {
                    echo "Details updated successfully";
                } else {
                    echo "Error updating details: " . $stmt->error;
                }

                $stmt->close();
            } else {
                echo "User not logged in";
            }
        }

        $conn->close();
    }
}

$operation = isset($_POST["operation"]) ? $_POST["operation"] : "Invalid";
$json = isset($_POST["json"]) ? $_POST["json"] : "";

$data = new Update();
switch ($operation) {
    case "update":
        echo $data->update($json);
        break;
    default:
        echo json_encode(array("status" => -1, "message" => "Invalid operation."));
}