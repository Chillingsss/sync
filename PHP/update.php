<?php

session_start();

class Update
{
    private $conn;

    public function __construct()
    {

        $servername = "127.0.0.1";
        $username = "root";
        $password = "pelino";
        $database = "db_socialmedia";

        $this->conn = new mysqli($servername, $username, $password, $database);

        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
    }

    public function update($formData)
    {

        $updatedFirstname = $formData["updated-firstname"];
        $updatedMiddlename = $formData["updated-middlename"];
        $updatedLastname = $formData["updated-lastname"];
        $updatedEmail = $formData["updated-email"];
        $updatedCpnumber = $formData["updated-cpnumber"];
        $updatedUsername = $formData["updated-username"];
        $updatedPassword = $formData["updated-password"];


        if (isset($_SESSION["userDetails"]["id"])) {
            $userId = $_SESSION["userDetails"]["id"];


            $stmt = $this->conn->prepare("UPDATE tbl_users SET firstname=?, middlename=?, lastname=?, email=?, cpnumber=?, username=?, password=? WHERE id=?");
            $stmt->bind_param("ssssisss", $updatedFirstname, $updatedMiddlename, $updatedLastname, $updatedEmail, $updatedCpnumber, $updatedUsername, $updatedPassword, $userId);


            if ($stmt->error) {
                return json_encode(array("status" => -1, "message" => "Error binding parameters: " . $stmt->error));
            }

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

    public function __destruct()
    {
        // Close the database connection in the destructor
        $this->conn->close();
    }
}

// Check the operation parameter
$operation = isset($_POST["operation"]) ? $_POST["operation"] : "Invalid";

// Get the form data
$formData = $_POST;

// Create an instance of the Update class
$data = new Update();

// Call the update method with form data
switch ($operation) {
    case "update":
        echo $data->update($formData);
        break;
    default:
        echo json_encode(array("status" => -1, "message" => "Invalid operation."));
}
