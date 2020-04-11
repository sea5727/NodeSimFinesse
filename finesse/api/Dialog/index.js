const fs = require('fs')
const parser_j2x = require('../../../utils/parser-j2x')
const dateFormat = require('dateformat')
const parser_xj2 = require('../../../utils/parser-x2j')
const builder = require('xmlbuilder')
const express = require('express')
const FinesseMemory = require('../../../memory');
const router = express.Router()
const xmlFormat = require('../../../utils/xmlFormat')

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

    fs.readFile(`.${req.originalUrl}`, (err, data)=> {
        if(err){
            return res.status(404).send('no exists')
        }

        try{
            objDialog = JSON.parse(data)
            objDialog = deepmerge(objDialog, req.body)
        }
        catch(err){
            return res.status(400).send('invalid request')
        }
        
        fs.writeFile(`.${req.originalUrl}`, JSON.stringify(objDialog, null, 4), (err) => {
            if(err){
                return res.status(500).send('update fail')
            }
            let xmlDialog = parser_j2x.parse(objDialog)
            console.log(`[XML] url: ${req.originalUrl} xml : ${xmlDialog}`)
            res.status(202).contentType('Application/xml').send()

            const xmppSession = FinesseMemory.get_xmpp(userId)
            if(xmppSession != null) { 
                const xmppUserEvent = xmlFormat.GetXmppUserEventFormat(userId, userData)
                xmppSession.send(xmppUserEvent)
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

//curl -X PUT 192.168.0.207:3000/finesse/api/Dialog/156494657 -d "<Dialog><extension>3000</extension><state>NOT_READY</state></User>" -H "Content-Type: Application/xml" -v
router.post('/:id', (req, res) => {
    console.log(`[HTTP] ${req.method} ${req.originalUrl} : ${JSON.stringify(req.body)}`)
    const dialog_id = req.params.id
    fs.readFile(`.${req.originalUrl}`, (err, data)=> {
        if(!err){
            return res.status(400).send('already dialog exist')
        }
        Dialog = {Dialog : { id : `${dialog_id}`, state: 'ALERTING'} }
        newObjDialog = xmlFormat.MakeDialog(Dialog)
        fs.writeFile(`.${req.originalUrl}`, JSON.stringify(newObjDialog, null, 4),  (err) => {
            if(err) {
                return res.status(500).send('dialog update fail')
            }
            return res.status(202).send('post dialog success')
            
        })
        
    })

})

module.exports = router;