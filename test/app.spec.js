const assert = require("assert");
const fs = require('fs')
const xmlFormat = require('../utils/xmlFormat')
const memory = require('../memory')

const sayHello = function(){
  return 'hello'
}


describe('App test!', function() {
  it('sayHello should retur nhello', function(done) {
    if(sayHello() == 'hello'){
      done()
    }
  })
})

describe('Xmpp Event Format', function(){
  it('user event', function(done){
    fs.readFile('./finesse/api/User/840000009', (err, data) => {
      if(err)
        done(new Error('no exist user'))
      const userData = JSON.parse(data)
      const xmppUserEvent = xmlFormat.GetXmppUserEventFormat('840000009', userData)
      done()
      // console.log(xmppUserEvent)
    })
  })
  it('dialog event', function(done){
    fs.readFile('./finesse/api/Dialog/156494657', (err, data) => {
      if(err)
        done(new Error('no exist dialog'))
      const dialogData = JSON.parse(data)
      const xmppDialogEvent = xmlFormat.GetXmppDialogEventFormat('840000009', dialogData)
      done()
      // console.log(xmppDialogEvent)
    })
  })
})
describe('Call Logic', function() {
  it('make call', function(done) {
    //ready -> alerting call

    fs.readFile('./utils/base', (err, data)=> {
      if(err) {
        done(new Error(err));
      }
      let custom = xmlFormat.MakeDialog()
      done()
      // console.log(custom)      
    })
  })
})

describe('memory logic', function() {
    it('set ', function(done) {
        let xmpp = 'this is sample xmpp session'
        memory.set_xmpp('123456789', xmpp)
        assert.equal(xmpp, memory.get_xmpp('123456789'))

        memory.set_state('123456789', 'RESERVED')
        assert.equal('RESERVED', memory.get_state('123456789'))

        let { user_id, dn } = memory.search_reserved_client()
        console.log(user_id)
        console.log(dn)
    



        memory.set_dialog_for_user_id('dialog_id', 'user_id', 'dn')
        user_id = memory.get_user_id_from_dialog('dialog_id')
        assert.equal ( user_id , 'user_id')

        set_dialog_for_user_id
        done()
      
    })
  })
  