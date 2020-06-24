#!/bin/sh
active3_message=$( cat ./ACTIVE3.xml)
curl -X POST 192.168.0.192:8083/finesse/api/Dialog/140124631 -d "${active3_message}" -H "Content-Type: Application/xml" -v






