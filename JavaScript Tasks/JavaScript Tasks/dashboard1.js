function fetchUserDetails(email) {
    return fetch('data.json') 
        .then(response => response.json())
        .then(data => {
            const user = data.users.find(user => user.email === email); 
            if (user) {
                sessionStorage.setItem('username', user.username); 
                return user;
            } else {
                console.error('User not found');
                return null;
            }
            
        })
        .catch(err => console.error('Error fetching user data:', err));
}


function setUserInitials(name) {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    document.getElementById('userCircle').textContent = initials;
}


window.onload = function () {
    const email = sessionStorage.getItem('email') || 'user@example.com'; 
    fetchUserDetails(email).then(user => {
        if (user) {
            setUserInitials(user.username);
        }
    });
};

function formatAmount(input) {
    let value = input.value.replace(/[^0-9.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
    }
    if (parts.length === 2) {
        parts[1] = parts[1].substring(0, 2);
        value = parts.join('.');
    }
    input.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
$(document).ready(function () {
    $('.datepicker').datepicker({
        format: 'dd-M-yyyy',
        autoclose: true,
        todayHighlight: true
    });
    displaySummary();
});
class Data {
    constructor(date, description, amount) {
        this.date = date;
        this.description = description;
        this.amount = amount;
    }
}
// UI Class: Handle UI Tasks
class UI {
    static displayData() {
        const datas = Store.getDatas();
        datas.forEach((data) => UI.addDataToList(data));
    }
    static addDataToList(data) {
        const list = document.querySelector('#data-list');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${data.date}</td>
            <td>${data.description}</td>
            <td>${data.amount}</td>
            <td><a href="#" class="btn btn-primary btn-sm update">Update</a></td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        list.appendChild(row);
    }
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.form-section');
        const form = document.querySelector('#myForm');
        container.insertBefore(div, form);
        setTimeout(() => div.remove(), 3000);
    }
    static clearFields() {
        document.querySelector('#date').value = '';
        document.querySelector('#description').value = '';
        document.querySelector('#amount').value = '';
    }
}
// Store Class: Handles Storage
class Store {
    static getDatas() {
        let datas;
        if (localStorage.getItem('datas') === null) {
            datas = [];
        } else {
            datas = JSON.parse(localStorage.getItem('datas'));
        }
        return datas;
    }
    static addDatas(data) {
        const datas = Store.getDatas();
        datas.push(data);
        localStorage.setItem('datas', JSON.stringify(datas));
    }
    static updateDatas(datas) {
        localStorage.setItem('datas', JSON.stringify(datas));
    }
    static removeDatas(amount) {
        const datas = Store.getDatas();
        datas.forEach((data, index) => {
            if (data.amount === amount) {
                datas.splice(index, 1);
            }
        });
        localStorage.setItem('datas', JSON.stringify(datas));
    }
    static displayData() {
        const datas = Store.getDatas();
        const sortOrder = sessionStorage.getItem('sortOrder');
        if (sortOrder) {
            datas.sort((a, b) => sortOrder === 'asc' ? parseFloat(a.amount) - parseFloat(b.amount) : parseFloat(b.amount) - parseFloat(a.amount));
        }
        datas.forEach((data) => UI.addDataToList(data));
    }
}
let dataToDelete = null; // Variable to hold the data to delete
let dataToUpdateIndex = null; // Variable to hold the index for updating
// Event: Display Data
document.addEventListener('DOMContentLoaded', UI.displayData);
// Event: Add or Update Data
document.querySelector('#myForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const dateInput = document.querySelector('#date').value;
    const description = document.querySelector('#description').value;
    const amountInput = document.querySelector('#amount').value;
    if (!dateInput) {
        UI.showAlert('Please fill the date', 'danger');
    } else if (!description) {
        UI.showAlert('Please fill the description', 'danger');
    } else if (!amountInput) {
        UI.showAlert('Please fill the amount', 'danger');
    } else {
        const formattedDate = dateInput;
        const formattedAmount = amountInput.replace(/[^0-9.]/g, '');
        const data = new Data(formattedDate, description, formattedAmount);
        // Check if we are updating
        if (dataToUpdateIndex !== null) {
            // Show update confirmation modal
            const updateModal = new bootstrap.Modal(document.getElementById('updateModal'));
            updateModal.show();
            // Confirm update action
            document.getElementById('confirmUpdate').onclick = () => {
                const listItems = Store.getDatas();
                listItems[dataToUpdateIndex] = data; // Update data in the list
                Store.updateDatas(listItems); // Update storage
                // Update the table row with new data
                const row = document.querySelectorAll('#data-list tr')[dataToUpdateIndex];
                row.children[0].textContent = data.date;
                row.children[1].textContent = data.description;
                row.children[2].textContent = data.amount;
                UI.showAlert('Data Updated', 'success');

                UI.clearFields();
                row.classList.add('updated'); // Highlight updated row
                displaySummary();
                updateModal.hide();
                dataToUpdateIndex = null; // Clear the index after updating
            };
        } else {
            UI.addDataToList(data);
            Store.addDatas(data);
            UI.showAlert('Data Added', 'success');
            displaySummary();
            window.location.href='newPage.html';
            UI.clearFields();
        }
    }
});
// Event: Remove Data
document.querySelector('#data-list').addEventListener('click', (e) => {
    if (e.target.classList.contains('delete')) {
        e.preventDefault();
        dataToDelete = e.target.parentElement.parentElement.children[2].textContent; // Amount for deletion
        const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
        modal.show();
    }
    // Event: Update Data
    if (e.target.classList.contains('update')) {
        e.preventDefault();
        const row = e.target.closest('tr');
        const date = row.children[0].textContent;
        const description = row.children[1].textContent;
        const amount = row.children[2].textContent;
        // Set values to the form
        document.querySelector('#date').value = date;
        document.querySelector('#description').value = description;
        document.querySelector('#amount').value = amount;
        // Set the index for updating
        dataToUpdateIndex = [...document.querySelectorAll('#data-list tr')].indexOf(row);
    }
});
// Confirm delete action
document.getElementById('confirmDelete').addEventListener('click', () => {
    const rowToDelete = Array.from(document.querySelectorAll('#data-list tr')).find(row =>
        row.children[2].textContent === dataToDelete
    );
    if (rowToDelete) rowToDelete.remove();
    Store.removeDatas(dataToDelete);
    UI.showAlert('Data Removed', 'success');
    displaySummary();
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
    modal.hide();
    dataToDelete = null;
});
// Clear fields on modal cancel
document.getElementById('cancelUpdate').addEventListener('click', () => {
    UI.clearFields();
    dataToUpdateIndex = null; // Clear the index after cancelling
});
// Function to display the summary
function displaySummary() {
    const datas = Store.getDatas();
    let currentMonthValue = 0;
    let previousMonthValue = 0;
    let currentYearValue = 0;
    let previousYearValue = 0;
    let totalValue = 0;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    datas.forEach(data => {
        const amount = parseFloat(data.amount);
        // Assume the date is in the format DD-MMM-YYYY
        const [day, month, year] = data.date.split('-');
        const dataMonth = new Date(`${month} 1, ${year}`).getMonth();
        const dataYear = parseInt(year, 10);
        totalValue += amount;
        if (dataYear === currentYear) {
            if (dataMonth === currentMonth) {
                currentMonthValue += amount;
            } else if (dataMonth === currentMonth - 1) {
                previousMonthValue += amount;
            }
            currentYearValue += amount;
        } else if (dataYear === currentYear - 1) {
            previousYearValue += amount;
        }
    });
    document.getElementById('currentMonthValue').textContent = currentMonthValue;
    document.getElementById('previousMonthValue').textContent = previousMonthValue;
    document.getElementById('currentYearValue').textContent = currentYearValue;
    document.getElementById('previousYearValue').textContent = previousYearValue;
    document.getElementById('totalValue').textContent = totalValue;
}

// //Sorting
// document.getElementById('sortAsc').addEventListener('click', () => sortTableByAmount('asc'));
// document.getElementById('sortDesc').addEventListener('click', () => sortTableByAmount('desc'));

// function sortTableByAmount(order) {
//     const datas = Store.getDatas();
//     if (order === 'asc') {
//         datas.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
//     } else if (order === 'desc') {
//         datas.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
//     }

//     document.getElementById('data-list').innerHTML = '';

//     datas.forEach(data => UI.addDataToList(data));
// }
