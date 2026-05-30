import { getProjects, getProfile, getSkills, getExperiences } from "@/lib/sanity";
import { ProjectsSection } from "@/components/ProjectsSection";
import { HeroSection } from "@/components/HeroSection";
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
    getExperiences()
  ]);

  return (
    <main className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-300 overflow-x-hidden">
      {/* Dynamic Hero Section with 3D Canvas */}
      <HeroSection profile={profile} />

      {/* Projects Grid Section */}
      <ProjectsSection projects={projects} />

      {/* Tech Stack Skills Section */}
      <TechStack skills={skills} />

      {/* GitHub Repository Feed */}
      <GitHubActivity githubUsername={profile.githubUsername} />

      {/* Experience and Education Timeline */}
      <Timeline experiences={experiences} />

      {/* Dynamic Action Footer */}
      <Footer 
        email={profile.email}
        linkedinUrl={profile.linkedinUrl}
        copyrightName={profile.copyrightName}
      />
    </main>
  );
}
