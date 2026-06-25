import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-05-30',
  useCdn: false,
});

export interface PortfolioProject {
  _id: string;
  title: string;
  category: string;
  techStack?: string[];
  videoUrl?: string;
  githubUrl?: string;
  description?: string;
  _createdAt: string;
}

const MOCK_PROJECTS: PortfolioProject[] = [
  {
    _id: "mock-1",
    title: "AI-Powered Coding Assistant",
    category: "Developer Tools",
    techStack: ["Next.js 15", "TypeScript", "Tailwind CSS", "Gemini API"],
    githubUrl: "https://github.com",
    videoUrl: "https://youtube.com",
    description: "An agentic AI coding assistant built to autonomously execute complex full-stack web development tasks, providing real-time UI updates and smooth animations.",
    _createdAt: new Date().toISOString(),
  },
  {
    _id: "mock-2",
    title: "High-Performance Portfolio Website",
    category: "Web Development",
    techStack: ["Next.js 15", "Sanity.io", "Framer Motion", "Tailwind CSS"],
    githubUrl: "https://github.com",
    videoUrl: "https://youtube.com",
    description: "A dark-mode-first developer portfolio engineered for speed and aesthetics, featuring structured content from Sanity.io and interactive page transitions.",
    _createdAt: new Date().toISOString(),
  },
  {
    _id: "mock-3",
    title: "Decentralized Finance Dashboard",
    category: "Blockchain",
    techStack: ["React", "Ethers.js", "Chart.js", "Solidity"],
    githubUrl: "https://github.com",
    description: "A comprehensive dashboard for tracking yield farming pools, staking rewards, and wallet assets across multiple EVM-compatible blockchains.",
    _createdAt: new Date().toISOString(),
  }
];

export async function getProjects(): Promise<PortfolioProject[]> {
  const isMock = 
    !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your-project-id' || 
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'placeholder-project-id';

  if (isMock) {
    return MOCK_PROJECTS;
  }

  try {
    const query = `*[_type == "portfolioProject"] | order(_createdAt desc) {
      _id,
      title,
      category,
      techStack,
      videoUrl,
      githubUrl,
      description,
      _createdAt
    }`;
    const data = await client.fetch<PortfolioProject[]>(query);
    return data.length > 0 ? data : MOCK_PROJECTS;
  } catch (error) {
    console.error("Failed to fetch from Sanity, using mock data:", error);
    return MOCK_PROJECTS;
  }
}

export interface Profile {
  _id: string;
  name: string;
  specialty: string;
  bio: string;
  aboutBio: string;
  githubUsername: string;
  email: string;
  linkedinUrl: string;
  copyrightName: string;
  resumeUrl: string;
  heroRoles: string[];

  aboutCodeSnippet: {
    name: string;
    role: string;
    focus: string[];
    available: boolean;
    location: string;
  };
  aboutStats: { target: number; suffix: string; label: string }[];
  aboutHeadline?: string;
  techHeadline?: string;
  techSubheadline?: string;
  experienceHeadline?: string;
  experienceSubheadline?: string;
  footerHeadline?: string;
  availabilityText?: string;
  timelineNowText: string;
  footerPitch: string;
  footerLocation: string;
  techCategoryOrder: string[];
}

const MOCK_PROFILE: Profile = {
  _id: "mock-profile",
  name: "Ali Abu Fadaleh",
  specialty: "Computer Science Engineer",
  bio: "Computer Science Engineer building scalable systems and high-performance web applications.",
  aboutBio: "I am a Computer Science Engineer focused on building fast, scalable, and intelligent systems. I obsess over clean architecture, developer experience, and delivering robust backend operations.",
  githubUsername: "Ali-Abu-Fadalah",
  email: "ali.abufadalah@gmail.com",
  linkedinUrl: "https://linkedin.com/in/ali-abu-fadalah",
  copyrightName: "Ali Abu Fadaleh",
  aboutHeadline: "Architecting scalable backend logic and enterprise web solutions",
  techHeadline: "Tech Stack",
  techSubheadline: "Languages, frameworks, databases, and tools I build modern software with.",
  experienceHeadline: "Professional Journey",
  experienceSubheadline: "A timeline of my professional roles, projects, and educational milestones.",
  footerHeadline: "Let's build something *great* together.",
  resumeUrl: "/resume.pdf",
  heroRoles: [
    'Computer Science Engineer',
    'Operations & Logistics',
    'Backend Systems Builder',
    'Software Developer',
  ],

  aboutCodeSnippet: {
    name: 'Ali Abu Fadaleh',
    role: 'Computer Science Engineer',
    focus: ['Performance', 'Systems Architecture', 'Operations', 'Clean Code'],
    available: true,
    location: 'Available Worldwide',
  },
  aboutStats: [
    { target: 3, suffix: '+', label: 'Years Experience' },
    { target: 20, suffix: '+', label: 'Projects Shipped' },
    { target: 10, suffix: '+', label: 'Technologies' },
    { target: 100, suffix: '+', label: 'GitHub Commits' },
  ],
  availabilityText: 'Available for new opportunities',
  timelineNowText: '— Building & growing',
  footerPitch: 'Available for full-time roles, contract work, and open-source collaborations. Drop me a message or grab my resume.',
  footerLocation: 'Available worldwide · Open to relocation',
  techCategoryOrder: [
    'Frontend',
    'Backend',
    'Database',
    'DevOps & Tools',
    'AI & Machine Learning',
  ],
};

