---
title: Azure Pipelines Uploading Project Source File to Storage Account
thumbnail: assets/logo_2.png
date: 2024-07-2T19:31:21.081Z
keywords: azure, file access, storage account, blob storage, build.sourcedirectory
draft: false
category: devops
---

Here is another hair pulling issue I had while working with Azure Pipelines. We have this API project where I have been writing public documentation for. We are using [Rapidoc](https://rapidocweb.com/): a quick solution to whip up API documentation that follows the OpenAPI specification. To use it you simply create a html document and plug in the CDN and a html code snippet and you are off to the races. The documentation is for a Azure function app I have been building. What I wanted is to be able to write the YAML spec and the HTML template within the same repository as the function app and when it gets deployed through azure, I can automatically upload the html to a [blob storage account](https://azure.microsoft.com/en-us/products/storage/blobs) to serve it. As you may have guessed I ran into a snag...

The problem I ran into was trying to access the sources files of my azure function app during the pipeline process. I created a task to upload the documentation yaml spec file and the rapidoc html file. I needed to use a Azure CLI command because my function app is running in a Linux environment and does [not support the file copy functionality in azure pipelines](https://zimmergren.net/azure-devops-vsts-current-operating-system-not-capable-of-running-this-task-linux/).

```yaml
- task: AzureCLI@2
  displayName: "Upload rapidoc.html"
  inputs:
    azureSubscription: "<subscription>"
    scriptType: "bash"
    scriptLocation: "inlineScript"
    inlineScript: |
      az storage blob upload \
      --account-name documentation \
      --container-name '$web' \
      --name rapidoc.html \
      --file "$(Build.SourcesDirectory)/documentation/rapidoc.html"
```

Great that should work as is right? Well it did not and the reason was hard to find. In order to access the files of the Build.SourcesDirectory you actually need to checkout the source repository during the process.

```yaml
steps:
  - checkout: self <== ADD THIS HERE
  - task: AzureCLI@2
    displayName: "Upload rapidoc.html"
    inputs:
      azureSubscription: "<subscription>"
      scriptType: "bash"
      scriptLocation: "inlineScript"
      inlineScript: |
        az storage blob upload \
        --account-name documentation \
        --container-name '$web' \
        --name rapidoc.html \
        --file "$(Build.SourcesDirectory)/documentation/rapidoc.html"
```

This allows the pipeline process to gain access to the original source files. I hope that helps!
