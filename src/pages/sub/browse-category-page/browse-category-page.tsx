/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDeleteCategory, useGetCategoryQuery } from "@/api/services/category"
import { Column, DataTable } from "@/components/data-table/data-table"
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
import { useNavigate } from "react-router-dom"

const BrowseCategoryPage = () => {
  const queryClient = useQueryClient();

  const campus = useSelector(selectCampus);
  const { BACKGROUND_PRIMARY_COLOR } = usePrimaryColor();

  // modal state
  const [modalTitle, setModalTitle] = useState("Delete Category")
  const [modalMessage, setModalMessage] = useState("Are you sure you want to delete this category? This action cannot be undone.")
  const [modalType, setModalType] = useState<"confirmDelete" | "result" | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState("");
  const deleteCategory = useDeleteCategory();

  const { data, isLoading } = useGetCategoryQuery({
    campusId: campus?.campusId ?? '',
    page,
    search,
  });

  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  }

  const handleDelete = () => {
    deleteCategory.mutate(categoryIdToDelete, {
      onSuccess: (res) => {
        queryClient.invalidateQueries({ queryKey: ["category"], exact: false });

        setModalTitle("Success");
        setModalMessage(res.message);
        setModalType("result");
      },
      onError: (err) => {
        setModalTitle("Error");
        setModalMessage(err.message);
        setModalType("result");
      }
    });
  };

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
      <Modal
        open={modalType !== null}
        onOpenChange={() => setModalType(null)}
        title={modalTitle}
        message={modalMessage}
        onConfirm={modalType === "confirmDelete" ? handleDelete : undefined}
        confirmText={modalType === "confirmDelete" ? "Delete" : "OK"}
        onCancel={modalType === "confirmDelete" ? () => setModalType(null) : undefined}
        cancelText="Cancel"
        loading={deleteCategory.isLoading}
      />

      <SearchBar onSearch={handleSearch} placeholder="Search Category..." />
      <DataTable
        isLoading={isLoading}
        columns={columns}
        data={data?.data ?? []}
        privilege={{ edit: true, delete: true }}
        onEdit={(row) => navigate('/browse-category/edit/' + row.id, { state: row })}
        onDelete={(row) => {
          setCategoryIdToDelete(row.id)
          setModalType("confirmDelete")
        }}
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
            onClick={() => navigate("/browse-category/create")}
          >
            Create Category
          </Button>
        </div>
      )}
    </SubLayout>
  )
}

export default BrowseCategoryPage