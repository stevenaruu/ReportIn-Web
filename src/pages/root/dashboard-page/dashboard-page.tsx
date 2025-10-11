import { useSelector } from "react-redux";
import AdministratorUniversityPage from "./administrator-university-page";
import { selectUserActiveRole } from "@/store/user/selector";
import { useEffect } from "react";
import SuperAdminPage from "./super-admin-page";

const RootDashboardPage = () => {
  const userActiveRole = useSelector(selectUserActiveRole);

  useEffect(() => {
    if (!['Administrator University', 'Super Admin'].includes(userActiveRole.roleName)) {
      window.location.href = '/logout';
    }
  }, [userActiveRole]);

  switch (userActiveRole.roleName) {
    case 'Administrator University':
      return <AdministratorUniversityPage />;
    case 'Super Admin':
      return <SuperAdminPage />;
    default:
      return null;
  }
};

export default RootDashboardPage;