export async function getProfile(): Promise<Profile> {
  const isMock = 
    !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your-project-id' || 
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'placeholder-project-id';

  if (isMock) {
    return MOCK_PROFILE;
  }

  try {
    const query = `*[_type == "profile"] {
      _id,
      name,
      specialty,
      bio,
      aboutBio,
      githubUsername,
      email,
      linkedinUrl,
      copyrightName,
      "resumeUrl": resumeUrl.asset->url,
      heroRoles,

      aboutHeadline,
      aboutCodeSnippet,
      aboutStats,
      availabilityText,
      techHeadline,
      techSubheadline,
      techCategoryOrder,
      experienceHeadline,
      experienceSubheadline,
      timelineNowText,
      footerHeadline,
      footerPitch,
      footerLocation
    }[0]`;
    const data = await client.fetch<Profile>(query);
    return data || MOCK_PROFILE;
  } catch (error) {
    console.error("Failed to fetch profile from Sanity, using mock data:", error);
    return MOCK_PROFILE;
  }
}

export interface Skill {
  _id: string;
  title: string;
  category: string;
}

const MOCK_SKILLS: Skill[] = [
  // Frontend
  { _id: 's1', title: 'React', category: 'Frontend' },
  { _id: 's2', title: 'Next.js', category: 'Frontend' },
  { _id: 's3', title: 'TypeScript', category: 'Frontend' },
  { _id: 's4', title: 'Tailwind CSS', category: 'Frontend' },
  { _id: 's5', title: 'Three.js / React Three Fiber', category: 'Frontend' },
  { _id: 's6', title: 'Framer Motion', category: 'Frontend' },
  
  // Backend
  { _id: 's7', title: 'Node.js', category: 'Backend' },
  { _id: 's8', title: 'Express', category: 'Backend' },
  { _id: 's9', title: 'Go', category: 'Backend' },
  { _id: 's10', title: 'GraphQL', category: 'Backend' },
  
  // Database
  { _id: 's11', title: 'PostgreSQL', category: 'Database' },
  { _id: 's12', title: 'MongoDB', category: 'Database' },
  { _id: 's13', title: 'Redis', category: 'Database' },
  { _id: 's14', title: 'Prisma ORM', category: 'Database' },
  
  // DevOps & Tools
  { _id: 's15', title: 'Docker', category: 'DevOps & Tools' },
  { _id: 's16', title: 'AWS', category: 'DevOps & Tools' },
  { _id: 's17', title: 'Git / GitHub', category: 'DevOps & Tools' },
  { _id: 's18', title: 'Sanity.io', category: 'DevOps & Tools' },
  
  // AI & Machine Learning
  { _id: 's19', title: 'PyTorch / TensorFlow', category: 'AI & Machine Learning' },
  { _id: 's20', title: 'LLM Integration (Gemini, OpenAI)', category: 'AI & Machine Learning' },
  { _id: 's21', title: 'LangChain / LangGraph', category: 'AI & Machine Learning' },
  { _id: 's22', title: 'Retrieval-Augmented Generation (RAG)', category: 'AI & Machine Learning' }
];

export async function getSkills(): Promise<Skill[]> {
  const isMock = 
    !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your-project-id' || 
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'placeholder-project-id';

  if (isMock) {
    return MOCK_SKILLS;
  }

  try {
    const query = `*[_type == "skill"] | order(title asc) {
      _id,
      title,
      category
    }`;
    const data = await client.fetch<Skill[]>(query);
    return data.length > 0 ? data : MOCK_SKILLS;
  } catch (error) {
    console.error("Failed to fetch skills from Sanity, using mock data:", error);
    return MOCK_SKILLS;
  }
}

export interface Experience {
  _id: string;
  role: string;
  organization: string;
  type: 'Work' | 'Education';
  dateRange: string;
  description: string;
  order?: number;
  _createdAt: string;
}

const MOCK_EXPERIENCES: Experience[] = [
  {
    _id: 'e1',
    role: 'B.S. in Computer Science',
    organization: 'University',
    type: 'Education',
    dateRange: '2019 - 2023',
    description: 'Specialized in Systems Engineering and software development.',
    order: 1,
    _createdAt: '2023-01-01T00:00:00Z'
  },
  {
    _id: 'e2',
    role: 'Operations/Logistics',
    organization: 'Shipa',
    type: 'Work',
    dateRange: 'Recent',
    description: 'Managing complex logistics operations and ensuring streamlined processes across supply chains.',
    order: 2,
    _createdAt: '2023-06-01T00:00:00Z'
  },
  {
    _id: 'e3',
    role: 'Computer Science Engineer',
    organization: 'Freelance & Projects',
    type: 'Work',
    dateRange: 'Ongoing',
    description: 'Engineered high-performance web applications using modern web technologies and robust backend architecture.',
    order: 3,
    _createdAt: '2024-01-01T00:00:00Z'
  }
];

export async function getExperiences(): Promise<Experience[]> {
  const isMock = 
    !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your-project-id' || 
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'placeholder-project-id';

  if (isMock) {
    return MOCK_EXPERIENCES;
  }

  try {
    const query = `*[_type == "experience"] | order(_createdAt asc) {
      _id,
      role,
      organization,
      type,
      dateRange,
      description,
      order,
      _createdAt
    }`;
    const data = await client.fetch<Experience[]>(query);
    return data.length > 0 ? data : MOCK_EXPERIENCES;
  } catch (error) {
    console.error("Failed to fetch experiences from Sanity, using mock data:", error);
    return MOCK_EXPERIENCES;
  }
}
