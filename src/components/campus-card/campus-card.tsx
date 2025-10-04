import { Card, CardContent } from "@/components/ui/card"
import { Pencil, Trash, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { usePrimaryColor } from "@/lib/primary-color"
import { IAllCampusByUserIdResponse } from "@/types/response/campus"

interface Privilege {
  view?: boolean
  edit?: boolean
  delete?: boolean
}

interface CampusCardProps {
  campus: IAllCampusByUserIdResponse
  isLoading?: boolean
  privilege?: Privilege
  onView?: (campus: IAllCampusByUserIdResponse) => void
  onEdit?: (campus: IAllCampusByUserIdResponse) => void
  onDelete?: (campus: IAllCampusByUserIdResponse) => void
}

export const CampusCard = ({
  campus,
  isLoading = false,
  privilege = { view: false, edit: false, delete: false },
  onView,
  onEdit,
  onDelete,
}: CampusCardProps) => {
  const { BACKGROUND_PRIMARY_COLOR } = usePrimaryColor()

  if (isLoading) {
    return (
      <Card className="p-4 shadow-sm rounded-md bg-neutral-50">
        <div className="flex items-center gap-4">
          <Skeleton className="w-14 h-14 rounded-full" />
          <div className="flex-1 flex flex-col gap-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="hidden md:flex gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="text-[#5d5d5d] relative flex flex-col md:flex-row items-center p-4 shadow-sm rounded-md bg-neutral-50">
      {/* Campus logo */}
      <img className="w-14 h-14 flex-shrink-0 rounded-full bg-neutral-300" src={campus.customization.logo} alt="" />

      {/* Details */}
      <CardContent className="flex-1 flex flex-col gap-1 md:ml-4 mt-3 md:mt-0 p-0 text-center md:text-left">
        <p className="font-semibold">{campus.name}</p>
        <p className="text-sm text-neutral-500">{campus.siteName}.{window.location.host}</p>
        <Badge
          style={BACKGROUND_PRIMARY_COLOR(1)}
          className="text-white w-fit mt-1 mx-auto md:mx-0"
          variant="outline"
        >
          {campus.status}
        </Badge>
      </CardContent>

      {/* Actions Desktop */}
      <div className="hidden md:flex gap-2 absolute top-3 right-3">
        {privilege.view && (
          <Button
            style={BACKGROUND_PRIMARY_COLOR(1)}
            size="icon"
            variant="outline"
            className="rounded-md h-8 w-8"
            onClick={() => onView?.(campus)}
          >
            <Eye className="h-4 w-4 text-white" />
          </Button>
        )}
        {privilege.edit && (
          <Button
            style={BACKGROUND_PRIMARY_COLOR(1)}
            size="icon"
            variant="outline"
            className="rounded-md h-8 w-8"
            onClick={() => onEdit?.(campus)}
          >
            <Pencil className="h-4 w-4 text-white" />
          </Button>
        )}
        {privilege.delete && (
          <Button
            style={BACKGROUND_PRIMARY_COLOR(1)}
            size="icon"
            variant="destructive"
            className="rounded-md h-8 w-8"
            onClick={() => onDelete?.(campus)}
          >
            <Trash className="h-4 w-4 text-white" />
          </Button>
        )}
      </div>

      {/* Actions Mobile */}
      <div className="flex md:hidden gap-2 justify-center mt-3">
        {privilege.view && (
          <Button
            size="icon"
            variant="outline"
            className="rounded-full h-8 w-8"
            onClick={() => onView?.(campus)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}
        {privilege.edit && (
          <Button
            size="icon"
            variant="outline"
            className="rounded-full h-8 w-8"
            onClick={() => onEdit?.(campus)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
        {privilege.delete && (
          <Button
            size="icon"
            variant="destructive"
            className="rounded-full h-8 w-8"
            onClick={() => onDelete?.(campus)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  )
}