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
            // Update the content on userProfile.html with user details
            document.getElementById("userFirstname").textContent = user.firstname;
            // Add more lines to update other elements as needed
        })
        .catch(error => {
            console.error('Error fetching user details:', error);
        });
}


function formatTimestamp(timestamp) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(timestamp).toLocaleDateString('en-US', options);
}

// Function to fetch and display user posts
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
                    <div class="text-start ml-3" style="font-weight:; font-size: 1.2rem; color: #E4E6EB;">${post.firstname}</div>
            
                        ${post.filename ? `<img src="uploads/${post.filename}" alt="Uploaded Image" class="card-img-top custom-img img-fluid">` : ''}
                        
                        <div class="d-flex justify-content-between">
                            <a href="#" onclick="deletePost(${post.id})" class="text-muted">Delete</a>
                            <div class="small text-muted">${formatTimestamp(post.upload_date)}</div>
                        </div>



                        <div class="text-center mb-4">
                        <div class="mb-4" style="font-size: 1.1rem; color: #E4E6EB;">${post.caption}</div>

                    </div>

                    <div class="d-flex align-items-center">
                                <button class="btn btn-info mr-2 ml-4" onclick="heartPost(${post.id})" style="border-radius: 30px; padding: 10px;">
                                    <span id="likeCount-${post.id}">${post.likes || 0}</span> Likes
                                </button>
                                <ul id="comments-${post.postId}" class="list-unstyled mr-3"></ul>
                                <form onsubmit="addComment(event, ${post.postId})" class="d-flex">
                                    <input type="text" class="form-control mr-2" style="flex-grow: 1; background-color: #242526; border-radius: 20px; width: 300px;" id="comment-${post.postId}" placeholder="Add a comment" required>
                                    <button type="submit" class="btn">
                                        <img src="img/comment.png" alt="Sync Comment">
                                    </button>
                                </form>
                            </div>
                </div>
            `;

                    // Append the card HTML to the image container
                    prof.innerHTML += cardHtml;

                    // Fetch and display comments for each post
                    // fetchComments(post.postId);
                });
            })
            .catch(error => {
                console.error('Error fetching user posts:', error);
            });
    } else {
        console.error('userId not available');
    }
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

    // Check if the user has already liked the post
    const likeCountElement = document.getElementById(`likeCount-${postId}`);
    const isLiked = likeCountElement && likeCountElement.dataset.liked === 'true';

    axios.post(`http://localhost/sync/PHP/login.php`, formData)
        .then(response => {
            if (response.data === 1) {

                // If liked successfully, update the like count
                const currentLikes = parseInt(likeCountElement.textContent);

                if (!isLiked) {
                    console.log('Post liked successfully:', response);
                    likeCountElement.textContent = currentLikes + 1;
                    likeCountElement.dataset.liked = 'true';
                } else {

                    console.log('Post unliked successfully:', response);
                    likeCountElement.textContent = Math.max(currentLikes - 1, 0); // Ensure it's not negative
                    likeCountElement.dataset.liked = 'false';
                }
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