const express = require('express');
const axios = require('axios');
const app = express();
const HOST = 'localhost';
const PORT = 3002;

app.use(express.json());
app.get('/test1', (req, res, next) => {
    res.send('Hello from test1\n');
});
app.post('/test2', (req, res, next) => {
    res.send('Hello from test2\n');
});

app.listen(PORT, () => {
    //register on start
    axios({
        method: 'POST',
        url: 'http://localhost:3000/register',
        headers: {'Content-Type': 'application/json'},
        data: {
            'apiName': 'testapi',
            'protocol': 'http',
            'host': HOST,
            'port': PORT
        }
    }).then((response) => {
        console.log(response.data);
    });
    console.log('Fake server started on port ' + PORT);
});
