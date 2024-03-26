function userList() {
    console.log("natawg");

    axios.get('http://localhost/sync/fetch_all_users.php')
        .then(response => {
            const usersContainer = document.getElementById('usersContainer');
            usersContainer.innerHTML = '';

            response.data.forEach(user => {
                const cardHtml = `
                    <div class="card mt-4 mx-auto d-block custom-card" style="border-radius: 20px; max-width: 500px; background-color: #272727;">
                        <a href="#" onclick="openUserPostsModal(${user.id})" style="text-decoration: none; color: #E4E6EB;">
                            <div class="text-start ml-3" style="font-weight:bold; font-size: 20px;">${user.firstname}</div>
                        </a>
                    </div>
                `;
                usersContainer.innerHTML += cardHtml;
            });
        })
        .catch(error => {
            console.error('Error fetching user list:', error);
        });
}

document.addEventListener('DOMContentLoaded', userList);
