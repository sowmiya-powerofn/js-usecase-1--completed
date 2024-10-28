async function fetchData() {
    const response = await fetch('data.json');
    const data = await response.json();
    return data.users;
}

function validateCredentials(users, email, password) {
    for (const user of users) {
        if (user.email === email && user.password === password) {
            return true;
        }
    }
    return false;
}

function showTooltip(message, isError = false) {
    const tooltip = document.getElementById("tooltip");
    tooltip.textContent = message;
    tooltip.className = `tooltip ${isError ? 'error' : 'success'} show`;
    setTimeout(() => {
        tooltip.classList.remove("show");
    }, 3000); // Tooltip will hide after 3 seconds
}

document.addEventListener('DOMContentLoaded', () => {
    const passwordField = document.getElementById("password");
    const togglePassword = document.querySelector(".password-toggle-icon i");

    // Toggle password visibility
    togglePassword.addEventListener("click", function () {
        if (passwordField.type === "password") {
            passwordField.type = "text";
            togglePassword.classList.remove("fa-eye-slash");
            togglePassword.classList.add("fa-eye");
        } else {
            passwordField.type = "password";
            togglePassword.classList.remove("fa-eye");
            togglePassword.classList.add("fa-eye-slash");
        }
    });

    // Enable/disable submit button
    function toggleSubmitButton() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        document.getElementById("submit").disabled = !(email && password);
    }

    document.getElementById('email').addEventListener('input', toggleSubmitButton);
    document.getElementById('password').addEventListener('input', toggleSubmitButton);

    // Form validation and redirection
    document.getElementById('submit').addEventListener('click', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const emailError = document.getElementById("email-error");
        const passwordError = document.getElementById("password-error");

        emailError.textContent = "";
        passwordError.textContent = "";

        let isValid = true;

        // Validate email format
        if (email === "" || !email.includes("@")) {
            // emailError.textContent = "Please enter a valid email address.";
            showTooltip("Please enter valid email .", true);
            isValid = false;
        }

        // Validate password length
        if (password === "" || password.length < 6) {
            //passwordError.textContent = "Please enter a password with at least 6 characters.";
            showTooltip("Please enter valid password .", true);
            isValid = false;
        }

        if (isValid) {
            const users = await fetchData();
            const isValidCredentials = validateCredentials(users, email, password);
            if (isValidCredentials) {
                showTooltip("Login successful!", false);
                setTimeout(() => {
                    window.location.href = 'newPage.html'; 
                }, 5000);
                
            } else {
                console.log("Invalid");
                // passwordError.textContent = "Invalid email or password.";
                showTooltip("Invalid email or password.", true);
            }
        }
    });
});
