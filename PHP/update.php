<?php
session_start();

class Update
{
    private $conn;

    public function __construct()
    {
        // Initialize database connection in the constructor
        $servername = "127.0.0.1";
        $username = "root";
        $password = "pelino";
        $database = "db_socialmedia";

        $this->conn = new mysqli($servername, $username, $password, $database);

        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
    }

    public function update($json)
    {
        $json = json_decode($json, true);

        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            // Check if the user is logged in
            if (isset($_SESSION["userDetails"]["id"])) {
                $userId = $_SESSION["userDetails"]["id"];

                // Get updated details from the POST data
                $updatedFirstname = $json["updated-firstname"];
                $updatedMiddlename = $json["updated-middlename"];
                $updatedLastname = $json["updated-lastname"];
                $updatedEmail = $json["updated-email"];
                $updatedCpnumber = $json["updated-cpnumber"];
                $updatedUsername = $json["updated-username"];
                $updatedPassword = $json["updated-password"];

                // Use prepared statement to update user details
                $stmt = $this->conn->prepare("UPDATE tbl_users SET firstname=?, middlename=?, lastname=?, email=?, cpnumber=?, username=?, password=? WHERE id=?");
                $stmt->bind_param("ssssisss", $updatedFirstname, $updatedMiddlename, $updatedLastname, $updatedEmail, $updatedCpnumber, $updatedUsername, $updatedPassword, $userId);

                // Check for errors in binding parameters
                if ($stmt->error) {
                    return json_encode(array("status" => -1, "message" => "Error binding parameters: " . $stmt->error));
                }

                // Execute the statement
                if ($stmt->execute()) {
                    return json_encode(array("status" => 1, "message" => "Details updated successfully"));
                } else {
                    return json_encode(array("status" => -1, "message" => "Error updating details: " . $stmt->error));
                }

                $stmt->close();
            } else {
                return json_encode(array("status" => -1, "message" => "User not logged in"));
            }
        }
    }

    public function __destruct()
    {
        // Close the database connection in the destructor
        $this->conn->close();
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
