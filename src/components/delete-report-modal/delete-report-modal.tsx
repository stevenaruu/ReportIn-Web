import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { usePrimaryColor } from "@/lib/primary-color"

interface DeleteReportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (deletionRemark: string) => void
  loading?: boolean
}

const DeleteReportModal: React.FC<DeleteReportModalProps> = ({ open, onOpenChange, onConfirm, loading = false }) => {
  const [deletionRemark, setDeletionRemark] = useState("")
  const [error, setError] = useState("")
  const { BACKGROUND_PRIMARY_COLOR } = usePrimaryColor()

  const handleConfirm = () => {
    if (!deletionRemark.trim()) {
      setError("Please provide a deletion reason.")
      return
    }
    setError("")
    onConfirm(deletionRemark)
    handleClose()
  }

  const handleClose = () => {
    setDeletionRemark("")
    setError("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Delete Report</DialogTitle>
          <DialogDescription>
            Please provide a reason for deleting this report. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-1">
          <Textarea
            value={deletionRemark}
            onChange={(e) => {
              setDeletionRemark(e.target.value)
              if (error) setError("")
            }}
            placeholder="Enter deletion reason..."
            className={`min-h-[120px] ${error ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-0 focus-visible:ring-offset-0"}`}
          />
          {error && <span className="text-sm text-red-500">{error}</span>}
        </div>

        <DialogFooter className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            style={BACKGROUND_PRIMARY_COLOR(1)}
            onClick={handleConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteReportModal