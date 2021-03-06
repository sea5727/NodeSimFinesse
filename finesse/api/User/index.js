const fs = require('fs')
const parser_j2x = require('../../../utils/parser-j2x')
const xmlFormat = require('../../../utils/xmlFormat')
const express = require('express')
const FinesseMemory = require('../../../memory');
// const asyncFile = require('../../../file/asyncFile')
const deepmerge = require('deepmerge')
const router = express.Router()


//curl -X GET 192.168.0.207:3000/finesse/api/User/840000009
router.get('/:id', (req, res) => {
    console.log(`[HTTP] ${req.method} ${req.originalUrl} : ${JSON.stringify(req.body)}`)
    fs.readFile(`.${req.originalUrl}`, (err, data) => {
        if(err){
            return res.status(404).send('unknown user')
        }

        userData = JSON.parse(data)
        let dataXml = parser_j2x.parse(userData)
        console.log(`[XML] url: ${req.originalUrl} xml : ${dataXml}`)
        return res.status(202).contentType('Application/xml').send(dataXml)
    })
})

//curl -X PUT 192.168.0.207:3000/finesse/api/User/840000009 -d "<User><extension>3000</extension><state>NOT_READY</state></User>" -H "Content-Type: Application/xml" -v
//curl -X PUT 192.168.0.207:3000/finesse/api/User/840000009 -d "<User><extension>3003</extension><state>LOGIN</state></User>" -H "Content-Type: Application/xml" -v
//curl -X PUT 192.168.0.192:8083/finesse/api/User/770440040 -d "<User><extension>3004</extension><state>RESERVED</state></User>" -H "Content-Type: Application/xml" -v
router.put('/:id', (req, res) => {
    console.log(`[HTTP] ${req.method} ${req.originalUrl} : ${JSON.stringify(req.body)}`)

    const userId = req.params.id

    fs.readFile(`.${req.originalUrl}`, (err, data) => {
        if(err) {
            return res.status(404).send('unknown user')
        }
        try{
            userData = JSON.parse(data)
            if(req.body.User.state == 'LOGIN'){ // if login request
                req.body.User.state = 'NOT_READY'
                // return res.status(400).send('already logined user')//todo 실패 d응답
            }
            newUserData = deepmerge(userData, req.body)
            FinesseMemory.set_user(userId, newUserData.User)
        }
        catch(err){
            return res.status(400).send('invalid data')//todo 실패 d응답
        }


        fs.writeFile(`.${req.originalUrl}`, JSON.stringify(newUserData, null, 4), (err) => {
            if(err)
                return res.status(500).send('update fail')
            res.status(202).contentType('Application/xml').send()

            const xmppSession = FinesseMemory.get_xmpp(userId)
            if(xmppSession != null) { 
                const xmppUserEvent = xmlFormat.GetXmppUserEventFormat(userId, newUserData)
                xmppSession.send(xmppUserEvent)
            }
            return
        })
    })
})



module.exports = router;