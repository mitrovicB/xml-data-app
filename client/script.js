loadXMLDoc(getUsers, "GET", "users");

function showError(msg) {
  //let errorDiv = document.getElementById('error');
  console.log(msg);
}

function saveUserInfo() {
  let userInfo = {
    first_name: document.querySelector('[name="first_name"]').value,
    last_name: document.querySelector('[name="last_name"]').value,
    address: document.querySelector('[name="address"]').value,
    city: document.querySelector('[name="city"]').value,
    country: document.querySelector('[name="countries"]').value,
    email: document.querySelector('[name="email"]').value,
    password: document.querySelector('[name="password"]').value
  };
  console.log(userInfo);

  // test email format https://ui.dev/validate-email-address-javascript/
  if (! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
    showError("Invalid email format!");
    return;
  }
  if (userInfo.password.length < 8) {
      showError("Password must be at least 8 characters long!");
      return;
  }

  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
    }
    /*
    switch(this.readyState == 4 && this.status) {
      /** This condition needs to be changed 
      case 200:
        console.log(xhttp.responseText);
        break;
      case 400:
        showError('You must fill all fields!');
        break;
      case 409:
        showError('This email address is already in use!');
      break;
      default:
        showError('Some error occured.') */
  };
  xhttp.open("POST", "http://127.0.0.1:3000/register", true);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify(userInfo));
}

function loadXMLDoc(callback, method, path) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    console.log(this.readyState,this.status);
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
        callback(this);
      }
  };
  xhttp.open(method, "http://127.0.0.1:3000/" + path, true);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send();
}

function getUsers(xml) {
  let i, data;
  let newArr = [];
  data = JSON.parse(xml.responseText);
  console.log(data.length);
  for (i = 0; i < data.length; i++) {
    const fullName = {
      full_name : [data[i].first_name + ' ' + data[i].last_name]
    } 
    newObject = Object.assign(fullName, data[i]);
    newArr.push(newObject);
  }
  newArr.forEach(user => {
    delete user.first_name;
    delete user.last_name;
    delete user.password;
  })
  const table = document.getElementById("content");
  table.appendChild(buildTable(newArr));
}

function buildTable(data) {
  console.log('data:', data)
  let table = document.createElement('table');
  table.className = 'table';
  let thead = document.createElement('thead');
  let tbody = document.createElement('tbody');
  let headRow = document.createElement('tr');
  ["Full Name", "Address", "City", "Country", "E-mail", "Action"].forEach(function(el) {
    let th = document.createElement('th');
    th.appendChild(document.createTextNode(el));
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);
  data.forEach(function(user) {
    let tr = document.createElement('tr');
    // Swapping email and country object elements
    const tmp = user.email;
    user.email = user.country;
    user.country = tmp;
    for (let obj in user) {
      let td = document.createElement('td');
      td.appendChild(document.createTextNode(user[obj]));
      tr.appendChild(td);
    }
    let button = document.createElement('button');
    button.appendChild(document.createTextNode('delete'));
    button.setAttribute('class', 'delete-btn');
    button.addEventListener('click', function() {
      console.log('clicked')
      let selectedUserEmail = this.previousElementSibling.innerHTML;
      console.log(selectedUserEmail);
      deleteUser(selectedUserEmail);
    })
    tr.appendChild(button)
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  return table;
}

function deleteUser(email) {

  let user = {
    'email': email
  }
  console.log(user);

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    console.log(this.readyState,this.status);
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
      }
  };
  xhttp.open("PUT", "http://127.0.0.1:3000/users", true);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify(user));
}