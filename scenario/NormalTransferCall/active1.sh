#!/bin/sh
active1_message=$( cat ./ACTIVE1.xml)
curl -X POST 192.168.0.192:8083/finesse/api/Dialog/140124631 -d "${active1_message}" -H "Content-Type: Application/xml" -v






