# Myinder — Frontend Project Documentation

**Project Name:** Myinder  
**Project Type:** Responsive Student Networking Landing Page  
**Reference Website:** https://froshfeed.com/  
**Frontend Stack:** React, TypeScript, Vite, Tailwind CSS  
**Status:** Frontend development

## 1. Project Overview

Myinder is a frontend web application inspired by the design and user experience of FroshFeed. Its purpose is to help incoming college and university students connect with future classmates, discover potential roommates, and build social connections before the academic year begins.

The project will recreate the reference website's public-facing landing page using the Myinder brand identity, responsive layouts, reusable React components, and interactive user interface elements.

The initial release will focus exclusively on the frontend. All content, including pricing plans, testimonials, and frequently asked questions, will be managed through local TypeScript data rather than a backend API.

## 2. Project Objectives

- Recreate the reference website's visual structure and user experience.
- Establish a consistent Myinder brand identity.
- Build reusable and maintainable React components.
- Implement responsive layouts for mobile, tablet, and desktop.
- Create interactive navigation, pricing cards, and FAQ sections.
- Implement smooth scrolling and accessible user interactions.
- Organize project content into reusable data structures.
- Prepare the frontend for future backend and payment integration.

## 3. Technology Stack

| Technology | Purpose |
|---|---|
| React | Component-based UI development |
| TypeScript | Static typing and safer code |
| Vite | Development server and production builds |
| Tailwind CSS | Responsive styling |
| Lucide React | Icons |
| React Router | Client-side routing when multiple pages are needed |
| Motion | Optional animations and transitions |
| ESLint | Code quality and linting |

## 4. Core Features

### 4.1 Navigation Bar

The navigation bar provides access to the main sections of the Myinder homepage.

Requirements:

- Display the Myinder logo or wordmark.
- Include navigation links for Pricing, How It Works, and FAQ.
- Include a prominent CTA button.
- Support a responsive mobile navigation menu.
- Use smooth scrolling for in-page links.
- Provide hover, focus, and active states.
- Keep navigation accessible through keyboard controls.

### 4.2 Hero Section

The hero section introduces Myinder and communicates its main value proposition.

Content:

- A prominent headline about meeting future classmates before college.
- Supporting text explaining the benefits of early connections.
- A primary CTA that directs users to pricing.
- A secondary CTA that directs users to the process section.
- Supporting imagery or decorative elements based on the verified reference design.

Example headline:

**Meet your people before day one.**

Example supporting text:

Start building friendships, finding potential roommates, and connecting with future classmates before stepping onto campus.

### 4.3 Testimonials Section

This section displays student testimonials to communicate the value of the service.

Each testimonial card may contain:

- Student initials or profile image.
- Display name.
- University or college.
- Class year.
- Testimonial text.
- Optional star rating.

Testimonials should be stored in a local data file. Placeholder content must be clearly identified during development and must not be represented as verified customer reviews.

### 4.4 Pricing Section

The pricing section presents the available profile-promotion plans.

| Feature | Standard | Express |
|---|---|---|
| Price | $15 | $25 |
| Turnaround | Within 3 days | Same day |
| Processing | Standard | Priority |
| CTA | Choose Standard | Choose Express |

Requirements:

- Display each plan in a separate card.
- Highlight the recommended plan if supported by the reference design.
- Present prices and turnaround times clearly.
- Include buttons that respond to user interaction.
- Maintain consistent card spacing and responsive behavior.

The prices above reflect the reference page reviewed for this specification. They should remain configurable and must be verified before production use.

During the frontend-only stage, CTA buttons can scroll to the appropriate section or display a temporary selection state. Actual payments will be implemented separately.

### 4.5 How It Works Section

Present the customer journey through three visual steps.

**Step 1 — Pick Your Plan**

Choose a profile-promotion plan based on the preferred processing time.

**Step 2 — Submit Your Materials**

Prepare the required photographs, caption, and payment confirmation according to the service workflow.

**Step 3 — Get Posted**

