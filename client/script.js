const registerBtn = document.getElementById("register");
registerBtn.addEventListener('click', () => {
    console.log('save user');
    }
);

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
    data.forEach(user => {
    let table = document.querySelector("table");
    table.innerHTML += `
    <tr>
      <td>${user.first_name[0]}</td>
      <td>${user.address[0]}</td>
      <td>${user.city[0]}</td>
      <td>${user.country}</td>
      <td>${user.email[0]}</td>
      <td>delete</td>
    </tr>
    `
    });
}


loadXMLDoc(getUsers);
