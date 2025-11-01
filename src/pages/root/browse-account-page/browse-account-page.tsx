/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useGetAllPersonQuery } from "@/api/services/person"
import { Column, DataTable } from "@/components/data-table/data-table"
import { SearchBar } from "@/components/search-bar/search-bar"
import { RootLayout, SubLayout } from "@/layouts/layout"
import { useNavigate, useParams } from "react-router-dom"
import { formatTableDate } from "@/lib/format-date"
import { useSelector } from "react-redux"
import { selectCampus } from "@/store/campus/selector"

const RootBrowseAccountPage = () => {
  const { campusId } = useParams<{ campusId: string }>();

  const { data, isLoading, isError, error } = useGetAllPersonQuery(campusId ?? '');

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
    <RootLayout className="my-4 md:my-8">
      <SearchBar onSearch={handleSearch} placeholder="Search Account..." />
      <DataTable
        isLoading={isLoading}
        columns={columns}
        data={data?.data ?? []}
        privilege={{ view: true }}
        onView={(row) => navigate('/browse-account/detail/' + row.id, { state: row })}
      />
    </RootLayout>
  )
}

export default RootBrowseAccountPage