import { selectUser } from "@/store/user/selector";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Authenticated = () => {
  const user = useSelector(selectUser);

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
      </div>
    </nav>
  )
}

export default Authenticated;