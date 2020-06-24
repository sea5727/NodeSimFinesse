#!/bin/sh
alerting_message=$( cat ./TransferCallQueue/ALERTING_MGR_TRANSFER_SIMPLE_QUEUE.xml )
active_message=$( cat ./TransferCallQueue/ACTIVE_MGR_TRANSFER_SIMPLE_QUEUE.xml)

curl -X PUT 192.168.0.192:8083/finesse/api/User/770440040 -d "<User><state>RESERVED</state></User>" -H "Content-Type: Application/xml" -v
curl -X POST 192.168.0.192:8083/finesse/api/Dialog/2144292888 -d "${alerting_message}" -H "Content-Type: Application/xml" -v
curl -X PUT 192.168.0.192:8083/finesse/api/User/770440040 -d "<User><state>TALKING</state></User>" -H "Content-Type: Application/xml" -v
curl -X POST 192.168.0.192:8083/finesse/api/Dialog/147370467 -d "${active_message}" -H "Content-Type: Application/xml" -v
#sleep 1
#curl -X POST 192.168.0.192:8083/finesse/api/Dialog/2144292888 -d "${dropped1_message}" -H "Content-Type: Application/xml" -v
#sleep 1
#curl -X PUT 192.168.0.192:8083/finesse/api/User/770440040 -d "<User><state>TALKING</state></User>" -H "Content-Type: Application/xml" -v
#curl -X POST 192.168.0.192:8083/finesse/api/Dialog/147370467 -d "${active2_message}" -H "Content-Type: Application/xml" -v







