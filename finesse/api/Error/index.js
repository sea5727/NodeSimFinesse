const fs = require('fs')
const parser_j2x = require('../../../utils/parser-j2x')
const dateFormat = require('dateformat')
const parser_xj2 = require('../../../utils/parser-x2j')
const builder = require('xmlbuilder')
const express = require('express')
const FinesseMemory = require('../../../memory');
const router = express.Router()
const xmlFormat = require('../../../utils/xmlFormat')
const deepmerge = require('deepmerge')
var Client = require('node-rest-client').Client;
var client = new Client()



//curl -X GET 192.168.0.30:3000/finesse/api/Dialog/156494657
router.get('/:id', (req, res) => {

})

router.put('/:id', (req, res) => {

})

//curl -X POST 192.168.0.192:8083/finesse/api/Dialog/156494658 -d "<Dialog><mediaProperties><DNIS>3004</DNIS></mediaProperties></Dialog>" -H "Content-Type: Application/xml" -v

//post 는 xmpp 메시지로 전달용.
router.post('/:id', (req, res) => {

    try{
        console.log('Error Post!!')
        console.log(req.body)
        var dn = req.body['Update']['data']['apiErrors']['apiError']['errorData']
       
        var { xmpp_session, user_id } = FinesseMemory.get_xmpp_from_dn(dn)

        xmppMessage = xmlFormat.GetXmppDialogEventFormat(user_id, req.body)
        if(xmpp_session != null){
            const update_xml = builder.create(req.body, {headless: true}).end({ pretty: true });
            console.log(update_xml)
            // xmppMessgae = xmlFormat.GetXmppDialogEventFormat(user_id, objDialog)
            xmpp_session.send(xmppMessage)
            res.send(200)
        }
    }
    catch(err){
        res.send(404)
    }

 
})

module.exports = router;