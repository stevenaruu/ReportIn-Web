import { useSelector } from "react-redux";
import { selectUser } from "@/store/user/selector";
import { useNavigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { selectPerson } from "@/store/person/selector";

const SubPrivateLayout = () => {
  const person = useSelector(selectPerson);
  const navigate = useNavigate();

  useEffect(() => {
    if (!person) {
      navigate("/login", { replace: true });
    }
  }, [person, navigate]);

  if (!person) {
    return null;
  }

  return (
    <Outlet />
  );
};

const RootPrivateLayout = () => {
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

export { SubPrivateLayout, RootPrivateLayout };
