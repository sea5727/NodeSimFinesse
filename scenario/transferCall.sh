#!/bin/sh
alerting_message=$( cat ./NormalTransferCall/ALERTING.xml )
active1_message=$( cat ./NormalTransferCall/ACTIVE1.xml)
dropped1_message=$(cat ./NormalTransferCall/DROPPED1.xml)
active2_message=$( cat ./NormalTransferCall/ACTIVE2.xml)
active3_message=$( cat ./NormalTransferCall/ACTIVE3.xml)
active4_message=$( cat ./NormalTransferCall/ACTIVE4.xml)
active5_message=$( cat ./NormalTransferCall/ACTIVE5.xml)
#################### 호인입 시나리오 ###################
curl -X PUT 192.168.0.192:8083/finesse/api/User/770440040 -d "<User><state>RESERVED</state></User>" -H "Content-Type: Application/xml" -v
curl -X POST 192.168.0.192:8083/finesse/api/Dialog/2131326100 -d "${alerting_message}" -H "Content-Type: Application/xml" -v
curl -X POST 192.168.0.192:8083/finesse/api/Dialog/140124631 -d "${active1_message}" -H "Content-Type: Application/xml" -v
#######################################################
sleep 1
#################### 통화중 시나리오 ###################
curl -X POST 192.168.0.192:8083/finesse/api/Dialog/2131326100 -d "${dropped1_message}" -H "Content-Type: Application/xml" -v
curl -X POST 192.168.0.192:8083/finesse/api/Dialog/140124631 -d "${active2_message}" -H "Content-Type: Application/xml" -v
curl -X POST 192.168.0.192:8083/finesse/api/Dialog/140124631 -d "${active3_message}" -H "Content-Type: Application/xml" -v
curl -X PUT 192.168.0.192:8083/finesse/api/User/770440040 -d "<User><state>TALKING</state></User>" -H "Content-Type: Application/xml" -v
sleep 1
curl -X POST 192.168.0.192:8083/finesse/api/Dialog/140124631 -d "${active4_message}" -H "Content-Type: Application/xml" -v
# curl -X POST 192.168.0.192:8083/finesse/api/Dialog/140124631 -d "${active5_message}" -H "Content-Type: Application/xml" -v







