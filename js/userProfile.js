document.addEventListener("DOMContentLoaded", function () {

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');

    fetchUserDetails(userId);


    fetchUserPosts(userId);
});

function formatTimestamp(timestamp) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(timestamp).toLocaleDateString('en-US', options);
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

function fetchUserPosts(userId) {
    const jsonData = {
        profID: userId
    }
    const formData = new FormData();
    formData.append("operation", "getProfile");
    formData.append("json", JSON.stringify(jsonData));
    if (userId) {
        axios.post(`http://localhost/sync/PHP/login.php`, formData)
            .then(response => {
                console.log("Response:", response);
                const prof = document.getElementById('prof');
                prof.innerHTML = '';

                const posts = response.data;
                posts.map(post => {
                    const cardHtml = `
            <div class="card mt-4 mx-auto d-block custom-card" style="border-radius: 20px; max-width: 500px; background-color: #272727;">
                <div class="text-start ml-3" style="font-weight:; font-size: 1.2rem; color: #E4E6EB;">${post.firstname}</div>
                <a href="#" onclick="openPostDetails(${post.postId})">
                    ${post.filename ? `<img src="uploads/${post.filename}" alt="Uploaded Image" class="card-img-top custom-img img-fluid">` : ''}
                </a>
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


fetchUserPosts();