---
title: Deploying a Node.js Express API to Kubernetes with Azure DevOps
thumbnail: assets/kubernetes-devops.webp
date: 2025-01-01T19:31:21.081Z
keywords: kubernetes, azure, devops, node.js, express, docker, bicep templates, azure pipelines, ci/cd, aks, azure container registry
draft: false
category: devops
---

This guide walks you through creating and deploying a Node.js Express API to Kubernetes, leveraging Docker, Kubernetes, and Azure DevOps. It assumes basic familiarity with the Azure CLI and Azure concepts. I have created a [repository for reference](https://github.com/barnacleDevelopments/node-ts-api-kubernetes/tree/version_1) to help follow along with the tutorial.

`vimeo:https://vimeo.com/1043303804?share=copy`

## Prerequisites

- Basic understanding of Azure CLI and Kubernetes
- Installed and configured Azure CLI
- Docker installed locally

## Create a NodeJs Express API

1. Install dependencies and initialize configuration:

```bash
npm i express
touch tsconfig.json
```

2. Create the API logic (not included in this guide).

3. Verify that your application runs as expected locally.

## Create Application Docker Image

Verify that the docker image is built without issues.

```bash
docker build -t node-ts-api .
```

## Configure Kubernetes Objects

Define the deployment object in `deployment.yml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: node-ts-api
spec:
  replicas: 1
  selector:
    matchLabels:
      app: node-ts-api
  template:
    metadata:
      labels:
        app: node-ts-api
    spec:
      containers:
        - name: nodetsapi
          image: devdeveloperregistry.azurecr.io/node-ts-api:latest
          ports:
            - containerPort: 3000
```

Define the service object in `service.yml`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: node-ts-api
spec:
  type: LoadBalancer
  ports:
    - port: 8080
      targetPort: 3000
  selector:
    app: node-ts-api
```

## Setup Infastructure as Code (IAC) using Bicep Templates

Use Bicep templates to provision an Azure Container Registry, and Kubernetes cluster.

**Create Template File**
This bicep template file contains instructions for provisioning our resources. You can find a list of other resources in the [microsoft template documentation](https://learn.microsoft.com/en-us/azure/templates/). I've reference the Microsoft Documentation link for each resource for your reference.

```bicep
// General
param location string = resourceGroup().location
param resourceGroupName string = resourceGroup().name
param subscriptionId string = subscription().subscriptionId

// Kubernetes Cluster
param clusterName string = 'devdeveloper-aks-cluster'
param nodeSize string = 'Standard_A2_v2'
param nodeCount int = 1
param k8sVersion string = ''

// Container Registry
param containerRegistryName string = 'devdeveloperregistry'

// Reference: https://learn.microsoft.com/en-us/azure/templates/microsoft.containerregistry/registries?pivots=deployment-language-bicep
resource containerRegistry 'Microsoft.ContainerRegistry/registries@2022-12-01' = {
  name: containerRegistryName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: false
  }
}

// Template Reference: https://learn.microsoft.com/en-us/azure/templates/microsoft.containerservice/managedclusters?pivots=deployment-language-bicep
// Manage Node Pools Reference: https://learn.microsoft.com/en-us/azure/aks/use-system-pools?tabs=azure-cli
resource devDeveloperCluster 'Microsoft.ContainerService/managedClusters@2024-09-01' = {
  location: location
  name: clusterName
  sku: {
    name: 'Base'
    tier: 'Free'
  }
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    agentPoolProfiles: [
      {
        count: nodeCount
        name: 'nodepool1'
        osDiskSizeGB: 30
        osType: 'Linux'
        vmSize: nodeSize
        mode: 'System'
      }
    ]
    dnsPrefix: 'minimalaks'
  }
}

output aksPrincipalId string = aks.identity.principalId
```

**Create the Role Assignments Bicep File**
Here we are writing the role assignments bicep file which will create a role assignment for our Kubernetes cluster to authenticate with the container registry to pull images.

```bicep
@description('The AKS principal ID')
param aksPrincipalId string

// Declare the existing ACR resource
resource acr 'Microsoft.ContainerRegistry/registries@2022-09-01' existing = {
  name: 'devdeveloperregistry'
}

resource roleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(acr.Id, aksPrincipalId, 'acrpull')
  scope: acrId
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '7f951dda-4ed3-4680-a7ca-43fe172d538d') // AcrPull role
    principalId: aksPrincipalId
  }
}
```

**Deploy the Templates to Azure**
Here we are deploying our resources to Azure using the deployment command. We first create a resoure group to contain our resources (we can later delete the resource group and all it's containing resources later). Second, we deploy our resources referencing the `azuredeploy.bicep` file. Lastly, we create role assignments using our `roleassignments.bicep` file.

```bash
# Create Resource Group
az group create --name <resource-group-name> --location 'Central US'

