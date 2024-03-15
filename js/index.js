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
            alert(response.data.message || response.data.error);
            window.location.href = "index.php";
        })
        .catch(function (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
}

function fetchImages() {
    sessionStorage.removeItem("selectedPostId");
    fetch('fetch_images.php')
        .then(response => response.json())
        .then(data => {
            const imageContainer = document.getElementById('imageContainer');
            imageContainer.innerHTML = '';

            data.forEach(post => {
                const userId = post.userId;
                fetch(`fetch_user.php?userId=${post.userId}`)
                    .then(response => response.json())
                    .then(user => {
                        const cardHtml = `
                        <div class="card mt-4 mx-auto d-block custom-card" style="border-radius: 20px; max-width: 500px; background-color: #272727;">
                            <a href="#" onclick="openUserPostsModal(${post.userID})" style="text-decoration: none; color: #E4E6EB;">
                                <div class="text-start ml-3" style="font-weight:; font-size: 1.2rem;">${post.firstname}</div>
                            </a>
                            
                                ${post.filename ? `<img src="uploads/${post.filename}" alt="Uploaded Image" class="card-img-top custom-img img-fluid">` : ''}
                          
                            <div style="text-align: right;" class="small text-muted">${formatTimestamp(post.upload_date)}</div>

                            <div class="text-center mb-4">
                                <div class="mb-4" style="font-size: 1.1rem; color: #E4E6EB;">${post.caption}</div>
                            </div>

                            
                            <div class="d-flex align-items-center">
                                <button class="btn btn-info mr-2 ml-4" onclick="heartPost(${post.id})" style="border-radius: 30px; padding: 10px;">
                                    <span id="likeCount-${post.id}">${post.likes || 0}</span> Likes
                                </button>
                                
                                <a href="#" onclick="commentPost(${post.id})" class="text-muted">Comment</a>
                            

                        
                            </div>

                        </div>
                    `;


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

function heartPost(postId) {
    const userId = sessionStorage.getItem('userId');
    const jsonData = {
        postId: postId,
        userId: userId
    };
    const formData = new FormData();
    formData.append("operation", "heartpost");
    formData.append("json", JSON.stringify(jsonData));

    const likeCountElement = document.getElementById(`likeCount-${postId}`);
    let isLiked = likeCountElement && likeCountElement.dataset.liked === 'true';

    axios.post(`http://localhost/sync/PHP/login.php`, formData)
        .then(response => {
            if (response.data === 1) {
                const currentLikes = parseInt(likeCountElement.textContent);

                if (!isLiked) {
                    console.log('Post liked successfully:', response);
                    likeCountElement.textContent = currentLikes + 1;
                } else {
                    console.log('Post unliked successfully:', response);
                    likeCountElement.textContent = Math.max(currentLikes - 1, 0);
                }

                isLiked = !isLiked;
                likeCountElement.dataset.liked = isLiked ? 'true' : 'false';
            } else {
                console.error('Error interacting with post:', response);
            }
        })
        .catch(error => {
            console.error('Error interacting with post:', error);
        });
}


// function openPostDetails(postId) {
//     // Fetch the detailed post information
//     fetch(`fetch_post_details.php?postId=${postId}`)
//         .then(response => response.json())
//         .then(postDetails => {
//             // Populate the modal with post details
//             const postDetailsContainer = document.getElementById('postDetails');
//             postDetailsContainer.innerHTML = '';

//             // Display the detailed information (customize this part based on your data structure)
//             postDetailsContainer.innerHTML = `
//                 <div>
//                     <h4>${postDetails.firstname}'s Post</h4>
//                     <img src="uploads/${postDetails.filename}" alt="Uploaded Image" class="img-fluid">
//                     <p>${postDetails.caption}</p>
//                     <p>Posted on: ${formatTimestamp(postDetails.upload_date)}</p>
//                 </div>
//             `;

//             // Show the modal
//             $('#imageModal').modal('show');
//         })
//         .catch(error => {
//             console.error('Error fetching post details:', error);
//         });
// }


function openUserPostsModal(userID) {
    console.log("asdasd" + userID);
    sessionStorage.setItem("idtopost", userID);
    window.location.href = `userProfile.html?userId=${userID}`;
}

function formatTimestamp(timestamp) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(timestamp).toLocaleDateString('en-US', options);
}

function fetchComments() {
    const jsonData = {
        uploadId: sessionStorage.getItem("selectedPostId"),
    };

    const formData = new FormData();
    formData.append("json", JSON.stringify(jsonData));
    formData.append("operation", "fetchComment")

    axios.post(`http://localhost/sync/PHP/login.php`, formData)
        .then(response => {
            // Clear previous comments
            const commentList = document.getElementById('commentList');
            commentList.innerHTML = '';

            // Populate comments in the modal
            response.data.forEach(comment => {
                const commentContainer = document.createElement('div');
                const commentFirstName = document.createElement('div');
                const commentItem = document.createElement('div');

                // Set inline styles for side-by-side display
                commentContainer.style.display = 'flex';
                commentFirstName.style.flexBasis = '30%'; // Adjust as needed
                commentFirstName.style.marginRight = '10px'; // Adjust as needed

                commentFirstName.textContent = comment.firstname + ": ";
                commentItem.textContent = comment.comment_message;

                // Append first name and comment to the comment container
                commentContainer.appendChild(commentFirstName);
                commentContainer.appendChild(commentItem);

                // Append the comment container to the comment list
                commentList.appendChild(commentContainer);
            });

            // Show the comment modal
            $('#commentModal').modal('show');
        })
        .catch(error => {
            console.error('Error fetching comments:', error);
        });
}




function addComment() {
    const commentInput = document.getElementById(`commentInput`).value;
    // const comment = commentInput.value;
    // console.log("postIDDDD", postId);
    const postId = sessionStorage.getItem("selectedPostId");
    const userId = sessionStorage.getItem('userId');
    const jsonData = {
        uploadId: postId,
        userId: userId,
        comment_message: commentInput,
    };

    console.log("JsonData", JSON.stringify(jsonData));

    const formData = new FormData();
    formData.append("json", JSON.stringify(jsonData));
    formData.append("operation", "commentPost")

    axios.post(`http://localhost/sync/PHP/login.php`, formData)
        .then(response => {
            console.log('Comment added successfully:', response.data);
            fetchComments();
        })
        .catch(error => {
            console.error('Error adding comment:', error);
        });
}


function commentPost(postId) {
    $('#commentModal').modal('show');
    sessionStorage.setItem("selectedPostId", postId);
    fetchComments();
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
            sessionStorage.removeItem("selectedPostId");
            sessionStorage.removeItem("userId");
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

