# High-Performance 3D Headless Portfolio

A dynamic, premium developer portfolio engineered with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. Content is modeled and managed headlessly using **Sanity.io Studio**, and interactive aesthetics are driven by **React Three Fiber (Three.js)** and **Framer Motion**.

---

## 🚀 Key Features

*   **Interactive 3D Hero Scene**: Centered around an abstract wireframe geometric shape (Icosahedron) built in React Three Fiber that auto-rotates and smoothly follows the cursor using linear interpolation (`lerp`).
*   **Global Theme Engine**: Toggleable Class-based Light & Dark theme modes powered by `next-themes` and `lucide-react`. Includes matching CSS transitions on background properties and real-time color adaptations on Three.js canvas materials.
*   **Headless CMS Integration**: Dynamic document schemas built inside Sanity.io Studio (`/studio` path) to manage projects, skills, career timeline, and profile attributes.
*   **GitHub Activity Sync**: Queries the latest 3 active repositories from the public GitHub API dynamically on the server with Next.js ISR (cache revalidation). Features high-fidelity fallback card interfaces to handle API rate limits gracefully.
*   **Technical Arsenal**: Dynamic groupings of skills mapped inside styled category containers with stagger load cards and custom hover scaling.
*   **Professional Timeline**: Chronological vertical timeline mapping education and work landmarks with scroll-reveal animations and colored dot tags (Work = Blue, Education = Violet).
*   **Action Footer**: Dynamic contact footer using SVG brands, email routing, and a resume download handler feeding directly from Sanity query bindings.
*   **Complete SEO & Sharing Card**: Fully structured Next.js Metadata configuration providing OpenGraph card previews, keywords, and author settings for social feeds.
*   **Magnetic UI Physics**: Responsive spring-physics-based attraction effect on desktop viewports. Mapped via Framer Motion's `useMotionValue`, `useSpring`, and `useTransform` to pull elements (max 15px) towards the cursor, returning to position on cursor release. Disables on screens `< 768px`.

---

## 🛠️ Tech Stack

*   **Core**: [Next.js 16 (App Router)](https://nextjs.org/) & [React 19](https://react.dev/)
*   **Styles**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **3D Graphics**: [Three.js](https://threejs.org/) via [@react-three/fiber](https://r3f.docs.pmnd.rs/) & [@react-three/drei](https://github.com/pmndrs/drei)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **Content Management**: [Sanity.io Studio](https://www.sanity.io/) & [GROQ Query Language](https://www.sanity.io/docs/groq)
*   **Type Safety**: [TypeScript](https://www.typescriptlang.org/)

---

## ⚙️ Setup & Local Run

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Ali-Abu-Fadalah/MyPortfolio.git
cd MyPortfolio
npm install
```

### 2. Configure Environment variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```
*Note: If no Sanity Project ID is provided, the application will automatically fall back to loading the high-fidelity mock datasets inside `lib/sanity.ts` to ensure immediate render availability.*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portfolio. Visit [http://localhost:3000/studio](http://localhost:3000/studio) to manage records through Sanity Studio.

---

## 📁 Project Architecture
```
├── app/                  # Next.js pages & root layout configurations
│   ├── studio/           # Headless Sanity Studio route
│   ├── globals.css       # Global styling & Tailwind v4 Custom Variants
│   └── page.tsx          # Server Component loading portfolio data
├── components/           # UI Elements & Widgets
│   ├── HeroSection.tsx   # 3D Wireframe Canvas & overlays
│   ├── Magnetic.tsx      # Framer Motion magnetic hover physics wrapper
│   ├── ProjectsSection.tsx # Projects grid container
│   ├── ProjectCard.tsx   # Interactive Project grid cards
│   ├── TechStack.tsx     # Technical Skills list
│   ├── GitHubActivity.ts # Server-fetched GitHub repositories feed
│   ├── Timeline.tsx      # Vertical chronological career items
│   ├── Footer.tsx        # Dynamic Contact controls & resume down-link
│   ├── ThemeToggle.tsx   # Theme toggler client button
│   └── providers.tsx     # Themes wrapper context
├── lib/                  # Sanity clients, interface typings, and fallback mocks
└── sanity/               # Sanity studio content schemas & datasets
```
