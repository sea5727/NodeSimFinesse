#!/bin/sh
dropped1_message=$(cat ./DROPPED1.xml)
curl -X POST 192.168.0.192:8083/finesse/api/Dialog/2131326100 -d "${dropped1_message}" -H "Content-Type: Application/xml" -v