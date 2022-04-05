//Global variables
let employees = [];
const urlAPI = `https://randomuser.me/api/?results=12&inc=name,picture,email,location,phone,dob&noinfo&nat=US`;
const gridContainer = document.querySelector('.grid-container');
const overlay = document.querySelector('.overlay');
const modalContainer = document.querySelector('.modal-content');
const modalClose = document.querySelector('.modal-close');
const searchBar = document.querySelector('#search')
const searchButton = document.querySelector('.header button')
let modalPrevious = document.getElementById('previous');
let modalNext = document.getElementById('next')

//Fetch data from API
fetch(urlAPI)
    .then(checkStatus)
    .then(res => res.json())
    .then(res => employees = res.results)
    .then(displayEmployees)
    .catch(err => console.log('Looks like there was a problem here!' ,err))

// HELPER FUNCTIONS  
//Check response function
function checkStatus(response)  {
    if(response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

//This function takes the data and stores it in a variable
function displayEmployees(employeeData) {
    let employeeHTML = '';

    //Loop through each employee and create HTML Markup
    employeeData.forEach((employee, index) => {
        let name = employee.name;
        let email = employee.email;
        let city = employee.location.city;
        let state = employee.location.state;
        let picture = employee.picture;

        employeeHTML += `
        <div class="card" data-index="${index}">
            <img class="avatar" src="${picture.large}" alt="avatar">
            <div class="text-container">
                <h2 class="name">${name.first} ${name.last}</h2>
                <p class="email">${email}</p>
                <p class="address">${city}, ${state}</p>
            </div>
        </div>
        `
    });
    gridContainer.innerHTML = employeeHTML;
}

//This function creates a displays modal of clicked employee card
function displayModal(index) {
    let {name, dob, phone, email, location:{ city, street, state, postcode }, picture } = employees[index];
    let birthDate = new Date(dob.date);
    let month = birthDate.getMonth() + 1;
    let date = birthDate.getDate();

    const modalHTML = `
    <img class="avatar" src="${picture.large}" alt="avatar">
    <div class="text-container">
        <h2 class="name">${name.first} ${name.last}</h2>
        <p class="email">${email}</p>
        <p class="address">${city}</p>
        <hr>
        <p>${phone}</p>
        <p class="address">${street.number} ${street.name}, ${state} ${postcode}</p>
        <p>Birthday: ${month}/${date}/${birthDate.getFullYear()}</p>
    </div>
    `;

    overlay.classList.remove('hidden');
    modalContainer.innerHTML = modalHTML;
};

//This function takes user's input and and iterates through all employee's card looking if there's any matches
function search() {
    const searchBar = document.querySelector('#search');
    const searchInput = searchBar.value.toLowerCase();
    let matches = [];
    for (let i = 0; i < employees.length; i++) {
        const employeeList = employees[i];
        const employeeName = (employees[i].name.first + employees[i].name.last).toLowerCase();
        if (employeeName.includes(searchInput)) {
            matches.push(employeeList)
        }
    }
    if (matches.length >= 1) {
        displayEmployees(matches);
        console.log(matches.length);
    } else {
        console.log(matches.length);
        const noMatch = '<h2>No results found, please try another name!</h2>'
        gridContainer.innerHTML = noMatch;
    }
}

//Event listeners 
let currentModal = ''
gridContainer.addEventListener('click', e => {
    if(e.target !== gridContainer) {
        const card = e.target.closest('.card');
        let index = card.getAttribute('data-index');
        console.log(index)
        displayModal(index);
        return currentModal = index;
    } 

});

modalClose.addEventListener('click', e => overlay.classList.add('hidden'));

//Modal
modalPrevious.addEventListener('click', e => {
    if (currentModal > 0) {
        currentModal--;
        modalPrevious.disable = false;
    } else if (currentModal === 0) {
        modalPrevious.disable = true;
    } else {
        displayModal(currentModal);
        console.log(currentModal);
}});

modalNext.addEventListener('click', e => {
    if (currentModal <= employees.length) {
        currentModal++;
        modalNext.disable = false;
    } else if (currentModal === employees.length - 1) {
        modalNext.disable = true;
    } else {
        displayModal(currentModal);
        console.log(currentModal);
}});

//This event handlers improve users experience by filtering the search results either clicking or just typing.
searchBar.addEventListener('keyup', e => {
    searchInput = e.target.value.toLowerCase();
    console.log(searchInput)
    search(employees);
});

searchButton.addEventListener('click', e => e.target = search(employees))