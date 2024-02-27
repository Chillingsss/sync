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
<!-- #E5E4E2; -->

<body class="mt-5" id="body" style="background-color: #0F0F0F">

   <nav class="navbar navbar-expand-lg fixed-top" id="navbar" style="background-color:#242526;">
      <a class="navbar-brand" href="index.php" style="text-decoration: none; ">
         <img src="img/sync.png" alt="Sync Logo" style="height: 50px; width: 100px;">
      </a>

      <span id="userFirstname" style="margin-left: 10px; color: #E4E6EB;"></span>

      <button class="navbar-toggler " type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
         <img src="img/menu.png" alt="Toggle Navigation" style="width: 40px; height: 40px;">
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
         <ul class="navbar-nav ml-auto">

            <li class="nav-item">
               <a class="nav-link" href="profile.html" style="text-decoration: none; color: #E4E6EB; font-size: 17px; font-weight: bold;">Profile</a>
            </li>
            <button type="button" class="btn btn-outline-secondary mb-4" style="margin-top:20px;" data-toggle="modal" data-target="#userDetailsModal">
               User Details
            </button>
            <li class="nav-item">
               <a class="nav-link" style="cursor: pointer; text-decoration: none; color: #E4E6EB; font-size: 17px; font-weight: bold;" onclick="logout()">Logout</a>
            </li>
         </ul>
      </div>
   </nav>

   <div class="modal fade" id="userDetailsModal" tabindex="-1" role="dialog" aria-labelledby="userDetailsModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
         <div class="modal-content" style="background-color: #242526; border-radius:20px;">
            <div class="modal-header">
               <h5 class="modal-title text-white" id="userDetailsModalLabel">User Details</h5>
               <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
               </button>
            </div>
            <div class="modal-body text-white" id="userDetailsContent">
               <!-- This div will be populated with the user details content -->

            </div>
            <div class="modal-footer">
               <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
               <button type="button" class="btn btn-primary" onclick="openUpdateDetailsModal()">Update</button>
            </div>
         </div>
      </div>
   </div>


   <div class="row-md-5 mb-3 ">

      <div class="col-md-3 justify-content-center d-flex align-items-center mx-auto mb-4">
         <!-- Button to trigger modal -->
         <button type="button" class="btn btn-outline-secondary  mb-4" style="margin-top:80px;" data-toggle="modal" data-target="#postModal">
            What's on your mind?
         </button>

         <!-- Modal -->
         <div class="modal fade" id="postModal" tabindex="-1" role="dialog" aria-labelledby="postModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
               <div class="modal-content" style="background-color: #242526; border-radius:20px;">
                  <div class="modal-header">
                     <h5 class="modal-title" id="postModalLabel" style="color: #E4E6EB;">Create a Post</h5>
                     <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                     </button>
                  </div>
                  <div class="modal-body">
                     <!-- Form inside the modal -->
                     <form id="uploadForm" enctype="multipart/form-data">
                        <div class="form-group">
                           <!-- Input for file selection -->
                           <input type="file" class="form-control-file" id="file" name="file" style="display: none;">

                           <!-- Display selected image -->
                           <label for="file" style="cursor: pointer;">
                              <span style="color: #E4E6EB;">Choose File </span>
                              <img id="previewImage" src="#" alt="Selected Image" style="max-width: 100%; max-height: 200px; border-radius:30px" />

                           </label>
                        </div>

                        <div class="form-group">
                           <label for="caption">Caption:</label>
                           <textarea class="form-control" id="caption" name="caption" placeholder="What's on your mind?" style="background-color: #242526; color: #E4E6EB;"></textarea>
                        </div>
                     </form>
                  </div>
                  <div class=" modal-footer">
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



   <div class="modal fade" id="imageModal" tabindex="-1" role="dialog" aria-labelledby="imageModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
         <div class="modal-content" style="background-color: #242526;">
            <div class="modal-header">
               <h5 class="modal-title" id="imageModalLabel" style="color: #E4E6EB;">Post Details</h5>
               <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
               </button>
            </div>
            <div class="modal-body" id="postDetails">
               <!-- This div will be populated with the post details -->
            </div>
         </div>
      </div>
   </div>

   <script src="js/index.js"></script>

   <script>
      document.addEventListener("DOMContentLoaded", function() {
         console.log("damn");
         const userId = sessionStorage.getItem('userId');

         // Check if userId is available before making the request
         if (userId) {
            axios.get(`http://localhost/sync/PHP/fetch_user_details.php?userId=${userId}`)
               .then(response => {
                  console.log('User details response:', response.data);
                  const userData = response.data;

                  // Update the modal content with user details
                  document.getElementById("userFirstname").textContent = userData.firstname;
                  // Add more lines to update other elements as needed

                  // Optional: You can also update the content inside the modal
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
   </script>
</body>

</html>