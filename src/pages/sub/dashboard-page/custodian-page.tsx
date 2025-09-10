import { SubLayout } from '@/layouts/layout'
import { IReport } from '@/types/model/report'

const CustodianPage = ({ reports }: { reports: IReport[] }) => {
  return (
    <SubLayout>
      <h2>Daftar Report (Real-time)</h2>
      <ul>
        {reports.map((report) => (
          <li key={report.id}>
            {report.description?.[0] ?? '(Tidak ada deskripsi)'} - {report.status}
          </li>
        ))}
      </ul>
    </SubLayout>)
}

export default CustodianPage