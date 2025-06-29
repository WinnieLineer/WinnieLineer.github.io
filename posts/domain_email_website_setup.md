---
title: 用 NT\$37 擁有自己的網域、信箱與個人網站
date: 2025-06-28
description: 教你用超佛價格（只要 NT$37！）快速建立自有網域、信箱轉寄、自架網站，完全適合新手，無需寫程式！ 
tags: [網域設定, 信箱轉寄, GitHub Pages, 個人品牌, 網頁架站, DNS 教學]
---

沒錯你沒看錯，只要一杯手搖的價格，就能：

- 擁有個人網域（像 `winnie-lin.space`）
- 使用自己的信箱收信寄信（像 `hi@winnie-lin.space`）
- 架設個人網站（完全免費）

每月不用繳主機費，流程簡單，保證新手也能快速上手：

---

## 第一步：購買網域（首年只要 NT\$37）

前往 [GoDaddy](https://www.godaddy.com/)，搜尋 `.space` 網域，例如 `winnie-lin.space`，通常首年只要 NT\$37！

> ⚠️ 注意：續約價格會跳漲，若只是想先試試水溫，建議關閉自動續約。

購買後記得把「DNS 設定頁面」加書籤，接下來會用到。

---

## 第二步：免費信箱轉寄（ImprovMX）

### 到 [improvmx.com](https://improvmx.com) 註冊

- 加入你的網域 `winnie-lin.space`
- 設定轉寄到 Gmail 等收信帳號

### 回到 GoDaddy 設定 DNS

新增以下紀錄：

- **MX 紀錄**：`mx1.improvmx.com`（優先順序 10）
- **MX 紀錄**：`mx2.improvmx.com`（優先順序 20）
- **TXT/SPF**：`v=spf1 include:improvmx.com include:_spf.google.com ~all`

這樣設定好之後，你就可以接收到寄到 `hi@winnie-lin.space` 的郵件囉！

---

## 第三步：用 Gmail 發信但顯示你的網域信箱

想要寄信時也顯示 `hi@winnie-lin.space` 嗎？照這樣設定就可以：

1. 開啟 Gmail → 設定 → 查看所有設定 → 帳戶與匯入
2. 找到「以其他地址寄信」→ 點「新增其他電子郵件地址」
3. 名稱隨便填（例如 Winnie）
4. 電子郵件：`hi@winnie-lin.space`
5. SMTP 伺服器：`smtp.improvmx.com`，Port：587
6. 使用者名稱：`hi@winnie-lin.space`，密碼：從 ImprovMX 取得

完成後，你在 Gmail 發信時就能選擇這個漂亮的寄件人信箱囉！

---

## 第四步：用 GitHub Pages 架設免費個人網站

### 建立 GitHub Repo

- 命名為 `blog` 或 `portfolio` 都可以
- 上傳你的網站檔案（HTML、CSS），或用 VitePress、Astro、Jekyll 等工具產生靜態網站

### 開啟 GitHub Pages 功能

- 到 Repo 的「Settings → Pages」
- 選擇來源分支與資料夾
- 你會拿到一個網址，例如 `https://yourusername.github.io/blog/`

---

## 第五步：把網站綁到 `blog.winnie-lin.space`

### 在專案根目錄加上 CNAME 檔案

內容就只有一行：

```
blog.winnie-lin.space
```

### 回到 GoDaddy 設定 CNAME 紀錄

新增一筆：

- 名稱：`blog`
- 目標：`yourusername.github.io`

這樣一來，你的網站就可以用 `blog.winnie-lin.space` 存取囉！

---

## 第六步：開啟 HTTPS 加密連線

GitHub Pages 會自動幫你產生 SSL 憑證，只要：

- 回到 Repo Settings → Pages
- 勾選「Enforce HTTPS」

就會看到網址變成 https 開頭，瀏覽器也會顯示安全鎖頭！

---

## 總結：你完成了這些！

- ✅ 買到 NT\$37 超便宜網域
- ✅ 設定好收信與 Gmail 寄信
- ✅ 架好免費網站
- ✅ 綁定網域 + HTTPS 安全憑證

從今天開始，不只擁有個人品牌，也能用專業信箱寄履歷、接案、寫技術部落格，一條龍搞定！

---

覺得太簡單想挑戰進階玩法？下一篇我們會介紹 Astro、VitePress 架站技巧，敬請期待！
