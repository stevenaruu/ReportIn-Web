/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash } from "lucide-react"
import { usePrimaryColor } from "@/lib/primary-color"
import { useSelector } from "react-redux"
import { selectCampus } from "@/store/campus/selector"

export interface Column<T> {
  key: keyof T | string
  header: string
  render?: (row: T, rowIndex?: number) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  privilege?: {
    view?: boolean
    edit?: boolean
    delete?: boolean
  }
  onView?: (row: T) => void
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  privilege = { view: false, edit: false, delete: false },
  onView,
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  const { BACKGROUND_PRIMARY_COLOR } = usePrimaryColor();
  const campus = useSelector(selectCampus);

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full border-collapse">
        <thead
          style={BACKGROUND_PRIMARY_COLOR(campus ? 0.7 : 1)}
        >
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className="px-4 py-2 text-left text-sm font-medium text-white border-b"
              >
                {col.header}
              </th>
            ))}
            <th className="text-center px-4 py-2 text-sm font-medium text-white border-b">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            // Skeleton loading rows
            [...Array(10)].map((_, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((_, colIndex) => (
                  <td key={colIndex} className="px-4 py-2 border-b">
                    <div className="h-5 w-full rounded bg-gray-200 animate-pulse" />
                  </td>
                ))}
                <td className="px-4 py-2 border-b">
                  <div className="flex justify-center items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gray-200 animate-pulse" />
                    <div className="h-6 w-6 rounded-full bg-gray-200 animate-pulse" />
                    <div className="h-6 w-6 rounded-full bg-gray-200 animate-pulse" />
                  </div>
                </td>
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="px-4 py-4 text-center text-sm text-[#5d5d5d]"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={cn(
                  "hover:bg-gray-50",
                  rowIndex % 2 === 1 && "bg-gray-50/50"
                )}
              >
                {columns.map((col, colIndex) => {
                  const value = col.render
                    ? col.render(row, rowIndex)
                    : (row as any)[col.key]

                  // jika value adalah string dengan pola "NAME\nDATE"
                  if (typeof value === "string" && value.includes("\n")) {
                    const [name, date] = value.split("\n")
                    return (
                      <td
                        key={colIndex}
                        className="px-4 py-2 text-sm text-[#5d5d5d] border-b"
                      >
                        <div className="flex flex-col">
                          <span>{name}</span>
                          <span className="text-xs text-gray-500">{date}</span>
                        </div>
                      </td>
                    )
                  }

                  return (
                    <td
                      key={colIndex}
                      className="px-4 py-2 text-sm text-[#5d5d5d] border-b"
                    >
                      {value}
                    </td>
                  )
                })}
                <td className="px-4 py-2 text-sm text-[#5d5d5d] border-b">
                  <div className="flex justify-center items-center gap-2">
                    {privilege.view && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onView?.(row)}
                      >
                        <Eye className="w-4 h-4 text-[#5d5d5d]" />
                      </Button>
                    )}
                    {privilege.edit && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onEdit?.(row)}
                      >
                        <Edit className="w-4 h-4 text-[#5d5d5d]" />
                      </Button>
                    )}
                    {privilege.delete && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDelete?.(row)}
                      >
                        <Trash className="w-4 h-4 text-[#5d5d5d]" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}