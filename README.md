# Content Writer Website (Work In Progress)

A full-stack content writer website: blog, admin area, portfolio, contact, resume builder, and CMS-style content management. This README summarizes the project, organized by feature and architecture.

## Table of Contents

- [Overview](#overview)
  - [Introduction](#introduction)
  - [Features](#features)
- [Pages & Functionality](#pages--functionality)
  - [Homepage](#homepage)
  - [Blog / Post Editor (Admin)](#blog--post-editor-admin)
  - [Admin Area](#admin-area)
  - [Resume Page](#resume-page)
  - [Portfolio Page](#portfolio-page)
  - [Shared / Infrastructure Features](#shared--infrastructure-features)
- [Architecture](#architecture)
- [My Process](#my-process)
  - [Built With](#built-with)
  - [What I Learned](#what-i-learned)
  - [Continued Development](#continued-development)
- [To Do](#to-do)
- [Author](#author)

---

## Overview

### Introduction

This repository contains the full-stack code for a content writer site that supports publishing posts with images, admin management, a resume builder, and a portfolio section. The focus is on **smooth writing UX**, **robust image handling**, and **manageable admin controls**.

### Features

Users should be able to:

- View a homepage with author intro, services, and featured portfolio.
- Browse blog posts with pagination and cover images.
- Create, edit, delete posts, and access unpublished and published post (if granted admin-access only).
- Rich-text editor with inline/bubble menu, image insertion, and drafts.
- Upload images (Cloudinary) with orphan-image cleanup (triggered on delete/update/clear draft).
- Generate resumes with experience management (CRUD + client-side print/export).
- View portfolio articles and contact the author.
- Protect admin routes with authentication and role checks (NextAuth + Google).

---

## Pages & Functionality

### Homepage

![homepage](/public/readme/home.gif)

- Hero area with author intro and contact button.  
- About me section, featured portfolio, services offered, and CTA.  
- General header & footer (shared across site) with minimal navigation and social links.  
- Accessible focus/hover states and semantic HTML.  
- Animations handled with Framer Motion.  

---

### Blog / Post Editor (Admin)

<div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: center; margin: auto; width: 100%; gap: 6px">
  <img width="200" alt="new post"
  src='https://raw.githubusercontent.com/Hikmahx/sarah-yousuph/refs/heads/main/public/readme/new-post.gif'
  />
  <img width="200" alt="admin blog"
  src='https://raw.githubusercontent.com/Hikmahx/sarah-yousuph/refs/heads/main/public/readme/admin-blog.gif'
  />
  <img width="200" alt="blog page"
  src='https://raw.githubusercontent.com/Hikmahx/sarah-yousuph/refs/heads/main/public/readme/blog.gif'
  />
  <img width="200" alt="blog post"
  src='https://raw.githubusercontent.com/Hikmahx/sarah-yousuph/refs/heads/main/public/readme/blog-post.gif'
  />
</div>

> **Note:** The post editor is part of the Admin Area (see Admin Area section). The editor uses `Tiptap` and provides a bubble/inline menu, image insertion, and drafts. Blog posts are displayed using **tailwind/typography prose** for clean formatting.

- **Post listing**
  - Paginated posts to prevent heavy initial loads.
  - Post previews include title, excerpt, author, published date, and cover image.

- **Image handling**
  - Cloudinary for image uploads and delivery.
  - Images can be deleted when a post is deleted, updated, or a draft is cleared.  

- **Editor features**
  - `Tiptap` rich-text editor with inline/bubble menu: bold, italic, links, headings, lists, code blocks, images.
  - Image insertion supports drag-and-drop upload and validated image URLs.
  - Draft storage persisted via `localStorage`.

---

### Admin Area

> The admin area contains the primary blog creation tools and dashboard. It has a base listing page and dedicated pages for creating and editing posts with unique slugs.

- **Admin base page**
  - Displays draft and published posts.
  - Each post includes a **3-column popover** with:
    - **Edit** — opens edit page.  
    - **Delete** — confirmation dialog.  
    - **View Post** — opens public post.  

- **Admin new/page**
  - Dedicated page to create a new post.  

- **Admin edit/page**
  - Edit specific draft/published post.  
  

- **Admin UX**
  - Toast notifications for save/publish/delete results.  
  

---

### Resume Page

![homepage](/public/readme/resume.gif)

- CRUD for experiences: organization, position, location, dates, responsibilities.
- Timeline layout with date markers.
- Experiences stored in Prisma DB.  
- Resume generation via `react-to-print`.

---

### Portfolio Page

![portfolio](/public/readme/portfolio.gif)

- Simple showcase of articles on different platforms.  
- Displays title, excerpt, and link to each article.  

---

### Shared / Infrastructure Features

- **Prisma** — blog CRUD (admin) and experience CRUD (resume).  
- **NextAuth + Google** — authentication with Prisma user integration.  
- **General header & footer** across site.  
- **Toasts & pagination** in key areas.  
- **Cloudinary** for image lifecycle.  

---

## Architecture

- **Image lifecycle** — temp upload → permanent on save → delete on post delete/update/clear draft.  
- **Draft persistence** — stored in `localStorage` (cleared on save).  
- **Prisma models** — User, Post, Tag, Experience, Asset.  
- **Auth flow** — Google login + role-based admin protection.  

---

## My Process

### Built With

- Semantic HTML5 markup  
- Mobile-first workflow  
- [React](https://reactjs.org/) - JS library  
- [Next.js](https://nextjs.org/) - React framework  
- [Tailwindcss](https://tailwindcss.com/) - CSS framework  
- [Tailwind Typography](https://tailwindcss-typography.vercel.app/) - Blog prose  
- [shadcn/ui](https://ui.shadcn.com/) - UI components  
- [Framer Motion](https://www.framer.com/motion/) - Animations  
- [Ionicons](https://ionicons.com) - Icons  
- [Prisma](https://www.prisma.io/) - ORM  
- [Cloudinary](https://cloudinary.com) - Image hosting & CDN  
- [NextAuth.js](https://next-auth.js.org/) - Authentication  
- [react-to-print](https://www.npmjs.com/package/react-to-print) - Resume export  
- [Vercel](https://vercel.com/) - Deployment  

---

### What I Learned

- Handling image lifecycle (upload, cleanup).  
- Rich-text editor integration with Tiptap.  
- Draft persistence with localStorage.  
- Admin dashboards with toast feedback and pagination.  

---

### Continued Development

- Improve SEO (structured data, OG, meta tags).  
- Add blog categories.  
- Revision history for posts.  
- Asset management UI.  
- Server-side resume PDF generation.  

---

## To Do

- [ ] Contact Page  
- [ ] Cron job for orphan-image cleanup  
- [ ] Blog categories  
- [ ] SEO improvements  
- [ ] Blog comments & likes feature


---

## Author

👩‍💻 **Hikmah Yousuph**  
- Portfolio: [Hikmah Yousuph](https://hikmah-yousuph.vercel.app)  
- GitHub: [Hikmahx](https://github.com/Hikmahx)  
- Email: [hikmayousuph@gmail.com](mailto:hikmayousuph@gmail.com)  
- LinkedIn: [linkedin.com/in/hikmah-yousuph](https://linkedin.com/in/hikmah-yousuph)  
