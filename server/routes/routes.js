const fs = require('fs'),
    xml2js = require('xml2js'),
    parseString = xml2js.parseString;

const continentObj = {
    "Europe": ["United Kingdom", "Germany", "France"],
    "North America": ["United States", "Canada"],
    "East Asia": ["China", "Japan"]
};

module.exports = app => {
    // Create a User
    app.post("/register", (req, res) => {
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
          /* for (let [key, value] of Object. entries(user)) {
                if(value === '') {
                    res.status(400).send({
                        message: "Content can not be empty!"
                    });
                    return;
                }
            } */

        let userContinent;
        for(continent in continentObj) {
            if(continentObj.hasOwnProperty(continent)) {
                let countryArr = continentObj[continent];
                console.log("continent: ", continent + "country array: ", countryArr)
                countryArr.forEach(el => {
                    if (newUser.country === el) {
                        userContinent = continent;
                        console.log("user continent:", userContinent);
                    }
                });
            }
        }
        fs.readFile('./data.xml', 'utf8', function(err, data) {
            parseString(data, function (err, result) {
            const json = JSON.stringify(result, null, 4);
            const el = JSON.parse(json);
            const continents = el.data.continent;
            console.log(continents);
            continents.forEach(continent => {
                console.log("continent name: ", continent.$.name);
                let countries = continent.country;
                countries.forEach(country => {
                    console.log("country name: " + country.$.name);
                    users = country.user;
                    users.forEach(user => {
                        console.log(user.email);
                        console.log(newUser.email)
                        if (newUser.email == user.email) {
                            return res.status(409).json({
                                message: err || "This email address is already in use." })
                        } else {
                            if (newUser.country === country.$.name) {
                                console.log("new user goes here:", country.$.name);
                                country.user.push(newUser);
                                console.log(country);
                            } else {
                                console.log("make new continent");
                                console.log(continent.$.name);
                                return;
                            }
                        }
                    });
                });
            });
        });
        });
      // write File
    });

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
                /////////////////////////////////
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