# Deploy AKS and ACR
az deployment group create \
  --resource-group <resource-group-name> \
  --template-file azuredeploy.bicep

# Fetch outputs
az deployment group show \
  --resource-group <resource-group-name> \
  --name <deployment-name> \
  --query properties.outputs -o json

# Deploy Role Assignment
az deployment group create \
  --resource-group <resource-group-name> \
  --template-file roleAssignment.bicep \
  --parameters aksPrincipalId=<principle-id>
```

## Setup Kubernetes Deployment Pipeline using Azure DevOps

This section covers deploying docker containers to our Kubernetes cluster using Azure Pipelines. This allows us to push continiously update our application images. This is achieved using a two staged pipeline defined in a YAML pipeline file. This file can be generated inside the Devops interface. Once your pipeline file is defined you can run the pipeline to deploy your applications.

1. Stage One: Build Application and Update Azure Container Registry
2. Stage Two: Deploy Applications to Kubernetes Cluster

```yaml
trigger:
  - master

resources:
  - repo: self

variables:
  # Container registry service connection established during pipeline creation
  dockerRegistryServiceConnection: "f908d294-cc22-4ef7-9658-c29d3df43b12"
  imageRepository: "node-ts-api"
  containerRegistry: "devdeveloperregistry.azurecr.io"
  dockerfilePath: "**/Dockerfile.dev"
  tag: "$(Build.BuildId)"
  imagePullSecret: "devdeveloperregistry8892c7e1-auth"

  # Agent Pool Name
  poolName: "Personal Laptop"

stages:
  - stage: Build
    displayName: Build stage
    jobs:
      - job: Build
        displayName: Build
        pool:
          name: $(poolName)
        steps:
          - task: Docker@2
            displayName: Build and push an image to container registry
            inputs:
              command: buildAndPush
              repository: $(imageRepository)
              dockerfile: $(dockerfilePath)
              containerRegistry: $(dockerRegistryServiceConnection)
              tags: |
                $(tag)

          - upload: manifests
            artifact: manifests

  - stage: Deploy
    displayName: Deploy stage
    dependsOn: Build

    jobs:
      - deployment: Deploy
        displayName: Deploy
        pool:
          name: $(poolName)
        environment: "barnacleDevelopmentskubernetestest-1499.default"
        strategy:
          runOnce:
            deploy:
              steps:
                - task: KubernetesManifest@0
                  displayName: Create imagePullSecret
                  inputs:
                    action: createSecret
                    secretName: $(imagePullSecret)
                    dockerRegistryEndpoint: $(dockerRegistryServiceConnection)

                - task: KubernetesManifest@0
                  displayName: Deploy to Kubernetes cluster
                  inputs:
                    action: deploy
                    manifests: |
                      $(Pipeline.Workspace)/manifests/deployment.yml
                      $(Pipeline.Workspace)/manifests/service.yml
                    imagePullSecrets: |
                      $(imagePullSecret)
                    containers: |
                      $(containerRegistry)/$(imageRepository):$(tag)
```

## Hit deployed API

1. **Get the LoadBalancer IP Address** Use the following command to retrieve the external IP address of your deployed API's LoadBalancer service:

```bash
kubectl get services
Look for the EXTERNAL-IP field of the node-ts-api service.
```

2. **Access the API** Copy the LoadBalancer IP address and paste it into your browser, followed by the appropriate endpoint (e.g., /api or /). For example:

```bash
http://<EXTERNAL-IP>:8080
```

## References

1. [Deploying a Kubernetes Cluster to Azure Pipelines](https://learn.microsoft.com/en-us/azure/aks/devops-pipeline?tabs=cli&pivots=pipelines-yaml)
2. [Azure Bicep Templates](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/)
3. [Microsoft.ContainerRegistry/registries Bicep Template Reference](https://learn.microsoft.com/en-us/azure/templates/microsoft.containerregistry/registries?pivots=deployment-language-bicep)
4. [Microsoft.ContainerService/managedClusters Bicep Template Reference](https://learn.microsoft.com/en-us/azure/templates/microsoft.containerservice/managedclusters?pivots=deployment-language-bicep)
5. [Microsoft.Sql/servers Bicep Template Reference](https://learn.microsoft.com/en-us/azure/templates/microsoft.sql/servers?pivots=deployment-language-bicep)
6. [Microsoft.Sql/servers/databases Bicep Template Reference](https://learn.microsoft.com/en-us/azure/templates/microsoft.sql/servers/databases?pivots=deployment-language-bicep)
7. [Self-Hosted Azure Agents](https://learn.microsoft.com/en-us/azure/devops/pipelines/agents/linux-agent?view=azure-devops)
8. [Azure DevOps Kubernetes Lab](https://azuredevopslabs.com/labs/vstsextend/kubernetes/)
