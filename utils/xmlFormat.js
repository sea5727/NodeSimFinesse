const builder = require('xmlbuilder');
// const parser_x2j = require('../../utils/parser-x2j')

const GetXmppUserEventFormat = (UserId, objUserData) => {
    let copy = JSON.parse(JSON.stringify(objUserData))
    if('User' in objUserData){
        Object.defineProperty(copy, 'user', Object.getOwnPropertyDescriptor(copy, 'User'));
        delete copy['User']; // User -> user 로 변경
    }

    let update = {
        update : {
            data : {
                '#text' : copy
            },
            event : { '#text' : 'PUT'},
            requestId: { '#text': '' },
            source: { '#text': `/finesse/api/User/${UserId}` }
        }
    }
    const update_xml = builder.create(update, {headless: true}).end({ pretty: true });
    const finesse_number = 'simfin01'
    const company_name = 'jdin'
    const full_event = {
        message: {
            '@from': `pubsub.${finesse_number}.${company_name}.icm`,
            '@to': `${UserId}@${finesse_number}.${company_name}.icm`,
            '@id': `/finesse/api/User/${UserId}__${UserId}@${finesse_number}.${company_name}.icm__FyRVw`,
            event: {
                '@xmlns': 'http://jabber.org/protocol/pubsub#event',
                items: {
                    '@node': `/finesse/api/User/${UserId}`,
                    item: {
                        '@id': 'da931a91-f39d-4081-8361-9afdf606956848660477',
                        notification: {
                            '@xmlns': "http://jabber.org/protocol/pubsub",
                            '@type': 'html',
                            '#text': `${update_xml}`
                        }
                    }
                }
            }
        }
    }
    return builder.create(full_event, { headless: true }).end({ pretty: true })
}

const GetXmppDialogEventFormat = (UserId, objDialogData) => {
    const copy = JSON.parse(JSON.stringify(objDialogData));
    const update = {
        '#text' : copy
        // Update : {
        //     data: {
        //         dialogs : {
        //             '#text': copy
        //         }
        //     },
        //     event: { '#text': 'PUT' },
        //     requestId: { '#text': '' },
        //     source: { '#text': `/finesse/api/User/${UserId}/Dialogs` }
        // }
    }
    const update_xml = builder.create(update, {headless: true}).end({ pretty: true });
    const finesse_number = 'simfin01'
    const company_name = 'jdin'
    const full_event = {
        message: {
            '@from': `pubsub.${finesse_number}.${company_name}.icm`,
            '@to': `${UserId}@${finesse_number}.${company_name}.icm`,
            '@id': `/finesse/api/User/${UserId}/Dialogs__${UserId}@${finesse_number}.${company_name}.icm__FyRVw`,
            event: {
                '@xmlns': 'http://jabber.org/protocol/pubsub#event',
                items: {
                    '@node': `/finesse/api/User/${UserId}/Dialogs`,
                    item: {
                        '@id': 'da931a91-f39d-4081-8361-9afdf606956848660477',
                        notification: {
                            '@xmlns': "http://jabber.org/protocol/pubsub",
                            '@type': 'html',
                            '#text': `${update_xml}`
                        }
                    }

                }
            }
        }
    }
    return builder.create(full_event, { headless: true }).end({ pretty: true })
}

