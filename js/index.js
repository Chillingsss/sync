const isLoggedIn = localStorage.getItem("isUserLoggedIn");

document.getElementById('file').addEventListener('change', function (event) {
    const fileInput = event.target;
    const previewImage = document.getElementById('previewImage');

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            previewImage.src = e.target.result;
        };

        reader.readAsDataURL(fileInput.files[0]);
    }
});

const userId = localStorage.getItem("id");
fetch(`fetch_user.php?userId=${userId}`)
    .then(response => response.json())
    .then(user => {
        document.getElementById('userFirstname').textContent = user.firstname;
    })
    .catch(error => {
        console.error('Error fetching user details:', error);
    });

function submitForm() {
    const form = document.getElementById('uploadForm');
    const userID = localStorage.getItem("id");
    const formData = new FormData(form);

    console.log(form)

    formData.append('userID', userID);

    axios.post('PHP/upload.php', formData, {
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

                fetch(`fetch_user.php?userId=${post.userId}`)
                    .then(response => response.json())
                    .then(user => {

                        const cardHtml = `
                        <div class="card mt-4 mx-auto d-block custom-card" style="border-radius: 20px; max-width: 450px; background-color: #272727;">
                            <div class="text-start ml-3" style="font-weight:; font-size: 1.2rem; color: #E4E6EB;">${post.firstname}</div>
                            <a href="#" onclick="openPostDetails(${post.postId})">
                                ${post.filename ? `<img src="uploads/${post.filename}" alt="Uploaded Image" class="card-img-top custom-img img-fluid">` : ''}
                            </a>
                            <div style="text-align: right;" class="small text-muted">${formatTimestamp(post.upload_date)}</div>

                            <div class="text-center mb-4">
                                <div class="mb-4" style="font-size: 1.1rem; color: #E4E6EB;">"${post.caption}"</div>
                            </div>

                            <!-- Comment Section -->
                            <div>
                                <ul id="comments-${post.postId}"></ul>
                                <form onsubmit="addComment(event, ${post.postId})">
                                    <div class="d-flex ml-4 mr-3">
                                        <input type="text" class="form-control mr-3" style="flex-grow: 1; background-color: #242526; color: #E4E6EB; border-radius: 50px;" id="comment-${post.postId}" placeholder="Add a comment" required>
                                        <button type="submit" class="btn mr-2">
                                            <img src="img/comment.png" alt="Sync Comment">
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    `;

                        // Append the card HTML to the image container
                        imageContainer.innerHTML += cardHtml;

                        // Fetch and display comments for each post
                        fetchComments(post.postId);
                    })
                    .catch(error => {
                        console.error('Error fetching user details:', error);
                    });
            });
        });
}

function openPostDetails(postId) {
    // Fetch the detailed post information
    fetch(`fetch_post_details.php?postId=${postId}`)
        .then(response => response.json())
        .then(postDetails => {
            // Populate the modal with post details
            const postDetailsContainer = document.getElementById('postDetails');
            postDetailsContainer.innerHTML = '';

            // Display the detailed information (customize this part based on your data structure)
            postDetailsContainer.innerHTML = `
                <div>
                    <h4>${postDetails.firstname}'s Post</h4>
                    <img src="uploads/${postDetails.filename}" alt="Uploaded Image" class="img-fluid">
                    <p>${postDetails.caption}</p>
                    <p>Posted on: ${formatTimestamp(postDetails.upload_date)}</p>
                </div>
            `;

            // Show the modal
            $('#imageModal').modal('show');
        })
        .catch(error => {
            console.error('Error fetching post details:', error);
        });
}

// Function to format timestamp to a readable format (adjust as needed)
function formatTimestamp(timestamp) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(timestamp).toLocaleDateString('en-US', options);
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

// Make sure to include Axios in your HTML

