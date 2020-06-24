const fs = require('fs')
var path = require('path')

path.extname('index.html')
// returns
'.html'
var commander = require('./utils/commander')

console.log(`your http port : ${commander.httpPort}, xmpp port : ${commander.xmppPort}`)

// let users = fs.readdirSync('./finesse/api/User/')
// for(let i = 0 ; i < users.length ; i++){
//     if(path.extname(users[i]) == '.js') continue
//     let data = fs.readFileSync(`./finesse/api/User/${users[i]}`)
//     objUser = JSON.parse(data)
//     objUser.User.state = 'LOGOUT'
//     fs.writeFileSync(`./finesse/api/User/${users[i]}`, JSON.stringify(objUser, null, 4))
// }

let http_server = require('./http_server')
let xmpp_server = require('./xmpp_server')

http_server(commander.httpPort)
xmpp_server(commander.xmppPort)
