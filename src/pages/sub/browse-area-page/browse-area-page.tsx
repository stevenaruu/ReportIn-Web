/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetAreaQuery } from "@/api/services/area"
import { Column, DataTable } from "@/components/data-table/data-table"
import { Pagination } from "@/components/pagination/pagination"
import { SearchBar } from "@/components/search-bar/search-bar"
import { Button } from "@/components/ui/button"
import { getSubdomainResponseExample } from "@/examples/campuses"
import { SubLayout } from "@/layouts/layout"
import { formatTableDate } from "@/lib/format-date"
import { BACKGROUND_PRIMARY_COLOR } from "@/lib/primary-color"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const BrowseAreaPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetAreaQuery({
    campusId: getSubdomainResponseExample.data.campusId,
    page,
    search,
  });

  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  }

  const columns: Column<any>[] = [
    {
      key: "no",
      header: "No",
      render: (_row, index) => {
        const pageSize = data?.meta?.pageSize ?? 10;
        const offset = (page - 1) * pageSize;
        return offset + (index ?? 0) + 1;
      }
    },
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
      {data?.meta && (
        <div className="mt-6 flex flex-col md:flex-row gap-6 md:gap-0 justify-between items-center">
          <Pagination
            currentPage={page}
            totalPages={data.meta.totalPages}
            onPageChange={setPage}
          />
          <Button
            style={BACKGROUND_PRIMARY_COLOR(0.7)}
            className="w-full md:w-1/4"
            variant="default"
            onClick={() => navigate("/report")}
          >
            Create Area
          </Button>
        </div>
      )}
    </SubLayout>
  )
}

export default BrowseAreaPage