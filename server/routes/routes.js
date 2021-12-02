//parser = require('xml2json'),
    const fs = require('fs');
        xml2js = require('xml2js');


module.exports = app => {
    // Create a User
    app.post("/register", (req, res) => {
        console.log('signup function')
    })
  
    // Get all users
    app.get('/users', (req, res) => {
        let users;
        let parser = new xml2js.Parser();
        fs.readFile('./data.xml', function(err, data) {
            parser.parseString(data, function (err, result) {
            console.dir(result['data']['continent'][0])
            /** U ovom dijelu sam zaglavila, 
             * trebam izvuci sve korisnike  */
                continents = result['data']['continent'];
                users = continents[0];
            });
            res.send(users);
        });
    });

    // Delete selected user
    app.delete('/remove', (req, res) => {
        console.log('delete function');
    })
}
