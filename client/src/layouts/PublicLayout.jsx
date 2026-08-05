import React from 'react';
import { Outlet } from 'react-router-dom';
import { AnnouncementBar } from '../components/common/AnnouncementBar';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { homeContent } from '../content/home';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AnnouncementBar announcements={homeContent.announcements} />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
