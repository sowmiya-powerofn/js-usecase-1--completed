// Fetch user details from data.json based on email
function fetchUserDetails(email) {
    return fetch('data.json') // Assuming data.json is in the same directory
        .then(response => response.json())
        .then(data => {
            const user = data.users.find(user => user.email === email); // Find user by email
            if (user) {
                sessionStorage.setItem('username', user.username); // Store username in sessionStorage
                return user;
            } else {
                console.error('User not found');
                return null;
            }
        })
        .catch(err => console.error('Error fetching user data:', err));
}

// Function to set user initials in the userCircle
function setUserInitials(name) {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    document.getElementById('userCircle').textContent = initials;
}

// Load user details and apply settings on page load
window.onload = function () {
    const email = sessionStorage.getItem('email') || 'user@example.com'; // Replace with dynamic email if needed
    fetchUserDetails(email).then(user => {
        if (user) {
            // Set initials based on username
            setUserInitials(user.username);
        }
    });
};

// Update profile picture and color on change
document.getElementById('profileUpload').addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('profilePreview').src = e.target.result;
            document.getElementById('profilePreview').style.display = 'block';
            document.getElementById('headerProfilePic').src = e.target.result;
            sessionStorage.setItem('profilePic', e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// Handle color picker change
document.getElementById('colorPicker').addEventListener('input', function () {
    const color = this.value;
    document.querySelector('.header').style.borderColor = color;
    document.getElementById('userCircle').style.backgroundColor = color; // Update userCircle color
    sessionStorage.setItem('headerBorderColor', color);
});

// Load saved settings from sessionStorage on page load
window.onload = function () {
    const savedProfilePic = sessionStorage.getItem('profilePic');
    const savedColor = sessionStorage.getItem('headerBorderColor');

    if (savedProfilePic) {
        document.getElementById('headerProfilePic').src = savedProfilePic;
    }

    if (savedColor) {
        document.querySelector('.header').style.borderColor = savedColor;
        document.getElementById('colorPicker').value = savedColor;
        document.getElementById('userCircle').style.backgroundColor = savedColor; // Update userCircle color
    }

    // Fetch user details and set initials
    const email = sessionStorage.getItem('email') || 'user@example.com'; // Replace with dynamic email if needed
    fetchUserDetails(email).then(user => {
        if (user) {
            setUserInitials(user.username); // Set initials based on username
        }
    });
};

document.getElementById('myForm').addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Settings saved!');
});
//Sorting
document.getElementById('sortAsc').addEventListener('click', () => {
    sessionStorage.setItem('sortOrder', 'asc');
});

document.getElementById('sortDesc').addEventListener('click', () => {
    sessionStorage.setItem('sortOrder', 'desc');
});
