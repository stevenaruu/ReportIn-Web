import { Card, CardContent } from "@/components/ui/card"
import { Eye, Pencil, Trash, Send, Clock, CheckCircle } from "lucide-react"
import { IReport } from "@/types/model/report"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useState } from "react"
import { usePrimaryColor } from "@/lib/primary-color"

interface ReportCardProps<T = IReport> {
  report: T
  isLoading?: boolean
  privilege?: {
    view?: boolean
    take?: boolean
    edit?: boolean
    delete?: boolean
  }
  onView?: (row: T) => void
  onTake?: (row: T) => void
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return <Clock className="h-2.5 w-2.5 text-white" />
    case "in progress":
      return <Send className="h-2.5 w-2.5 text-white" />
    case "done":
      return <CheckCircle className="h-2.5 w-2.5 text-white" />
    default:
      return null
  }
}

export const ReportCard = <T extends IReport>({
  report,
  isLoading = false,
  privilege = { view: true, take: false, edit: false, delete: false },
  onView,
  onEdit,
  onDelete,
}: ReportCardProps<T>) => {
  const { BACKGROUND_PRIMARY_COLOR } = usePrimaryColor();
  
  const [currentImage, setCurrentImage] = useState(0)

  const images = report.image || []
  const description = report.description?.[0] || "No description"
  const extraDescriptions =
    report.description?.length > 1 ? report.description.length - 1 : 0

  const handleDotClick = (index: number) => {
    setCurrentImage(index)
  }

  if (isLoading) {
    return (
      <Card className="p-4 shadow-sm rounded-md bg-neutral-50">
        <div className="flex gap-4">
          <Skeleton className="w-28 h-28 md:w-20 md:h-20 rounded-lg" />
          <div className="flex-1 flex flex-col gap-2">
            <Skeleton className="h-4 w-1/3" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="text-[#5d5d5d] relative flex flex-col items-center md:items-start md:flex-row p-4 shadow-sm rounded-md bg-neutral-50">
      {/* Action buttons (Desktop: top-right) */}
      <div className="hidden md:flex gap-2 absolute top-3 right-3">
        {privilege.delete && (
          <Button
            style={BACKGROUND_PRIMARY_COLOR(0.5)}
            size="icon"
            variant="destructive"
            className="rounded-md h-8 w-8"
            onClick={() => onDelete?.(report)}
          >
            <Trash className="h-4 w-4 text-white" />
          </Button>
        )}
        {privilege.edit && (
          <Button
            style={BACKGROUND_PRIMARY_COLOR(0.5)}
            size="icon"
            variant="outline"
            className="rounded-md h-8 w-8"
            onClick={() => onEdit?.(report)}
          >
            <Pencil className="h-4 w-4 text-white" />
          </Button>
        )}
        {privilege.take && (
          <Button
            style={BACKGROUND_PRIMARY_COLOR(0.5)}
            size="icon"
            variant="outline"
            className="rounded-md h-8 w-8"
            onClick={() => onView?.(report)}
          >
            <Send className="h-4 w-4 text-white" />
          </Button>
        )}
        {privilege.view && (
          <Button
            style={BACKGROUND_PRIMARY_COLOR(0.5)}
            size="icon"
            variant="outline"
            className="rounded-md h-8 w-8"
            onClick={() => onView?.(report)}
          >
            <Eye className="h-4 w-4 text-white" />
          </Button>
        )}
      </div>

      {/* Image Carousel */}
      <div className="flex flex-col items-center mb-3 md:mb-0 md:mr-4 self-center">
        <div className="relative w-28 h-28 md:w-20 md:h-20 overflow-hidden rounded-lg">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentImage * 100}%)` }}
          >
            {images.length > 0 ? (
              images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Report ${idx + 1}`}
                  className="w-28 h-28 md:w-20 md:h-20 object-cover flex-shrink-0"
                />
              ))
            ) : (
              <img
                src="/placeholder.png"
                alt="Placeholder"
                className="w-28 h-28 md:w-20 md:h-20 object-cover"
              />
            )}
          </div>
        </div>

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="flex gap-1 mt-2">
            {images.slice(0, 5).map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                style={
                  currentImage === idx ? BACKGROUND_PRIMARY_COLOR(0.5) : {}
                }
                className={`w-2 h-2 rounded-full ${currentImage === idx ? "" : "bg-neutral-300"
                  }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Report Details */}
      <CardContent className="flex-1 items-center md:items-start p-0 flex flex-col gap-2">
        <p className="font-medium flex items-center gap-2">
          Location: {report.area?.name}
        </p>

        <div className="flex justify-center md:justify-start flex-wrap gap-2">
          {report.category?.name && (
            <Badge
              style={BACKGROUND_PRIMARY_COLOR(0.5)}
              className="text-white"
              variant="outline"
            >
              {report.category.name}
            </Badge>
          )}
          {report.status && (
            <Badge
              style={BACKGROUND_PRIMARY_COLOR(0.5)}
              className="text-white"
              variant="outline"
            >
              {report.status} &nbsp;
              {getStatusIcon(report.status)}
            </Badge>
          )}
          {report.count > 0 && (
            <Badge
              style={BACKGROUND_PRIMARY_COLOR(0.5)}
              className="text-white"
              variant="outline"
            >
              {report.count} Similar Reports
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 w-full">
          <p className="text-sm text-neutral-600 line-clamp-1 flex-1">
            {description}
          </p>
          {extraDescriptions > 0 && (
            <Badge variant="outline" className="text-xs shrink-0 bg-gray-100">
              +{extraDescriptions} more
            </Badge>
          )}
        </div>

        <p className="text-xs text-neutral-500">
          Last Updated By: {report.lastUpdatedBy}
        </p>

        {/* Action buttons (Mobile: bottom) */}
        <div className="flex md:hidden gap-2 justify-center mt-3">
          {privilege.view && (
            <Button
              size="icon"
              variant="outline"
              className="rounded-full h-8 w-8"
              onClick={() => onView?.(report)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {privilege.edit && (
            <Button
              size="icon"
              variant="outline"
              className="rounded-full h-8 w-8"
              onClick={() => onEdit?.(report)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {privilege.delete && (
            <Button
              size="icon"
              variant="destructive"
              className="rounded-full h-8 w-8"
              onClick={() => onDelete?.(report)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}