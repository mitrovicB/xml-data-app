const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());

app.use(cors());
app.options('*', cors());

app.use(express.urlencoded({ extended: false}));

app.get('/', (req, res) => {
    res.send("Welcome to your server");
});

require("./routes/routes.js")(app);

// Start your server on a specified port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})