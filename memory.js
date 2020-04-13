
let xmpp_client = {}
let client_value = {
    state : '',
    xmpp_session : null
}
let dialog = {}
let dialog_value = {
    user_id : '',
    dn : '',
}
module.exports = {
    search_dn_dialog : function(dn){
        for( let[ key, value] of Object.entries(dialog)){
            if(value.dn == dn) 
                return { dialog_id : key }
        }
        return { dialog_id : null }
    },
    search_reserved_client : function(){
        for ( let [key, value] of Object.entries(xmpp_client)){
            if(value.state == 'RESERVED'){
                return  { user_id : key, dn : value.extension }
            }
        }
        return  { user_id : null, dn : null }
    },
    get_client_memory : function(){
        return xmpp_client
    },
    get_user_id_from_dialog : function(dialog_id){
        return dialog[dialog_id].user_id
    },
    set_dialog_for_user_id : function(dialog_id, user_id, dn){
        value = JSON.parse(JSON.stringify(dialog_value))
        value.user_id = user_id
        value.dn = dn
        dialog[dialog_id] = value
    },
    get_state : function(id){
        return xmpp_client[id].state
    },
    set_state : function(id, state){
        xmpp_client[id].state = state
    },


    get_xmpp : function(id){
        return xmpp_client[id].xmpp_session
    },
    set_xmpp : function(id, xmpp){
        value = JSON.parse(JSON.stringify(client_value))
        value.state = '',
        value.xmpp_session = xmpp
        xmpp_client[id] = value
    },
}