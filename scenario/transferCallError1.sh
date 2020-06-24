#!/bin/sh
alerting_message=$( cat ./ErrorCase1/2_ALERTING.xml )
error_message=$( cat ./ErrorCase1/3_ERROR.xml )
alerting_message2=$( cat ./ErrorCase1/4_ALERTING.xml )
initiating_message1=$( cat ./ErrorCase1/7_INITIATING.xml )
initiating_message2=$( cat ./ErrorCase1/8_INITIATING.xml )

#################### 호인입 시나리오 ###################
curl -X PUT 192.168.0.192:8083/finesse/api/User/770440040 -d "<User><state>RESERVED</state></User>" -H "Content-Type: Application/xml" -v
curl -X POST 192.168.0.192:8083/finesse/api/Dialog/154963621 -d "${alerting_message}" -H "Content-Type: Application/xml" -v
curl -X POST 192.168.0.192:8083/finesse/api/Error/154963621 -d "${error_message}" -H "Content-Type: Application/xml" -v
curl -X POST 192.168.0.192:8083/finesse/api/Dialog/154963621 -d "${alerting_message2}" -H "Content-Type: Application/xml" -v
curl -X PUT 192.168.0.192:8083/finesse/api/User/770440040 -d "<User><state>READY</state></User>" -H "Content-Type: Application/xml" -v
curl -X PUT 192.168.0.192:8083/finesse/api/User/770440040 -d "<User><state>TALKING</state></User>" -H "Content-Type: Application/xml" -v
curl -X POST 192.168.0.192:8083/finesse/api/Dialog/154963621 -d "${initiating_message1}" -H "Content-Type: Application/xml" -v
curl -X POST 192.168.0.192:8083/finesse/api/Dialog/154963621 -d "${initiating_message2}" -H "Content-Type: Application/xml" -v
curl -X PUT 192.168.0.192:8083/finesse/api/User/770440040 -d "<User><state>READY</state></User>" -H "Content-Type: Application/xml" -v



