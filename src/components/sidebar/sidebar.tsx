/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/Sidebar.tsx
import { hexToRgba } from "@/lib/hex-to-rgba";
import { sidebarConfig } from "@/lib/sidebar";
import { selectPerson, selectPersonActiveRole } from "@/store/person/selector";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IPersonRole } from "@/types/role";
import { setPersonActiveRole } from "@/store/person/slice";
import { selectCampus } from "@/store/campus/selector";
import { usePrimaryColor } from "@/lib/primary-color";

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const person = useSelector(selectPerson);
  const activeRole = useSelector(selectPersonActiveRole);
  const campus = useSelector(selectCampus);
  const { BACKGROUND_PRIMARY_COLOR } = usePrimaryColor();

  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<IPersonRole>(activeRole);

  const roleConfig = sidebarConfig.find(
    (config) => config.role === activeRole?.roleName
  );

  const activeBg = hexToRgba(
    campus?.customization.primaryColor,
    0.7
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed md:static 
          z-50 w-64 h-full flex flex-col text-white
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
        style={BACKGROUND_PRIMARY_COLOR(0.5)}
      >
        {/* Campus Logo */}
        {campus?.customization?.logo && (
          <div
            style={BACKGROUND_PRIMARY_COLOR(0.7)}
            className="flex rounded-md justify-center mx-4 mt-4">
            <img
              src={campus.customization.logo}
              alt={`${campus.name} Logo`}
              className="w-6/12 object-contain"
            />
          </div>
        )}

        <div
          style={BACKGROUND_PRIMARY_COLOR(0.7)}
          className="rounded-md p-4 mt-4 mx-4"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm">Role</span>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <div
                  style={BACKGROUND_PRIMARY_COLOR(1)}
                  className="cursor-pointer px-2 py-1 rounded-sm"
                >
                  <p className="text-xs">CHANGE</p>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Change Role</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {person?.role.map((role: IPersonRole) => {
                    const isActive = role.roleName === selectedRole.roleName;
                    return (
                      <div
                        key={role.roleId}
                        onClick={() => setSelectedRole(role)}
                        style={{
                          backgroundColor: isActive ? activeBg : "#f5f5f5",
                          color: isActive ? "white" : "black",
                        }}
                        className={`cursor-pointer rounded-md border p-4 hover:opacity-90 transition`}
                      >
                        <p className="font-semibold text-xl">{role.roleName}</p>
                        <p className="mt-2 text-sm">{campus?.name}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    onClick={() => {
                      dispatch(setPersonActiveRole(selectedRole));
                      navigate("/dashboard");
                      setOpen(false);
                    }}
                    style={BACKGROUND_PRIMARY_COLOR(1)}
                    className="text-white hover:opacity-90 w-full sm:w-auto"
                  >
                    CHOOSE
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-lg font-semibold mt-4">{activeRole?.roleName}</p>
          <p className="text-sm mt-1">{campus?.name}</p>
        </div>

        {/* === NAV MENU === */}
        <nav className="flex-1 overflow-y-auto mt-4">
          <ul>
            {roleConfig?.menus.map((menu, idx) => (
              <li
                key={idx}
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
      </aside >
    </>
  );
}