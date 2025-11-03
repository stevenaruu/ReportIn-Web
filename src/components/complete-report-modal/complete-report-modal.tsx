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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePrimaryColor } from "@/lib/primary-color"
import { useGetAllFacilityItemQuery } from "@/api/services/facility-item"
import type { IGetFacilityItemResponse } from "@/types/response/facility-item"

interface CompleteReportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (issue: string, itemId: string, difficulty: number) => void
  loading?: boolean
  campusId: string
  areaId: string
}

const CompleteReportModal: React.FC<CompleteReportModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
  loading = false,
  campusId,
  areaId,
}) => {
  const [issue, setIssue] = useState("")
  const [selectedItemId, setSelectedItemId] = useState("")
  const [difficulty, setDifficulty] = useState<number | "">("")
  const [error, setError] = useState("")
  const { BACKGROUND_PRIMARY_COLOR } = usePrimaryColor()

  // Fetch facility items for the area
  const { data: facilityItemsData, isLoading: isLoadingItems } = useGetAllFacilityItemQuery(campusId, areaId)

  const handleConfirm = () => {
    if (!selectedItemId.trim()) {
      setError("Please select a facility item.")
      return
    }
    if (!issue.trim()) {
      setError("Please provide an issue description.")
      return
    }
    if (difficulty === "") {
      setError("Please select a difficulty level.")
      return
    }
    setError("")
    onConfirm(issue, selectedItemId, difficulty as number)
    handleClose()
  }

  const handleClose = () => {
    setIssue("")
    setSelectedItemId("")
    setDifficulty("")
    setError("")
    onOpenChange(false)
  }

  const difficultyOptions = [
    { value: 1, label: "Very easy" },
    { value: 2, label: "Somewhat easy" },
    { value: 3, label: "Neutral / Neither easy nor difficult" },
    { value: 4, label: "Somewhat difficult" },
    { value: 5, label: "Very difficult" },
  ]

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete Report</DialogTitle>
          <DialogDescription>
            Please select the facility item and provide details about the issue resolution.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Facility Item Dropdown */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Facility Item</label>
            <Select
              value={selectedItemId}
              onValueChange={(value) => {
                setSelectedItemId(value)
                if (error) setError("")
              }}
              disabled={isLoadingItems}
            >
              <SelectTrigger className="focus:ring-0 focus:ring-offset-0 border border-gray-200">
                <SelectValue placeholder={isLoadingItems ? "Loading items..." : "Select a facility item"} />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg">
                {facilityItemsData?.data?.map((item: IGetFacilityItemResponse) => (
                  <SelectItem key={item.id} value={item.id} className="hover:bg-gray-50 cursor-pointer">
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">How difficult was it to complete this report?</label>
            <Select
              value={difficulty === "" ? "" : difficulty.toString()}
              onValueChange={(value) => {
                setDifficulty(Number.parseInt(value, 10))
                if (error) setError("")
              }}
            >
              <SelectTrigger className="focus:ring-0 focus:ring-offset-0 border border-gray-200">
                <SelectValue placeholder="Select difficulty level" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg">
                {difficultyOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value.toString()}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Issue Textarea */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Issue Description</label>
            <Textarea
              value={issue}
              onChange={(e) => {
                setIssue(e.target.value)
                if (error) setError("")
              }}
              placeholder="Describe the issue and resolution..."
              className={`min-h-[120px] ${error ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-0 focus-visible:ring-offset-0"}`}
            />
          </div>

          {/* Error Message */}
          {error && <span className="text-sm text-red-500">{error}</span>}
        </div>

        <DialogFooter className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button style={BACKGROUND_PRIMARY_COLOR(1)} onClick={handleConfirm} disabled={loading || isLoadingItems}>
            {loading ? "Completing..." : "Complete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CompleteReportModal