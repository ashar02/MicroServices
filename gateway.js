const express = require('express');
const helmet = require('helmet');
const app = express();
const routes = require('./routes');

const PORT = 3000; //gateway port

app.use(express.json());
app.use(helmet()); //http security patches
app.use('/', routes); //routes logic

app.listen(PORT, () => {
    console.log('Gateway has started on port ' + PORT);
});