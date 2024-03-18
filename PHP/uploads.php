<?php
header('Content-Type: application/json');

// Define the destination directory for uploads
$uploadDir = '/var/www/html/sync/uploads/'; // Adjust this path as needed

// Check if file data is received
if (!empty($_FILES['file']['tmp_name']) && is_uploaded_file($_FILES['file']['tmp_name'])) {
    $fileName = $_FILES['file']['name'];
    $fileTmpName = $_FILES['file']['tmp_name'];
    $fileSize = $_FILES['file']['size'];
    $fileError = $_FILES['file']['error'];
    $fileType = $_FILES['file']['type'];

    $userID = isset($_POST['userID']) ? $_POST['userID'] : '';
    $caption = isset($_POST['caption']) ? $_POST['caption'] : '';


    // Process file upload
    $fileExt = explode('.', $fileName);
    $fileActualExt = strtolower(end($fileExt));

    $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    if (in_array($fileActualExt, $allowed)) {
        if ($fileError === 0) {
            if ($fileSize < 25000000) {
                $fileNameNew = uniqid('', true) . "." . $fileActualExt;
                $fileDestination = $uploadDir . $fileNameNew; // Adjust the destination path

                if (move_uploaded_file($fileTmpName, $fileDestination)) {
                    // File uploaded successfully, now insert data into the database
                    try {
                        $servername = "127.0.0.1";
                        $username = "root";
                        $password = "pelino";
                        $dbname = "db_socialmedia";

                        // Create connection
                        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
                        // Set the PDO error mode to exception
                        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                        // Prepare SQL statement
                        $sql = "INSERT INTO uploads (filename, caption, userID) VALUES (:filename, :caption, :userID)";
                        $stmt = $conn->prepare($sql);
                        $stmt->bindParam(':filename', $fileNameNew);
                        $stmt->bindParam(':caption', $caption);
                        $stmt->bindParam(':userID', $userID);

                        // Execute the statement
                        $stmt->execute();

                        // Close connection
                        $conn = null;

                        // Return success message
                        echo json_encode(["message" => "File uploaded and inserted into the database successfully!"]);
                    } catch (PDOException $e) {
                        // Display error message if insertion fails
                        echo json_encode(["error" => "Error inserting data into the database: " . $e->getMessage()]);
                    }
                } else {
                    echo json_encode(["error" => "Failed to move uploaded file."]);
                }
            } else {
                echo json_encode(["error" => "Your file is too large!"]);
            }
        } else {
            echo json_encode(["error" => "There was an error uploading your file!"]);
        }
    } else {
        echo json_encode(["error" => "You cannot upload files of this type!"]);
    }
} else {
    echo json_encode(["error" => "No file uploaded!"]);
}
