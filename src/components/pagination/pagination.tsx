import { Button } from "@/components/ui/button"
import { BACKGROUND_PRIMARY_COLOR } from "@/lib/primary-color"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="default"
        style={BACKGROUND_PRIMARY_COLOR(0.7)}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </Button>

      {Array.from({ length: totalPages }).map((_, index) => (
        <Button
          key={index}
          style={currentPage === index + 1 ? BACKGROUND_PRIMARY_COLOR(0.7) : {}}
          variant={currentPage === index + 1 ? "default" : "secondary"}
          onClick={() => onPageChange(index + 1)}
        >
          {index + 1}
        </Button>
      ))}

      <Button
        variant="default"
        style={BACKGROUND_PRIMARY_COLOR(0.7)} onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  )
}