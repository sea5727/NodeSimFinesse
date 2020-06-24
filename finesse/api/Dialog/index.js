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
    console.log(`[HTTP] ${req.method} ${req.originalUrl} : ${JSON.stringify(req.body)}`)

    fs.readFile(`.${req.originalUrl}`, (err, data)=> {
        if(err){
            return res.status(404).send('no exists dialog')
        }
        objDialog = JSON.parse(data)
        let xmlDialog = parser_j2x.parse(objDialog)
        console.log(`[XML] url: ${req.originalUrl} xml : ${xmlDialog}`)
        return res.status(202).contentType('Application/xml').send(xmlDialog)
    })
})

router.put('/:id', (req, res) => {
    console.log(`[HTTP] ${req.method} ${req.originalUrl} : ${JSON.stringify(req.body)}`)
    const dialog_id = req.params.id
    var path = req.originalUrl
    fs.readFile(`.${path}`, (err, data)=> {
        if(err){
            return res.status(404).send('no exists')
        }
        let objDialog = null
        let requestedAction = null
        let dialogs = null
        let Dialog = null
        let newDialog = null
        try{
            
            objDialog = JSON.parse(data)
            if(objDialog.Update.data['dialogs'] != null){
                dialogs = objDialog.Update.data.dialogs
                Dialog = objDialog.Update.data.dialogs.Dialog
            }
            else {
                dialogs = objDialog.Update.data
                Dialog = objDialog.Update.data.dialog
            }
                
            requestedAction = req.body.Dialog['requestedAction']
            if(requestedAction == 'UPDATE_CALL_DATA'){
                if(Dialog.state == 'DROPPED'){
                    throw 'invalid request'
                }
                delete req.body.Dialog['requestedAction']
                req.body.Dialog.state = 'ACTIVE'
    
            }
            else if(requestedAction == 'TRANSFER_SST'){
                delete req.body.Dialog['requestedAction']
            }            
            else if(requestedAction == 'DROP'){
                req.body = {
                    Dialog : {
                        state : 'DROPPED'
                    }
                }
            }
            newDialog = deepmerge(Dialog, req.body.Dialog)
            if(objDialog.Update.data['dialogs'] != null){
                Dialog = objDialog.Update.data.dialogs.Dialog = newDialog
            }
            else {
                objDialog.Update.data.dialog = newDialog
            }
            // objDialog.Update.data.dialogs.Dialog = newDialog
        }
        catch(err){
            console.log(err)
            return res.status(404).send('invalid request')
        }
        
        console.log(path)

        fs.writeFile(`.${path}`, JSON.stringify(objDialog, null, 4), (err) => {
            if(err){
                return res.status(500).send('update fail')
            }
            res.status(202).contentType('Application/xml').send()

            let Participant = Dialog.participants.Participant

            if(!Participant.hasOwnProperty('length')){
                console.log(Participant.mediaAddress) 
                var { xmpp_session, user_id } = FinesseMemory.get_xmpp_from_dn(Participant.mediaAddress)
                if(xmpp_session != null){
                    xmppMessgae = xmlFormat.GetXmppDialogEventFormat(user_id, objDialog)
                    xmpp_session.send(xmppMessgae)

                    if (requestedAction == 'DROP') {
                        const args = {
                            headers: { 'Content-Type': 'Application/xml' },
                            data: '<User><state>WORK_READY</state></User>'
        
                        }
                        client.put(`http://127.0.0.1:8083/finesse/api/User/${user_id}`, args, (data, response) => {
                            // console.log(data)
                            // console.log(response)
                        })
                    }
                }
            }

            for(let i = 0 ; i < Participant.length; i++){
                console.log(Participant[i].mediaAddress) 
                var { xmpp_session, user_id } = FinesseMemory.get_xmpp_from_dn(Participant[i].mediaAddress)
                if(xmpp_session != null){
                    xmppMessgae = xmlFormat.GetXmppDialogEventFormat(user_id, objDialog)
                    xmpp_session.send(xmppMessgae)

                    if (requestedAction == 'DROP') {
                        const args = {
                            headers: { 'Content-Type': 'Application/xml' },
                            data: '<User><state>WORK_READY</state></User>'
        
                        }
                        client.put(`http://127.0.0.1:8083/finesse/api/User/${user_id}`, args, (data, response) => {
                            // console.log(data)
                            // console.log(response)
                        })
                    }
                }
            }


        })
    })
})

//curl -X POST 192.168.0.192:8083/finesse/api/Dialog/156494658 -d "<Dialog><mediaProperties><DNIS>3004</DNIS></mediaProperties></Dialog>" -H "Content-Type: Application/xml" -v

//post 는 xmpp 메시지로 전달용.
router.post('/:id', (req, res) => {
    console.log(`[HTTP] ${req.method} ${req.originalUrl} : ${JSON.stringify(req.body)}`)
    agent = null
    if(req.query.agent){
        agent = req.query.agent
    }
    const dialog_id = req.params.id
    fs.readFile(`.${req.originalUrl}`, (err, data)=> {
        // if(!err){
        //     return res.status(400).send('already dialog exist')
        // }
        const objDialog = req.body
        let dialogs = null
        let Dialog = null
        if(objDialog.Update.data['dialogs'] != null){
            dialogs = objDialog.Update.data.dialogs
            Dialog = objDialog.Update.data.dialogs.Dialog
        }
        else {
            dialogs = objDialog.Update.data
            Dialog = objDialog.Update.data.dialog
        }


        fs.writeFile(`.${req.originalUrl}`, JSON.stringify(objDialog, null, 4),  (err) => {
            if(err) {
                return res.status(500).send('dialog update fail')
            }
            res.status(202).send('post dialog success')
            console.log(Dialog)
            console.log(dialogs)

            if(!agent){
                Participant = Dialog.participants.Participant

                if(!Participant.hasOwnProperty('length')){
                    console.log(Participant.mediaAddress)
                    var { xmpp_session, user_id } = FinesseMemory.get_xmpp_from_dn(Participant.mediaAddress)
                    if(xmpp_session != null){
                        const xmppMessage = xmlFormat.GetXmppDialogEventFormat(user_id, objDialog)
                        xmpp_session.send(xmppMessage)
                    }                    
                }

                for(let i = 0 ; i < Participant.length; i++){
                    console.log(Participant[i].mediaAddress)
                    var { xmpp_session, user_id } = FinesseMemory.get_xmpp_from_dn(Participant[i].mediaAddress)
                    if(xmpp_session != null){
                        const xmppMessage = xmlFormat.GetXmppDialogEventFormat(user_id, objDialog)
                        xmpp_session.send(xmppMessage)
                    }
                }
            }
            else {
                xmpp_session = FinesseMemory.get_xmpp(agent)
                if(xmpp_session != null){
                    const xmppMessage = xmlFormat.GetXmppDialogEventFormat(agent, objDialog)
                    xmpp_session.send(xmppMessage)
                }
            }

        })
    })
})

module.exports = router;