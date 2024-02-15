<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");

class Data
{
    // USERS
    function loginUser($json)
    {
        include "connection.php";
        $json = json_decode($json, true);

        try {
            $sql = "SELECT * FROM tbl_users WHERE username=:loginUsername";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':loginUsername', $json['loginUsername']);

            if ($stmt->execute()) {
                $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
                if (!empty($data)) {
                    $storedPasswordHash = $data[0]['password']; // Assuming the password column is named 'password'

                    // Verify the entered password
                    if (password_verify($json['loginPassword'], $storedPasswordHash)) {
                        // Password matched, set session and return success
                        session_start();

                        // Set user details in the session
                        $_SESSION["userDetails"] = [
                            "id" => $data[0]["id"],
                            "firstname" => $data[0]["firstname"],
                            "middlename" => $data[0]["middlename"],
                            "lastname" => $data[0]["lastname"],
                            "email" => $data[0]["email"],
                            "cpnumber" => $data[0]["cpnumber"],
                            "username" => $data[0]["username"],
                        ];

                        // Set login status in the session
                        $_SESSION["isLoggedIn"] = true;

                        return json_encode(array("status" => 1, "data" => $data));
                    } else {
                        return json_encode(array("status" => -1, "data" => [], "message" => "Incorrect password."));
                    }
                } else {
                    return json_encode(array("status" => -1, "data" => [], "message" => "No data found."));
                }
            } else {
                throw new Exception("Error executing SQL statement.");
            }
        } catch (PDOException $e) {
            $errorMsg = $e->getMessage();
            error_log("PDOException: " . $errorMsg);
            return json_encode(array("status" => -1, "title" => "Database error.", "message" => $errorMsg));
        } catch (Exception $e) {
            $errorMsg = $e->getMessage();
            error_log("Exception: " . $errorMsg);
            return json_encode(array("status" => -1, "title" => "An error occurred.", "message" => $errorMsg));
        } finally {
            $stmt = null; // Close the statement
            $conn = null; // Close the database connection
        }
    }
}

$operation = isset($_POST["operation"]) ? $_POST["operation"] : "Invalid";
$json = isset($_POST["json"]) ? $_POST["json"] : "";

$data = new Data();
switch ($operation) {
    case "loginUser":
        echo $data->loginUser($json);
        break;
    default:
        echo json_encode(array("status" => -1, "message" => "Invalid operation."));
}

?>