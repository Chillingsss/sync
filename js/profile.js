async function deletePost(postId) {
    try {
        const jsonData = {
            postId: postId
        };
        const formData = new FormData();
        formData.append("operation", "deletePost");
        formData.append("json", JSON.stringify(jsonData));

        if (confirm('Are you sure you want to delete this post?')) {
            const res = await axios.post('http://localhost/sync/PHP/login.php', formData);
            console.log("RESPONSE NAKO NI", res);

            if (res.data === 1) {
                console.log('Post deleted successfully:', res);
                fetchUserPosts();
            } else {
                console.error('Error deleting post:', res.message);
            }
        }
    } catch (error) {
        console.error('Error deleting post:', error);
    }
}

function fetchUserDetails(userId) {
    fetch(`fetch_user.php?userId=${userId}`)
        .then(response => response.json())
        .then(user => {

            document.getElementById("userFirstname").textContent = user.firstname;

        })
        .catch(error => {
            console.error('Error fetching user details:', error);
        });
}


function formatTimestamp(timestamp) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(timestamp).toLocaleDateString('en-US', options);
}


function fetchUserPosts() {
    const userId = sessionStorage.getItem('userId');
    const jsonData = {
        profID: userId
    }
    const formData = new FormData();
    formData.append("operation", "getProfile");
    formData.append("json", JSON.stringify(jsonData));
    if (userId) {
        axios.post(`http://localhost/sync/PHP/login.php`, formData)
            .then(response => {
                console.log("asdas", response);
                const prof = document.getElementById('prof');
                prof.innerHTML = '';

                const posts = response.data;
                posts.map(post => {
                    const cardHtml = `
                <div class="card mt-4 mx-auto d-block custom-card" style="border-radius: 20px; max-width: 500px; background-color: #272727;">
                    <div class="text-start ml-3" style="font-weight: bold; font-size: 1.2rem; color: #E4E6EB;">${post.firstname}</div>
            
                        ${post.filename ? `<img src="uploads/${post.filename}" alt="Uploaded Image" class="card-img-top custom-img img-fluid">` : ''}
                        
                    <div class="d-flex justify-content-between">
                        <div>
                            <a href="#" onclick="deletePost(${post.id})" class="text-muted mr-3">Delete</a>
                            <a href="#" onclick="editPost(${post.id})" class="text-muted">Edit</a>
                        </div>
                        <div class="small text-muted">${formatTimestamp(post.upload_date)}</div>
                    </div>
                    

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


                    prof.innerHTML += cardHtml;


                });
            })
            .catch(error => {
                console.error('Error fetching user posts:', error);
            });
    } else {
        console.error('userId not available');
    }
}

function editPost(postId) {
    $('#editModal').modal('show');
    sessionStorage.setItem("selectedPostId", postId);

}


function submitEdit(postId) {

    var updatedCaption = document.getElementById("updated-caption").value;

    const jsonData = {
        postId: postId,
        updatedCaption: updatedCaption
    };

    console.log("jsonData", jsonData);
    const formData = new FormData();
    formData.append("operation", "editPost");
    formData.append("json", JSON.stringify(jsonData));

    axios.post('http://localhost/sync/PHP/login.php', formData)
        .then(response => {


            if (response.data.status === 1) {

                console.log('Caption updated successfully:', response.data);

                $('#editModal').modal('hide');
                alert("Caption updated successfully!");
                window.location.href = "profile.html";


            } else {
                console.error('Error updating caption:', response.data);
                alert("Error updating caption. Please try again later.");
            }
        })
        .catch(error => {
            console.error('Error updating caption:', error);
            alert("Error updating caption. Please try again later.");
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
            fetchComments();
            console.log('Comment added successfully:', response.data);

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

// function submitEdit(postId) {
//     var updatedCaption = document.getElementById("updated-caption").value;


//     const jsonData = {
//         postId: postId,
//         "updated-caption": updatedCaption
//     };
//     const formData = new FormData();
//     formData.append("operation", "editPost");
//     formData.append("json", JSON.stringify(jsonData));

//     axios.post('http://localhost/sync/PHP/login.php', formData)
//         .then(response => {
//             console.log("resoponse ni submitEdit", response.data);
//             if (response.data.status === 1) {
//                 console.log('Caption updated successfully:', response.data);
//                 $('#editModal').modal('hide');
//                 alert("Caption updated successfully!");
//             } else {
//                 console.error('Error updating caption:', response.data);
//                 alert("Error updating caption. Please try again later.");
//             }
//         })
//         .catch(error => {
//             console.error('Error updating caption:', error);
//             alert("Error updating caption. Please try again later.");
//         });
// }


function fetchImages() {
    fetch('fetch_images.php')
        .then(response => response.json())
        .then(data => {
            const profileContainer = document.getElementById('profileContainer');
            profileContainer.innerHTML = '';

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
                          
                            

                        </div>
                    `;


                        profileContainer.innerHTML += cardHtml;

                        // Fetch and display comments for each post
                        fetchComments(post.postId);
                    })
                    .catch(error => {
                        console.error('Error fetching user details:', error);
                    });
            });
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
//         <div>
//             <h4>${postDetails.firstname}'s Post</h4>
//             <img src="uploads/${postDetails.filename}" alt="Uploaded Image" class="img-fluid">
//             <p>${postDetails.caption}</p>
//             <p>Posted on: ${formatTimestamp(postDetails.upload_date)}</p>
//         </div>
//     `;

//             // Show the modal
//             $('#imageModal').modal('show');
//         })
//         .catch(error => {
//             console.error('Error fetching post details:', error);
//         });
// }

fetchUserPosts();



//camera grrr
document.addEventListener("DOMContentLoaded", () => {
    const btnWebcam = document.getElementById("webcamButton");
    const btnStop = document.getElementById("stopButton");
    const video = document.getElementById("webcam");
    const canvas = document.getElementById("canvas");

    const chooseFileLabel = document.querySelector('label[for="file"]');

    btnStop.style.display = "none";

    btnWebcam.addEventListener("click", () => {
        // Show the stop button
        btnStop.style.display = "inline";
        // Hide the camera button
        btnWebcam.style.display = "none";
        // Hide the "Choose File" label
        chooseFileLabel.style.display = "none";

        // Start webcam
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
        // Hide the stop button
        btnStop.style.display = "none";
        // Show the camera button
        btnWebcam.style.display = "inline";

        // Stop webcam
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
            // Keep the modal open while webcam is active
            modal.style.display = "block";
        }).catch(error => {
            alert(error);
        });
    });

    btnWebcam.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent default behavior
        event.stopPropagation(); // Prevent the modal from closing
        // Rest of your code to start webcam stream
        openModal(); // Function to open the modal if it's closed
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

        // Generate a unique filename based on the current timestamp
        const filename = `captured_image_${Date.now()}.png`;
        console.log("haha", filename);

        // Assign the data URL to the preview image
        previewImage.src = dataUrl;

        // Stop the webcam
        // const mediaStream = video.srcObject;
        // const tracks = mediaStream.getTracks();
        // tracks[0].stop();

        // Do something with the filename, like submit it along with the form data
        console.log("Filename:", filename);
    });



});

function submitCapturedImageProfile() {
    const userID = localStorage.getItem("id");
    const caption = document.getElementById("caption").value; // Retrieve the caption value

    const formData = new FormData();

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");

    // Generate a unique filename based on the current timestamp and a random string
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
            window.location.href = "profile.html";
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