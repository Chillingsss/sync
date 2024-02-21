$('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
})

var isLoggedIn = localStorage.getItem('isUserLoggedIn');

if (isLoggedIn === "true") {

    window.location.href = "index.php";
}
else {
    console.log(isLoggedIn);
}

function showRegistrationForm() {
    document.getElementById('login-form').classList.add('d-none');
    document.getElementById('register').classList.add('d-none');
    document.getElementById('registration-card').classList.remove('d-none');
    document.getElementById('back-to-login').classList.remove('d-none');


}

function showLoginForm() {
    document.getElementById('registration-card').classList.add('d-none');
    document.getElementById('login-form').classList.remove('d-none');
    document.getElementById('register').classList.remove('d-none');
}



// Check if there is a session identifier in the localStorage
// var sessionId = localStorage.getItem('session_id');
// if (sessionId) {
//     checkLoginStatus();
// }

// function checkLoginStatus() {
//     console.log("Check login status called");
//     var sessionId = localStorage.getItem('session_id');
//     if (sessionId) {
//         var xhr = new XMLHttpRequest();
//         xhr.open('GET', 'PHP/check_login.php', true);
//         xhr.onload = function () {
//             if (xhr.status === 200) {
//                 var response = JSON.parse(xhr.responseText);
//                 console.log(response);
//                 if (response.status === 'success') {
//                     isLoggedIn = true;
//                     document.getElementById('update-details-btn').removeAttribute('disabled');
//                     document.getElementById('delete-account-btn').removeAttribute('disabled');
//                     document.getElementById('update-details-btn').style.display = 'block';
//                     document.getElementById('delete-account-btn').style.display = 'block';
//                     document.getElementById('logout-btn').style.display = 'block';
//                 } else {
//                     handleLogout();
//                 }
//             } else {
//                 console.error("Error checking login status. Status: " + xhr.status);
//                 handleLogout();
//             }
//         };
//         xhr.send();
//     } else {
//         handleLogout();
//     }
// }

function handleLogout() {
    isLoggedIn = false;
    document.getElementById('update-details-btn').style.display = 'none';
    document.getElementById('delete-account-btn').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'none';
    showForm('login');
    history.pushState({}, null, 'login.html');
}

function showForm(option) {
    var forms = document.querySelectorAll('.form-container');
    forms.forEach(form => form.style.display = 'none');
    document.getElementById(option + '-form').style.display = 'block';


    document.getElementById('update-details-btn').style.display = 'none';
    document.getElementById('delete-account-btn').style.display = 'none';
    document.getElementById('logout-btn').style.display = isLoggedIn ? 'block' : 'none';
}

function checkPasswordMatch() {
    var password = document.getElementById("reg-password").value;
    var retypePassword = document.getElementById("reg-retype-password").value;
    var errorElement = document.getElementById("retypePasswordErrorMsg");

    if (password !== retypePassword) {
        errorElement.textContent = "Passwords do not match";
    } else {
        errorElement.textContent = "";
    }
}

function registerUser() {
    try {
        const firstnameInput = document.getElementById("reg-firstname");
        const middlenameInput = document.getElementById("reg-middlename");
        const lastnameInput = document.getElementById("reg-lastname");
        const emailInput = document.getElementById("reg-email");
        const cpnumberInput = document.getElementById("reg-cpnumber");
        const userInput = document.getElementById("reg-username");
        const passInput = document.getElementById("reg-password");
        const retypePasswordInput = document.getElementById("reg-retype-password");

        // Reset previous error messages and border colors
        document.getElementById("firstnameErrorMsg").textContent = '';
        document.getElementById("middlenameErrorMsg").textContent = '';
        document.getElementById("lastnameErrorMsg").textContent = '';
        document.getElementById("emailErrorMsg").textContent = '';
        document.getElementById("contactErrorMsg").textContent = '';
        document.getElementById("userErrorMsg").textContent = '';
        document.getElementById("passErrorMsg").textContent = '';
        document.getElementById("retypePasswordErrorMsg").textContent = '';

        firstnameInput.style.borderColor = '';
        middlenameInput.style.borderColor = '';
        lastnameInput.style.borderColor = '';
        emailInput.style.borderColor = '';
        cpnumberInput.style.borderColor = '';
        userInput.style.borderColor = '';
        passInput.style.borderColor = '';
        retypePasswordInput.style.borderColor = '';

        // Check for empty fields
        if (
            firstnameInput.value.trim() === '' ||
            middlenameInput.value.trim() === '' ||
            lastnameInput.value.trim() === '' ||
            emailInput.value.trim() === '' ||
            cpnumberInput.value.trim() === '' ||
            userInput.value.trim() === '' ||
            passInput.value.trim() === '' ||
            retypePasswordInput.value.trim() === ''
        ) {
            if (firstnameInput.value.trim() === '') {
                document.getElementById("firstnameErrorMsg").textContent = 'First name cannot be empty';
                firstnameInput.style.borderColor = 'red';
            }
            if (middlenameInput.value.trim() === '') {
                document.getElementById("middlenameErrorMsg").textContent = 'Middle name cannot be empty';
                middlenameInput.style.borderColor = 'red';
            }
            if (lastnameInput.value.trim() === '') {
                document.getElementById("lastnameErrorMsg").textContent = 'Last name cannot be empty';
                lastnameInput.style.borderColor = 'red';
            }
            if (emailInput.value.trim() === '') {
                document.getElementById("emailErrorMsg").textContent = 'Email cannot be empty';
                emailInput.style.borderColor = 'red';
            }
            if (cpnumberInput.value.trim() === '') {
                document.getElementById("contactErrorMsg").textContent = 'Contact number cannot be empty';
                cpnumberInput.style.borderColor = 'red';
            }
            if (userInput.value.trim() === '') {
                document.getElementById("userErrorMsg").textContent = 'Username cannot be empty';
                userInput.style.borderColor = 'red';
            }
            if (passInput.value.trim() === '') {
                document.getElementById("passErrorMsg").textContent = 'Password cannot be empty';
                passInput.style.borderColor = 'red';
            }
            if (retypePasswordInput.value.trim() === '') {
                document.getElementById("retypePasswordErrorMsg").textContent = 'Please re-type your password';
                retypePasswordInput.style.borderColor = 'red';
            }

            return;
        }

        const password = passwordInput.value;
        const retypePassword = retypePasswordInput.value;

        // Check if the passwords match
        if (password !== retypePassword) {
            alert("Passwords do not match");
            return;
        }

        const registrationForm = document.getElementById("registration-form-inner");
        const formData = new FormData(registrationForm);

        axios.post("http://localhost/media/PHP/register.php", formData)
            .then((response) => {
                console.log(response);
                const responseData = response.data || {};

                if (responseData.status === "success") {
                    alert("Registration failed!");
                } else {
                    alert("Registration successful!");
                    window.location.href = "login.html";
                }
            })
            .catch((error) => {
                console.error("Registration error: ", error);
            });
    } catch (error) {
        console.error("Registration error: ", error);
    }
}










