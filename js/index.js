const isLoggedIn = localStorage.getItem("isUserLoggedIn");


document.addEventListener("DOMContentLoaded", () => {
    const btnWebcam = document.getElementById("webcamButton");
    const btnStop = document.getElementById("stopButton");
    const video = document.getElementById("webcam");
    const canvas = document.getElementById("canvas");

    const chooseFileLabel = document.querySelector('label[for="file"]');

    btnStop.style.display = "none";

    btnWebcam.addEventListener("click", () => {

        btnStop.style.display = "inline";

        btnWebcam.style.display = "none";

        chooseFileLabel.style.display = "none";

        const postButton = document.querySelector('.modal-footer .btn-primary');
        if (postButton && getComputedStyle(postButton).display !== 'none') {
            postButton.style.display = "none";
        }


        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        }).then(stream => {
            video.srcObject = stream;
            video.addEventListener("loadedmetadata", () => {
                video.play();
            });
        }).catch(error => {
            alert(error);
        });
    });



    btnStop.addEventListener("click", () => {

        btnStop.style.display = "none";

        btnWebcam.style.display = "inline";


        const mediaStream = video.srcObject;
        const tracks = mediaStream.getTracks();
        tracks.forEach(track => track.stop());


        event.stopPropagation();
    });
});




document.addEventListener("DOMContentLoaded", () => {
    const btnWebcam = document.getElementById("webcamButton");
    const btnStop = document.getElementById("stopButton");
    const modal = document.getElementById("postModal");

    btnWebcam.addEventListener("click", () => {
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        }).then(stream => {
            video = document.getElementById("webcam");
            video.srcObject = stream;
            video.addEventListener("loadedmetadata", () => {
                video.play();
            });

            modal.style.display = "block";
        }).catch(error => {
            alert(error);
        });
    });

    btnWebcam.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        openModal();
    });



    btnStop.addEventListener("click", () => {
        const mediaStream = video.srcObject;
        const tracks = mediaStream.getTracks();
        tracks[0].stop();
        modal.style.display = "none";
    });

    document.getElementById("capture").addEventListener("click", () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/png");
        console.log("haha", dataUrl);
        previewImage.src = dataUrl;
    });

    document.getElementById("capture").addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/png");
        console.log("damn", dataUrl);


        const filename = `captured_image_${Date.now()}.png`;
        console.log("haha", filename);


        previewImage.src = dataUrl;

        console.log("Filename:", filename);
    });



});

function submitCapturedImage() {
    const userID = localStorage.getItem("id");
    const caption = document.getElementById("caption").value;

    const formData = new FormData();

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");


    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(7);
    const fileName = `image_${timestamp}_${randomString}.png`;

    const blob = dataURLtoBlob(dataUrl);

    formData.append("file", blob, fileName);

    formData.append("caption", caption);
    formData.append("userID", userID);

    axios.post('PHP/uploads.php', formData)
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



// Function to convert data URL to Blob
function dataURLtoBlob(dataURL) {
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {
        type: contentType
    });
}



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


// pag submit ug upload
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
            // Handle error
            alert('An error occurred. Please try again.');
        });
}






// makita tanan gi upload
function fetchImages() {

    sessionStorage.removeItem("selectedPostId");
    fetch('fetch_images.php')
        .then(response => response.json())
        .then(data => {
            const imageContainer = document.getElementById('imageContainer');
            imageContainer.innerHTML = '';

            data.forEach(post => {
                isUserLiked(post.id);
                const userId = post.userId;
                fetch(`fetch_user.php?userId=${post.userId}`)
                    .then(response => response.json())
                    .then(user => {
                        const cardHtml = `
                        <div class="card mt-4 mx-auto d-block custom-card" style="border-radius: 20px; max-width: 500px; background-color: #272727;">
                            <a href="#" onclick="openUserPostsModal(${post.userID})" style="text-decoration: none; color: #E4E6EB;">
                                <div class="text-start ml-3" style="font-weight:bold; font-size: 20px;">${post.firstname}</div>
                            </a>
                            
                                ${post.filename ? `<img src="uploads/${post.filename}" alt="Uploaded Image" class="card-img-top custom-img img-fluid">` : ''}
                          
                            <div style="text-align: right;" class="small text-muted">${formatTimestamp(post.upload_date)}</div>

                            <div class="text-center mb-4">
                                <div class="mb-4" style="font-size: 1.1rem; color: #E4E6EB;">${post.caption}</div>
                            </div>

                            
                            <div class="d-flex align-items-center">
                                <button class="btn btn-info mr-2 ml-4" onclick="heartPost(${post.id})" style="border-radius: 30px; padding: 10px; background: transparent; border: none;">
                                    <span id="likeCount-${post.id}">${post.likes || 0}</span>  &nbsp; 
                                    <img id="likeIcon-${post.id}" src="../sync/img/${sessionStorage.getItem(`liked-${post.id}`) === 'true' ? 'liked.png' : 'like.png'}" alt="" style="height: 30px; width: 30px;">
                                </button>
                        
                            
                        
                        
                        
                                
                                <a href="javascript:void(0);" onclick="commentPost(${post.id})" class="text-muted"><img src="../sync/img/com.png" alt="" style="height: 30px; width: 30px;"></a>
                        
                            </div>

                        </div>
                    `;

                        // sessionStorage.getItem(`liked-${post.id}`)
                        imageContainer.innerHTML += cardHtml;

                        // fetchComments(post.postId);

                    })
                    .catch(error => {
                        console.error('Error fetching user details:', error);
                    });
            });
        });
}

