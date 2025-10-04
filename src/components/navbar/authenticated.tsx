import { selectUser } from "@/store/user/selector";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Authenticated = () => {
  const user = useSelector(selectUser);

  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    window.location.href = '/logout';
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
  }, [open]);

  return (
    <nav className="flex items-center justify-between px-4 md:px-8 py-4 bg-[#E5E5E5] text-[#5D5D5D] shadow relative z-50">
      <div className="hidden md:flex items-center gap-3">
        <Link to="/dashboard">
          <img className="w-32" src="/assets/images/reportin-logo.png" alt="Reportin logo" />
        </Link>
        <p>|</p>
        <p className="text-lg">Facility Complaint System</p>
      </div>

      <div className="relative inline-block text-left font-semibold" ref={popoverRef}>
        <div className="flex items-center">
          <span
            onClick={() => setOpen(!open)}
            className="bg-red-500 text-white px-9 py-2 rounded-md hover:bg-red-600 transition font-bold cursor-pointer"
          >
            {user?.name}
          </span>
        </div>

        {open && (
          <div className="absolute right-0 mt-2 w-64 rounded-md bg-white shadow-lg ring-1 ring-black/5 z-20">
            <div className="p-4 text-gray-700 text-sm space-y-2">
              <p className="font-semibold">{user?.name}</p>
              <hr />
              <div className="flex py-2 gap-2">
                <img className="w-5" src="/assets/icons/email.svg" alt="email" />
                <p className="font-semibold">{user?.email}</p>
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

export default Authenticated;