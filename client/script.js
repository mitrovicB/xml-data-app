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
          console.log(this.responseText)
        callback(this);
      }
    };
    xhttp.open("GET", "http://127.0.0.1:3000/users", true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send();
}

function getUsers(xml) {
    let i, txt, y, xmlDoc, data;
    xmlDoc = xml.response;
    console.log(xmlDoc);
}

loadXMLDoc(getUsers);
