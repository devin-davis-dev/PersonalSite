---
title: "Automating Azure Kubernetes Flux Deployment"
thumbnail: "assets/kubernetes-devops.webp"
date: "2025-01-17T19:31:21.081Z"
keywords: "kubernetes, azure, devops, node.js, express, docker, bicep, templates, azure pipelines, ci/cd, aks, azure container registry, flux"
draft: true
category: "devops"
---

The ultimate power of DevOps lies in the full automation of deployment pipelines. Automating Kubernetes deployments with Flux ensures reproducibility, scalability, and control over production resources. This tutorial will guide you through automating a Kubernetes Flux deployment, allowing you to quickly spin up and tear down a production-grade Kubernetes environment using Flux. Additionally, we'll set up a PostgreSQL database that leverages an Azure Storage Account, demonstrating how deployment updates work in a GitOps-driven environment.

# Prerequisites

- Review my [previous tutorial](/blog/) on setting up flux before continuing. Though this tutorial will provide a script to fully automate the previous tutorials.

# The Script

This script goes through the process of provisioning Azure Resources, setting up a CI/CD pipeline utitlizing Azure DevOps, and configuring Flux.

```bash
# BEFORE RUNNING
# Set Environment Variables
# export TF_VAR_AZDO_PERSONAL_ACCESS_TOKEN=<Personal Access Token>
# export AZDO_ORG_SERVICE_URL=https://dev.azure.com/dev-developer
# export GITHUB_TOKEN=

# GIT variables
GITHUB_USER="barnacleDevelopments"

# Define Flux Variables
FLUX_REPO_NAME="flux-config"
FLUX_BRANCH="master"
FLUX_COMPONENTS="image-reflector-controller,image-automation-controller"
FLUX_CLUSTER_NAME="app-cluster"

# Define node-ts-api variables
NODE_TS_API_BRANCH="version_3"
NODE_TS_API_NAME="node-ts-api"
NODE_TS_API_GIT_URL="https://github.com/barnacleDevelopments/node-ts-api-kubernetes"
NODE_TS_API_INTERVAL="1m"

# Azure Variables
AZ_RS_GROUP="KubernetesTest"
AZ_AKS_NAME="devdeveloper-aks-cluster"
AZ_SUBSCRIPTION_ID="59966e90-8185-44af-a00c-13bc237e59cb"

# DEPLOY RESOURCES
cd ./iac
terraform apply
cd ../

AKS_OBJECT_ID=$(az aks show --resource-group $AZ_RS_GROUP --name $AZ_AKS_NAME --query "identityProfile.kubeletidentity.objectId" -o tsv)

az role assignment create \
    --assignee $AKS_OBJECT_ID \
    --role "AcrPull" \
    --scope "/subscriptions/$AZ_SUBSCRIPTION_ID/resourceGroups/KubernetesTest/providers/Microsoft.ContainerRegistry/registries/devdeveloperregistry"

az aks get-credentials --resource-group KubernetesTest --name devdeveloper-aks-cluster

# CONFIGURE FLUX
flux bootstrap github \
  --owner=$GITHUB_USER \
  --repository=$FLUX_REPO_NAME \
  --branch=$FLUX_BRANCH \
  --path="./clusters/$FLUX_CLUSTER_NAME" \
  --personal \
  --components-extra=$FLUX_COMPONENTS \
  --read-write-key=true

git clone "git@github.com:$GITHUB_USER/$FLUX_REPO_NAME.git"

cd $FLUX_REPO_NAME

flux create source git flux-kubernetes-app \
  --url=$NODE_TS_API_GIT_URL \
  --branch=$NODE_TS_API_BRANCH \
  --interval=$NODE_TS_API_INTERVAL \
  --export > ./clusters/$FLUX_CLUSTER_NAME/flux-node-ts-api-source.yaml

cat ../flux-config.yaml > ./clusters/$FLUX_CLUSTER_NAME/flux-node-ts-api-source.yaml

flux create kustomization flux-kubernetes-app \
  --target-namespace="default" \
  --source=$NODE_TS_API_NAME \
  --path="./manifests/overlays/prod" \
  --prune="true" \
  --wait="true" \
  --interval="30m" \
  --retry-interval="2m" \
  --health-check-timeout="3m" \
  --export > ./clusters/$FLUX_CLUSTER_NAME/flux-node-ts-api-kustomization.yaml

kubectl create secret generic flux-git-auth --namespace flux-system --from-literal=username=barnacleDevelopments --from-literal=password=$GITHUB_TOKEN

git add -A && git commit -m "Add flux-kubernetes-test Kustomization"
git push
cd ../
rm -r $FLUX_REPO_NAME

```

##
