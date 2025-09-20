/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useGetAllPersonQuery } from "@/api/services/person"
import { Column, DataTable } from "@/components/data-table/data-table"
import { SearchBar } from "@/components/search-bar/search-bar"
import { SubLayout } from "@/layouts/layout"
import { useNavigate } from "react-router-dom"
import { formatTableDate } from "@/lib/format-date"
import { useSelector } from "react-redux"
import { selectCampus } from "@/store/campus/selector"

const BrowseAccountPage = () => {
  const campus = useSelector(selectCampus);

  const { data, isLoading, isError, error } = useGetAllPersonQuery(campus?.campusId ?? '');

  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    console.log("User searched:", value)
  }

  const columns: Column<any>[] = [
    { key: "no", header: "No", render: (_row, index) => (index ?? 0) + 1 },
    { key: "email", header: "Email" },
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
      <SearchBar onSearch={handleSearch} placeholder="Search Account..." />
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

export default BrowseAccountPage