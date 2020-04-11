const xmpp = require('node-xmpp-server');

const FinesseMemory = require('./memory');


let listen = function (port) {
    var options = {
        port: port,
        domain : 'finesse'
    }
    
    var server = new xmpp.C2S.TCPServer(options);

    server.on('listening', () => {
        console.log(`[XMPP] listening succ port:${port}`);
    });

    server.on('connection', (client) => {
        console.log('[XMPP] client connection');
        client.on('online', () => {
            console.log('[XMPP] online from client');
        });

        client.on('register', (opts, cb) => {
            console.log('[XMPP] register from client');
            cb(true);
        });

        client.on('authenticate', (opts, cb) => {
            let finesse_id = opts.username
            FinesseMemory.set_xmpp(finesse_id, client);
            console.log('[XMPP] authenticate from client finesse_id : ', finesse_id);
            // 로그인 처리 인듯..? 
            // opts.username
            // opts.password
            cb(null, opts);
            // session_router.set_xmpp(client.jid.local, client); // key : FnsLoginId, value : xmpp_client
        })

        client.on('stanza', (stanza) => {
            // receive message from client 
            if (stanza.name === 'iq' && stanza.type == 'get') {
                var from = stanza.attrs.from
                stanza.attrs.from = stanza.attrs.to
                stanza.attrs.to = from
                stanza.type = 'result'
                client.send(stanza);
            }
            else {
                console.log(`[XMPP / ${client.jid.local}] stanza : ${stanza.toString()}`);
                var from = stanza.attrs.from
                stanza.attrs.from = stanza.attrs.to
                stanza.attrs.to = from
                client.send(stanza)
            }
        });

        client.on('disconnect', () => {
            console.log('[XMPP] disconnect from client');
        });

    });
}

module.exports = listen;