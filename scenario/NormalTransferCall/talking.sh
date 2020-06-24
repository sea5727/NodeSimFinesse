#!/bin/sh
curl -X PUT 192.168.0.192:8083/finesse/api/User/770440040 -d "<User><state>TALKING</state></User>" -H "Content-Type: Application/xml" -v