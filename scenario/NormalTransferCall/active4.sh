#!/bin/sh
active4_message=$( cat ./ACTIVE4.xml)
curl -X POST 192.168.0.192:8083/finesse/api/Dialog/140124631 -d "${active4_message}" -H "Content-Type: Application/xml" -v






