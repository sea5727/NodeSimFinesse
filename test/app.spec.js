const fs = require('fs')
const xmlFormat = require('../utils/xmlFormat')

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