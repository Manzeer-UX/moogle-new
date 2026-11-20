import { FinalCtaSection } from "@/components/cta/FinalCtaSection";
import { DeliveryStagesSection } from "@/components/delivery/DeliveryStagesSection";
import GradualBlur from "@/components/effects/GradualBlur";
import { FaqSection } from "@/components/faq/FaqSection";
import { OrbHero } from "@/components/hero/OrbHero";
import { IndustriesSection } from "@/components/industries/IndustriesSection";
import { OperatingModelSection } from "@/components/scale/OperatingModelSection";
import { ServicesSection } from "@/components/services/ServicesSection";
import { EnterpriseStackSection } from "@/components/stack/EnterpriseStackSection";
import { SiteHeader } from "@/components/site/SiteHeader";
import { TestimonialsSection } from "@/components/testimonials/TestimonialsSection";
import { WhySection } from "@/components/why/WhySection";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <OrbHero />
        <ServicesSection />
        <IndustriesSection />
        <EnterpriseStackSection />
        <DeliveryStagesSection />
        <WhySection />
        <OperatingModelSection />
        <TestimonialsSection />
        <FinalCtaSection />
        <FaqSection />
      </main>
      {/* Content softens into the bottom edge of the screen while there is more to scroll */}
      <GradualBlur
        target="page"
        position="bottom"
        height="5rem"
        strength={1.6}
        layers={6}
        curve="bezier"
        exponential
        autoHide
        zIndex={40}
      />
    </>
  );
}
