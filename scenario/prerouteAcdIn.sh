#!/bin/sh
active_message=$( cat ./NormalPrerouteAcdIn/ACTIVE.xml)
alerting_message=$( cat ./NormalPrerouteAcdIn/ALERTING.xml)
#echo ${active_message}
curl -X PUT 192.168.0.192:8083/finesse/api/User/900740006 -d "<User><state>RESERVED</state></User>" -H "Content-Type: Application/xml" -v
curl -X POST 192.168.0.192:8083/finesse/api/Dialog/147370467 -d "${alerting_message}" -H "Content-Type: Application/xml" -v
curl -X PUT 192.168.0.192:8083/finesse/api/User/900740006 -d "<User><state>TALKING</state></User>" -H "Content-Type: Application/xml" -v
curl -X POST 192.168.0.192:8083/finesse/api/Dialog/147370467 -d "${active_message}" -H "Content-Type: Application/xml" -v


#curl -X PUT 192.168.0.192:8083/finesse/api/Dialog/147370467 -H "Content-Type: Application/xml" -v -d "<Dialog><state>ACTIVE</state><mediaProperties><DNIS>3004</DNIS><callType>TRANSFER</callType></mediaProperties></Dialog>"
#curl -X PUT 192.168.0.192:8083/finesse/api/User/770440040 -d "<User><state>TALKING</state></User>" -H "Content-Type: Application/xml" -v



