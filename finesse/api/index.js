const fs = require('fs')
const parser_j2x = require('../../utils/parser-j2x')
const express = require('express')
const router = express.Router();

router.use('/User', require('./User'))
router.use('/Dialog', require('./Dialog'))
// router.use('/Scenario', require('./Scenario'))

router.get('/SystemInfo', (req, res) => {
    console.log(`[HTTP] ${req.originalUrl}`)
    fs.readFile(`.${req.originalUrl}`, (err, data) => {
        if(err) {
            console.log(`[ERR] url: ${req.originalUrl} err : ${err.message}`)
            return res.send(404)
        } 
        let objRes = parser_j2x.parse(JSON.parse(data.toString())) 
        console.log(objRes)
        return res.status(202).contentType('Application/xml').send(objRes);
    })

});

module.exports = router;