async function heartPost(postId) {
    console.log("gi tawag ang heart post");
    const userId = sessionStorage.getItem('userId');
    const jsonData = {
        postId: postId,
        userId: userId
    };
    const formData = new FormData();
    formData.append("operation", "heartpost");
    formData.append("json", JSON.stringify(jsonData));
    console.log("JSON DATA MO TO", JSON.stringify(jsonData));

    const likeCountElement = document.getElementById(`likeCount-${postId}`);
    const likeIcon = document.getElementById(`likeIcon-${postId}`);
    // const isLiked = sessionStorage.getItem(`liked-${postId}`) === 'true';
    isUserLiked(postId);

    try {
        const response = await axios.post(`http://localhost/sync/PHP/login.php`, formData);
        console.log("response sa heartpost", response);
        const currentLikes = parseInt(likeCountElement.textContent);

        if (response.data === -5) {
            console.log('Post unliked successfully:', response);
            likeCountElement.textContent = Math.max(currentLikes - 1, 0);
            likeIcon.src = "../sync/img/like.png";
            sessionStorage.setItem(`liked-${postId}`, 'false');
        } else {
            console.log('Post liked successfully:', response);
            likeCountElement.textContent = currentLikes + 1;
            likeIcon.src = "../sync/img/liked.png";
            sessionStorage.setItem(`liked-${postId}`, 'true');
        }

    } catch (error) {
        console.error('Error interacting with post:', error);
    }
}

async function isUserLiked(postId) {
    try {
        const url = "http://localhost/sync/PHP/login.php";
        const userId = sessionStorage.getItem("userId");
        const jsonData = {
            postId: postId,
            userId: userId
        }

        const formData = new FormData();
        formData.append("json", JSON.stringify(jsonData));
        formData.append("operation", "isUserLiked");
        const res = await axios.post(url, formData);
        console.log("na like ba ni user? ", res.data);
        // return res.data;
        if (res.data === 1) {
            sessionStorage.setItem(`liked-${postId}`, 'true');
        } else {
            sessionStorage.setItem(`liked-${postId}`, 'false');
        }
    } catch (error) {
        alert("there was an error", error);
    }
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
    formData.append("operation", "fetchComment");

    axios.post(`http://localhost/sync/PHP/login.php`, formData)
        .then(response => {
            const commentList = document.getElementById('commentList');
            commentList.innerHTML = '';

            response.data.forEach(comment => {
                const commentContainer = document.createElement('div');
                commentContainer.classList.add('card', 'mb-3', 'h-20', 'bg-dark', 'text-white', 'd-flex', 'flex-row', 'align-items-start');
                commentContainer.style.borderColor = '#0F0F0F';

                const commentTextContainer = document.createElement('div');
                commentTextContainer.classList.add('d-flex', 'flex-column', 'flex-grow-1');

                const commentFirstName = document.createElement('div');
                commentFirstName.classList.add('card-header', 'font-weight-bold');
                commentFirstName.style.fontSize = 'px';
                commentFirstName.textContent = comment.firstname;

                const commentItem = document.createElement('div');
                commentItem.classList.add('card-body');
                commentItem.textContent = comment.comment_message;

                commentTextContainer.appendChild(commentFirstName);
                commentTextContainer.appendChild(commentItem);

                commentContainer.appendChild(commentTextContainer);

                if (parseInt(comment.comment_userID) === parseInt(sessionStorage.getItem("userId"))) {
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.classList.add('btn', 'btn-sm', 'ml-auto', 'mt-2', 'text-secondary');
                    deleteButton.onclick = () => deleteComment(comment.comment_id);
                    commentContainer.appendChild(deleteButton);
                }

                commentList.appendChild(commentContainer);
            });

            // Show the comment modal
            $('#commentModal').modal('show');
        })
        .catch(error => {
            console.error('Error fetching comments:', error);
        });
}




