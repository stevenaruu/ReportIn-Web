import { useGetAllCampusByUserId, useDeleteCampus } from "@/api/services/campus"
import { CampusCard } from "@/components/campus-card/campus-card"
import EmptyState from "@/components/empty-state/empty-state"
import { Modal } from "@/components/modal/Modal"
import { Pagination } from "@/components/pagination/pagination"
import { SearchBar } from "@/components/search-bar/search-bar"
import { Button } from "@/components/ui/button"
import { RootLayout } from "@/layouts/layout"
import { usePrimaryColor } from "@/lib/primary-color"
import { selectUser } from "@/store/user/selector"
import { IAllCampusByUserIdResponse } from "@/types/response/campus"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

const RootDashboardPage = () => {
  const queryClient = useQueryClient();
  
  const user = useSelector(selectUser);
  const { BACKGROUND_PRIMARY_COLOR } = usePrimaryColor();
  const navigate = useNavigate();
  
  const { data, isLoading } = useGetAllCampusByUserId(user?.id ?? "");
  const deleteCampus = useDeleteCampus();

  // modal state
  const [modalTitle, setModalTitle] = useState("Delete Campus")
  const [modalMessage, setModalMessage] = useState("Are you sure you want to delete this campus? This action cannot be undone.")
  const [modalType, setModalType] = useState<"confirmDelete" | "result" | null>(null);
  
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [campusIdToDelete, setCampusIdToDelete] = useState("");  // Normalisasi data biar gak undefined/null
  const campuses: IAllCampusByUserIdResponse[] = data?.data ?? [];

  const handleEdit = (campus: IAllCampusByUserIdResponse) => {
    console.log("Edit clicked:", campus);
    // contoh: navigate(`/campus/${campus.id}/edit`)
  };

  const handleDelete = () => {
    deleteCampus.mutate(campusIdToDelete, {
      onSuccess: (res) => {
        queryClient.invalidateQueries({ queryKey: ["campus"], exact: false });

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

  const handleDeleteClick = (campus: IAllCampusByUserIdResponse) => {
    setCampusIdToDelete(campus.id)
    setModalType("confirmDelete")
  };

  const handleSearch = (value: string) => {
    console.log("search", search);
    setSearch(value);
    setPage(1);
  }

  return (
    <RootLayout>
      <Modal
        open={modalType !== null}
        onOpenChange={() => setModalType(null)}
        title={modalTitle}
        message={modalMessage}
        onConfirm={modalType === "confirmDelete" ? handleDelete : undefined}
        confirmText={modalType === "confirmDelete" ? "Delete" : "OK"}
        onCancel={modalType === "confirmDelete" ? () => setModalType(null) : undefined}
        cancelText="Cancel"
        loading={deleteCampus.isLoading}
      />

      <div className="mt-6">
        <SearchBar onSearch={handleSearch} placeholder="Search Campus..." />

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col gap-4">
            {[...Array(4)].map((_, i) => (
              <CampusCard
                key={i}
                isLoading
                campus={{} as IAllCampusByUserIdResponse}
              />
            ))}
          </div>
        )}

        {/* Data kampus */}
        {!isLoading && campuses.length > 0 && (
          <div className="flex flex-col gap-4">
            {campuses.map((campus) => (
              <CampusCard
                key={campus.id}
                campus={campus}
                privilege={{ edit: true, delete: true }}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-col md:flex-row gap-6 md:gap-0 justify-between items-center">
          <Pagination
            currentPage={page}
            totalPages={1}
            onPageChange={setPage}
          />

          <Button
            style={BACKGROUND_PRIMARY_COLOR(1)}
            className="w-full md:w-1/4"
            variant="default"
            onClick={() => navigate("/browse-area/create")}
          >
            Create Campus
          </Button>
        </div>

        {/* Empty state */}
        {!isLoading && (
          <EmptyState
            className="mt-10"
            count={campuses.length}
            type="campus"
          >
            <Button
              style={BACKGROUND_PRIMARY_COLOR(1)}
              className="w-full md:w-1/3"
              variant="default"
              onClick={() => navigate("/campus")}
            >
              Create Campus
            </Button>
          </EmptyState>
        )}
      </div>
    </RootLayout>
  );
};

export default RootDashboardPage;