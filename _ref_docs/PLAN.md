# Project Plan: Customized Responsive Landing Page

## 1. Project Overview
This project aims to build a **Customized Responsive Landing Page** system. It will utilize the data collected and processed (email addresses + research data) from the existing `irunica_together_emailsender` system to generating personalized web experiences for each potential lead.

## 2. Core Objective
- **Personalization**: The landing page content updates dynamically based on the visitor (identified via URL parameter or ID).
- **Data Integration**: Connects to the existing Google Sheets database to pull research insights and lead details.
- **Responsiveness**: A mobile-first, high-quality "Premium" design that looks perfect on all devices.

## 3. Recommended Architecture

### Option A: Dynamic Single Page Application (Recommended)
Instead of creating hundreds of static HTML files, we build **one** intelligent application.
*   **How it works**:
    1.  The User visits `yoursite.com/?id=lead_123` or `yoursite.com/welcome?email=CEO@target.com`
    2.  The App reads the `id`; locally or via API to fetch the specific row from Google Sheets.
    3.  The App renders a custom headline (e.g., "Hello [Company Name] CEO!"), shows the specific research data we found about them, and presents a tailored proposal.
*   **Tech Stack**:
    *   **Framework**: Vite + React (Best for handling dynamic data state).
    *   **Styling**: Vanilla CSS (CSS Modules) for a unique, premium look (Glassmorphism, Animations).
    *   **Data**: Google Sheets API (via a secure backend or proxied function to protect keys).

### Option B: Static Site Generation (SSG)
If we need extreme speed or offline capabilities, we can generate a static `.html` file for every single lead.
*   **Pros**: Very fast loading, no database calls on load.
*   **Cons**: Harder to update. If you fix a typo, you have to regenerate 1000 files.

## 4. Execution Steps
1.  **Environment Setup**: (Done) Configured keys and environment variables.
2.  **Data Fetching Layer**: Create a script/service to read the Google Sheet data.
3.  **UI Design**: different sections (Hero, Problem/Solution based on research, Call to Action).
4.  **Deployment**: Firebase Hosting (Connects well with the existing ecosystem).

## 5. Security Note
Since we are using `credentials.json` (Service Account), **we cannot expose this key in the client-side code** (the browser).
*   **Solution**: We should likely use a simple Firebase Cloud Function (since you have `.firebaserc`) or a Next.js API route to act as a bridge. The frontend asks the backend "Give me data for user X", and the backend uses the secret key to ask Google Sheets.
