#!/bin/sh
active2_message=$( cat ./ACTIVE2.xml)
curl -X POST 192.168.0.192:8083/finesse/api/Dialog/140124631 -d "${active2_message}" -H "Content-Type: Application/xml" -v






