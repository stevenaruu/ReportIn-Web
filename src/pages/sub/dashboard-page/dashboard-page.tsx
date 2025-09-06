import { selectPersonActiveRole } from '@/store/person/selector';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ComplainantPage from './complainant-page';
import CustodianPage from './custodian-page';
import BuildingManagementPage from './building-management-page';

const SubDashboardPage = () => {
  const personActiveRole = useSelector(selectPersonActiveRole);

  useEffect(() => {
    if (!['Complainant', 'Custodian', 'Building Management'].includes(personActiveRole.roleName)) {
      window.location.href = '/logout';
    }
  }, [personActiveRole]);

  switch (personActiveRole.roleName) {
    case 'Complainant':
      return <ComplainantPage />;
    case 'Custodian':
      return <CustodianPage />;
    case 'Building Management':
      return <BuildingManagementPage />;
    default:
      return null;
  }
};

export default SubDashboardPage;