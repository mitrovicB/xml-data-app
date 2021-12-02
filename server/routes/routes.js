//parser = require('xml2json'),
    const fs = require('fs');
        xml2js = require('xml2js');


module.exports = app => {
   /* function getXml() {
        fs.readFile('./data.xml', function(err, data) {
        if (err) console.log(err);
        const json = JSON.parse(parser.toJson(data, {reversible: true}));
        console.log("json:", json.data);
        return json;
        });
    }   */

    // Create a User
    app.post("/register", (req, res) => {
        console.log('signup function')
    })
  
    // Get all users
    app.get('/users', (req, res) => {
        let allusers;
        var parser = new xml2js.Parser();
        fs.readFile('./data.xml', function(err, data) {
            parser.parseString(data, function (err, result) {
            console.dir(result['data']['continent'][0])
            /** U ovom dijelu sam zaglavila, 
             * trebam izvuci sve korisnike  */
            allusers = result['data']['continent'];
          
            });
            res.send(allusers);
        });
    });

    // Delete selected user
    app.delete('/remove', (req, res) => {
        console.log('delete function');
    })
}
