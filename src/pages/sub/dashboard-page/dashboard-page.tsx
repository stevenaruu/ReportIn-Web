import { selectPersonActiveRole } from '@/store/person/selector';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ComplainantPage from './complainant-page';
import CustodianPage from './custodian-page';
import BuildingManagementPage from './building-management-page';
import { getSubdomainResponseExample } from '@/examples/campuses';
import { useReports } from '@/hooks/use-report';

const SubDashboardPage = () => {
  const personActiveRole = useSelector(selectPersonActiveRole);
  const campusId = getSubdomainResponseExample.data.campusId;

  const { reports } = useReports(campusId, { sortBy: "count", order: "desc" });

  useEffect(() => {
    if (!['Complainant', 'Custodian', 'Building Management'].includes(personActiveRole.roleName)) {
      window.location.href = '/logout';
    }
  }, [personActiveRole]);

  switch (personActiveRole.roleName) {
    case 'Complainant':
      return <ComplainantPage />;
    case 'Custodian':
      return <CustodianPage reports={reports} />;
    case 'Building Management':
      return <BuildingManagementPage reports={reports} />;
    default:
      return null;
  }
};

export default SubDashboardPage;