<!DOCTYPE html>
<html lang="en">

<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>News Feed</title>
   <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

   <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">

   <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
   <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

   <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css">


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
            <li class="nav-item dropdown " style="margin-right: 15px; margin-top: 5px;">
               <a class=" nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="text-decoration: none; color: #E4E6EB; font-size: 17px; font-weight: bold; cursor:pointer;">
                  <img src="img/settings.png" alt="Setting Icon" style="width: 20px; height: 20px;">
               </a>
               <div class="dropdown-menu bg-dark " aria-labelledby="navbarDropdown" style="border-radius: 50px;">
                  <a class="dropdown-item bg-transparent" style="text-decoration: none; color:#E4E6EB; font-size: 17px; font-weight: bold; cursor:pointer;" data-toggle="modal" data-target="#userDetailsModal">
                     User Details
                  </a>
               </div>
            </li>

            <li class="nav-item" style="margin-right: 15px; margin-top: 5px;">
               <a class="nav-link" href="profile.html" style="cursor: pointer; text-decoration: none; color: #E4E6EB; font-size: 17px; font-weight: bold;">
                  <img src="img/profile.png" alt="Setting Icon" style="width: 100px; height: 25px;">
               </a>
            </li>

            <li class="nav-item">
               <a class="nav-link" style="cursor: pointer; text-decoration: none; color: #E4E6EB; font-size: 17px; font-weight: bold;" onclick="logout()">
                  <img src="img/logout.png" alt="Setting Icon" style="width: 40px; height: 40px;">
               </a>
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

            </div>
            <div class="modal-footer">
               <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
               <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#updateDetailsModal">Update Details</button>
            </div>
         </div>
      </div>
   </div>

   <div class="modal fade" id="updateDetailsModal" tabindex="-1" role="dialog" aria-labelledby="updateDetailsModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
         <div class="modal-content" style="background-color: #FFF; border-radius:20px;">
            <div class="modal-header">
               <h5 class="modal-title bg-white" id="updateDetailsModalLabel">Update User Details</h5>
               <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
               </button>
            </div>
            <div class="modal-body">
               <form id="updateDetailsForm" onsubmit="updateDetails()">
                  <div class="form-group" style="margin-bottom: 20px">
                     <input type="text" class="form-control" id="updated-firstname" placeholder="Enter updated Firstname">
                     <small id="firstnameErrorMsg" class="form-text text-danger"></small>
                  </div>
                  <div class="form-group" style="margin-bottom: 20px">

                     <input type="text" class="form-control" id="updated-middlename" placeholder="Enter updated middle name">
                     <small id="middlenameErrorMsg" class="form-text text-danger"></small>
                  </div>
                  <div class="form-group" style="margin-bottom: 20px">
                     <input type="text" class="form-control" id="updated-lastname" placeholder="Enter updated last name">
                     <small id="lastnameErrorMsg" class="form-text text-danger"></small>
                  </div>
                  <div class="form-group" style="margin-bottom: 20px">

                     <input type="email" class="form-control" id="updated-email" placeholder="Enter updated email">
                     <small id="emailErrorMsg" class="form-text text-danger"></small>
                  </div>
                  <div class="form-group" style="margin-bottom: 20px">

                     <input type="tel" class="form-control" id="updated-cpnumber" placeholder="Enter updated contact number">
                     <small id="contactErrorMsg" class="form-text text-danger"></small>
                  </div>
                  <div class="form-group" style="margin-bottom: 20px">

                     <input type="text" class="form-control" id="updated-username" placeholder="Enter updated username">
                     <small id="userErrorMsg" class="form-text text-danger"></small>
                  </div>
                  <div class="form-group" style="margin-bottom: 20px">

                     <input type="password" class="form-control" id="updated-password" placeholder="Enter updated password">
                     <small id="passErrorMsg" class="form-text text-danger"></small>
                  </div>

                  <div class="d-flex justify-content-end align-items-end">
                     <button type="submit" class="btn btn-primary">Save Changes</button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   </div>


   <div class="row-md-5 mb-3 ">

      <div class="col-md-3 justify-content-center d-flex align-items-center mx-auto mb-4">

         <button type="button" class="btn btn-outline-secondary  mb-4" style="margin-top:80px;" data-toggle="modal" data-target="#postModal">
            What's on your mind?
         </button>

         <!-- modal para sa mag create ug post -->
         <div class="modal fade" id="postModal" tabindex="-1" role="dialog" aria-labelledby="postModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
               <div class="modal-content" style="background-color: #242526; border-radius:20px;">
                  <div class="modal-header">
                     <h5 class="modal-title" id="postModalLabel" style="color: #E4E6EB;">Create a Post</h5>
                     <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                     </button>
                  </div>

                  <div class="modal-body" id="modal-body">
                     <form id="uploadForm" enctype="multipart/form-data">
                        <div class="form-group">
                           <!-- Input for file selection -->
                           <input type="file" class="form-control-file" id="file" name="file" style="display: none;">

                           <!-- Display selected image -->
                           <label for="file" style="cursor: pointer;">
                              <span style="color: #E4E6EB;">Choose File </span>
                              <img id="previewImage" src="#" alt="Selected Image" style="max-width: 100%; max-height: 200px; border-radius: 30px; display: none;" />
                              <h6 id="noImageText" style="color: #E4E6EB;">No image selected</h6>
                           </label>

                        </div>

                        <!-- camera option -->

                        <div class="d-flex justify-content-center">
                           <video id="webcam" class="embed-responsive-item" autoplay style="width: 100%; max-width: 600px;"></video>
                        </div>
                        <div class="row mt-2">
                           <div class="col-12">
                              <a id="webcamButton"><img src="../sync/img/camera.png" alt="" style="height: 30px; width:30px;"></a>
                              <button id="stopButton" style="background: transparent; border: none;"><img src="../sync/img/close.png" alt="" style="height: 30px; width: 30px;"></button>
                           </div>
                        </div>
                        <div class="row mt-2">
                           <div class="col-12">
                              <canvas id="canvas" style="display: none;"></canvas>
                           </div>
                        </div>



                        <div class="form-group">
                           <label for="caption">Caption:</label>
                           <textarea class="form-control" id="caption" name="caption" placeholder="What's on your mind?" style="background-color: #242526; color: #E4E6EB;"></textarea>
                        </div>

                     </form>
                  </div>

                  <div class="modal-footer d-flex justify-content-between">
                     <button type="button" class="btn btn-success" onclick="submitCapturedImage()">Post
                        Captured</button>
                     <div>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onclick="submitForm()">Post</button>
                     </div>
                  </div>
               </div>
            </div>
         </div>



      </div>

      <div class="col-md-13 " id="imageContainer"></div>

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
            </div>
         </div>
      </div>
   </div>


   <div class="modal fade" id="userPostsModal" tabindex="-1" role="dialog" aria-labelledby="userPostsModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
         <div class="modal-content" style="background-color: #242526;">
            <div class="modal-header">
               <h5 class="modal-title" id="userPostsModalLabel" style="color: #E4E6EB;">User Posts</h5>
               <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
               </button>
            </div>
            <div class="modal-body" id="userPostsModalBody">
            </div>
         </div>
      </div>
   </div>


   <!-- Comment Modal -->
   <div class="modal fade" id="commentModal" tabindex="-1" role="dialog" aria-labelledby="commentModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
         <div class="modal-content bg-dark text-white">
            <div class="modal-header">
               <h5 class="modal-title" id="commentModalLabel">Add Comment</h5>
               <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
               </button>
            </div>
            <div class="modal-body">
               <form id="commentForm">
                  <div class="form-group">
                     <label for="commentInput">Comment:</label>
                     <textarea class="form-control bg-dark text-white" id="commentInput" rows="3" placeholder="Enter your comment"></textarea>
                  </div>
               </form>
            </div>
            <div class="modal-footer">
               <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
               <button type="button" class="btn btn-primary" onclick="addComment()">Add Comment</button>
            </div>
            <!-- Display area for fetched comments -->
            <div class="modal-body bg-dark text-white">
               <h5>Comments:</h5>
               <div id="firstname"></div>
               <div id="commentList"></div>
            </div>
         </div>
      </div>
   </div>





   <script src="js/index.js"></script>


</body>

</html>