The profile is published after the required submission and payment checks are completed.

Each step should have a number, icon, title, and short description.

### 4.6 FAQ Section

Create an interactive accordion component containing commonly asked questions.

Suggested questions:

- Do I have to be fully committed to a university?
- What information should I include in my profile?
- What makes a good profile post?
- What is the difference between Standard and Express?
- Is payment secure?
- How long does publication take?

Functional requirements:

- Clicking a question expands its answer.
- Clicking the same question collapses it.
- The component supports keyboard interaction.
- Answers remain readable on small screens.
- Accordion state is managed using React state.

### 4.7 Final Call to Action

Create a final promotional section encouraging visitors to choose a plan.

Include:

- A concise headline.
- Supporting copy.
- Standard and Express plan options.
- CTA buttons linked to the pricing section or intended destination.

### 4.8 Footer

The footer should include:

- Myinder branding.
- Navigation links.
- Contact or support link placeholders.
- Privacy Policy and Terms links when available.
- Copyright information.

Do not link to nonexistent pages. Use appropriate placeholders until the corresponding pages are implemented.

## 5. UI/UX Design Requirements

### Design principles

- Reproduce the reference website's overall visual hierarchy.
- Use consistent typography, spacing, and border radii.
- Maintain a clear distinction between primary and secondary buttons.
- Use reusable styles for cards and interactive elements.
- Keep layouts clean and avoid unnecessary visual clutter.
- Use accessible text contrast and visible focus indicators.

### Responsive design

**Desktop**
- Full navigation bar.
- Spacious hero layout.
- Side-by-side pricing cards.
- Multi-column content where appropriate.

**Tablet**
- Adjust grid layouts and typography.
- Maintain readable content widths.
- Reduce unnecessary whitespace.

**Mobile**
- Use a collapsible navigation menu.
- Stack pricing cards vertically.
- Ensure buttons are touch-friendly.
- Prevent horizontal scrolling.
- Maintain comfortable text sizes and section spacing.

### Animation

Optional animations may include:

- Subtle hero content entrance.
- Card hover transitions.
- FAQ expansion.
- Smooth scrolling.
- Button hover feedback.

Animations must not interfere with usability and should respect the user's reduced-motion preference.

## 6. Project Structure

```text
myinder/
├── public/
│   ├── images/
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── home/
│   │   │   ├── Hero.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── Pricing.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── FAQ.tsx
│   │   │   └── FinalCTA.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       └── SectionHeading.tsx
│   ├── data/
│   │   └── content.ts
│   ├── pages/
│   │   └── HomePage.tsx
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### Component responsibilities

- `Navbar.tsx`: Header, navigation links, and mobile menu.
- `Hero.tsx`: Main headline, supporting text, and hero CTAs.
- `Testimonials.tsx`: Student testimonial cards.
- `Pricing.tsx`: Standard and Express pricing cards.
- `HowItWorks.tsx`: Three-step workflow.
- `FAQ.tsx`: Interactive question-and-answer accordion.
- `FinalCTA.tsx`: Closing promotional section.
- `Footer.tsx`: Footer navigation and branding.
- `HomePage.tsx`: Composes the homepage sections.
- `content.ts`: Holds local content and configurable plan data.

## 7. Installation and Setup

### Prerequisites

Install Node.js LTS, npm, Git, and a code editor such as Visual Studio Code.

### Create the project

```powershell
npm create vite@latest myinder -- --template react-ts
cd myinder
npm install
```

### Install dependencies

```powershell
npm install lucide-react motion react-router-dom
npm install tailwindcss @tailwindcss/vite
```

For a frontend-only single-page application, React Router is optional.

### Configure Tailwind CSS

Update `vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

In `src/index.css`, add:

```css
@import "tailwindcss";

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-width: 320px;
  font-family: Arial, Helvetica, sans-serif;
}
```

The font is a temporary default. Replace it after identifying the reference website's typography.

### Start the development server

```powershell
npm run dev
```

Open the local URL displayed in the terminal, typically `http://localhost:5173`.
