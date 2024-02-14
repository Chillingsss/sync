<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image Uploads</title>
    <!-- Add the Bootstrap CSS link -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <!-- Add your custom CSS or Tailwind CSS file for styling -->
    <style>
        /* Add your custom styles here */
        body.dark-mode {
            background-color: #333;
            color: #fff;

        }
    </style>
</head>

<body class="container mt-4" id="body">
    <div class="row">
        <div class="col-md-6">
            <form action="upload.php" method="POST" enctype="multipart/form-data" class="mb-4">
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

        <!-- Display uploaded images and captions -->
        <div class="col-md-6" id="imageContainer"></div>
    </div>

    <!-- Dark mode toggle button -->
    <button id="darkModeToggle" class="btn btn-secondary mt-2">Toggle Dark Mode</button>

    <!-- Add the Bootstrap JS and Popper.js scripts (required for Bootstrap components) -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

    <script>
        const darkModeToggle = document.getElementById('darkModeToggle');
        const body = document.getElementById('body');

        darkModeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
        });
        // Function to fetch and display images and captions using JavaScript
        function fetchImages() {
            fetch('fetch_images.php')
                .then(response => response.json())
                .then(data => {
                    const imageContainer = document.getElementById('imageContainer');
                    imageContainer.innerHTML = '';

                    data.forEach(post => {
                        const card = document.createElement('div');
                        card.classList.add('card', 'mb-4');

                        const img = document.createElement('img');
                        img.src = 'uploads/' + post.filename;
                        img.alt = 'Uploaded Image';
                        img.classList.add('card-img-top', 'rounded-top');

                        const cardBody = document.createElement('div');
                        cardBody.classList.add('card-body');

                        const p = document.createElement('p');
                        p.classList.add('card-text');
                        p.textContent = post.caption;

                        cardBody.appendChild(p);
                        card.appendChild(img);
                        card.appendChild(cardBody);

                        imageContainer.appendChild(card);
                    });
                });
        }

        // Fetch and display images on page load
        document.addEventListener('DOMContentLoaded', fetchImages);

        // Dark mode toggle

    </script>
</body>

</html>