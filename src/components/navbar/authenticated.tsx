import { selectUser } from "@/store/user/selector";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Authenticated = () => {
  const user = useSelector(selectUser);
  const [open, setOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-4 md:px-8 py-4 bg-[#E5E5E5] text-[#5D5D5D] font-semibold shadow relative z-50">
      <div className="flex items-center gap-6">
        <Link to="/">
          <img className="w-32" src="/assets/images/reportin-logo.png" alt="Reportin logo" />
        </Link>
      </div>

      <div className="flex items-center">
        <span className="bg-red-500 text-white px-9 py-2 rounded-md hover:bg-red-600 transition font-bold cursor-pointer">
          {user?.name}
        </span>
        <button
          className="md:hidden ml-3"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
        >
          <svg className="w-7 h-7 text-[#5D5D5D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#E5E5E5] shadow-lg py-3 px-6 flex flex-col gap-2 animate-fade-in">
          <Link to="/features" className="py-2 px-1 hover:text-red-500" onClick={() => setOpen(false)}>Features</Link>
          <Link to="/how-it-works" className="py-2 px-1 hover:text-red-500" onClick={() => setOpen(false)}>How it Works</Link>
          <Link to="/contact" className="py-2 px-1 hover:text-red-500" onClick={() => setOpen(false)}>Contact</Link>
          <Link to="/login" onClick={() => setOpen(false)}>
            <button className="w-full bg-red-500 text-white py-2 rounded-md mt-2 hover:bg-red-600 transition font-bold">
              Sign In
            </button>
          </Link>
        </div>
      )}
    </nav>
  )
}

export default Authenticated;