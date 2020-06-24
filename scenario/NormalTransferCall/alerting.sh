#!/bin/sh
alerting_message=$( cat ./ALERTING.xml )
curl -X POST 192.168.0.192:8083/finesse/api/Dialog/2131326100 -d "${alerting_message}" -H "Content-Type: Application/xml" -v







