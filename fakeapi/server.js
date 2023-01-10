const express = require('express');
const axios = require('axios');
const app = express();
const HOST = 'localhost';
const PORT = 3001;

app.use(express.json());
app.get('/fakeapi', (req, res, next) => {
    res.send('Hello from the fake api server\n');
});
app.post('/bogusapi', (req, res, next) => {
    res.send('Bogus api says hello!\n');
});

app.listen(PORT, () => {
    axios({
        method: 'POST',
        url: 'http://localhost:3000/register',
        headers: {'Content-Type': 'application/json'},
        data: {
            'apiName': 'registrytest',
            'protocol': 'http',
            'host': HOST,
            'port': PORT
        }
    }).then((response) => {
        console.log(response.data);
    });
    console.log('Fake server started on port ' + PORT);
});