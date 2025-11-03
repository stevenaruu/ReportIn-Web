/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetFacilityItemLogQuery } from "@/api/services/facility-item"
import { type Column, DataTable } from "@/components/data-table/data-table"
import Header from "@/components/header/header"
import { SearchBar } from "@/components/search-bar/search-bar"
import { Button } from "@/components/ui/button"
import { SubLayout } from "@/layouts/layout"
import { formatTableDate } from "@/lib/format-date"
import { usePrimaryColor } from "@/lib/primary-color"
import { IGetFacilityItemResponse } from "@/types/response/facility-item"
import { useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"

const FacilityItemLogPage = () => {
  const { areaId, facilityItemId } = useParams<{ areaId: string; facilityItemId: string }>()
  const navigate = useNavigate()

  const location = useLocation()
  const facilityItem = location.state as IGetFacilityItemResponse

  const { BACKGROUND_PRIMARY_COLOR } = usePrimaryColor()

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const { data, isLoading } = useGetFacilityItemLogQuery({
    itemId: facilityItemId ?? "",
    page,
    search,
  })

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
      header: "Technician",
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
      <Header title="Facility Item Logs" subheader={`Facility Item: ${facilityItem.name}`} />
      <SearchBar onSearch={handleSearch} placeholder="Search Logs..." />
      <DataTable
        isLoading={isLoading}
        columns={columns}
        data={data?.data ?? []}
        privilege={{ view: false, edit: false, delete: false }}
      />
      <div className="mt-6 flex flex-col md:flex-row gap-3 md:gap-0 justify-start">
        <Button
          style={BACKGROUND_PRIMARY_COLOR(0.7)}
          className="w-full md:w-auto bg-transparent"
          variant="default"
          onClick={() => navigate(`/browse-facility-item/${areaId}`)}
        >
          Back
        </Button>
      </div>
    </SubLayout>
  )
}

export default FacilityItemLogPage