const MakeDialog = (Option) => {

    const default_associatedDialogUri = ''
    const default_fromAddress = '01012345678'
    const default_dialog_id = '156494657'
    const default_DNIS = '3000'
    const default_callType = 'PREROUTE_ACD_IN'
    const default_dialogNumber = '821343'
    const default_mediaId = '1'
    const default_outboundClassification = ''
    const default_wrapUpReason = 'VOICE_ANNOUNCE'
    const default_mediaType = 'Voice'
    const default_state = 'ALERTING'
    const default_toAddress = `${default_dialogNumber}`
    const default_uri = `/finesse/api/Dialog/${default_dialog_id}`
  
    objDialog = Option || {}
    objDialog['Dialog'] = objDialog['Dialog'] || {}
  
    Dialog = objDialog.Dialog
    Dialog['associatedDialogUri'] = Dialog['associatedDialogUri'] || default_associatedDialogUri
    Dialog['fromAddress'] = Dialog['fromAddress'] || default_fromAddress
    Dialog['id'] = Dialog['id'] || default_dialog_id
    Dialog['mediaProperties'] = Dialog['mediaProperties'] || {}
  
    mediaProperties = Dialog.mediaProperties
  
    mediaProperties['DNIS'] = mediaProperties['DNIS'] || default_DNIS
    mediaProperties['callType'] = mediaProperties['callType'] || default_callType
    mediaProperties['callvariables'] = mediaProperties['callvariables'] || { CallVariable : [] }
    mediaProperties['dialogNumber'] = mediaProperties['dialogNumber'] || default_dialogNumber
    mediaProperties['mediaId'] = mediaProperties['mediaId'] || default_mediaId
    mediaProperties['outboundClassification'] = mediaProperties['outboundClassification'] || default_outboundClassification
    mediaProperties['wrapUpReason'] = mediaProperties['wrapUpReason'] || default_wrapUpReason
  
    
    Dialog['mediaType'] = Dialog['mediaType'] || default_mediaType
    Dialog['participants'] = Dialog['participants'] || []
    Dialog['state'] = Dialog['state'] || default_state
    Dialog['toAddress'] = Dialog['toAddress'] || default_toAddress
    Dialog['uri'] = Dialog['uri'] || default_uri
    
    
    let CallVariable = mediaProperties['callvariables'].CallVariable
    let names = []
    
    for(let i = 0 ; i < CallVariable.length ; i ++){
        names.push(CallVariable[i].name)
    }

    if ( ! names.includes('callVariable1') ) CallVariable.push({name : 'callVariable1', value:'821343114______________________'})
    if ( ! names.includes('callVariable2') ) CallVariable.push({name : 'callVariable2', value:'152811000160063'}) 
    if ( ! names.includes('callVariable3') ) CallVariable.push({name : 'callVariable3', value:'DJCVP02____________232010_________0000'})
    if ( ! names.includes('callVariable4') ) CallVariable.push({name : 'callVariable4', value:'01073647757_____01073647757_____'})
    if ( ! names.includes('callVariable5') ) CallVariable.push({name : 'callVariable5', value:'012302_____Default__010010'}) //transfer_count : [1]
    if ( ! names.includes('callVariable6') ) CallVariable.push({name : 'callVariable6', value:'Z05A01001_084123600__________'})
    if ( ! names.includes('callVariable7') ) CallVariable.push({name : 'callVariable7', value:'18'})//호타입
    if ( ! names.includes('callVariable7') ) CallVariable.push({name : 'callVariable8', value:'110012005100'})
    if ( ! names.includes('callVariable8') ) CallVariable.push({name : 'callVariable9', value:'020021608'})
    if ( ! names.includes('callVariable10') ) CallVariable.push({name : 'callVariable10', value:'43_1_114____________'})
    if ( ! names.includes('user.que') ) CallVariable.push({name : 'user.que', value:''})
    if ( ! names.includes('user.ewt') ) CallVariable.push({name : 'user.ewt', value:'130712'})
  
  
    let participants = Dialog['Participant']
    let party = []
    if(Dialog['Participant'] != null){
    }
    else {
        participants.push({
            Pargicipant : {
              actions : {
                action : [
                  "TRANSFER_SST",
                  "CONSULT_CALL",
                  "HOLD",
                  "UPDATE_CALL_DATA",
                  "SEND_DTMF",
                  "DROP"
                ]
              },
              mediaAddress : '01073647757',
              mediaAddressType : '',
              startTime : '2019-05-21T04:07:38.017Z',
              state : 'ACTIVE',
              stateChangeTime : "2019-05-21T04:07:38.017Z"
            }
          })
          participants.push({
            Pargicipant : {
              actions : {
                action : [
                  "TRANSFER_SST",
                  "CONSULT_CALL",
                  "HOLD",
                  "UPDATE_CALL_DATA",
                  "SEND_DTMF",
                  "DROP"
                ]
              },
              mediaAddress : '5008',
              mediaAddressType : 'AGENT_DEVICE',
              startTime : '2019-05-21T04:07:38.017Z',
              state : 'ACTIVE',
              stateChangeTime : "2019-05-21T04:07:38.017Z"
            }
          })
    }


    return objDialog
  }
// const XmppUserEventFormatUsingObject = (UserId, dataObj) => {

//     var dataFormat = JSON.parse(JSON.stringify(dataObj));
//     if('User' in dataObj){
//         Object.defineProperty(dataFormat, 'user', Object.getOwnPropertyDescriptor(dataFormat, 'User'));
//         delete dataFormat['User'];
//     }


//     let update = {
//         update: {
//             data: {
//                 '#text': dataFormat
//             },
//             event: { '#text': 'PUT' },
//             requestId: { '#text': '' },
//             source: { '#text': `/finesse/api/User/${UserId}` }
//         }
//     }

//     let update_xml = builder.create(update, {headless: true}).end({ pretty: true });
//     let finesse_number = 'simfin01'
//     let company_name = 'jdin'
//     var full_event = {
//         message: {
//             '@from': `pubsub.${finesse_number}.${company_name}.icm`,
//             '@to': `${UserId}@${finesse_number}.${company_name}.icm`,
//             '@id': `/finesse/api/User/${UserId}__${UserId}@${finesse_number}.${company_name}.icm__FyRVw`,
//             event: {
//                 '@xmlns': 'http://jabber.org/protocol/pubsub#event',
//                 items: {
//                     '@node': `/finesse/api/User/${UserId}`,
//                     item: {
//                         '@id': 'da931a91-f39d-4081-8361-9afdf606956848660477',
//                         notification: {
//                             '@xmlns': "http://jabber.org/protocol/pubsub",
//                             '@type': 'html',
//                             '#text': `${update_xml}`
//                         }
//                     }
//                 }
//             }
//         }
//     }
//     return builder.create(full_event, { headless: true }).end({ pretty: true })
// }
// const XmppDialogEventFormatUsingObject = (UserId, dataObj) => {

