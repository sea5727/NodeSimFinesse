#!/bin/sh
active_message=$( cat ./NormalPrerouteAcdIn/ACTIVE.xml)
alerting_message=$( cat ./NormalPrerouteAcdIn/ALERTING.xml)
dropped_message=$( cat ./DropedAgent/DROPPED.xml)
#echo ${dropped_message}
curl -X POST 192.168.0.192:8083/finesse/api/Dialog/147370467 -d "${dropped_message}" -H "Content-Type: Application/xml" -v


#curl -X PUT 192.168.0.192:8083/finesse/api/Dialog/147370467 -H "Content-Type: Application/xml" -v -d "<Dialog><state>ACTIVE</state><mediaProperties><DNIS>3004</DNIS><callType>TRANSFER</callType></mediaProperties></Dialog>"
#curl -X PUT 192.168.0.192:8083/finesse/api/User/770440040 -d "<User><state>TALKING</state></User>" -H "Content-Type: Application/xml" -v



