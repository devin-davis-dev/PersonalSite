---
title: Content Disposition Header
thumbnail: assets/logo_2.png
date: 2024-04-22T19:31:21.081Z
keywords: content disposition header, pdf, stop download
category: programming
draft: false
---

I have been working on a PDF download feature for BrewersInsight. We have created a PDF generation service that takes in data to generate a _Bill of Ladding_. The service first generates a PDF then stores it in a Azure Storage Account and create a URL to access it.

```typescript
function generateSASUri(name: string) {
  const blockBlobClient: any = pdfStoreClient.getBlockBlobClient(name);

  // Define the permissions and expiration time for the SAS token
  const sasTokenExpires = new Date();
  sasTokenExpires.setMinutes(sasTokenExpires.getMinutes() + 60); // Set the expiration time (e.g., 1 hour from now)
  const permissions = new BlobSASPermissions();
  permissions.read = true; // Allow read access

  // Generate the SAS token
  const sasQueryParameters = generateBlobSASQueryParameters(
    {
      containerName: pdfStoreClient.containerName,
      blobName: name,
      startsOn: new Date(),
      expiresOn: sasTokenExpires,
      permissions,
      contentDisposition: "inline",
    },

    //@ts-ignore
    new StorageSharedKeyCredential(
      blobServiceClient.accountName,
      blobServiceClient.credential.accountKey,
    ),
  );

  // Combine the SAS token with the blob URL to create the complete URL
  const blobUrlWithSAS = `${blockBlobClient.url}?${sasQueryParameters}`;
  console.log(
    "🚀 ~ file: generatePdf.ts:406 ~ generateSASUri ~ blobUrlWithSAS:",
    blobUrlWithSAS,
  );

  return blobUrlWithSAS;
}
```

I had small headache figuring out why [Chromium](https://www.chromium.org/Home/) browsers were prompting the user to save the PDF when I had explicitly set the [Content Disposition](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition) header to _inline_. What was most troubling was that I was not having this issue while using the Firefox browser.

The solution has to also set the [_Content Type_](https://developer.mozilla.org/en-US/docs/Web/SVG/Content_type) header to application/pdf.

```typescript
const sasQueryParameters = generateBlobSASQueryParameters(
  {
    containerName: pdfStoreClient.containerName,
    blobName: name,
    startsOn: new Date(),
    expiresOn: sasTokenExpires,
    permissions,
    contentDisposition: "inline",
    contentType: "application/pdf", // <==== HERE!
  },

  //@ts-ignore
  new StorageSharedKeyCredential(
    blobServiceClient.accountName,
    blobServiceClient.credential.accountKey,
  ),
);
```

After that everything started to work as expected!
