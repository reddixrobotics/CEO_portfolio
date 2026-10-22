import { getCachedSiteContent } from "@/lib/content/contentService";
import HeroAboutScene from "@/components/sections/HeroAboutScene";
import CareerTimeline from "@/components/sections/CareerTimeline";
import VisionImpactSection from "@/components/sections/VisionImpactSection";
import AchievementsSection from "@/components/sections/AchievementsSection";
import ContactSection from "@/components/sections/ContactSection";

// Force static prerendering (SSG) with on-demand tag revalidation
export const dynamic = "force-static";

export default async function HomePage() {
  const content = await getCachedSiteContent();

  return (
    <>
      <HeroAboutScene
        hero={content.hero}
        about={content.about}
        projects={content.projects}
      />
      <CareerTimeline career={content.career} />
      <VisionImpactSection standalone={false} />
      <AchievementsSection achievements={content.achievements} />
      <ContactSection standalone={false} />
    </>
  );
}
