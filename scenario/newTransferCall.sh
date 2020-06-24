#!/bin/sh
alerting_message=$( cat ./NewTransferCall/ALERTING.xml )
active1_message=$( cat ./NewTransferCall/ACTIVE1.xml)
active2_message=$( cat ./NewTransferCall/ACTIVE2.xml)
active3_message=$( cat ./NewTransferCall/ACTIVE3.xml)

curl -X PUT 192.168.0.192:8083/finesse/api/User/770440040 -d "<User><state>RESERVED</state></User>" -H "Content-Type: Application/xml" -v
curl -X POST 192.168.0.192:8083/finesse/api/Dialog/188136819 -d "${alerting_message}" -H "Content-Type: Application/xml" -v
curl -X PUT 192.168.0.192:8083/finesse/api/User/770440040 -d "<User><state>TALKING</state></User>" -H "Content-Type: Application/xml" -v
curl -X POST 192.168.0.192:8083/finesse/api/Dialog/188136819 -d "${active1_message}" -H "Content-Type: Application/xml" -v
sleep 1
curl -X POST 192.168.0.192:8083/finesse/api/Dialog/188136819 -d "${active2_message}" -H "Content-Type: Application/xml" -v
sleep 1
curl -X POST 192.168.0.192:8083/finesse/api/Dialog/188136819 -d "${active3_message}" -H "Content-Type: Application/xml" -v



#curl -X PUT 192.168.0.192:8083/finesse/api/Dialog/147370467 -H "Content-Type: Application/xml" -v -d "<Dialog><state>ACTIVE</state><mediaProperties><DNIS>3004</DNIS><callType>TRANSFER</callType></mediaProperties></Dialog>"
#curl -X PUT 192.168.0.192:8083/finesse/api/User/770440040 -d "<User><state>TALKING</state></User>" -H "Content-Type: Application/xml" -v



