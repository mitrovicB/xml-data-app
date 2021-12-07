const { count } = require('console');
const { userInfo } = require('os');

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
            email: req.body.email,
            password : req.body.password
        };

        // Make sure all fields are filled
        for (let [key, value] of Object. entries(newUser)) {
            if(value === '') {
                res.status(400).send({
                    message: "Content can not be empty!"
                });
                return;
            }
        } 

        const newElements = {
            country: req.body.country,
        }
        let userContinent;
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
        console.log(newUser);

        fs.readFile('./data.xml', 'utf8', function(err, data) {
            parseString(data, (err, result) => {
                if (err) {
                    throw err;
                }

                let continents = result.data.continent;
                console.log("data continents:", continents);

                let continent = continents.find(continent => continent.$.name === userContinent);
                console.log(continent);

                if (continent === undefined) {
                    continents.push({
                        '$':    { name: userContinent },
                        country: [{
                            '$': { name: newElements.country },
                            user: [newUser]
                        }]
                    });
                } else {
                    let countries = continent.country;
                    console.log('countries: ' + countries);
                    
                    let countryFound = countries.find(country => country.$.name === newElements.country);
                    console.log('country found: ' + countryFound);

                    if (countryFound == undefined) {
                        countries.push({
                            '$': { name: newElements.country },
                            user: [newUser]
                        });

                    } else if ( countryFound.$.name == newElements.country) {
                        console.log('add only user');
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
                fs.writeFile('./data.xml', xml, (err) => {
                    if (err) {
                        throw err;
                    }
                console.log(`Updated XML is written to a new file.`);
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
        // `for...of` loop
    for (const [key, value] of Object.entries(animals)) {
        console.log(`${key}: ${value}`);
    }
    })
}