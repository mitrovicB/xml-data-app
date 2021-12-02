    const fs = require('fs');
    parseString = require('xml2js').parseString;

module.exports = app => {
    // Create a User
    app.post("/register", (req, res) => {
        console.log(req.body);
        // Create User
        const newUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            address: req.body.address,
            city: req.body.city,
            country: req.body.country,
            email: req.body.email,
            password : req.body.password
        };
        console.log(newUser);
    })
  
    // Get all users
    app.get('/users', (req, res) => {
        let allUsers = [];
        fs.readFile('./data.xml', 'utf8', function(err, data) {
            parseString(data, function (err, result) {
            const json = JSON.stringify(result, null, 4);
            const el = JSON.parse(json);
            const continents = el.data.continent;
            console.log(continents);
            continents.forEach(continent => {
                console.log(continent.$.name);
                let countries = continent.country;

                countries.forEach(country => {
                    console.log("country name: "+ country.$.name);
                    users = country.user;

                    users.forEach(user => {
                        user.country = country.$.name;
                        console.log('First name ' + user.first_name + ' Last name ' + user.last_name +
                            ' Address ' + user.address + ' City ' + user.city + 'Country ' + user.country + ' Email ' + user.email +
                            ' Password ' + user.password);
                        console.log('\n');
                
                        allUsers.push(user);
                    });
                });
            });
            console.log(allUsers);
            res.send(allUsers);
            });
        });
    });

    // Delete selected user
    app.delete('/remove', (req, res) => {
        console.log('delete function');
    })
}