import { selectUsername } from "@/store/auth/selector";
import { useSelector } from "react-redux";
import Unauthenticated from "./unauthenticated";
import Authenticated from "./authenticated";
import { selectPerson } from "@/store/person/selector";
import { Link } from "react-router-dom";
import { hexToRgba } from "@/lib/hex-to-rgba";
import { getSubdomainResponseExample } from "@/examples/campuses";

const RootNavbar = () => {
  const user = useSelector(selectUsername);
  return user ? <Authenticated /> : <Unauthenticated />;
};

const SubNavbar = () => {
  const person = useSelector(selectPerson);

  return (
    <nav className="flex items-center justify-between px-4 md:px-8 py-4 text-[#5D5D5D] shadow relative z-50">
      <div className="flex items-center gap-3">
        <Link to="/">
          <img className="w-32" src="/assets/images/reportin-logo.png" alt="Reportin logo" />
        </Link>
        <p>|</p>
        <p className="text-lg">Facility Complaint System</p>
      </div>

      <div className="flex items-center">
        <span
          style={{ backgroundColor: hexToRgba(getSubdomainResponseExample.data.customization.primaryColor, 0.7) }}
          className="text-white px-9 py-2 rounded-md transition font-bold cursor-pointer"
        >
          {person?.name}
        </span>
      </div>
    </nav>
  )
}

export { RootNavbar, SubNavbar };