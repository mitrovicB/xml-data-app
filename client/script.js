const registerBtn = document.getElementById("register");
registerBtn.addEventListener('click', () => {
  saveUserInfo();
  }
);

// loadXMLDoc(getUsers, "GET", "users");

function deleteUser() {
  console.log('delete user');
}
function showError(msg) {
  //let errorDiv = document.getElementById('error');
  console.log(msg);
}

function saveUserInfo() {
  let user = {
    first_name: document.querySelector('[name="first_name"]').value,
    last_name: document.querySelector('[name="last_name"]').value,
    address: document.querySelector('[name="address"]').value,
    city: document.querySelector('[name="city"]').value,
    country: document.querySelector('[name="countries"]').value,
    email: document.querySelector('[name="email"]').value,
    password: document.querySelector('[name="password"]').value
  };

  console.log(user);

  // test email format https://ui.dev/validate-email-address-javascript/
  if (! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    showError("Invalid email format!");
    return;
  }
  if (user.password.length < 8) {
      showError("Password must be at least 8 characters long!");
      return;
  }

  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          console.log(xhttp.responseText);
      } else if (this.status == 400) {
        return showError('You must fill all fields!');
      }
  };

  xhttp.open("POST", "http://127.0.0.1:3000/register", true);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify(user));
}

function loadXMLDoc(callback, method, route, newObj) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    console.log(this.readyState,this.status);
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
        callback(this);
      }
    };
    xhttp.open(method, "http://127.0.0.1:3000/" + route, true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(newObj);
}

function getUsers(xml) {
    let i, data;
    data = JSON.parse(xml.responseText);
    console.log(data);
    data.forEach(user => {
    let table = document.querySelector("table");
    table.innerHTML += `
    <tr>
      <td>${user.first_name[0]}</td>
      <td>${user.address[0]}</td>
      <td>${user.city[0]}</td>
      <td>${user.country}</td>
      <td>${user.email[0]}</td>
      <td><button class="delete-btn" onclick="deleteUser()">delete</button></td>
    </tr>
    `
    });
  }