// function loginUser() {
//     var formData = new FormData(document.getElementById('login-form-inner'));

//     // Use Axios for the login request
//     axios.post('PHP/login.php', formData)
//         .then(function (response) {
//             console.log("Login response:", response.data);

//             if (response.data.status === 'success') {
//                 localStorage.setItem("firstname", response.data.userDetails.firstname);
//                 localStorage.setItem("middlename", response.data.userDetails.middlename);
//                 localStorage.setItem("lastname", response.data.userDetails.lastname);
//                 localStorage.setItem("username", response.data.userDetails.username);

//                 localStorage.setItem("isUserLoggedIn", "true");

//                 window.location.href = "dashboard.html";
//             } else {
//                 alert("Login failed: " + response.data.message);
//             }
//         })
//         .catch(function (error) {
//             console.error("Login request failed:", error);
//         });
// }

//lerio version
function loginUser() {
    try {
        const usernameInput = document.getElementById("loginUsername");
        const passwordInput = document.getElementById("loginPassword");
        const usernameErrorMsg = document.getElementById("usernameErrorMsg");
        const passwordErrorMsg = document.getElementById("passwordErrorMsg");

        // Reset previous error messages and border colors
        usernameErrorMsg.textContent = '';
        passwordErrorMsg.textContent = '';
        usernameInput.style.borderColor = '';
        passwordInput.style.borderColor = '';


        if (usernameInput.value.trim() === '' || passwordInput.value.trim() === '') {
            if (usernameInput.value.trim() === '') {
                usernameErrorMsg.textContent = 'Username cannot be empty';
                usernameInput.style.borderColor = 'red';
            }
            if (passwordInput.value.trim() === '') {
                passwordErrorMsg.textContent = 'Password cannot be empty';
                passwordInput.style.borderColor = 'red';
            }
            return;
        }

        const formData = new FormData();

        const jsonData = {
            loginUsername: usernameInput.value,
            loginPassword: passwordInput.value
        }

        formData.append("operation", "loginUser");
        formData.append("json", JSON.stringify(jsonData));

        axios({
            url: "http://localhost/media/PHP/login.php",
            method: "post",
            data: formData,
        })
            .then((response) => {
                console.log(response)
                console.log(response.data.data[0])
                if (response.data.status === -1) {

                    usernameErrorMsg.textContent = 'Incorrect username or password';
                    passwordErrorMsg.textContent = 'Incorrect username or password';
                    usernameInput.style.borderColor = 'red';
                    passwordInput.style.borderColor = 'red';
                } else {
                    localStorage.setItem("id", response.data.data[0].id);
                    sessionStorage.setItem("id", response.data.data[0].id);
                    localStorage.setItem("firstname", response.data.data[0].firstname);
                    localStorage.setItem("middlename", response.data.data[0].middlename);
                    localStorage.setItem("lastname", response.data.data[0].lastname);
                    localStorage.setItem("email", response.data.data[0].email);
                    localStorage.setItem("cpnumber", response.data.data[0].cpnumber);
                    localStorage.setItem("username", response.data.data[0].username);
                    localStorage.setItem("password", response.data.data[0].password);
                    localStorage.setItem("isUserLoggedIn", "true");
                    window.location.href = "index.php";
                }
            })
            .catch((error) => {
                console.error("Login error: ", error);
            });
    } catch (error) {
        console.error("Login error: ", error);
    }
}









// document.addEventListener('DOMContentLoaded', function () {
//     // Add event listeners to the buttons
//     document.getElementById('logout-btn').addEventListener('click', logout);
//     document.getElementById('login-btn').addEventListener('click', function () {
//         showForm('login');
//     });
//     document.getElementById('register-btn').addEventListener('click', function () {
//         showForm('registration');
//     });
//     document.getElementById('update-details-btn').addEventListener('click', updateDetails);
//     document.getElementById('delete-account-btn').addEventListener('click', deleteAccount);

//     // Additional listeners for login and registration forms
//     document.getElementById('login-form-inner').addEventListener('submit', function (e) {
//         e.preventDefault(); // Prevent the default form submission
//         loginUser();
//     });

//     document.getElementById('registration-form-inner').addEventListener('submit', function (e) {
//         e.preventDefault(); // Prevent the default form submission
//         registerUser();
//     });
// });