import React from 'react';
import { HeroSection } from '../components/common/HeroSection';
import { TrustedBy } from '../components/common/TrustedBy';
import { AboutNexus } from '../components/common/AboutNexus';
import { WhyParticipate } from '../components/common/WhyParticipate';
import { ConferenceTracks } from '../components/common/ConferenceTracks';
import { RegistrationFlow } from '../components/common/RegistrationFlow';
import { ImportantDates } from '../components/common/ImportantDates';
import { AwardsSection } from '../components/common/AwardsSection';
import { FAQ } from '../components/common/FAQ';
import { ContactSection } from '../components/common/ContactSection';
import { SEO } from '../components/common/SEO';

export const Home = () => {
  return (
    <>
      <SEO 
        title="Home | NEXUS 2026" 
        description="NEXUS 2026 - Pre-Conference Research Paper Writing Competition organized by Tech Fusion in association with ICDETGT-2026."
      />
      <HeroSection />
      <TrustedBy />
      <AboutNexus />
      <WhyParticipate />
      <ConferenceTracks />
      <RegistrationFlow />
      <ImportantDates />
      <AwardsSection />
      <FAQ />
      <ContactSection />
    </>
  );
};

