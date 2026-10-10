---
title: Bevel All-In-One Tutorial
thumbnail: assets/logo_2.png
date: 2024-12-09T15:13:45.129Z
keywords: "hyperledger fabric, hyperledger bevel"
category: hyperledger
draft: true
---

I started learning about Hyperledger Bevel and I wanted to provide an all-in-one tutorial covering a basic development setup. I'll later write a tutorial for a production setup which I will link to here.

## What is Bevel?

Hyperledger Bevel is a deployment framework for permissioned blockchains. Its aim is to facilitate the process of complex production deployments for frameworks like Hyperledger Fabric. One of the main stunting factors affecting the adoption of permissioned blockchains is that they are inherently difficult to deploy and manage. Any effort to make this deployment process easier will be necessary to increase adoption.

## What is this Tutorial for?

This tutorial is quick and dirty reference for setting up a local development environment with Bevel. If you want to setup your environment on a VM The documentation provided by Hyperledger is thorough and I recommend going through it. For those who don't want to navigate multiple different pages to get a development environment setup, I have created this tutorial. I will leave links throughout to different resources so that you can learn how Bevel works. You're welcome!

## Step 1: Setup Virtual Machine with Minikube

1. Download ISO for Ubuntu 20.04.

2. Download Virtual Box or a preferred virtual environment.

3. Setup a machine with 16gb of ram, 8 vcpu and public IP address (so you can access your Kubernetes Cluster from your host machine).

4. For steps 1.a through 1.f run all commands inside the VM.

### Step a: Setup a project directory

1. This is the directory that we will be working out of going forward. I have named it `bevel-sample-project` but you can name it whatever you want.

```bash
mkdir bevel-sample-project/bin
mv vault bevel-sample-project/bin
export PATH=./bevel-sample-project/bin:$PATH
```

### Install Dependencies

### Step b: Setup Hashi Vault

1. Install the binnary for Hashi Vault: https://www.vaultproject.io/downloads/

2. Create a config.hcl file inside the `bevel-sample-project` directory.

```
echo "ui = true
storage "file" {
   path    = "./project/data"
}
listener "tcp" {
   address     = "0.0.0.0:8200"
   tls_disable = 1
}" > config.hcl
```

3. start the vault server.

```bash
vault server -config=config.hcl
```

4. Navigate to http://localhost:8200/.

5. Enter "1" for Key Shares, enter "1" for Key Threshold, and press initialize.

6. Click copy the keys. Then click Continue to Unseal. Provide the unseal key first and then the root token to login. Keep a copy of these keys for later reference.

7. Get your local IP Address for Vault. Follow [this guide](https://www.avast.com/c-how-to-find-ip-address) to get your machine's local IP Address.

8. In a new terminal, execute the following :

```bash
export VAULT_ADDR='http://<Your Vault local IP address>:8200' #e.g. http://192.168.0.1:8200
export VAULT_TOKEN="<Your Vault root token>"
```

9. Enable Secrets v2 (assuming the vault is in your [PATH](https://opensource.com/article/17/6/set-path-linux))

```bash
   vault secrets enable -version=2 -path=secretsv2 kv
```

10. Visit the documentation and [take the basic tutorial](https://developer.hashicorp.com/vault/tutorials/get-started).

## Step c: Setup Minikube

1. Install Minikube

```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube && rm minikube-linux-amd64
```

2. Start minikube instance on your machine

```bash
minikube start --memory 12000 --cpus 4 --kubernetes-version=1.23.1 --apiserver-ips=<specify public ip of VM>
```

3. [Visit the documentation](https://minikube.sigs.k8s.io/docs/start/?arch=%2Flinux%2Fx86-64%2Fstable%2Fbinary+download).

## Step d: Fork Bevel

1. The bevel repository contains all the necessary files for you to work with Bevel

```bash
git clone https://github.com/hyperledger-bevel/bevel
```

2. Create a local branch for bevel

```
cd bevel
git checkout develop # to get latest code
git pull
git checkout -b local
git push --set-upstream origin local
```

3. [Visit the documentation](https://hyperledger-bevel.readthedocs.io/en/latest/).

### Step e: Setup Bevel

1. Create a build folder inside your Bevel repository:

```bash
mkdir build
Copy ca.crt, client.key, client.crt from ~/.minikube to build:
```

```bash
cp ~/.minikube/ca.crt build/
cp ~/.minikube/profiles/minikube/client.key build/
cp ~/.minikube/profiles/minikube/client.crt build/
```

2. Copy ~/.kube/config file to build:

```bash
cp ~/.kube/config build/
```

3. Get minikube server ip

```bash
minikube ip
```

4. Open the above config file in build directory and update file path for certificate-authority (CA), client-certificate (CC) and client-key (CK) to point to the respective files copied in build directory. Also replace the server address with the ip you got from running `minikube ip`.

```yaml
apiVersion: v1
clusters:
  - cluster:
      certificate-authority: ca.crt <======= REFERENCE CA PATH (same directory)
      extensions:
        - extension:
            last-update: Mon, 09 Dec 2024 13:06:47 EST
            provider: minikube.sigs.k8s.io
            version: v1.34.0
          name: cluster_info
      server: https://192.168.59.105:8443 <= ADD SERVER ADDRESS
    name: minikube
contexts:
  - context:
      cluster: minikube
      extensions:
        - extension:
            last-update: Mon, 09 Dec 2024 13:06:47 EST
            provider: minikube.sigs.k8s.io
            version: v1.34.0
          name: context_info
      namespace: default
      user: minikube
    name: minikube
current-context: minikube
kind: Config
preferences: {}
users:
  - name: minikube
    user:
      client-certificate: client.crt <==== REFERENCE CC PATH (same directory)
      client-key: client.key <============ REFERENCE CK PATH (same directory)
```
