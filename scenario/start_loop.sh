#!/bin/sh

for (( ; ;))
do
   echo start prerouteAcdIn
   ./prerouteAcdIn.sh
   sleep 5
   echo start dropAgent
   ./droppedAgent.sh
   sleep 2 
done
