import { useSelector } from "react-redux";
import { selectUser } from "@/store/user/selector";
import { useNavigate, Outlet } from "react-router-dom";
import { useEffect } from "react";

const PrivateLayout = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <Outlet />
  );
};

export default PrivateLayout;
