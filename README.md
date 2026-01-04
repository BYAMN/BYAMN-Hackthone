```md
# BYAMN Hackathon Section – Internship Task

This repository contains the frontend implementation for the **BYAMN Hackathon Section**.  
The goal is to build a dynamic hackathon listing and detail system using **HTML, CSS, and JavaScript**, powered by **Google Sheets via API**.

---

## Objective

Build a deployable frontend website where:

- Hackathons are displayed as cards
- Clicking a card opens a detailed hackathon page
- A “Register” button redirects users to an external platform
- All data is fetched dynamically from Google Sheets

This task represents a real-world production-style frontend feature.

---

## Data Source (API)

All hackathon data must be fetched from the following API:

```

[https://sheetdb.io/api/v1/wosxpgxr0u76m](https://sheetdb.io/api/v1/wosxpgxr0u76m)

```

This API is connected to a Google Sheet that acts as the database.  
The Google Sheet link will be shared later for reference.

---

## Tech Stack

- HTML  
- CSS  
- Vanilla JavaScript  

The project is fully static and can be deployed on GitHub Pages, Netlify, or any static hosting.

---

## Project Structure

```

byamn-hackathons/
│
├── index.html        # Hackathon listing page
├── hackathon.html    # Hackathon detail page
│
├── css/
│   └── style.css
│
├── js/
│   ├── api.js        # API fetch logic
│   ├── listing.js   # Listing page logic
│   └── detail.js    # Detail page logic
│
└── README.md

```

---

## Pages to Build

### 1. Hackathon Listing Page (`index.html`)

This page should:
- Fetch all hackathons from the API
- Display them as responsive cards
- Show:
  - Banner image  
  - Hackathon title  
  - Organizer  
  - Prize pool  
  - Tags  
  - Days left (calculated from deadline)

Clicking a card should redirect to:
```

hackathon.html?slug=hackathon-slug

```

---

### 2. Hackathon Detail Page (`hackathon.html`)

This page should:
- Read the `slug` from the URL
- Fetch data from the API
- Display full details of the selected hackathon:
  - Banner and title
  - Organizer and basic info
  - Team size, mode, deadline
  - About section
  - Stages and timeline
  - Rewards
  - Contact information

The **Register** button should:
- Open the external registration link in a new tab
- Show **“Registrations Closed”** if the deadline has passed

---

## Countdown Logic

Days left must be calculated using the `deadline` field from the API.

Expected behavior:
- Deadline passed → `Closed`
- Deadline today → `Today`
- Otherwise → `X days left`

---

## Contribution Workflow

Before starting work:

1. Create a **GitHub Issue** describing:
   - What you are going to work on
   - Which page or feature you are handling

2. After creating the issue:
   - Start development
   - Commit your changes
   - Open a Pull Request linked to the issue

This ensures clear ownership and avoids duplicate work.

---

## Communication

All discussions, updates, and queries will happen in the **Discord community**.  
The Discord invite link will be shared by the admin.

---

## Expected Outcome

- Fully functional hackathon section
- Data controlled via Google Sheets
- Clean and maintainable frontend code
- Ready-to-deploy static website

---

**BYAMN – Learn. Build. Ship.**
```
