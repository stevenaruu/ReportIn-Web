import { selectUsername } from "@/store/auth/selector";
import { useSelector } from "react-redux";
import Unauthenticated from "./unauthenticated";
import Authenticated from "./authenticated";

const Navbar = () => {
  const user = useSelector(selectUsername);
  return user ? <Authenticated /> : <Unauthenticated />;
};

export default Navbar;