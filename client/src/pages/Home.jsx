import React from 'react';
import { HeroSection } from '../components/common/HeroSection';
import { TrustedBy } from '../components/common/TrustedBy';
import { AboutNexus } from '../components/common/AboutNexus';
import { AboutTechFusion } from '../components/common/AboutTechFusion';
import { AboutHIET } from '../components/common/AboutHIET';
import { AboutICDETGT } from '../components/common/AboutICDETGT';
import { ConferenceStats } from '../components/common/ConferenceStats';
import { WhyParticipate } from '../components/common/WhyParticipate';
import { ConferenceTracks } from '../components/common/ConferenceTracks';
import { PublicationSection } from '../components/common/PublicationSection';
import { BrochureCTA } from '../components/common/BrochureCTA';
import { ImportantDates } from '../components/common/ImportantDates';
import { PatronsSection } from '../components/common/PatronsSection';
import { AdvisoryBoard } from '../components/common/AdvisoryBoard';
import { OrganizingCommittee } from '../components/common/OrganizingCommittee';
import { PartnerOrganizations } from '../components/common/PartnerOrganizations';
import { FAQ } from '../components/common/FAQ';
import { ContactSection } from '../components/common/ContactSection';
import { VenueSection } from '../components/common/VenueSection';
import { SEO } from '../components/common/SEO';

export const Home = () => {
  return (
    <>
      <SEO 
        title="Home" 
        description="NEXUS 2026 - Pre-Conference Research Paper Writing Competition organized by Tech Fusion."
      />
      <HeroSection />
      <TrustedBy />
      <AboutNexus />
      <AboutTechFusion />
      <AboutHIET />
      <AboutICDETGT />
      <ConferenceStats />
      <WhyParticipate />
      <ConferenceTracks />
      <PublicationSection />
      <BrochureCTA />
      <ImportantDates />
      <PatronsSection />
      <AdvisoryBoard />
      <OrganizingCommittee />
      <PartnerOrganizations />
      <FAQ />
      <VenueSection />
      <ContactSection />
    </>
  );
};
