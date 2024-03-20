<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");

class Data
{

    function isUserLiked($json)
    {
        include "connection.php";
        $json = json_decode($json, true);
        $sql = "SELECT * FROM tbl_points WHERE point_postId = :postId AND point_userId = :userId";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":postId", $json["postId"]);
        $stmt->bindParam(":userId", $json["userId"]);
        $stmt->execute();
        return $stmt->rowCount() > 0 ? 1 : 0;
    }

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
                    // Assuming the password column is named 'password'
                    $storedPassword = $data[0]['password'];

                    // Verify the entered password
                    if ($json['loginPassword'] === $storedPassword) {
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
            $stmt = null;
            $conn = null;
        }
    }





    function heartpost($json)
    {
        include "connection.php";
        $json = json_decode($json, true);

        // Retrieve post and user IDs from the request
        $postId = $json['postId'];
        $userId = $json['userId'];

        try {
            $sqlCheckLiked = "SELECT * FROM tbl_points WHERE point_postId = :postId AND point_userId = :userId";
            $stmtCheckLiked = $conn->prepare($sqlCheckLiked);
            $stmtCheckLiked->bindParam(":postId", $postId);
            $stmtCheckLiked->bindParam(":userId", $userId);
            $stmtCheckLiked->execute();

            if ($stmtCheckLiked->rowCount() > 0) {
                $sqlUnlike = "DELETE FROM tbl_points WHERE point_postId = :postId AND point_userId = :userId";
                $stmtUnlike = $conn->prepare($sqlUnlike);
                $stmtUnlike->bindParam(":postId", $postId);
                $stmtUnlike->bindParam(":userId", $userId);
                $stmtUnlike->execute();
                return -5;
            } else {
                $sqlLike = "INSERT INTO tbl_points (point_postId, point_userId) VALUES (:postId, :userId)";
                $stmtLike = $conn->prepare($sqlLike);
                $stmtLike->bindParam(":postId", $postId);
                $stmtLike->bindParam(":userId", $userId);
                $stmtLike->execute();
            }

            return $stmtLike->rowCount() > 0 || $stmtUnlike->rowCount() > 0 ? 1 : 0;
        } catch (PDOException $e) {
            error_log("Error in heartpost function: " . $e->getMessage(), 0);
            return 0;
        }
    }





    function getLikes($json)
    {
        include "connection.php";
        $json = json_decode($json, true);

        $sql = "SELECT a.firstname, b.*, COUNT(c.point_Id) AS likes
            FROM tbl_users as a
            INNER JOIN uploads as b ON a.id = b.userID
            LEFT JOIN tbl_points as c ON c.point_postId = b.id
            WHERE b.id = :postId
            GROUP BY b.id
            ORDER BY b.upload_date DESC";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":postId", $json["postId"]);
        $stmt->execute();

        return $stmt->rowCount() > 0 ? json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)) : 0;
    }




    function updateDetails($json)
    {
        include "connection.php";
        $json = json_decode($json, true);

        try {
            $sql = "UPDATE tbl_users SET firstname=:updatedFirstname, middlename=:updatedMiddlename, lastname=:updatedLastname, email=:updatedEmail, cpnumber=:updatedCpnumber, username=:updatedUsername, password=:updatedPassword WHERE id=:userId";

            $stmt = $conn->prepare($sql);

            // Bind parameters
            $stmt->bindParam(":updatedFirstname", $json["updated-firstname"]);
            $stmt->bindParam(":updatedMiddlename", $json["updated-middlename"]);
            $stmt->bindParam(":updatedLastname", $json["updated-lastname"]);
            $stmt->bindParam(":updatedEmail", $json["updated-email"]);
            $stmt->bindParam(":updatedCpnumber", $json["updated-cpnumber"]);
            $stmt->bindParam(":updatedUsername", $json["updated-username"]);
            $stmt->bindParam(":updatedPassword", $json["updated-password"]);
            $stmt->bindParam(":userId", $json["userId"]);

            if ($stmt->execute()) {
                return json_encode(array("status" => 1, "message" => "Details updated successfully"));
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
            $stmt = null;
            $conn = null;
        }
    }


    function getProfile($json)
    {
        include "connection.php";
        $json = json_decode($json, true);
        $sql = "SELECT a.firstname, b.*, COUNT(c.point_Id) AS likes
            FROM tbl_users as a
            INNER JOIN uploads as b ON a.id = b.userID
            LEFT JOIN tbl_points as c ON c.point_postId = b.id
            WHERE a.id = :profID
            GROUP BY b.id
            ORDER BY b.upload_date DESC";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":profID", $json["profID"]);
        $stmt->execute();

        return $stmt->rowCount() > 0 ? json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)) : 0;
    }


    function deletePost($json)
    {
        include "connection.php";
        $json = json_decode($json, true);

        $postId = $json['postId'];

        $sql = "DELETE FROM uploads WHERE id = :postId";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':postId', $postId, PDO::PARAM_INT);

        $stmt->execute();
        return $stmt->rowCount() > 0 ? 1 : 0;
    }

    function editPost($json)
    {
        include "connection.php";
        $json = json_decode($json, true);

        $sql = "UPDATE uploads SET caption=:updatedCaption WHERE id=:postId";

        $stmt = $conn->prepare($sql);

        $stmt->bindParam(":updatedCaption", $json["updatedCaption"]);

        $stmt->bindParam(":postId", $json["postId"]);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            return json_encode(array("status" => 1, "message" => "Details updated successfully"));
        } else {
            throw new Exception("Error executing SQL statement.");
        }

        $stmt = null;
        $conn = null;
    }

    function commentPost($json)
    {
        include "connection.php";
        $json = json_decode($json, true);

        $uploadId = $json["uploadId"];
        $userId = $json["userId"];
        $comment_message = $json["comment_message"];


        $sql = "INSERT INTO tbl_comment (comment_userID, comment_message, comment_uploadId, comment_date_created)
            VALUES (:userId, :comment_message, :uploadId, NOW())";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":comment_message", $comment_message);
        $stmt->bindParam(":uploadId", $uploadId);
        $stmt->bindParam(":userId", $userId);
        $stmt->execute();

        return $stmt->rowCount() > 0 ? 1 : 0;
    }

    function fetchComment($json)
    {
        include "connection.php";
        $json = json_decode($json, true);

        $sql = "SELECT a.firstname, b.comment_message 
        FROM tbl_users as a 
        INNER JOIN tbl_comment as b ON b.comment_userID = a.id 
        WHERE b.comment_uploadId = :postId";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":postId", $json["uploadId"]);

        $stmt->execute();

        $returnValue = 0;

        if ($stmt->rowCount() > 0) {
            $rs = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $returnValue = json_encode($rs);
        }

        return $returnValue;
    }
}

$operation = isset($_POST["operation"]) ? $_POST["operation"] : "Invalid";
$json = isset($_POST["json"]) ? $_POST["json"] : "";

$data = new Data();
switch ($operation) {
    case "loginUser":
        echo $data->loginUser($json);
        break;
    case "heartpost":
        echo $data->heartpost($json);
        break;
    case "getLikes":
        echo $data->getLikes($json);
        break;
    case "updateDetails":
        echo $data->updateDetails($json);
        break;
    case "getProfile":
        echo $data->getProfile($json);
        break;
    case "deletePost":
        echo $data->deletePost($json); // Call the deletePost function
        break;
    case "commentPost":
        echo $data->commentPost($json);
        break;
    case "editPost":
        echo $data->editPost($json);
        break;
    case "fetchComment":
        echo $data->fetchComment($json);
        break;
    case "isUserLiked":
        echo $data->isUserLiked($json);
        break;
    default:
        echo json_encode(array("status" => -1, "message" => "Invalid operation."));
}
