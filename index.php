<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image Uploads</title>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">\

    <style>
        /* Dark mode styles for the modal content */
        .dark-mode .modal-content {
            background-color: #343a40;
            /* Dark background color for modal content */
            color: #fff;
            /* Light text color for modal content in dark mode */
        }

        /* Add more styles as needed */
    </style>

</head>

<body class="mt-0" id="body" style="background-color: #E5E4E2;">

    <nav class="navbar navbar-expand-lg text-light fixed-top " id="navbar">
        <a class="nav-link" href="#" style="text-decoration: none; color: black;">Sync</a>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item active">
                    <a class="nav-link" href="#" style="text-decoration: none; color: black;">Home <span
                            class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" style="text-decoration: none; color: black;">Profile</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" style="cursor: pointer; text-decoration: none; color: black;"
                        onclick="logout()">Logout</a>
                </li>

                <button id="darkModeToggle" style="border: none; background: none;">
                    <img src="img/dark.png" alt="" style="width: 24px; height: 24px; border: none;">
                </button>

            </ul>


        </div>
    </nav>

    <div class="row-md-6 mt-5">
        <div class="col-md-3 justify-content-center d-flex align-items-center mx-auto mb-4">
            <!-- Button to trigger modal -->
            <button type="button" class="btn btn-outline-secondary" data-toggle="modal" data-target="#postModal">
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
        <div class="cold-md-13">
            <form id="comment">
                <textarea class="form-control" id="caption" name="caption"
                    placeholder="What's on your mind?"></textarea>
            </form>
        </div>

    </div>



    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

    <script>
        const isLoggedIn = localStorage.getItem("isUserLoggedIn");

        const darkModeToggle = document.getElementById('darkModeToggle');
        const body = document.getElementById('body');
        const nav = document.getElementById('navbar');
        const postModal = document.getElementById('postModal');
        const navbarLinks = document.querySelectorAll('.navbar-nav a');

        darkModeToggle.addEventListener('click', () => {
            body.classList.toggle('bg-dark');
            body.classList.toggle('text-white');

            nav.classList.toggle('bg-dark');
            nav.classList.toggle('navbar-dark');

            // Set background color of navbar to black if dark mode is enabled
            if (body.classList.contains('bg-dark')) {
                nav.style.backgroundColor = '#000'; // Black color
            } else {
                nav.style.backgroundColor = '#000'; // Use default or other color when not in dark mode
            }

            // Update navbar link colors based on dark mode
            navbarLinks.forEach(link => {
                link.classList.toggle('text-dark', !body.classList.contains('bg-dark'));
                link.classList.toggle('text-white', body.classList.contains('bg-dark'));
            });

            postModal.classList.toggle('dark-mode');

            console.log('Dark mode toggled:', postModal.classList.contains('dark-mode'));

            const captionTextarea = document.getElementById('caption');

            if (body.classList.contains('bg-dark')) {
                captionTextarea.style.color = '#6F6F6F';  // Set text color to white in dark mode

                // Apply dark background to existing cards
                const existingCards = document.querySelectorAll('.custom-card');
                existingCards.forEach(card => {
                    card.classList.add('bg-dark', 'text-white');
                    card.style.borderColor = '';  // Set border color to white
                });
            } else {
                captionTextarea.style.color = '#000';  // Set text color to black in light mode

                // Remove dark background from existing cards
                const existingCards = document.querySelectorAll('.custom-card');
                existingCards.forEach(card => {
                    card.classList.remove('bg-dark', 'text-white');
                    card.style.borderColor = '';  // Set border color to black
                });
            }
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
                        const card = document.createElement('div');
                        card.classList.add('card', 'mb-4', 'mx-auto', 'd-block', 'custom-card', 'bg-amber-100');
                        card.style.borderRadius = '10px';
                        card.style.maxWidth = '500px'; // Added custom width style

                        // Check if the post has a valid image URL
                        if (post.filename) {
                            const img = document.createElement('img');
                            img.src = 'uploads/' + post.filename;
                            img.alt = 'Uploaded Image';
                            img.classList.add('card-img-top', 'custom-img', 'img-fluid'); // Added border classes
                            card.appendChild(img); // Append image only if the URL is not null
                        }

                        // Create a div for the card body
                        // Create a div for the card body
                        const cardBody = document.createElement('div');
                        cardBody.classList.add('card-body', 'text-center');

                        // Create a div for the firstname
                        const firstNameDiv = document.createElement('div');
                        firstNameDiv.style.fontWeight = 'bold';
                        firstNameDiv.style.fontSize = '1.5rem';
                        firstNameDiv.textContent = post.firstname;

                        // Create a span element for the caption and style it
                        const captionSpan = document.createElement('span');
                        captionSpan.style.fontSize = '1.2rem';
                        captionSpan.textContent = '"' + post.caption + '"';

                        // Append the firstname div to the card body
                        cardBody.appendChild(firstNameDiv);

                        // Append the caption span to the card body
                        cardBody.appendChild(captionSpan);

                        // Append the card body to the card
                        card.appendChild(cardBody);

                        // Append the card to the image container
                        imageContainer.appendChild(card);


                    });
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