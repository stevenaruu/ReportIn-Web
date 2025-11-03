/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react"
import { SubLayout } from "@/layouts/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useExportReportMutation } from "@/api/services/report"
import Header from "@/components/header/header"
import { Modal } from "@/components/modal/Modal"
import { Card, CardContent } from "@/components/ui/card"
import { usePrimaryColor } from "@/lib/primary-color"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectCampus } from "@/store/campus/selector"

const ExportReportPage = () => {
  const campus = useSelector(selectCampus);
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], [])
  const sevenDaysAgoStr = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() - 7)
    return d.toISOString().split("T")[0]
  }, [])

  const [startDate, setStartDate] = useState<string>(sevenDaysAgoStr)
  const [endDate, setEndDate] = useState<string>(todayStr)
  const [open, setOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState("")
  const [modalMessage, setModalMessage] = useState("")

  const navigate = useNavigate()
  const { BACKGROUND_PRIMARY_COLOR, TEXT_PRIMARY_COLOR } = usePrimaryColor()

  const exportReport = useExportReportMutation()

  const isRangeValid = useMemo(() => {
    if (!startDate || !endDate) return false
    return new Date(startDate) <= new Date(endDate)
  }, [startDate, endDate])

  const handleExport = () => {
    if (!isRangeValid) {
      setModalTitle("Error")
      setModalMessage("Invalid date range. Please ensure the Start Date is earlier than or equal to the End Date.")
      setOpen(true)
      return
    }

    const formattedStart = new Date(`${startDate}T00:00:00.000Z`).toISOString()
    const formattedEnd = new Date(`${endDate}T23:59:59.999Z`).toISOString()

    exportReport.mutate(
      { startDate: formattedStart, endDate: formattedEnd, campusId: campus?.campusId || "" },
      {
        onSuccess: (blob) => {
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `reports-${startDate}-to-${endDate}.xlsx`
          document.body.appendChild(a)
          a.click()
          a.remove()
          URL.revokeObjectURL(url)

          setModalTitle("Success")
          setModalMessage("The report has been successfully exported. Your download should start shortly.")
          setOpen(true)
        },
        onError: (err: any) => {
          const msg = typeof err?.message === "string"
            ? err.message
            : "Failed to export the report. Please try again."
          setModalTitle("Error")
          setModalMessage(msg)
          setOpen(true)
        },
      },
    )
  }

  return (
    <SubLayout>
      <Header title="Export Report" />

      <Modal
        open={open}
        onOpenChange={setOpen}
        title={modalTitle}
        message={modalMessage}
      />

      <div className="space-y-4">
        <Card>
          <CardContent className="p-4 text-[#5d5d5d]">
            <h2 className="font-semibold mb-3">Start Date</h2>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-neutral-50 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-[#5d5d5d]">
            <h2 className="font-semibold mb-3">End Date</h2>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-neutral-50 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button style={TEXT_PRIMARY_COLOR(0.7)} variant="outline" onClick={() => navigate("/browse-report")}>
            Back
          </Button>
          <Button
            onClick={handleExport}
            style={BACKGROUND_PRIMARY_COLOR(0.7)}
            disabled={!isRangeValid || exportReport.isLoading}
          >
            {exportReport.isLoading ? "Exporting..." : "Export Report"}
          </Button>
        </div>
      </div>
    </SubLayout>
  )
}

export default ExportReportPage