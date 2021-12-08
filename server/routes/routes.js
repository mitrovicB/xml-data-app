const fs = require('fs'),
    xml2js = require('xml2js'),
    parseString = xml2js.parseString;

const continentObj = {
    "Europe": ["United Kingdom", "Germany", "France"],
    "North America": ["United States", "Canada"],
    "East Asia": ["China", "Japan"]
};

function writeFile(xml) {
    fs.writeFile('./data.xml', xml, (err) => {
        if (err) throw err
    console.log(`Updated XML is written to a new file.`);
    }); 
}

module.exports = app => {
    // Get all users
    app.get('/users', (req, res) => {
        let allUsers = [];
        fs.readFile('./data.xml', 'utf8', function(err, data) {
            if (err) {
                throw err;
            }
            parseString(data, function (err, result) {
                console.log(result)
                const json = JSON.stringify(result, null, 4);
                const el = JSON.parse(json);

                const continents = el.data.continent;
                console.log(continents);

                continents.forEach(continent => {
                    console.log(continent.$.name);
                    let countries = continent.country;
                    // Loop through countries
                    countries.forEach(country => {
                        console.log("country name: "+ country.$.name);
                        users = country.user;
                        // Loop through users
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
                res.send(allUsers);
            });
        });
    });

    app.post("/register", (req, res) => {
        // Create New User
        const newUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            address: req.body.address,
            city: req.body.city,
            email: req.body.email,
            password : req.body.password
        };
        console.log(newUser);

        // Country property we get from form &&  continent check loop
        const newElements = {
            country: req.body.country,
        }

         // Make sure all fields are filled
         for (let [key, value] of Object. entries(newUser)) {
            if(value === '') {
                res.status(400).send({
                    message: "Content can not be empty!"
                });
                return;
            }
        } 

        let userContinent;
        // Check continent
        for(continent in continentObj) {
            if(continentObj.hasOwnProperty(continent)) {
                let countryArr = continentObj[continent];
                countryArr.forEach(el => {
                    if (newElements.country === el) {
                        userContinent = continent;
                        newElements['continent'] = continent;
                    }
                });
            }
        }

        fs.readFile('./data.xml', 'utf8', function(err, data) {
            parseString(data, (err, result) => {
                if (err) {
                    throw err;
                }

                let continents = result.data.continent;
                console.log("continents:", continents);

                let continent = continents.find(continent => continent.$.name === userContinent);
                console.log(continent);
             
                if (continent === undefined) {
                    // add continent & country & user
                    continents.push({
                        '$':    { name: userContinent },
                        country: [{
                            '$':    { name: newElements.country },
                            user: [newUser]
                        }]
                    });
                } else {
                    let countries = continent.country;
                    console.log(countries);
                    
                    let countryFound = countries.find(country => country.$.name === newElements.country);
                    console.log('country found: ' + countryFound);
    
                    if (countryFound == undefined) {
                        // add country and user
                        countries.push({
                            '$': { name: newElements.country },
                            user: [newUser]
                        });
                    } else if (countryFound.$.name == newElements.country) {
                        // only add user
                        userArr = countryFound.user;
                        userArr.push(newUser);
                    }
                }

                // print JSON object
                console.log(JSON.stringify(result, null, 4));
                // convert JSON object to XML
                const builder = new xml2js.Builder();
                const xml = builder.buildObject(result);
                console.log(xml);
                // write updated XML string to a file
                writeFile(xml);
            });
        });
    });

    // Delete selected user
    app.put('/delete', (req, res) => {
        let userObject = {
            email: req.body.email
        };

        function checkIndexOf(arr, element) {
            let index = arr.indexOf(element);
            if (index != -1) {
                arr.splice(index, 1);
                console.log(arr);
            }
        }

        fs.readFile('./data.xml', 'utf-8', function (err, data) {
            parseString(data, (err, result) => {
                if (err) throw err 
               
                const continents = result.data.continent;
                console.log(continents);

                continents.forEach(continent => {
                    let countries = continent.country;
                    countries.map(country => {
                        let users = country.user;
                        for (i = 0; i < users.length; i++) {
                            if (users[i].email == userObject.email) {
                                itemIndex = i;
                                if (itemIndex != -1) {
                                    users.splice(itemIndex, 1);
                                    console.log('users:', users);
                                }
                            }
                        }
                        if(users == "") {
                            console.log('undefined');
                            delete country.$;
                            delete country.user;
                            let index = countries.indexOf(country)
                            if (index != -1) {
                                countries.splice(index, 1);
                                console.log('countries:', countries);
                            }
                        }
                    });

                    if (countries == "") {
                        checkIndexOf(continents, continent);
                    }
                });

            
                // print JSON object
                console.log(JSON.stringify(result, null, 4));
                    
                // convert JSON object to XML
                const builder = new xml2js.Builder();
                const xml = builder.buildObject(result);
                console.log(xml);
                writeFile(xml);
            });
        });
    });
}