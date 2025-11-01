/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetFacilityItemLogQuery } from "@/api/services/facility-item"
import { type Column, DataTable } from "@/components/data-table/data-table"
import { SearchBar } from "@/components/search-bar/search-bar"
import { Button } from "@/components/ui/button"
import { SubLayout } from "@/layouts/layout"
import { formatTableDate } from "@/lib/format-date"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

const FacilityItemLogPage = () => {
  const { itemId } = useParams<{ itemId: string }>()

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const { data, isLoading } = useGetFacilityItemLogQuery({
    itemId: itemId ?? "",
    page,
    search,
  })

  const navigate = useNavigate()

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const columns: Column<any>[] = [
    {
      key: "no",
      header: "No",
      render: (_row, index) => {
        const pageSize = data?.meta?.pageSize ?? 10
        const offset = (page - 1) * pageSize
        return offset + (index ?? 0) + 1
      },
    },
    {
      key: "person",
      header: "Person",
      render: (row) => `${row.person.name}\n${row.person.email}`,
    },
    { key: "issue", header: "Issue" },
    {
      key: "createdDate",
      header: "Created Date",
      render: (row) => formatTableDate(row.createdDate),
    },
  ]

  return (
    <SubLayout>
      <div className="mb-4 flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-xl font-semibold">Facility Item Logs</h2>
      </div>

      <SearchBar onSearch={handleSearch} placeholder="Search Logs..." />
      <DataTable
        isLoading={isLoading}
        columns={columns}
        data={data?.data ?? []}
        privilege={{ view: false, edit: false, delete: false }}
      />
    </SubLayout>
  )
}

export default FacilityItemLogPage