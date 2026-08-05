export const ROUTES = {
  PUBLIC: {
    HOME: '/',
    ABOUT: '/about',
    TRACKS: '/tracks',
    COMMITTEE: '/committee',
    FAQ: '/faq',
    CONTACT: '/contact',
    GUIDELINES: '/guidelines'
  },
  AUTH: {
    LOGIN: '/auth/login',
    ADMIN_LOGIN: '/admin/login',
    SIGNUP: '/auth/signup',
    VERIFY_EMAIL: '/auth/verify',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  },
  PRIVATE: {
    DASHBOARD: '/dashboard',
    TEAM: '/dashboard/team',
    MEMBER_DASHBOARD: '/dashboard/member',
    CREATE_TEAM: '/dashboard/team/create',
    PROFILE_INIT: '/profile/initialize',
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_QUEUE: '/admin/queue',
    ADMIN_SETTINGS: '/admin/settings'
  }
};