// function updateDetails() {
//     // Get updated details from the form
//     var updatedFirstname = document.getElementById("updated-firstname").value;
//     var updatedMiddlename = document.getElementById("updated-middlename").value;
//     var updatedLastname = document.getElementById("updated-lastname").value;
//     var updatedEmail = document.getElementById("updated-email").value;
//     var updatedCpnumber = document.getElementById("updated-cpnumber").value;
//     var updatedUsername = document.getElementById("updated-username").value;
//     var updatedPassword = document.getElementById("updated-password").value;

//     // Create a JSON object with the updated details
//     var jsonData = {
//         "updated-firstname": updatedFirstname,
//         "updated-middlename": updatedMiddlename,
//         "updated-lastname": updatedLastname,
//         "updated-email": updatedEmail,
//         "updated-cpnumber": updatedCpnumber,
//         "updated-username": updatedUsername,
//         "updated-password": updatedPassword
//     };

//     // Send the update request to the server using Axios
//     axios.post('PHP/update.php', {
//         operation: 'update',
//         json: JSON.stringify(jsonData)
//     })
//         .then(function (response) {
//             // Handle the response from the server
//             console.log(response.data);
//             // You can perform additional actions here if needed
//         })
//         .catch(function (error) {
//             // Handle errors
//             console.error('Error updating details:', error);
//         });
// }



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

function fetchUserDetails() {
    // Make a GET request to fetch user details
    axios.get('http://localhost/sync/PHP/fetch_user_details.php')
        .then(response => {
            const userData = response.data;

            // Display the user details in the modal
            document.getElementById("firstname").textContent = userData.firstname;
            document.getElementById("middlename").textContent = userData.middlename;
            document.getElementById("lastname").textContent = userData.lastname;
            document.getElementById("email").textContent = userData.email;
            document.getElementById("cpnumber").textContent = userData.cpnumber;
            document.getElementById("username").textContent = userData.username;
            document.getElementById("password").textContent = userData.password; // Note: Consider not displaying the password
        })
        .catch(error => {
            console.error('Error fetching user details:', error);
        });
}

// Assume this code is in your main JavaScript file (e.g., js/index.js)
// document.addEventListener("DOMContentLoaded", function () {
//     // Fetch user details and update the modal content
//     axios.get('http://localhost/sync/PHP/fetch_user_details.php')
//         .then(response => {
//             const userData = response.data;

//             // Update the modal content with user details
//             document.getElementById("userFirstname").textContent = userData.firstname;
//             // Add more lines to update other elements as needed

//             // Optional: You can also update the content inside the modal
//             document.getElementById("userDetailsContent").innerHTML = `
//                 <p><strong>First Name:</strong> ${userData.firstname}</p>
//                 <p><strong>Middle Name:</strong> ${userData.middlename}</p>
//                 <p><strong>Last Name:</strong> ${userData.lastname}</p>
//                 <p><strong>Email:</strong> ${userData.email}</p>
//                 <p><strong>Contact Number:</strong> ${userData.cpnumber}</p>
//                 <p><strong>Username:</strong> ${userData.username}</p>
//                 <p><strong>Password:</strong> ${userData.password}</p>

//             `;
//         })
//         .catch(error => {
//             console.error('Error fetching user details:', error);
//         });
// });


// Function to fetch user details using Axios
// function fetchUserDetails() {
//     axios.get('your_server_endpoint_for_user_details')
//         .then(response => {
//             const userData = response.data;
//             console.log('User data:', userData) // Assuming your user details are in the response.data

//             // Update the content of the spans with the received user data
//             document.getElementById("firstname").textContent = userData.firstname;
//             document.getElementById("middlename").textContent = userData.middlename;
//             document.getElementById("lastname").textContent = userData.lastname;
//             document.getElementById("email").textContent = userData.email;
//             document.getElementById("cpnumber").textContent = userData.cpnumber;
//             document.getElementById("username").textContent = userData.username;
//             document.getElementById("password").textContent = userData.password;
//         })
//         .catch(error => {
//             console.error('Error fetching user details:', error);
//         });
// }

// // Call the function to fetch and display user details

