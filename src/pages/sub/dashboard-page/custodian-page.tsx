import { useGetAllAreaQuery } from '@/api/services/area';
import { useGetAllCategoryQuery } from '@/api/services/category';
import { useUpdateReportStatus } from '@/api/services/report';
import EmptyState from '@/components/empty-state/empty-state';
import FilterSort from '@/components/filter-sort/filter-sort';
import { Pagination } from '@/components/pagination/pagination';
import { ReportCard } from '@/components/report-card/report-card';
import { SearchBar } from '@/components/search-bar/search-bar';
import { Button } from '@/components/ui/button';
import { useReports } from '@/hooks/use-report';
import { SubLayout } from '@/layouts/layout'
import { ITEMS_PER_PAGE } from '@/lib/item-per-page';
import { usePrimaryColor } from '@/lib/primary-color';
import { selectCampus } from '@/store/campus/selector';
import { selectPerson } from '@/store/person/selector';
import { IReport } from '@/types/model/report';
import { IUpdateReportStatusRequest } from '@/types/request/report';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@/components/modal/Modal';

const CustodianPage = () => {
  const navigate = useNavigate();

  const person = useSelector(selectPerson);
  const campus = useSelector(selectCampus);
  const { BACKGROUND_PRIMARY_COLOR } = usePrimaryColor();

  // Fetch master data for areas and categories
  const { data: areasData } = useGetAllAreaQuery(campus?.campusId || "");
  const { data: categoriesData } = useGetAllCategoryQuery(campus?.campusId || "");

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
  const [activeTab, setActiveTab] = useState<"reports" | "myReports">("reports");

  const handleSearch = (value: string) => {
    setSearchTerm(value.toLowerCase());
    setCurrentPage(1);
  };

  const tabbedReports = activeTab === "myReports"
    ? reports.filter(r => r.complainant?.some(c => c.personId === person?.id))
    : reports;

  const filteredReports = tabbedReports.filter(
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

  const takeReport = useUpdateReportStatus();

  // Modal state
  const [open, setOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const handleTakeReport = (report: IReport) => {
    const request: IUpdateReportStatusRequest = {
      status: "IN PROGRESS",
      custodianId: person?.id || "",
    };

    takeReport.mutate({
      id: report.id,
      data: request,
    }, {
      onSuccess: (res: unknown) => {
        let message = "Report taken successfully.";
        if (typeof res === 'object' && res !== null && 'message' in res) {
          message = (res as { message?: string }).message || message;
        }
        setModalTitle("Success");
        setModalMessage(message);
        setOpen(true);
      },
      onError: (error: unknown) => {
        let message = "Failed to take report.";
        if (typeof error === 'object' && error !== null && 'message' in error) {
          message = (error as { message?: string }).message || message;
        }
        setModalTitle("Error");
        setModalMessage(message);
        setOpen(true);
      }
    });
  };

  return (
    <SubLayout>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title={modalTitle}
        message={modalMessage}
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
              <Button
                size="sm"
                className="rounded-full px-6"
                style={activeTab === "myReports" ? BACKGROUND_PRIMARY_COLOR(0.7) : {}}
                variant={activeTab === "myReports" ? "default" : "outline"}
                onClick={() => setActiveTab("myReports")}
              >
                My Reports
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
              ? paginatedReports.map((report: IReport) => {
                const isPending = report.status === 'PENDING';
                return (
                  <ReportCard
                    key={report.id}
                    report={report}
                    privilege={{ view: true, take: isPending }}
                    onView={() => navigate(`/report/view/${report.id}`)}
                    onTake={() => handleTakeReport(report)}
                  />
                );
              })
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
                onClick={() => navigate("/report")}
              >
                Create Report
              </Button>
            </div>
          }
        </>
      ) : (
        <EmptyState count={allReports.length} type="publicReport">
          <Button
            style={BACKGROUND_PRIMARY_COLOR(0.7)}
            className="w-full md:w-1/3"
            variant="default"
            onClick={() => navigate("/report")}
          >
            Create Report
          </Button>
        </EmptyState>
      )}
    </SubLayout>
  );
}

export default CustodianPage