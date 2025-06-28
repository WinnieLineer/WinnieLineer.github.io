---
title: How to Set Up Your Own Domain, Email, and Website for Free
date: 2025-06-28
description: A step-by-step guide to using GoDaddy, ImprovMX, and GitHub Pages to create a custom domain email and personal website with zero hosting fees.
tags: [Web Development, Domain Setup, Email Configuration, GitHub Pages, Free Hosting, DNS Configuration, Tutorial, Personal Branding]
---

Want your own domain, a custom email like `hi@yourdomain.com`, and a professional-looking website—all without paying for web hosting? This guide walks you through everything from domain purchase to email forwarding and site deployment using free tools.

---

## Step 1: Buy a Domain

Use a registrar like [GoDaddy](https://www.godaddy.com/) to buy a domain. It's beginner-friendly and offers low first-year prices. A few tips:

- Renewal cost increases significantly after the first year
- Disable **auto-renewal** if you don't plan to keep it
- Bookmark the DNS settings page—you'll likely return to it multiple times during setup

---

## Step 2: Free Email Forwarding with ImprovMX

### 2.1 Register at [improvmx.com](https://improvmx.com)
- Add your domain (e.g., `yourdomain.com`)
- Set your destination email (e.g., Gmail)

By doing this, you can receive emails sent to your custom domain directly in your Gmail inbox.

### 2.2 Update DNS Records in GoDaddy
Add the following DNS records:

- **MX Record 1**
  - Type: MX
  - Name: @
  - Value: `mx1.improvmx.com`
  - Priority: 10

- **MX Record 2**
  - Type: MX
  - Name: @
  - Value: `mx2.improvmx.com`
  - Priority: 20

- **TXT Record (SPF)**
  - Type: TXT
  - Name: @
  - Value: `v=spf1 include:improvmx.com include:_spf.google.com ~all`

**Why this matters:**
- **MX (Mail Exchange) records** determine where emails for your domain should be delivered. Lower numbers have higher priority—so emails will first attempt to deliver via `mx1.improvmx.com`; if that fails, `mx2.improvmx.com` will be used.
- **TXT/SPF records** help verify that mail sent from your domain is legitimate, reducing the chance it ends up in spam or gets blocked.
---

## Step 3: Host a Free Website with GitHub Pages

### 3.1 Create a GitHub Repository
- Name it `Blog`, `Site`, or anything meaningful

### 3.2 Upload Your Site
- Use static files (like HTML/CSS) or a site generator such as Jekyll, VitePress, or Astro
- *(I'll create another guide to walk through site generators step by step)*

### 3.3 Enable GitHub Pages
- Go to **Settings → Pages** in your repository
- Select the branch and folder to publish from
- GitHub will give you a public URL like `https://yourusername.github.io/yourrepo/`

---

## Step 4: Connect a Custom Domain

### 4.1 Add a `CNAME` File to Your Repo
In your deployed site folder (usually root or `docs`), add a file named `CNAME`:
```
blog.yourdomain.com
```

### 4.2 Update GoDaddy DNS
Add a CNAME record:
- Name: `blog`
- Value: `yourusername.github.io`

**Why this matters:**
- The `CNAME` record tells DNS to point your custom domain (e.g., `blog.yourdomain.com`) to your GitHub Pages site.
- Without it, your browser won’t know how to resolve your domain to the GitHub-hosted site.

---

## Step 5: Enable HTTPS

GitHub Pages will automatically issue an SSL certificate for your custom domain. Just:
- Go to **Settings → Pages**
- Enable **"Enforce HTTPS"**

**Why this matters:**
- HTTPS encrypts communication between your site and your visitors
- It boosts credibility, improves SEO, and ensures your site isn’t flagged as “Not Secure” by browsers

---

## Wrap-up

You've now successfully:
- ✅ Registered a custom domain
- ✅ Set up a free email forwarder
- ✅ Hosted your own website
- ✅ Connected your domain to GitHub Pages
- ✅ Secured your site with HTTPS

This setup is ideal for developers, freelancers, and job seekers. You can now own your personal brand online—with no hosting cost at all!
