import { TabTitle } from "@/components/easter/TabTitle";

import { getProjects, getProfile, getSkills, getExperiences } from "@/lib/sanity";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { TechGraph } from "@/components/sections/TechGraph";
import { GitHubActivity } from "@/components/sections/GitHubActivity";
import { Timeline } from "@/components/sections/Timeline";
import { ContactSection } from "@/components/sections/ContactSection";

export const revalidate = 10;

export default async function Home() {
  const [projects, profile, skills, experiences] = await Promise.all([
    getProjects(),
    getProfile(),
    getSkills(),
    getExperiences()
  ]);

  return (
    <main className="flex min-h-screen flex-col bg-transparent text-white transition-colors duration-300 overflow-x-hidden">
      <TabTitle />
      {/* Dynamic Hero Section with 3D Canvas */}
      <HeroSection profile={profile} />

      {/* Projects Grid Section */}
      <ProjectsSection projects={projects} />

      {/* Tech Stack Skills Section */}
      <TechGraph skills={skills} />

      {/* GitHub Repository Feed */}
      <GitHubActivity githubUsername={profile.githubUsername} />

      {/* Experience and Education Timeline */}
      <Timeline experiences={experiences} />

      {/* Dynamic Action Footer */}
      <ContactSection
        email={profile.email}
        linkedinUrl={profile.linkedinUrl}
        copyrightName={profile.copyrightName}
      />
    </main>
  );
}
