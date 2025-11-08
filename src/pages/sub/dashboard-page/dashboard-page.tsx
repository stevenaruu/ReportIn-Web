import { selectPersonActiveRole } from '@/store/person/selector';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import BuildingManagementPage from './building-management-page';
import FacilityUserPage from './facility-user-page';
import TechnicianPage from './technician-page';

const SubDashboardPage = () => {
  const personActiveRole = useSelector(selectPersonActiveRole);

  useEffect(() => {
    if (!['Facility User', 'Technician', 'Building Management'].includes(personActiveRole.roleName)) {
      window.location.href = '/logout';
    }
  }, [personActiveRole]);

  switch (personActiveRole.roleName) {
    case 'Facility User':
      return <FacilityUserPage />;
    case 'Technician':
      return <TechnicianPage />;
    case 'Building Management':
      return <BuildingManagementPage />;
    default:
      return null;
  }
};

export default SubDashboardPage;