import { selectUsername } from "@/store/auth/selector";
import { useSelector } from "react-redux";
import Unauthenticated from "./unauthenticated";
import Authenticated from "./authenticated";
import { selectPerson } from "@/store/person/selector";
import { selectPersonActiveRole } from "@/store/person/selector";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { usePrimaryColor } from "@/lib/primary-color";
import { Checkbox } from "@/components/ui/checkbox";
import { useUpdatePersonStatus } from "@/api/services/person";
import { IUpdatePersonStatusRequest } from "@/types/request/person";

const RootNavbar = () => {
  const user = useSelector(selectUsername);
  return user ? <Authenticated /> : <Unauthenticated />;
};

export default function SubNavbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const navigate = useNavigate();
  const person = useSelector(selectPerson);
  const personActiveRole = useSelector(selectPersonActiveRole);
  const { BACKGROUND_PRIMARY_COLOR } = usePrimaryColor();

  const [custodianActive, setCustodianActive] = useState(false);
  const updateStatus = useUpdatePersonStatus(person?.id || '');

  const updateCustodianStatus = async (active: boolean) => {
    try {
      const request: IUpdatePersonStatusRequest = {
        campusId: person?.campusId || '',
        status: active,
      }

      await updateStatus.mutate(request, {
        onSuccess: (res) => {
          console.log('Successfully updated custodian status:', res);
        },
        onError: (err) => {
          console.error('Failed to update custodian status:', err);
        }
      })

    } catch (error) {
      console.error('Failed to update custodian status:', error);
    }
  };

  // Handler checkbox
  const handleCustodianCheckbox = (checked: boolean) => {
    setCustodianActive(checked);
    updateCustodianStatus(checked);
  };
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    navigate('/logout');
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open, custodianActive]);

  return (
    <nav className="flex items-center justify-between px-4 md:px-8 py-4 text-[#5D5D5D] shadow relative z-50">
      <button
        className="md:hidden p-2 rounded hover:bg-gray-100"
        onClick={onToggleSidebar}
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="hidden md:flex items-center gap-3">
        <Link to="/">
          <img className="w-32" src="/assets/images/reportin-logo.png" alt="Reportin logo" />
        </Link>
        <p>|</p>
        <p className="text-lg">Facility Complaint System</p>
      </div>

      <div className="relative inline-block text-left" ref={popoverRef}>
        <div className="flex items-center">
          <span
            onClick={() => setOpen(!open)}
            style={BACKGROUND_PRIMARY_COLOR(0.7)}
            className="text-white px-9 py-2 rounded-md transition font-bold cursor-pointer select-none"
          >
            {person?.name}
          </span>
        </div>

        {open && (
          <div className="absolute right-0 mt-2 w-64 rounded-md bg-white shadow-lg ring-1 ring-black/5 z-20">
            <div className="p-4 text-gray-700 text-sm space-y-2">
              <p className="font-semibold">{person?.name}</p>
              {/* Checkbox hanya untuk custodian */}
              {personActiveRole?.roleName?.toLowerCase() === 'custodian' && (
                <label className="flex items-center mt-2 gap-2 p-0">
                  <Checkbox
                    style={{ backgroundColor: custodianActive ? BACKGROUND_PRIMARY_COLOR(0.7).backgroundColor : undefined }}
                    checked={custodianActive}
                    onCheckedChange={handleCustodianCheckbox}
                  />
                  <span className="font-semibold select-none">Active Status</span>
                </label>
              )}
              <hr />
              <div className="flex py-2 gap-2">
                <img className="w-5" src="/assets/icons/email.svg" alt="email" />
                <p className="font-semibold">{person?.email}</p>
              </div>
              <hr />
              <div onClick={handleLogout} className="flex pt-2 gap-2 cursor-pointer">
                <img className="w-5" src="/assets/icons/logout.svg" alt="logout" />
                <p className="font-semibold">Logout</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export { RootNavbar };