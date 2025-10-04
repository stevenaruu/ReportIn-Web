import { Button } from "@/components/ui/button";
import { usePrimaryColor } from "@/lib/primary-color";
import { selectCampus } from "@/store/campus/selector";
import { useSelector } from "react-redux";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const { BACKGROUND_PRIMARY_COLOR } = usePrimaryColor();
  const campus = useSelector(selectCampus);

  if (totalPages <= 1) return <div />;

  const renderPages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 3) {
      // jika total halaman ≤ 3, tampilkan semua
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 2) {
      // di awal
      pages.push(1, 2, 3);
      if (totalPages > 3) pages.push("...", totalPages);
    } else if (currentPage >= totalPages - 1) {
      // di akhir
      pages.push(1, "...");
      for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i);
    } else {
      // di tengah
      pages.push(1, "...", currentPage, "...", totalPages);
    }

    return pages.map((page, index) =>
      page === "..." ? (
        <span key={index} className="px-2">
          ...
        </span>
      ) : (
        <Button
          key={index}
          style={currentPage === page ? (campus ? BACKGROUND_PRIMARY_COLOR(0.7) : BACKGROUND_PRIMARY_COLOR(1)) : {}}
          variant={currentPage === page ? "default" : "secondary"}
          onClick={() => onPageChange(page as number)}
        >
          {page}
        </Button>
      )
    );
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="default"
        style={campus ? BACKGROUND_PRIMARY_COLOR(0.7) : BACKGROUND_PRIMARY_COLOR(1)}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </Button>

      {renderPages()}

      <Button
        variant="default"
        style={campus ? BACKGROUND_PRIMARY_COLOR(0.7) : BACKGROUND_PRIMARY_COLOR(1)}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
};