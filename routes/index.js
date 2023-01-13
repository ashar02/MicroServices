const express = require('express');
const router = express.Router();
const axios = require('axios');
const registry = require('./registry.json');
const fs = require('fs');

//decision on services to rout
router.all('/:apiName/:path', (req, res) => {
    console.log(req.params.apiName + ' ' + req.params.path + '\n');
    if(registry.services[req.params.apiName]) {
        axios({
            method: req.method,
            url: registry.services[req.params.apiName][0].url + req.params.path,
            headers: req.headers,
            data: req.body
        }).then((response) => {
            res.send(response.data);
        }).catch((error) => {
            res.send(error + '\n');
        });
    } else {
        res.send("API name doesn't exist\n");
    }
});

//register a service and save on disk
router.post('/register', (req, res) => {
    const registrationInfo = req.body;
    registrationInfo.url = registrationInfo.protocol + '://' + registrationInfo.host + ':' + registrationInfo.port + '/';
    if(apiAlreadyExists(registrationInfo)) {
        res.send('Configuration already exists for ' + registrationInfo.apiName + ' at ' + registrationInfo.url + '\n');
    } else {
        if(!registry.services[registrationInfo.apiName]) {
            registry.services[registrationInfo.apiName] = [];
        }
        registry.services[registrationInfo.apiName].push({...registrationInfo});
        fs.writeFile('./routes/registry.json', JSON.stringify(registry), (error) => {
            if(error) {
                res.send('Could not register ' + registrationInfo.apiName + '\n' + error + '\n');
            } else {
                res.send('Successfully registered ' + registrationInfo.apiName + '\n');
            }
        });
    }
});

//unregister a service and save on disk
router.post('/unregister', (req, res) => {
    const registrationInfo = req.body;
    registrationInfo.url = registrationInfo.protocol + '://' + registrationInfo.host + ':' + registrationInfo.port + '/';
    if(apiAlreadyExists(registrationInfo)) {
        const index = registry.services[registrationInfo.apiName].findIndex((instance) => {
            return registrationInfo.url === instance.url;
        });
        registry.services[registrationInfo.apiName].splice(index, 1);
        fs.writeFile('./routes/registry.json', JSON.stringify(registry), (error) => {
            if(error) {
                res.send('Could not unregister ' + registrationInfo.apiName + '\n' + error + '\n');
            } else {
                res.send('Successfully unregistered ' + registrationInfo.apiName + '\n');
            }
        });
    } else {
        res.send('Configuration does not exist for ' + registrationInfo.apiName + ' at ' + registrationInfo.url + '\n');
    }
});

//To check whether service exists in list
const apiAlreadyExists = (registrationInfo) => {
    let exists = false;
    if(registry.services[registrationInfo.apiName]) {
        registry.services[registrationInfo.apiName].forEach(instance => {
            if(instance.url === registrationInfo.url) {
                exists = true;
                return;
            }
        });
    }
    return exists;
};

module.exports = router;