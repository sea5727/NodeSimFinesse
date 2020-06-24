#!/bin/sh
active5_message=$( cat ./ACTIVE5.xml)
curl -X POST 192.168.0.192:8083/finesse/api/Dialog/140124631 -d "${active5_message}" -H "Content-Type: Application/xml" -v






