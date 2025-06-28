---
title: 如何擁有自己的網域、收信信箱與個人網站（免費架設教學）
date: 2025-06-28
description: 教你如何使用 GoDaddy + ImprovMX + GitHub Pages 來免費建立專屬信箱與個人網站。
tags: [網頁開發, 網域設定, 信箱配置, GitHub Pages, 免費主機, DNS設定, 教學指南, 個人品牌]
---

想擁有一個專屬的網域，讓你能使用像 `hi@你的網域` 的信箱、擁有個人網站嗎？這篇文章將一步步教你，如何以最省錢的方式完成整個技術設定，無需付主機費，也能擁有完整的網站與收信信箱功能。

---

## 🛒 Step 1: 購買網域

你可以透過 [GoDaddy](https://www.godaddy.com/) 購買網域，它是常見的網域註冊商之一。GoDaddy 第一年的價格相對便宜，適合新手入門。不過請注意：

- 第二年起價格會提高。
- 若不打算續用，記得**關閉自動續約**功能。

---

## 📩 Step 2: 免費收信信箱（使用 ImprovMX）

### 2.1 註冊帳號
- 前往 [improvmx.com](https://improvmx.com)
- 設定轉寄地址，例如 Gmail

### 2.2 GoDaddy DNS 設定：
新增：
- MX: `mx1.improvmx.com`, 優先順序 10
- MX: `mx2.improvmx.com`, 優先順序 20
- TXT: `v=spf1 include:spf.improvmx.com ~all`

---

## 🌐 Step 3: GitHub Pages 免費網站

### 3.1 建立 GitHub Repository
- 命名為 `Blog` 或 `Portfolio`

### 3.2 上傳網站內容
- 可用靜態網頁、VitePress、Jekyll 產生網站內容

### 3.3 啟用 GitHub Pages
- 設定 → Pages → 選擇分支與資料夾 → 產出網址

---

## 🔗 Step 4: 綁定自訂網域

### 4.1 GitHub Repo 中新增 CNAME 檔案
```
blog.winnie-lin.space
```

### 4.2 GoDaddy 設定 DNS
新增 CNAME：
- Name: blog
- Value: yourusername.github.io

---

## 🔒 Step 5: 啟用 HTTPS

等候 GitHub 自動產生 SSL 憑證 → 設定中啟用 Enforce HTTPS

---

## ✅ 結語

你現在已完成：
- ✅ 擁有自訂網域
- ✅ 免費信箱轉寄服務
- ✅ GitHub Pages 網站
- ✅ 網域綁定與 HTTPS

讓我們用最少成本，打造最專業的個人品牌！
