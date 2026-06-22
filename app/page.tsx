import { getProjects, getProfile, getSkills, getExperiences } from "@/lib/sanity";
import { ProjectsSection } from "@/components/ProjectsSection";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { TechStack } from "@/components/TechStack";
import { GitHubActivity } from "@/components/GitHubActivity";
import { Timeline } from "@/components/Timeline";
import { Footer } from "@/components/Footer";

export const revalidate = 10;

export default async function Home() {
  const [projects, profile, skills, experiences] = await Promise.all([
    getProjects(),
    getProfile(),
    getSkills(),
    getExperiences(),
  ]);

  return (
    <main
      className="flex min-h-screen flex-col overflow-x-hidden"
      style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >
      <HeroSection profile={profile} />
      <AboutSection profile={profile} />
      <ProjectsSection projects={projects} />
      <TechStack skills={skills} profile={profile} />
      <GitHubActivity githubUsername={profile.githubUsername} />
      <Timeline experiences={experiences} profile={profile} />
      <Footer profile={profile} />
    </main>
  );
}
