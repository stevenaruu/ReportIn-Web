export const sidebarConfig = [
  {
    role: "Facility User",
    menus: [
      { label: "Dashboard", path: "/dashboard" },
    ],
  },
  {
    role: "Technician",
    menus: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Leaderboard", path: "/leaderboard" },
    ],
  },
  {
    role: "Building Management",
    menus: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Leaderboard", path: "/leaderboard" },
      { label: "Browse Report", path: "/browse-report" },
      { label: "Browse Category", path: "/browse-category" },
      { label: "Browse Area", path: "/browse-area" },
      { label: "Browse Account", path: "/browse-account" },
    ],
  },
];
