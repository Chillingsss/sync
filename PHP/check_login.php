<?php
session_start();

$response = array();

if (isset($_SESSION['user_id'])) {
    $userDetails = array(
        'firstname' => $_SESSION['firstname'],
        'middlename' => $_SESSION['middlename'],
        'lastname' => $_SESSION['lastname'],
        'username' => $_SESSION['username']
    );

    $response['status'] = 'success';
    $response['userDetails'] = $userDetails;
} else {
    $response['status'] = 'error';
}

header('Content-Type: application/json');
echo json_encode($response);
?>