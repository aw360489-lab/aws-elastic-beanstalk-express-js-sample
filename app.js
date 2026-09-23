//const express = require('express');
//const app = express();
//const port = 8080;

//app.get('/', (req, res) => res.send('Hello World!'));

//app.listen(port);
//console.log(`App running on http://localhost:${port}`);

const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const port = process.env.PORT || 8080;

// Start the server only when app.js is executed directly.
// Exporting the app allows automated tests to import it
// without starting a real listening server.
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

module.exports = app;
