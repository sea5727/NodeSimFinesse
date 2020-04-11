const express = require('express');
const bodyParser = require('body-parser')
require('body-parser-xml')(bodyParser);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.xml({
    xmlParseOptions : {
        explicitArray : false,
    }
}));

app.get('/', (req, res) => {
    res.send('Hello World post!\n');
});


// app.use('/finesse/views/SystemInfo', require('./finesse/views/SystemInfo'))
// app.use('/finesse/views/User', require('./finesse/views/User'))
// app.use('/finesse/views/Dialog', require('./finesse/views/Dialog'))
// app.use('/finesse/views/Scenario', require('./finesse/views/Scenario'))

app.use('/finesse/api', require('./finesse/api'));

var listen = function (port) {
    app.listen(port, () => {
        console.log(`NodeSimFinesse listening on port ${port}!`)
    });
}

module.exports = listen