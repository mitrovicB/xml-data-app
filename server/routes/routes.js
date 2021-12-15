const fs = require('fs'),
    xml2js = require('xml2js'),
    parseString = xml2js.parseString;

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
                console.log(result);
                if (result.data == '') {
                    console.log('content is empty')
                    res.send({
                        message: "The tavle is empty"
                    });
                    return;
                }
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

        let userData = {
            newCountry: req.body.country,
        }

        // Make sure all fields are filled
        for (let [key, value] of Object. entries(newUser)) {
            if(value === '') {
                res.status(401).send({
                    message: "Please, fill all fields."
                });
                return;
            }
        }

        const continentObj = {
            "Europe": ["United Kingdom", "Germany", "France"],
            "North America": ["United States", "Canada"],
            "East Asia": ["China", "Japan"]
        };

        let continentCheck;
        let userAdded = false;
        // Check continent
        for(continent in continentObj) {
            if(continentObj.hasOwnProperty(continent)) {
                let countryArr = continentObj[continent];
                countryArr.forEach(el => {
                    if (userData.newCountry === el) {
                        continentCheck = continent;
                        userData['continent'] = continent;
                    }
                });
            }
        }

        function checkIfExists(arr, elName) {
            if (arr.some(el => el.$.name === elName)) {
                return true;
            } else {
                return false;
            }
        }

        function findContinent(newCountry) {
            let count = 0;
            let continentCount = 0;
            for (const [key, value] of Object.entries(continentObj)) {
                for (var i = 0; i < value.length; i++) {
                    if (value[i] == newCountry) {
                        continentCount = count;
                        break;
                    }
                }
        
                if (continentCount > 0) {
                    break;
                }
                count++;
            }
            return continentCount;
        }
        
        
        function userExists(continents, newUser) {
            for (num in continents) {
                let countries = continents[num].country;
        
                for (num1 in countries) {
                    let users = countries[num1].user;
        
                    for (num2 in users) {
                        if (users[num2].email == newUser) {
                            console.log('User exist');
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        fs.readFile('./data.xml', 'utf8', function(err, data) {
            parseString(data, (err, result) => {
                if (err) {
                    throw err;
                }
                if (result.data == '') {
                    console.log('create new continent');
                    return;
                }

                let continents = result.data.continent;
                console.log("continents:", continents);

                let userContinent, userCountry, continentNumber = 0, countryNumber = 0;
                let userExist = false;

                let continentExists = checkIfExists(continents, continentCheck);

                userExist = userExists(continents, newUser.email);

                if (userExist) {
                    res.status(409).send({
                        message: "User with this email address already exists."
                    });
                } else {
                    if (!continentExists && !userExist) {
                        continents.push({
                            '$':    { name: continentCheck },
                            country: [{
                                '$':    { name: userData.newCountry },
                                user: [newUser]
                            }]
                        });
                        userAdded = true;
                    }

                    let count = 0;

                    for (num in continents) {
                        console.log(continents[num].$.name, ':');
                        let countries = continents[num].country;
                        let countryExist = checkIfExists(countries, userData.newCountry);
                        console.log(countryExist);
    
                        if (countryExist) {
                            count++;
                            continentNumber = num;
                            let conCount = 0;
                            countries.forEach(country => {
                                conCount++;
                                console.log(country.$.name);
    
                                if (country.$.name == userData.newCountry) {
                                    userContinent = continents[num].$.name;
                                    userCountry = country.$.name;
                                    countryNumber = conCount - 1;
                                }
                            });
                        }
                        if (num == continents.length - 1 && count == 0 && !userExist) {
                            let continentNum = findContinent(userData.newCountry);
                            continents[continentNum].country.push({
                                '$': { name: userData.newCountry },
                                user: [newUser]
                            });
                            userAdded = true;
                            break;
                        }
                    }
                }

                console.log('Continent', userContinent + ' country ' + userCountry + ' exists ' + userExist);
                if (!userExist && !userAdded) {
                    console.log('user does not exist');
                    console.log(continents);
                    console.log(continentNumber + ' ' + countryNumber);
                    let userAdd = continents[continentNumber].country[countryNumber].user;
                    userAdd.push(newUser);
                }
                 // print JSON object
                 // console.log(JSON.stringify(result, null, 4));
                    
                 // convert JSON object to XML
                 const builder = new xml2js.Builder();
                 const xml = builder.buildObject(result);
                 console.log(xml);
                 writeFile(xml);
                 res.send(result);
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
                if (err) throw err;
               
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
                    
                // convert JSON object to XML
                const builder = new xml2js.Builder();
                const xml = builder.buildObject(result);
                console.log(xml);
                writeFile(xml);
                res.send(result);
            });
        });
    });
}