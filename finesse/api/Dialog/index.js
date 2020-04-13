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
    fs.readFile(`.${req.originalUrl}`, (err, data)=> {
        if(err){
            return res.status(404).send('no exists')
        }


        let requestedAction = null
        try{
            let objDialog = JSON.parse(data)

            requestedAction = req.body.Dialog['requestedAction']
            if(requestedAction == 'UPDATE_CALL_DATA'){
                if(objDialog.Dialog.state == 'DROPPED'){
                    throw 'invalid request'
                }
                delete req.body.Dialog['requestedAction'];
                req.body.Dialog['state'] = 'ACTIVE'
    
            }
            else if(requestedAction == 'DROP'){
                req.body = {
                    Dialog : {
                        state : 'DROPPED'
                    }
                }
            }
            
            newobjDialog = deepmerge(objDialog, req.body)
        }
        catch(err){
            return res.status(404).send('invalid request')
        }
        
        fs.writeFile(`.${req.originalUrl}`, JSON.stringify(newobjDialog, null, 4), (err) => {
            if(err){
                return res.status(500).send('update fail')
            }
            res.status(202).contentType('Application/xml').send()

            user_id = FinesseMemory.get_user_id_from_dialog(dialog_id)

            const xmppMessage = xmlFormat.GetXmppDialogEventFormat(user_id, newobjDialog)
            FinesseMemory.get_xmpp(user_id).send(xmppMessage)

            if(requestedAction == 'DROP'){
                const args = {
                    headers : {'Content-Type' : 'Application/xml'}, 
                    data : '<User><state>WORK_READY</state></User>'
                    
                }
                client.put(`http://127.0.0.1:8083/finesse/api/User/${user_id}`, args, (data, response) => {
                    // console.log(data)
                    // console.log(response)
                })                
            }


        })


    })

    // if(req.body.Dialog.requestedAction == 'TEST'){
    //     let state = req.body.Dialog.state
    //     let userId = req.body.Dialog.userId
    //     var { err, data } = await asyncFile.select(`./finesse/api/Dialog/${state}`)

    //     const xmppSession = FinesseMemory.get_xmpp(userId)
    //     if(xmppSession == null){
    //         return res.status(500).send({ message: 'no xmpp user' })
    //     }
    //     let objData = parser_xj2.parse(data)
    //     console.log(objData)
    //     const xmppDialogEvent = xmlFormat.XmppDialogEventFormatUsingString(userId, objData) // send xmpp dialog event
        
    //     xmppSession.send(xmppDialogEvent)
    // }
    // else if(req.body.Dialog.requestedAction == 'ALERTING'){
    //     let anyUser = FinesseMemory.get_any_user()
    //     if(anyUser === undefined){
    //         return res.status(500).send({ message: 'no ready user' })
    //     }

    //     const userId = anyUser.Fsm.state.context.User.loginId
    //     let result = anyUser.Fsm.send('RESERVED')
    //     if(!result.changed){
    //         return res.status(500).send({ message: 'no reserved user' })
    //     }

    //     // update user data
    //     var { err } = await asyncFile.update(`.${result.context.User.uri}.json`, JSON.stringify(result.context, null, 4))
    //     if(err){
    //         return res.status(500).send({ message: 'update reserved user fail' })
    //     }        const xmppSession = FinesseMemory.get_xmpp(userId)
    //     if(xmppSession == null){
    //         return res.status(500).send({ message: 'no xmpp user' })
    //     }



    //     const xmppUserEvent = xmlFormat.XmppUserEventFormatUsingObject(result.context.User.loginId, result.context) // send xmpp user event 
    //     xmppSession.send(xmppUserEvent)

    //     let objDialog = JSON.parse(data)
    //     objDialog.Dialog.state = 'ALERTING'

    //     var { err } = await asyncFile.update(`.${req.originalUrl}.json`, JSON.stringify(objDialog, null, 4))
    //     if (err) {
    //         return res.status(500).send({ message: 'update fail' })
    //     }
    
    //     const xmppDialogEvent = xmlFormat.XmppDialogEventFormatUsingObject(result.context.User.loginId, objDialog) // send xmpp dialog event
    //     xmppSession.send(xmppDialogEvent)
    // }

    // return res.status(202).contentType('Application/xml').send()
    
})

//curl -X POST 192.168.0.192:8083/finesse/api/Dialog/156494658 -d "<Dialog><mediaProperties><DNIS>3004</DNIS></mediaProperties></Dialog>" -H "Content-Type: Application/xml" -v
router.post('/:id', (req, res) => {
    console.log(`[HTTP] ${req.method} ${req.originalUrl} : ${JSON.stringify(req.body)}`)
    const dialog_id = req.params.id
    fs.readFile(`.${req.originalUrl}`, (err, data)=> {
        // if(!err){
        //     return res.status(400).send('already dialog exist')
        // }
        Dialog = {Dialog : { id : `${dialog_id}`, state: 'ALERTING'} }
        Dialog = deepmerge(Dialog, req.body)
        newObjDialog = xmlFormat.MakeDialog(Dialog)
        fs.writeFile(`.${req.originalUrl}`, JSON.stringify(newObjDialog, null, 4),  (err) => {
            if(err) {
                return res.status(500).send('dialog update fail')
            }
            res.status(202).send('post dialog success')
            let { user_id, dn } = FinesseMemory.search_reserved_client()
            if(user_id != null){
                FinesseMemory.set_dialog_for_user_id(dialog_id, user_id, dn)
                xmppMessgae = xmlFormat.GetXmppDialogEventFormat(user_id, newObjDialog)
                FinesseMemory.get_xmpp(user_id).send(xmppMessgae)
            }
        })
    })
})

module.exports = router;