---
title: "NowCut"
description: "A multi-portal SaaS platform for managing barbershop businesses across the UAE, from bookings and barber scheduling to financials. I built features end to end in its Admin and Shop portals."
tech: ["Next.js", "TypeScript", "Tailwind CSS", "Turborepo", "React Query", "nuqs"]
category: ["SaaS", "Marketplace"]
live: "https://nowcut.app"
image: "/now-cutz-logo.svg"
featured: false
order: 6
employer: "IOMechs"
myPart: "I built promo codes, commission tiers, role-based access and bulk service assignment across the Admin and Shop portals."
yearCompleted: 2025
highlights:
  - "Built Promo Codes, Commission Tiers and per-shop Settings end to end, using React Query cache invalidation so the UI stays consistent after every change"
  - "Developed bulk service assignment across both portals, with validation that stops shop managers from continuing without selecting barbers"
  - "Designed role-based access control (Admin, Owner, Manager), including a two-step shop creation form, ownership transfer and a freelance shop type"
  - "Used nuqs for URL-driven filters and pagination, so search results are shareable and survive a refresh"
  - "Extracted reusable components and hooks into shared packages used by both portals"
  - "Added invoice tips distribution and barber availability scheduling, and fixed bugs around cache invalidation, form resets and query parameters"
---

## Overview

NowCut is built as a Turborepo monorepo: two separate Next.js 15 apps, the Admin Portal and the Shop Portal, share packages for types, UI components and utilities, so they stay in sync without duplicated code. The platform covers bookings, barber scheduling, financials and geographic service areas.