async function deleteComment(comment_id) {
    try {
        const jsonData = {
            comment_id: comment_id
        };

        const formData = new FormData();
        formData.append("operation", "deleteComment");
        formData.append("json", JSON.stringify(jsonData));

        if (confirm('Are you sure you want to delete this comment?')) {
            const res = await axios.post('http://localhost/sync/PHP/login.php', formData);
            console.log("RESPONSE sa delete comment NI", res);

            if (res.data === 1) {
                console.log('Comment deleted successfully:', res);
                fetchComments();
            } else {
                console.error('Error comment post:', res.message);
            }
        }
    } catch (error) {
        console.error('Error comment post:', error);
    }
}




async function addComment() {
    const commentInput = document.getElementById(`commentInput`).value;
    if (commentInput == null || commentInput == "") {
        console.log(commentInput);
    } else {
        try {
            const postId = sessionStorage.getItem("selectedPostId");
            const userId = sessionStorage.getItem('userId');
            const jsonData = {
                uploadId: postId,
                userId: userId,
                comment_message: commentInput,
            };

            const formData = new FormData();
            formData.append("json", JSON.stringify(jsonData));
            formData.append("operation", "commentPost");

            const response = await axios.post(`http://localhost/sync/PHP/login.php`, formData);
            console.log('Comment added successfully:', response.data);
            fetchComments();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    }
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
            // sessionStorage.removeItem("selectedPostId");
            sessionStorage.clear();
            sessionStorage.removeItem('liked - ${ postId }');


            localStorage.clear();


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





fetchUserDetails();

function openUpdateDetailsModal() {
    $('#userDetailsModal').modal('hide');
    $('#updateDetailsModal').modal('show');
}





document.addEventListener("DOMContentLoaded", function () {
    console.log("damn");
    const userId = sessionStorage.getItem('userId');

    if (userId) {
        axios.get(`http://localhost/sync/PHP/fetch_user_details.php?userId=${userId}`)
            .then(response => {
                console.log('User details response:', response.data);
                const userData = response.data;

                document.getElementById("userFirstname").textContent = userData.firstname;

                document.getElementById("userDetailsContent").innerHTML = `
               <p><strong>First Namesss:</strong> ${localStorage.getItem("firstname")}</p>
               <p><strong>Middle Name:</strong> ${localStorage.getItem("middlename")}</p>
               <p><strong>Last Name:</strong> ${localStorage.getItem("lastname")}</p>
               <p><strong>Email:</strong> ${localStorage.getItem("email")}</p>
               <p><strong>Contact Number:</strong> ${localStorage.getItem("cpnumber")}</p>
               <p><strong>Username:</strong> ${localStorage.getItem("username")}</p>
               <p><strong>Password:</strong> ${localStorage.getItem("password")}</p>
           `;
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
            });
    } else {
        console.error('userId not available');
    }
});

function openUpdateDetailsForm() {
    document.getElementById('update-details-form-container').style.display = 'block';
}

function updateDetails() {
    console.log("update");

    var updatedFirstname = document.getElementById("updated-firstname").value;
    var updatedMiddlename = document.getElementById("updated-middlename").value;
    var updatedLastname = document.getElementById("updated-lastname").value;
    var updatedEmail = document.getElementById("updated-email").value;
    var updatedCpnumber = document.getElementById("updated-cpnumber").value;
    var updatedUsername = document.getElementById("updated-username").value;
    var updatedPassword = document.getElementById("updated-password").value;


    var formData = new FormData();
    formData.append("operation", "updateDetails");
    formData.append("json", JSON.stringify({
        "updated-firstname": updatedFirstname,
        "updated-middlename": updatedMiddlename,
        "updated-lastname": updatedLastname,
        "updated-email": updatedEmail,
        "updated-cpnumber": updatedCpnumber,
        "updated-username": updatedUsername,
        "updated-password": updatedPassword,
        "userId": sessionStorage.getItem("userId")
    }));

    axios.post('http://localhost/sync/PHP/login.php', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
    })
        .then(function (response) {
            console.log(response.data);

            window.location.href = "index.php";


        })
        .catch(function (error) {
            console.error('Error updating details:', error);
        });
}



