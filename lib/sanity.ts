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
  githubUsername: string;
  email: string;
  linkedinUrl: string;
  copyrightName: string;
}

const MOCK_PROFILE: Profile = {
  _id: "mock-profile",
  name: "Ali Abu Fadaleh",
  specialty: "Enterprise Systems Specialist",
  bio: "Computer Science Graduate & Enterprise Systems Specialist. I build high-performance web applications, developer tooling, and interactive 3D experiences.",
  githubUsername: "Ali-Abu-Fadalah",
  email: "ali.abufadalah@gmail.com",
  linkedinUrl: "https://linkedin.com/in/ali-abu-fadalah",
  copyrightName: "Ali Abu Fadaleh"
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
    const query = `*[_type == "profile"][0] {
      _id,
      name,
      specialty,
      bio,
      githubUsername,
      email,
      linkedinUrl,
      copyrightName
    }`;
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
  level?: number;
}

const MOCK_SKILLS: Skill[] = [
  // Frontend
  { _id: 's1', title: 'React', category: 'Frontend', level: 9 },
  { _id: 's2', title: 'Next.js', category: 'Frontend', level: 8 },
  { _id: 's3', title: 'TypeScript', category: 'Frontend', level: 9 },
  { _id: 's4', title: 'Tailwind CSS', category: 'Frontend', level: 9 },
  { _id: 's5', title: 'Three.js / React Three Fiber', category: 'Frontend', level: 7 },
  { _id: 's6', title: 'Framer Motion', category: 'Frontend', level: 8 },
  
  // Backend
  { _id: 's7', title: 'Node.js', category: 'Backend', level: 8 },
  { _id: 's8', title: 'Express', category: 'Backend', level: 8 },
  { _id: 's9', title: 'Go', category: 'Backend', level: 6 },
  { _id: 's10', title: 'GraphQL', category: 'Backend', level: 7 },
  
  // Database
  { _id: 's11', title: 'PostgreSQL', category: 'Database', level: 8 },
  { _id: 's12', title: 'MongoDB', category: 'Database', level: 8 },
  { _id: 's13', title: 'Redis', category: 'Database', level: 7 },
  { _id: 's14', title: 'Prisma ORM', category: 'Database', level: 8 },
  
  // DevOps & Tools
  { _id: 's15', title: 'Docker', category: 'DevOps & Tools', level: 7 },
  { _id: 's16', title: 'AWS', category: 'DevOps & Tools', level: 6 },
  { _id: 's17', title: 'Git / GitHub', category: 'DevOps & Tools', level: 9 },
  { _id: 's18', title: 'Sanity.io', category: 'DevOps & Tools', level: 7 },
  
  // AI & Machine Learning
  { _id: 's19', title: 'PyTorch / TensorFlow', category: 'AI & Machine Learning', level: 5 },
  { _id: 's20', title: 'LLM Integration (Gemini, OpenAI)', category: 'AI & Machine Learning', level: 8 },
  { _id: 's21', title: 'LangChain / LangGraph', category: 'AI & Machine Learning', level: 7 },
  { _id: 's22', title: 'Retrieval-Augmented Generation (RAG)', category: 'AI & Machine Learning', level: 7 }
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
  _createdAt: string;
}

const MOCK_EXPERIENCES: Experience[] = [
  {
    _id: 'e1',
    role: 'B.S. in Computer Science',
    organization: 'Stanford University',
    type: 'Education',
    dateRange: '2019 - 2023',
    description: 'Specialized in Artificial Intelligence and Systems Engineering. Graduated with honors.',
    _createdAt: '2023-01-01T00:00:00Z'
  },
  {
    _id: 'e2',
    role: 'Software Engineer Intern',
    organization: 'Google',
    type: 'Work',
    dateRange: 'Summer 2022',
    description: 'Developed backend API endpoints for Google Cloud Platform, optimizing data ingestion pipelines by 15%.',
    _createdAt: '2023-06-01T00:00:00Z'
  },
  {
    _id: 'e3',
    role: 'Enterprise Systems Specialist',
    organization: 'Tech Innovations Lab',
    type: 'Work',
    dateRange: '2023 - 2025',
    description: 'Engineered high-performance web applications using React, Node.js, and PostgreSQL. Spearheaded adoption of Next.js and Tailwind CSS.',
    _createdAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: 'e4',
    role: 'Lead 3D Web Engineer',
    organization: 'Creative Tech Solutions',
    type: 'Work',
    dateRange: '2025 - Present',
    description: 'Leading the development of interactive web applications with React Three Fiber, Framer Motion, and headless content architecture.',
    _createdAt: '2025-06-01T00:00:00Z'
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
      _createdAt
    }`;
    const data = await client.fetch<Experience[]>(query);
    return data.length > 0 ? data : MOCK_EXPERIENCES;
  } catch (error) {
    console.error("Failed to fetch experiences from Sanity, using mock data:", error);
    return MOCK_EXPERIENCES;
  }
}
