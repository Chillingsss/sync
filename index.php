<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image Uploads</title>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">\

</head>

<body class="mt-0" id="body">

    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <a class="navbar-brand" href="#">Sync</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item active">
                    <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Profile</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" onclick="logout()">Logout</a>
                </li>
                <button id="darkModeToggle" class="btn btn-secondary">Dark Mode</button>
            </ul>
        </div>
    </nav>



    <div class="row-md-6 mt-5 ">
        <div class="col-md-4 justify-content-center d-flex align-items-center mx-auto">
            <form action="upload.php" method="POST" enctype="multipart/form-data" class="mb-3">
                <div class="form-group">
                    <label for="file">Choose File:</label>
                    <input type="file" class="form-control-file" id="file" name="file">
                </div>
                <div class="form-group">
                    <label for="caption">Caption:</label>
                    <textarea class="form-control" id="caption" name="caption"
                        placeholder="What's on your mind?"></textarea>
                </div>
                <button type="submit" class="btn btn-primary" name="submit">UPLOAD</button>
            </form>
        </div>

        <div class="col-md-13" id="imageContainer"></div>
    </div>

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

    <script>
        const darkModeToggle = document.getElementById('darkModeToggle');
        const body = document.getElementById('body');

        darkModeToggle.addEventListener('click', () => {
            body.classList.toggle('bg-dark');

            // Toggle text color and background for the caption textarea
            const captionTextarea = document.getElementById('caption');

            if (body.classList.contains('bg-dark')) {
                body.classList.add('text-white');
                captionTextarea.style.color = '#fff';

                // Apply dark background to existing cards
                const existingCards = document.querySelectorAll('.custom-card');
                existingCards.forEach(card => {
                    card.classList.add('bg-dark', 'text-white');
                });
            } else {
                body.classList.remove('text-white');
                captionTextarea.style.color = '#000';

                // Remove dark background from existing cards
                const existingCards = document.querySelectorAll('.custom-card');
                existingCards.forEach(card => {
                    card.classList.remove('bg-dark', 'text-white');
                });
            }
        });

        function fetchImages() {
            fetch('fetch_images.php')
                .then(response => response.json())
                .then(data => {
                    const imageContainer = document.getElementById('imageContainer');
                    imageContainer.innerHTML = '';

                    data.forEach(post => {
                        const card = document.createElement('div');
                        card.classList.add('card', 'mb-4', 'mx-auto', 'd-block', 'custom-card'); // Added mx-auto and d-block for centering
                        card.style.maxWidth = '500px'; // Added custom width style

                        const img = document.createElement('img');
                        img.src = 'uploads/' + post.filename;
                        img.alt = 'Uploaded Image';
                        img.classList.add('card-img-top', 'custom-img', 'img-fluid'); // Added custom-img and img-fluid classes

                        const cardBody = document.createElement('div');
                        cardBody.classList.add('card-body');

                        const p = document.createElement('p');
                        p.classList.add('card-text');
                        p.textContent = post.caption;

                        // Set text color based on dark mode
                        if (body.classList.contains('dark-mode')) {
                            p.style.color = '#fff';
                        }

                        cardBody.appendChild(p);
                        card.appendChild(img);
                        card.appendChild(cardBody);

                        imageContainer.appendChild(card);
                    });
                });
        }

        document.addEventListener('DOMContentLoaded', fetchImages);

        const isLoggedIn = localStorage.getItem("isUserLoggedIn");


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