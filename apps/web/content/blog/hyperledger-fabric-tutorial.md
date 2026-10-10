---
title: Hyperledger Fabric Tutorial
thumbnail: assets/logo_2.png
date: 2020-04-03T15:13:45.129Z
keywords: neurolink
category: programming
draft: true
---

Hyperledger is a set of tools designed for creating blockchains. The term is often confused with being a framework when it is actually just an umbrella term to describe a variety of related technologies. Today we will be talking about a hyperledger framework called Hyperledger Fabric. This framework facilitates the process of setting up a permissioned blockchain (a blockchain where members are invited to participate in contributing to the ledger).

# Prerequisites

Before continuing I would recommend some familiarity with bash terminal, NodeJs, and Docker. This tutorial is meant to be an introduction to Fabric without diving into too much detail. That's what the documentation is for ;).

You need to give access to add permissions to your user in order to run some of the commands.

## Permissions

```bash
chmod -R 755 /home/devin/Hyperledger/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
sudo chown -R devin:devin /home/devin/Hyperledger/fabric-samples/
```

## Chaincode

```bash
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"TransferAsset","Args":["asset6","Christopher"]}'
```

# Deploying to Production

- Note that channels should not have peers that use both CouchDB and LevelDB on them, as CouchDB imposes some data restrictions on keys and values.
- Certificate Authorities generate the certificates that represent identities, the MSP contains a list of permissioned identities.
- MSP is a mechanism of assigning roles to different certificate authorities on the network.
- Channel MSPs are like sub roles
- The exclusive relationship between an organization and its MSP makes it sensible to name the MSP after the organization, a convention you’ll find adopted in most policy configurations.
- Each MSP defines the specific roles and permissions for the channel or authority, allowing for fine-grained control over access to data and resources.
- Note that, if the called chaincode is on a different channel from the calling chaincode, only read query is allowed.

### Difference between Fabric shim and fabric contract api

- Use Fabric Contract API when you want to write simple Smart Contracts with a high-level interface.
- Use Fabric Shim when you need more control and flexibility in your chaincode implementation, or when you're working with complex business logic.
