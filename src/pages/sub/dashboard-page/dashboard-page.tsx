import { db } from '@/config/firebase';
import { SubLayout } from '@/layouts/layout';
import { selectPerson } from '@/store/person/selector';
import { IReport } from '@/types/model/report';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

const SubDashboardPage = () => {
  const [reports, setReports] = useState<IReport[]>([]);
  const person = useSelector(selectPerson);

  console.log("person", person);

  useEffect(() => {
    const q = query(
      collection(db, 'Report'),
      orderBy('createdDate', 'desc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const reportData: IReport[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<IReport, 'id'>;
        return {
          id: doc.id,
          ...data,
        };
      });
      setReports(reportData);
    });

    return () => unsub();
  }, []);

  return (
    <SubLayout>
      <h2>Daftar Report (Real-time)</h2>
      <ul>
        {reports.map((report) => (
          <li key={report.id}>
            {report.description?.[0] ?? '(Tidak ada deskripsi)'} - {report.status}
          </li>
        ))}
        {reports.map((report) => (
          <li key={report.id}>
            {report.description?.[0] ?? '(Tidak ada deskripsi)'} - {report.status}
          </li>
        ))}
        {reports.map((report) => (
          <li key={report.id}>
            {report.description?.[0] ?? '(Tidak ada deskripsi)'} - {report.status}
          </li>
        ))}
      </ul>
    </SubLayout>
  )
}

export default SubDashboardPage