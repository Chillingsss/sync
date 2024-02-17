<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image Uploads</title>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>



</head>

<body class="mt-5" id="body" style="background-color: #E5E4E2;">

    <nav class="navbar navbar-expand-lg navbar-light fixed-top" id="navbar">
        <a class="navbar-brand" href="#" style="text-decoration: none; color: black;">
            <img src="img/sync.png" alt="Sync Logo" style="height: 60px; width: auto;">
        </a>

        <span id="userFirstname" style="margin-left: 10px;"></span>

        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item active">
                    <a class="nav-link text-dark" href="#"
                        style="text-decoration: none; color: black; font-size: 17px; font-weight: bold;">Home <span
                            class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-dark" href="#"
                        style="text-decoration: none; color: black; font-size: 17px; font-weight: bold;">Profile</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-dark"
                        style="cursor: pointer; text-decoration: none; color: black; font-size: 17px; font-weight: bold;"
                        onclick="logout()">Logout</a>
                </li>
            </ul>
        </div>
    </nav>



    <div class="row-md-6 mt-5">

        <div class="col-md-3 justify-content-center d-flex align-items-center mx-auto mb-4">
            <!-- Button to trigger modal -->
            <button type="button" class="btn btn-outline-secondary mt-5" data-toggle="modal" data-target="#postModal">
                What's on your mind?
            </button>

            <!-- Modal -->
            <div class="modal fade" id="postModal" tabindex="-1" role="dialog" aria-labelledby="postModalLabel"
                aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="postModalLabel">Create a Post</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <!-- Form inside the modal -->
                            <form id="uploadForm" enctype="multipart/form-data">
                                <div class="form-group">
                                    <label for="file">Choose File:</label>
                                    <input type="file" class="form-control-file" id="file" name="file">
                                </div>
                                <div class="form-group">
                                    <label for="caption">Caption:</label>
                                    <textarea class="form-control" id="caption" name="caption"
                                        placeholder="What's on your mind?"></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="submitForm()">Post</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-13 " id="imageContainer">
        </div>
    </div>


    <script>
        const isLoggedIn = localStorage.getItem("isUserLoggedIn");

        // Assuming you have a PHP endpoint to fetch user details
        const userId = localStorage.getItem("id");
        fetch(`fetch_user.php?userId=${userId}`)
            .then(response => response.json())
            .then(user => {
                // Update the user's firstname in the HTML
                document.getElementById('userFirstname').textContent = user.firstname;
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
            });


        function submitForm() {
            const form = document.getElementById('uploadForm');
            const userID = localStorage.getItem("id");
            const formData = new FormData(form);


            formData.append('userID', userID);

            axios.post('upload.php', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(function (response) {
                    console.log('Response Data:', response.data);
                    // Handle success
                    alert(response.data.message || response.data.error);
                    window.location.href = "index.php";
                })
                .catch(function (error) {
                    console.error('Error:', error);
                    // Handle error
                    alert('An error occurred. Please try again.');
                });
        }


        function fetchImages() {
            fetch('fetch_images.php')
                .then(response => response.json())
                .then(data => {
                    const imageContainer = document.getElementById('imageContainer');
                    imageContainer.innerHTML = '';

                    data.forEach(post => {
                        const cardHtml = `
                            <div class="card mt-5 mx-auto d-block custom-card" style="border-radius: 20px; max-width: 450px;">
                                <div class="text-start ml-3" style="font-weight: bold; font-size: 1.2rem;">${post.firstname}</div>
                                ${post.filename ? `<img src="uploads/${post.filename}" alt="Uploaded Image" class="card-img-top custom-img img-fluid">` : ''}
                                <div class="text-center mb-4">
                                    <div class="mb-4" style="font-size: 1.2rem;">"${post.caption}"</div>
                                </div>
                                <!-- Comment Section -->
                                <div>
                                    <h5>Comments:</h5>
                                    <ul id="comments-${post.postId}"></ul>
                                    <form onsubmit="addComment(event, ${post.postId})">
                                        <input type="text" id="comment-${post.postId}" placeholder="Add a comment" required>
                                        <button type="submit">Post</button>
                                    </form>
                                </div>
                            </div>
                        `;

                        // Append the card HTML to the image container
                        imageContainer.innerHTML += cardHtml;

                        // Fetch and display comments for each post
                        fetchComments(post.postId);
                    });
                });
        }

        function fetchComments(postId) {
            fetch(`fetch_comments.php?postId=${postId}`)
                .then(response => response.json())
                .then(comments => {
                    const commentsList = document.getElementById(`comments-${postId}`);
                    commentsList.innerHTML = '';

                    comments.forEach(comment => {
                        const li = document.createElement('li');
                        li.textContent = comment.comment;
                        commentsList.appendChild(li);
                    });
                });
        }

        function addComment(event, postId) {
            event.preventDefault();
            const commentInput = document.getElementById(`comment-${postId}`);
            const comment = commentInput.value;

            // Add the comment to the UI
            const commentsList = document.getElementById(`comments-${postId}`);
            const li = document.createElement('li');
            li.textContent = comment;
            commentsList.appendChild(li);

            // Clear the input field
            commentInput.value = '';

            // Send the comment to the server (you need to implement this part in your PHP script)
            axios.post('add_comment.php', { postId, comment })
                .then(response => {
                    console.log('Comment added successfully:', response.data);
                })
                .catch(error => {
                    console.error('Error adding comment:', error);
                });
        }

        document.addEventListener('DOMContentLoaded', fetchImages);







        document.getElementById("firstname").innerHTML = localStorage.getItem("firstname");
        document.getElementById("middlename").innerHTML = localStorage.getItem("middlename");
        document.getElementById("lastname").innerHTML = localStorage.getItem("lastname");
        document.getElementById("email").innerHTML = localStorage.getItem("email");
        document.getElementById("cpnumber").innerHTML = localStorage.getItem("cpnumber");
        document.getElementById("username").innerHTML = localStorage.getItem("username");

        function showUpdateForm() {
            if (!isLoggedIn) {
                alert("Please login first.");
                return;
            }

            // Display the update details form
            document.getElementById('update-details-form-container').style.display = 'block';
        }

        function updateDetails() {
            // Retrieve the updated details from the form
            var updatedFirstname = document.getElementById("updated-firstname").value;
            var updatedMiddlename = document.getElementById("updated-middlename").value;
            var updatedLastname = document.getElementById("updated-lastname").value;

            // Update the displayed user details
            document.getElementById("firstname").innerHTML = updatedFirstname;
            document.getElementById("middlename").innerHTML = updatedMiddlename;
            document.getElementById("lastname").innerHTML = updatedLastname;

            const jsonData = {
                "updated-firstname": updatedFirstname,
                "updated-middlename": updatedMiddlename,
                "updated-lastname": updatedLastname
            };

            const formdata = new FormData();
            formdata.append("operation", "update");
            formdata.append("json", JSON.stringify(jsonData));

            // Use axios to send the data to the server
            axios.post("http://localhost/media/PHP/update.php", formdata)
                .then((response) => {
                    console.log("Server response: ", response.data);
                })
                .catch((error) => {
                    console.error("Error updating details: ", error);
                });

            // Save the updated details back to localStorage
            localStorage.setItem('firstname', updatedFirstname);
            localStorage.setItem('middlename', updatedMiddlename);
            localStorage.setItem('lastname', updatedLastname);

            // Hide the update details form after submission
            document.getElementById('update-details-form-container').style.display = 'none';
        }



        function cancelUpdate() {
            // Hide the update details form if the user cancels
            document.getElementById('update-details-form-container').style.display = 'none';
        }

        function deleteAccount() {
            if (confirm("Are you sure you want to delete your account?")) {
                // Perform account deletion
                axios.post('PHP/delete.php')
                    .then(response => {
                        if (response.status === 200) {
                            alert(response.data);
                            // Logout and go back to the main page after successful deletion
                            logout();
                        } else {
                            alert("Error deleting account");
                        }
                    })
                    .catch(error => {
                        console.error("Account deletion request failed. Error: ", error);
                    });
            }
        }

        function logout() {
            console.log("Logout na siya");
            axios.post('PHP/logout.php')
                .then(() => {
                    // Clear local storage
                    localStorage.clear();
                    // Redirect to login page
                    window.location.href = "login.html";
                })
                .catch(error => {
                    console.error("Logout request failed. Error: ", error);
                });
        }

    </script>
</body>

</html>