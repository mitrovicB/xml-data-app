const api_server = API_URL + ":" + API_PORT;
console.log(api_server);

const registerBtn = document.getElementById("register");
registerBtn.addEventListener('click', () => { saveUserData(); });
const errorDiv = document.getElementById('error');

function showError(msg) {
  errorDiv.innerText = msg;
  errorDiv.style.display = "block"
  console.log(msg);
}

function hideError() {
  errorDiv.style.display = "none";
}

loadXMLDoc(getUsers);

function loadXMLDoc(callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
        callback(this);
      }
  };
  xhttp.open("GET", api_server + "/users", true);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send();
}

function getUsers(xml) {
  let i, data;
  let newArr = [];
  data = JSON.parse(xml.responseText);
  
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
  });

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
      let selectUser = this.previousElementSibling.innerHTML;
      console.log(selectUser);
      deleteUser(selectUser);
      });

    tr.appendChild(button)
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  return table;
}

function saveUserData() {
  let userData = {
    first_name: document.querySelector('[name="first_name"]').value,
    last_name: document.querySelector('[name="last_name"]').value,
    address: document.querySelector('[name="address"]').value,
    city: document.querySelector('[name="city"]').value,
    country: document.querySelector('[name="countries"]').value,
    email: document.querySelector('[name="email"]').value,
    password: document.querySelector('[name="password"]').value
  };

  // test email format https://ui.dev/validate-email-address-javascript/
  if (! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    showError("Invalid email format!");
    return;
  }

  if (userData.password.length < 8) {
      showError("Password must be at least 8 characters long!");
      return;
  }

  hideError();
  
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      let res = JSON.parse(xhttp.responseText);
      switch (this.status) {
        case 200:
          console.log(xhttp.responseText);
          if (xhttp.responseText) {
            console.log('user created');
            location.reload();
          }
          break;
        case 401:
          showError(res.message);
          break;
        case 409:
          showError(res.message);
          break;
        default:
          console.log('unknown error');
          showError("Unknown Error Occured. Server response not received. Try again later.");
      }
    }
  }

  xhttp.open("POST", api_server + "/register", true);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify(userData));
}

async function deleteUser(email) {
  let user = {
    "email": email
  }

  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
        if (this.responseText) {
          console.log('user deleted');
          location.reload();
        }
      } 
  }
  xhttp.open("PUT", api_server + "/delete", true);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify(user));
}
