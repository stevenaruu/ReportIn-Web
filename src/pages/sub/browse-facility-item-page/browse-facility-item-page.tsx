/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDeleteFacilityItem, useGetFacilityItemQuery } from "@/api/services/facility-item"
import { type Column, DataTable } from "@/components/data-table/data-table"
import { Modal } from "@/components/modal/Modal"
import { Pagination } from "@/components/pagination/pagination"
import { SearchBar } from "@/components/search-bar/search-bar"
import { Button } from "@/components/ui/button"
import { SubLayout } from "@/layouts/layout"
import { formatTableDate } from "@/lib/format-date"
import { usePrimaryColor } from "@/lib/primary-color"
import { selectCampus } from "@/store/campus/selector"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { Eye } from "lucide-react"
import Header from "@/components/header/header"
import { IGetAreaResponse } from "@/types/response/area"

const BrowseFacilityItemPage = () => {
  const queryClient = useQueryClient()

  const location = useLocation()
  const area = location.state as IGetAreaResponse;

  const { areaId } = useParams<{ areaId: string }>()

  const campus = useSelector(selectCampus)
  const { BACKGROUND_PRIMARY_COLOR, TEXT_PRIMARY_COLOR } = usePrimaryColor()

  // modal state
  const [modalTitle, setModalTitle] = useState("Delete Facility Item")
  const [modalMessage, setModalMessage] = useState(
    "Are you sure you want to delete this facility item? This action cannot be undone.",
  )
  const [modalType, setModalType] = useState<"confirmDelete" | "result" | null>(null)

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [facilityItemIdToDelete, setFacilityItemIdToDelete] = useState("")
  const deleteFacilityItem = useDeleteFacilityItem()

  const { data, isLoading } = useGetFacilityItemQuery({
    campusId: campus?.campusId ?? "",
    areaId: areaId ?? "",
    page,
    search,
  })

  const navigate = useNavigate()

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleDelete = () => {
    deleteFacilityItem.mutate(facilityItemIdToDelete, {
      onSuccess: (res) => {
        queryClient.invalidateQueries({ queryKey: ["facilityItem"], exact: false })

        setModalTitle("Success")
        setModalMessage(res.message)
        setModalType("result")
      },
      onError: (err) => {
        setModalTitle("Error")
        setModalMessage(err.message)
        setModalType("result")
      },
    })
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
    { key: "name", header: "Name" },
    {
      key: "createdBy",
      header: "Created By-Date",
      render: (row) => `${row.createdBy}\n${formatTableDate(row.createdDate)}`,
    },
    {
      key: "updatedBy",
      header: "Updated By-Date",
      render: (row) => `${row.lastUpdatedBy}\n${formatTableDate(row.lastUpdatedDate)}`,
    },
  ]

  return (
    <SubLayout>
      <Header title="Browse Facility Item" subheader={`Area: ${area.name}`} />

      <Modal
        open={modalType !== null}
        onOpenChange={() => setModalType(null)}
        title={modalTitle}
        message={modalMessage}
        onConfirm={modalType === "confirmDelete" ? handleDelete : undefined}
        confirmText={modalType === "confirmDelete" ? "Delete" : "OK"}
        onCancel={modalType === "confirmDelete" ? () => setModalType(null) : undefined}
        cancelText="Cancel"
        loading={deleteFacilityItem.isLoading}
      />

      <SearchBar onSearch={handleSearch} placeholder="Search Facility Item..." />
      <DataTable
        isLoading={isLoading}
        columns={columns}
        data={data?.data ?? []}
        privilege={{
          view: { enabled: true, icon: <Eye className="w-4 h-4 text-[#5d5d5d]" /> },
          edit: true,
          delete: true,
        }}
        onView={(row) => navigate(`/browse-facility-item/${areaId}/logs/${row.id}`, { state: row })}
        onEdit={(row) => navigate("/browse-facility-item/edit/" + row.id, { state: row })}
        onDelete={(row) => {
          setFacilityItemIdToDelete(row.id)
          setModalType("confirmDelete")
        }}
      />
      {data?.meta && (
        <div className="mt-6 flex flex-col md:flex-row gap-6 md:gap-0 justify-between items-center">
          <Pagination currentPage={page} totalPages={data.meta.totalPages} onPageChange={setPage} />
          <div className="w-full md:w-auto flex flex-col md:flex-row gap-3 md:gap-2">
            <Button
              style={TEXT_PRIMARY_COLOR(0.7)}
              className="w-full md:w-auto bg-transparent"
              variant="outline"
              onClick={() => navigate("/browse-area")}
            >
              Back
            </Button>
            <Button
              style={BACKGROUND_PRIMARY_COLOR(0.7)}
              className="w-full md:w-auto"
              variant="default"
              onClick={() => navigate("/browse-facility-item/create", { state: { areaId } })}
            >
              Create Facility Item
            </Button>
          </div>
        </div>
      )}
    </SubLayout>
  )
}

export default BrowseFacilityItemPage