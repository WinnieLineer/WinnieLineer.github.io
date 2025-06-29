---
title: Set Up Your Own Domain, Email, and Website (for just NT$37!)
date: 2025-06-28
description: Get your own domain email and website set up with just NT\$37 using GoDaddy, ImprovMX, Gmail, and GitHub Pages. Super beginner-friendly! 
tags: [Domain Setup, Email, GitHub Pages, Personal Branding, Website Hosting, DNS]
---

Yup, you're not dreaming. For the price of a latte, you can:

- Own a custom domain (like `winnie-lin.space`)
- Send and receive email using that domain (like `hi@winnie-lin.space`)
- Host a personal website (for free!)

No monthly hosting fee. No complicated tech knowledge required. Just follow these chill steps:

---

## Step 1: Buy a Domain (NT\$37 Deal!)

Go to [GoDaddy](https://www.godaddy.com/) and search for a `.space` domain—like `winnie-lin.space`. First-year price is usually NT\$37!

> ⚠️ Heads-up: Renewal price jumps after the first year. You can disable **auto-renew** if you're just testing the waters.

Also, after buying, bookmark the **DNS Settings** page. You'll need it soon.

---

## Step 2: Free Email Forwarding with ImprovMX

### Register on [improvmx.com](https://improvmx.com)

- Add your domain `winnie-lin.space`
- Forward mail to your Gmail (or other mailbox)

### Update DNS on GoDaddy

Add these records:

- **MX Record**: `mx1.improvmx.com` (priority 10)
- **MX Record**: `mx2.improvmx.com` (priority 20)
- **TXT Record (SPF)**: `v=spf1 include:improvmx.com include:_spf.google.com ~all`

This makes sure you can **receive** emails sent to `hi@winnie-lin.space`.

---

## Step 3: Send Email as `hi@winnie-lin.space` from Gmail

Want to **send** mail using your domain too? Here's how:

1. Open Gmail → Settings → See all settings → Accounts and Import
2. Under **"Send mail as"**, click **"Add another email address"**
3. Name: Anything
4. Email: `hi@winnie-lin.space`
5. SMTP server: `smtp.improvmx.com`, Port: `587`
6. Username: `hi@winnie-lin.space`, Password: (from ImprovMX)

Done! You can now choose `hi@winnie-lin.space` when composing emails.

---

## Step 4: Build a Free Website with GitHub Pages

### Create a GitHub Repo

- Name it `blog` or `portfolio`
- Upload your static site (HTML, CSS) or use generators like VitePress, Astro, or Jekyll

### Enable GitHub Pages

- Go to **Repo Settings → Pages**
- Choose source branch & folder
- GitHub gives you a public URL like `https://yourusername.github.io/blog/`

---

## Step 5: Connect to `blog.winnie-lin.space`

### Add a CNAME file

In your project’s root folder:

```
blog.winnie-lin.space
```

### Update DNS in GoDaddy

Add a CNAME Record:

- Name: `blog`
- Value: `yourusername.github.io`

This links `blog.winnie-lin.space` to your GitHub-hosted site.

---

## Step 6: Enable HTTPS

GitHub handles SSL for you:

- Go to **Repo Settings → Pages**
- Check **"Enforce HTTPS"**

Secure, credible, and browser-safe.

---

## Wrap-up: You Did It!

Let’s recap. You now:

- ✅ Bought a custom domain for NT\$37
- ✅ Set up Gmail-compatible email with your domain
- ✅ Hosted a free website
- ✅ Linked it to your custom domain
- ✅ Secured everything with HTTPS

Ready to show off your personal brand like a boss?

Share your site, send your resume from your fancy new email, and enjoy being the tech-savvy superstar you are.

---

Still confused? Want help using VitePress, Astro, or writing blog posts? Stay tuned for part 2!

