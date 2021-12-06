const fs = require('fs'),
    xml2js = require('xml2js'),
    parseString = xml2js.parseString;

const continentObj = {
    "Europe": ["United Kingdom", "Germany", "France"],
    "North America": ["United States", "Canada"],
    "East Asia": ["China", "Japan"]
};

function checkIfExists(arr, newdata) {
    if (arr.some(el => el.$.name === newdata)) {
        console.log("Object found inside the array:", newdata);
        return true;
    } else {
        console.log("Object not found.");
        return false;
    }
}

module.exports = app => {
    let allUsers;
    // Create a User
    app.post("/register", (req, res) => {
        // Create User
        const newUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            address: req.body.address,
            city: req.body.city,
            email: req.body.email,
            password : req.body.password
        };

        const newElements = {
            country: req.body.country
        }
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
                countryArr.forEach(el => {
                    if (newElements.country === el) {
                        userContinent = continent;
                        newElements["continent"] = userContinent;
                    }
                });
            }
        }

        console.log(newUser);
        console.log(newElements);

        fs.readFile('./data.xml', 'utf8', function(err, data) {
            parseString(data, (err, result) => {
                if (err) {
                    throw err;
                }

                let continents = result.data.continent;
                console.log("data continents:", continents);

                let checkContinent = checkIfExists(continents, userContinent);
                console.log(checkContinent);
                if (!checkContinent) {
                    console.log('create new continent');
                    continents.push({
                        '$': { name: userContinent },
                        country: [{
                            '$': { name: newElements.country },
                            user: [newUser]
                        }]
                    });
                } else {
                    continents.forEach(continent => {
                        let country = continent.country;
                        console.log('country:', country);
                        let countryCheck = checkIfExists(country, newElements.country);
                        console.log(countryCheck);
                        if (!countryCheck) {
                            console.log(' create new country ');
                            country.push({
                                '$': { name: newElements.country },
                                user: [newUser]
                            });
                        }
                    });
                }

                // print JSON object
                console.log(JSON.stringify(result, null, 4));
                    
                // convert JSON object to XML
                const builder = new xml2js.Builder();
                const xml = builder.buildObject(result);
                console.log(xml);

                // write updated XML string to a file
               fs.writeFile('./data.xml', xml, (err) => {
                    if (err) {
                        throw err;
                    }
                console.log(`Updated XML is written to a new file.`)
                }); 
            });
        });
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