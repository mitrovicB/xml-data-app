const registerBtn = document.getElementById("register");
registerBtn.addEventListener('click', () => {
  saveUserInfo();
  }
);

loadXMLDoc(getUsers, "GET", "users");

function deleteUser(user) {
  let userId = user.parentNode.id
  console.log('delete user:', userId);
  console.log(JSON.stringify(userId));
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
  xhttp.send(JSON.stringify(user));
}

function loadXMLDoc(callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    console.log(this.readyState,this.status);
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
        callback(this);
      }
  };
  xhttp.open("GET", "http://127.0.0.1:3000/users", true);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send();
}

function getUsers(xml) {
  let i, data;
  data = JSON.parse(xml.responseText);
  console.log(data);
  let numberId = 1;
  data.forEach(user => {
  let table = document.querySelector("tbody");
  let userId = 'user' + numberId++;
  table.innerHTML += `
    <tr id=${userId}>
      <td>${user.first_name[0]}</td>
      <td>${user.address[0]}</td>
      <td>${user.city[0]}</td>
      <td>${user.country}</td>
      <td>${user.email[0]}</td>
      <td><button type="submit" id="delete-btn" onclick='deleteUser(this.parentNode)'>delete</button></td>
    </tr>
    `
  console.log(userId);
  });
}