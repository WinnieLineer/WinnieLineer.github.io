---
title: How to Set Up Your Own Domain, Email, and Website for Free
date: 2025-06-28
description: A step-by-step guide to using GoDaddy, ImprovMX, and GitHub Pages to create a custom domain email and personal website with zero hosting fees.
tags: [Web Development, Domain Setup, Email Configuration, GitHub Pages, Free Hosting, DNS Configuration, Tutorial, Personal Branding]
---

Want your own domain, a custom email like `hi@yourdomain.com`, and a professional-looking website—all without paying for web hosting? This guide walks you through everything from domain purchase to email forwarding and site deployment using free tools.

---

## 🛒 Step 1: Buy a Domain

Use a registrar like [GoDaddy](https://www.godaddy.com/) to buy a domain. It's beginner-friendly and offers low first-year prices. A few tips:

- Renewal cost increases significantly after the first year
- Disable **auto-renewal** if you don't plan to keep it

---

## 📩 Step 2: Free Email Forwarding with ImprovMX

### 2.1 Register at [improvmx.com](https://improvmx.com)
- Add your domain (e.g., `yourdomain.com`)
- Set your destination email (e.g., Gmail)

### 2.2 Update DNS Records in GoDaddy
Add the following:
- MX: `mx1.improvmx.com` with priority 10
- MX: `mx2.improvmx.com` with priority 20
- TXT: `v=spf1 include:spf.improvmx.com ~all`

---

## 🌐 Step 3: Host a Free Website with GitHub Pages

### 3.1 Create a GitHub Repository
- Name it `Blog`, `Site`, or similar

### 3.2 Upload Your Site
- Use static files or a site generator like Jekyll/VitePress

### 3.3 Enable GitHub Pages
- Go to Settings → Pages → Select branch/folder → GitHub gives you a public URL

---

## 🔗 Step 4: Connect a Custom Domain

### 4.1 Add a `CNAME` File to Your Repo
```
blog.yourdomain.com
```

### 4.2 Update GoDaddy DNS
Add a CNAME record:
- Name: blog
- Value: yourusername.github.io

---

## 🔒 Step 5: Enable HTTPS

GitHub Pages will auto-generate an SSL certificate. Go to Settings → Pages and enable "Enforce HTTPS."

---

## ✅ Wrap-up

You've now successfully:
- ✅ Registered a custom domain
- ✅ Set up a free email forwarder
- ✅ Hosted your own website
- ✅ Secured your site with HTTPS

Now you can build your online presence with zero hosting cost!
