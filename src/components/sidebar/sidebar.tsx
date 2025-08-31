/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/Sidebar.tsx
import { getSubdomainResponseExample } from "@/examples/campuses";
import { hexToRgba } from "@/lib/hex-to-rgba";
import { sidebarConfig } from "@/lib/sidebar";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  role: string;
}

export default function Sidebar({ role }: SidebarProps) {
  const roleConfig = sidebarConfig.find(config => config.role === role);

  const baseBg = hexToRgba(getSubdomainResponseExample.data.customization.primaryColor, 0.5);
  const activeBg = hexToRgba(getSubdomainResponseExample.data.customization.primaryColor, 0.7);

  return (
    <aside
      className="w-64 text-white h-screen flex flex-col"
      style={{ backgroundColor: baseBg }}
    >
      <nav className="flex-1 overflow-y-auto mt-4">
        <ul>
          {roleConfig?.menus.map((menu, idx) => (
            <li
              key={idx}
              // inject css variable untuk hover & active
              style={
                {
                  ["--hover-bg" as any]: activeBg,
                  ["--active-bg" as any]: activeBg,
                } as React.CSSProperties
              }
              className="py-2 px-4"
            >
              <NavLink
                to={menu.path}
                className={({ isActive }) =>
                  `
              block px-6 py-2 rounded-lg transition-colors duration-150
              hover:bg-[var(--hover-bg)]
              ${isActive ? "font-semibold bg-[var(--active-bg)]" : ""}
            `
                }
              >
                {menu.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}