//     var dataFormat = JSON.parse(JSON.stringify(dataObj));
//     let update = {
//         Update : {
//             data: {
//                 dialogs : {
//                     '#text': dataFormat
//                 }
                
//             },
//             event: { '#text': 'PUT' },
//             requestId: { '#text': '' },
//             source: { '#text': `/finesse/api/User/${UserId}/Dialogs` }
//         }
//     }

//     let update_xml = builder.create(update, {headless: true}).end({ pretty: true });
//     let finesse_number = 'simfin01'
//     let company_name = 'jdin'
//     var full_event = {
//         message: {
//             '@from': `pubsub.${finesse_number}.${company_name}.icm`,
//             '@to': `${UserId}@${finesse_number}.${company_name}.icm`,
//             '@id': `/finesse/api/User/${UserId}/Dialogs__${UserId}@${finesse_number}.${company_name}.icm__FyRVw`,
//             event: {
//                 '@xmlns': 'http://jabber.org/protocol/pubsub#event',
//                 items: {
//                     '@node': `/finesse/api/User/${UserId}/Dialogs`,
//                     item: {
//                         '@id': 'da931a91-f39d-4081-8361-9afdf606956848660477',
//                         notification: {
//                             '@xmlns': "http://jabber.org/protocol/pubsub",
//                             '@type': 'html',
//                             '#text': `${update_xml}`
//                         }
//                     }

//                 }
//             }
//         }
//     }
//     return builder.create(full_event, { headless: true }).end({ pretty: true })
// }
// const XmppEventFormatUsingString = (UserId, strXmlData) => {
//     let update = {
//         update: {
//             data: {
//                 '#text': strXmlData
//             },
//             event: { '#text': 'PUT' },
//             requestId: { '#text': '' },
//             source: { '#text': `/finesse/api/User/${UserId}` }
//         }
//     }

//     let update_xml = builder.create(update, {headless: true}).end({ pretty: true });
//     let finesse_number = 'simfin01'
//     let company_name = 'jdin'
//     var full_event = {
//         message: {
//             '@from': `pubsub.${finesse_number}.${company_name}.icm`,
//             '@to': `${UserId}@${finesse_number}.${company_name}.icm`,
//             '@id': `/finesse/api/User/${UserId}__${UserId}@${finesse_number}.${company_name}.icm__FyRVw`,
//             event: {
//                 '@xmlns': 'http://jabber.org/protocol/pubsub#event',
//                 items: {
//                     '@node': `/finesse/api/User/${UserId}`,
//                     item: {
//                         '@id': 'da931a91-f39d-4081-8361-9afdf606956848660477',
//                         notification: {
//                             '@xmlns': "http://jabber.org/protocol/pubsub",
//                             '@type': 'html',
//                             '#text': `${update_xml}`
//                         }
//                     }

//                 }
//             }
//         }
//     }
//     return builder.create(full_event, { headless: true }).end({ pretty: true })
// }

// const XmppDialogEventFormatUsingString = (UserId, strXmlData) => {
//     let objXmlData = parser_x2j.parse(strXmlData)
//     let update = {
//         Update: {
//             data: {
//                 dialogs : {
//                     '#text': objXmlData
//                 }
//             },
//             event: { '#text': 'PUT' },
//             requestId: { '#text': '' },
//             source: { '#text': `/finesse/api/User/${UserId}/Dialogs` }
//         }
//     }

//     let update_xml = builder.create(update, {headless: true}).end({ pretty: true });
//     let finesse_number = 'simfin01'
//     let company_name = 'jdin'
//     var full_event = {
//         message: {
//             '@from': `pubsub.${finesse_number}.${company_name}.icm`,
//             '@to': `${UserId}@${finesse_number}.${company_name}.icm`,
//             '@id': `/finesse/api/User/${UserId}/Dialogs__${UserId}@${finesse_number}.${company_name}.icm__FyRVw`,
//             event: {
//                 '@xmlns': 'http://jabber.org/protocol/pubsub#event',
//                 items: {
//                     '@node': `/finesse/api/User/${UserId}/Dialogs`,
//                     item: {
//                         '@id': 'da931a91-f39d-4081-8361-9afdf606956848660477',
//                         notification: {
//                             '@xmlns': "http://jabber.org/protocol/pubsub",
//                             '@type': 'html',
//                             '#text': `${update_xml}`
//                         }
//                     }

//                 }
//             }
//         }
//     }
//     return builder.create(full_event, { headless: true }).end({ pretty: true })
// }

// module.exports = {
//     XmppUserEventFormatUsingObject : XmppUserEventFormatUsingObject,
//     XmppEventFormatUsingString : XmppEventFormatUsingString,
//     XmppDialogEventFormatUsingObject : XmppDialogEventFormatUsingObject,
//     XmppDialogEventFormatUsingString : XmppDialogEventFormatUsingString
// }

module.exports = {
    MakeDialog : MakeDialog,
    GetXmppUserEventFormat : GetXmppUserEventFormat,
    GetXmppDialogEventFormat : GetXmppDialogEventFormat,
}
