---
title: Content Security Policy
thumbnail: assets/csp.webp
date: 2021-12-14T19:31:21.081Z
keywords: content security policy, html standard, XSS attack, headers, cors, csp
draft: false
category: programming
---

Content Security Policy (CSP) is a Hyper Text Transfer Protocol (HTTP) header
that is sent to the browser and controls what resources can be retrieved from
other domains. Websites today use external resources to style pages, change
fonts and run libraries etc. As a web developer, it is important to understand
CSP to secure your sites and prevent malicious attacks like Cross Site
Scripting (XSS).

## What you should know

Before learning about CSP you should know the following:

- What HTTP headers are and their general purpose.

- Some experience working in the server environment.

- The various types of HTTP requests that exist (POST, GET …).

- APIs.

- The Document Object Model (DOM).

- Express middleware (optional).

## Why CSP?

This protocol was primarily implemented to prevent cross site scripting attacks. In short, it prevents other sites from executing scripts on your domain which can lead to data leaks. These kinds of attacks should be guarded against and that’s where CSP comes in.

### Example:

One type of XSS attack named “Stored XSS” occurs when a form is submitted. Let us say an attacker visits your blog, signs up for an account, and posts a comment on one of your articles. Further, they decide to embed a script inside their comment. Consequently, that comment is appended to your website using innerHTML thus allowing the script to be embedded in your page. This could do all kinds of no good, therefore should be avoided.

## The difference between CORS & CSP

Cross Origin Resource Sharing (CORS) is another HTTP header that can be confused with CSP. The CORS header specifies if one origin can perform requests to another origin, while CSP is concerned with what resources can be loaded from other sites.

### Example:

CORS is enforced by the servers and not the browser. With that in mind, let us say we have blog website that uses an Application User Interface (API) to retrieve its posts. When the blog page (origin A) requests data from the API (origin B), the API sends back an Access-Control-Allow-Origin header with the allowed origins. If it matches the origin of the request, the response will also include the requested resource. However, if the origin is not permitted to access the resource, the server's response would not contain the request resource.

Now, CSP is enforced by the browser and not the server. Instead of acting as a gate like CORS, CSP behaves like a wall preventing any unwanted resources from running in the browser through a particular web-page. So if a web-page contains a JavaScript script that is not part of the CSP it will simply not run. All in all, CORS is concerned with the origin of requests and CSP is concerned with the trustworthiness of a resource.

## Configuring CSP

Configuring a CSP policy is different for every site, therefore careful attention should be made to ensure proper implementation. To add a policy developers must use multiple directives which specify the type and location of particular resources. A list of directives can be found at netsparker’s website but here are a few examples:

- object-src

- default-src

- script-src

- style-src

- connect-src

- font-src

As you can see each directive name specifies a resource type. These resources could include images, scripts, videos, or style-sheet etc. The values of each of these directives can be multiple sites or a few different pre-defined values. One of which is ‘self’ (with single quotes) which allows only resources from the same origin.

## Implementing Directives

There are a few different ways of implementing a CSP policy. Here are a few ways:

### Meta Tag Method

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src  'self'; script-src ‘unsafe-inline’"
/>
```

The first attribute (http-equiv) states which HTTP header is being used and the content attribute states which directives to use. By the way, each directive together with its values are separated by semi colons.

### Server Method

The server method can differ depending on what kind of backend is being used i.e. php or NodeJs etc. In NodeJs, convenient way of implementing it is by using a middleware called Helmet. Helmet pre-configures many other HTTP headers buts also allows you to customize them. Here is an example configuration for CSP:

```javascript

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: \["'self'"],
      scriptSrc: \["'self'", "https://example.com"],
      objectSrc: \["'none'"],
    },
  })
);

```

## Conclusion

CSP is an important security header that should be included in any website whenever possible. Without it, there are high chances that an XSS attack can occur. Take the time to read about this HTTP header before going live with your new web app or website.
