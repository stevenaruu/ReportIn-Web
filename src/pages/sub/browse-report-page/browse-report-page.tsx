import { useState, useEffect, useMemo } from "react";
import { SearchBar } from "@/components/search-bar/search-bar";
import { SubLayout } from "@/layouts/layout";
import { ReportCard } from "@/components/report-card/report-card";
import { Pagination } from "@/components/pagination/pagination";
import { Button } from "@/components/ui/button";
import { useReports } from "@/hooks/use-report";
import { useDeleteReport } from "@/api/services/report";
import { IReport } from "@/types/model/report";
import FilterSort from "@/components/filter-sort/filter-sort";
import { useSelector } from "react-redux";
import { selectCampus } from "@/store/campus/selector";
import EmptyState from "@/components/empty-state/empty-state";
import { usePrimaryColor } from "@/lib/primary-color";
import { ITEMS_PER_PAGE } from "@/lib/item-per-page";
import { Modal } from "@/components/modal/Modal";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useGetAllAreaQuery } from "@/api/services/area";
import { useGetAllCategoryQuery } from "@/api/services/category";

const BrowseReportPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const campus = useSelector(selectCampus);
  const { BACKGROUND_PRIMARY_COLOR } = usePrimaryColor();

  // Fetch master data for areas and categories
  const { data: areasData } = useGetAllAreaQuery(campus?.campusId || "");
  const { data: categoriesData } = useGetAllCategoryQuery(campus?.campusId || "");

  // modal state
  const [modalTitle, setModalTitle] = useState("Delete Report")
  const [modalMessage, setModalMessage] = useState("Are you sure you want to delete this report? This action cannot be undone.")
  const [modalType, setModalType] = useState<"confirmDelete" | "result" | null>(null);
  const [reportIdToDelete, setReportIdToDelete] = useState("");
  const deleteReport = useDeleteReport();

  // filter & sort state
  const [sortBy, setSortBy] = useState<"status" | "area" | "category" | "count">("count");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [areaFilter, setAreaFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);

  const reportOptions = useMemo(() => ({
    sortBy,
    order,
    filters: { status: statusFilter, areas: areaFilter, categories: categoryFilter }
  }), [sortBy, order, statusFilter, areaFilter, categoryFilter]);

  const { allReports, reports, loading } = useReports(campus?.campusId, reportOptions);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"reports">("reports");

  const handleSearch = (value: string) => {
    setSearchTerm(value.toLowerCase());
    setCurrentPage(1);
  };

  const handleDelete = () => {
    deleteReport.mutate(reportIdToDelete, {
      onSuccess: (res) => {
        queryClient.invalidateQueries({ queryKey: ["reports"], exact: false });

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

  const handleDeleteClick = (report: IReport) => {
    setReportIdToDelete(report.id)
    setModalType("confirmDelete")
  };

  const filteredReports = reports.filter(
    (r) =>
      r.area?.name?.toLowerCase().includes(searchTerm) ||
      r.complainant?.some(c => c.description.toLowerCase().includes(searchTerm)) ||
      r.category?.name?.toLowerCase().includes(searchTerm) ||
      r.lastUpdatedBy?.toLowerCase().includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [totalPages, currentPage]);

  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
        loading={deleteReport.isLoading}
      />

      {loading ? (
        <div className="flex flex-col">
          <SearchBar onSearch={handleSearch} placeholder="Search Report..." />

          <div className="flex flex-col gap-4">
            {Array.from({ length: 5 }).map((_, idx) => (
              <ReportCard key={`skeleton-${idx}`} isLoading report={{} as IReport} />
            ))}
          </div>
        </div>
      ) : allReports.length > 0 ? (
        <>
          <SearchBar onSearch={handleSearch} placeholder="Search Report..." />

          <div className="flex flex-col gap-2 md:flex-row justify-between mb-4">
            <div className="flex gap-3">
              <Button
                size="sm"
                className="rounded-full px-6"
                style={activeTab === "reports" ? BACKGROUND_PRIMARY_COLOR(0.7) : {}}
                variant={activeTab === "reports" ? "default" : "outline"}
                onClick={() => setActiveTab("reports")}
              >
                Reports
              </Button>
            </div>
            <FilterSort
              areas={areasData?.data?.map(area => area.name) || []}
              categories={categoriesData?.data?.map(category => category.name) || []}
              onApply={({ sortBy, sortDirection, status, areas, categories }) => {
                setSortBy(sortBy);
                setOrder(sortDirection);
                setStatusFilter(status);
                setAreaFilter(areas);
                setCategoryFilter(categories);
              }}
            />
          </div>

          <div className="flex flex-col gap-4">
            {paginatedReports.length > 0
              ? paginatedReports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  privilege={{ view: true, delete: true }}
                  onView={() => navigate(`/report/view/${report.id}`)}
                  onDelete={handleDeleteClick}
                />
              ))
              : (
                <div className="flex justify-center items-center">
                  <EmptyState className="w-3/6 mt-10" count={reports.length} type="filterReport" />
                </div>
              )
            }
          </div>

          {reports.length > 0 &&
            <div className="mt-6 flex flex-col md:flex-row gap-6 md:gap-0 justify-between items-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
              <Button
                style={BACKGROUND_PRIMARY_COLOR(0.7)}
                className="w-full md:w-1/4"
                variant="default"
                onClick={() => navigate("/report/export")}
              >
                Export Report
              </Button>
            </div>
          }
        </>
      ) : (
        <EmptyState count={allReports.length} type="privateReport" />
      )}
    </SubLayout>
  );
};

export default BrowseReportPage;