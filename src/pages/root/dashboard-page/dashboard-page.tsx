/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetAllCampusByUserId } from "@/api/services/campus"
import { CampusCard } from "@/components/campus-card/campus-card"
import EmptyState from "@/components/empty-state/empty-state"
import { Pagination } from "@/components/pagination/pagination"
import { SearchBar } from "@/components/search-bar/search-bar"
import { Button } from "@/components/ui/button"
import { RootLayout } from "@/layouts/layout"
import { usePrimaryColor } from "@/lib/primary-color"
import { selectUser } from "@/store/user/selector"
import { IAllCampusByUserIdResponse } from "@/types/response/campus"
import { useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

const RootDashboardPage = () => {
  const user = useSelector(selectUser);
  const { BACKGROUND_PRIMARY_COLOR } = usePrimaryColor();
  const navigate = useNavigate();

  const { data, isLoading } = useGetAllCampusByUserId(user?.id ?? "");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Normalisasi data biar gak undefined/null
  const campuses: IAllCampusByUserIdResponse[] = data?.data ?? [];

  const handleEdit = (campus: IAllCampusByUserIdResponse) => {
    console.log("Edit clicked:", campus);
    // contoh: navigate(`/campus/${campus.id}/edit`)
  };

  const handleDelete = (campus: IAllCampusByUserIdResponse) => {
    console.log("Delete clicked:", campus);
    // contoh: panggil API delete
  };

  const handleSearch = (value: string) => {
    console.log("search", search);
    setSearch(value);
    setPage(1);
  }

  return (
    <RootLayout>
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
                onDelete={handleDelete}
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