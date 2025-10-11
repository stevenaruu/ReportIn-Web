import { useGetAllCampus } from "@/api/services/campus"
import { CampusCard } from "@/components/campus-card/campus-card"
import EmptyState from "@/components/empty-state/empty-state"
import { Pagination } from "@/components/pagination/pagination"
import { SearchBar } from "@/components/search-bar/search-bar"
import { RootLayout } from "@/layouts/layout"
import { IAllCampusByUserIdResponse } from "@/types/response/campus"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const SuperAdminPage = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetAllCampus({
    page,
    search,
  });

  // Normalisasi data biar gak undefined/null
  const campuses: IAllCampusByUserIdResponse[] = data?.data ?? [];

  const handleEdit = (campus: IAllCampusByUserIdResponse) => {
    navigate(`/campus/verify/${campus.id}`, { state: { campus } })
  };

  const handleSearch = (value: string) => {
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
            {[...Array(5)].map((_, i) => (
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
                privilege={{ edit: true }}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}

        {data?.meta && (
          <div className="mt-6 flex flex-col md:flex-row gap-6 md:gap-0 justify-between items-center">
            <Pagination
              currentPage={page}
              totalPages={data.meta.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && (
          <EmptyState
            count={campuses.length}
            type="campus"
          />
        )}
      </div>
    </RootLayout>
  );
};

export default SuperAdminPage;