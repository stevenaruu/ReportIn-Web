/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetAreaQuery } from "@/api/services/area"
import { Column, DataTable } from "@/components/data-table/data-table"
import { SearchBar } from "@/components/search-bar/search-bar"
import { getSubdomainResponseExample } from "@/examples/campuses"
import { SubLayout } from "@/layouts/layout"
import { formatTableDate } from "@/lib/format-date"
import { useNavigate } from "react-router-dom"

const BrowseAreaPage = () => {
  const { data, isLoading } = useGetAreaQuery({ campusId: getSubdomainResponseExample.data.campusId });

  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    console.log("User searched:", value)
  }

  const columns: Column<any>[] = [
    { key: "no", header: "No", render: (_row, index) => (index ?? 0) + 1 },
    { key: "name", header: "Name" },
    { key: "beaconId", header: "Beacon ID" },
    {
      key: "createdBy",
      header: "Created By-Date",
      render: (row) => `${row.createdBy}\n${formatTableDate(row.createdDate)}`
    },
    {
      key: "updatedBy",
      header: "Updated By-Date",
      render: (row) => `${row.lastUpdatedBy}\n${formatTableDate(row.createdDate)}`
    },
  ]
  return (
    <SubLayout>
      <SearchBar onSearch={handleSearch} placeholder="Search Area..." />
      <DataTable
        isLoading={isLoading}
        columns={columns}
        data={data?.data ?? []}
        privilege={{ view: true }}
        onView={(row) => navigate('/browse-account/' + row.id, { state: row })}
      />
    </SubLayout>
  )
}

export default BrowseAreaPage