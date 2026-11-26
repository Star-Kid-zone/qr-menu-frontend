export const routes = {
  public: {
    home: "/",
    login: "/login",
    register: "/register",
    forgotPassword: "/forgot-password",
    otp: "/otp",
    resetPassword: "/reset-password",
    privacy: "/privacy",
    terms: "/terms",
  },
  admin: {
    home: "/admin/home",

    qrMenu: "/admin/qr-menu",
    listMenu: "/admin/listmenu",
    addMenu: "/admin/addmenu",
    listReview: "/admin/listreview",
    addReview: "/admin/addreview",


    listBusiness: "/admin/listbusiness",
    settings: "/admin/settings",
    socialMedia: "/admin/social-media",
    staff: "/admin/staff",
    schedule: "/admin/schedule",
    checklists: "/admin/checklists",
  },
  user: {
    dashboard: "/",
  },
  superadmin: {
    home: "/superadmin",
    users: "/superadmin/users",
    userDetail: (id: string) => `/superadmin/users/${id}`,
    analytics: "/superadmin/analytics",
    weeklyPosters: "/superadmin/weekly-posters",
    creativeStudio: "/superadmin/creative-studio",
    prompts: "/superadmin/prompts",
    blueprints: "/superadmin/blueprints",
    announcements: "/superadmin/announcements",
    occasionPacks: "/superadmin/occasion-packs",
  },

} as const;
