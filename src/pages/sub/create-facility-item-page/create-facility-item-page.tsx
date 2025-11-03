import { useCreateFacilityItem } from "@/api/services/facility-item"
import Header from "@/components/header/header"
import { Modal } from "@/components/modal/Modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SubLayout } from "@/layouts/layout"
import { usePrimaryColor } from "@/lib/primary-color"
import { selectCampus } from "@/store/campus/selector"
import type { IFacilityItemRequest } from "@/types/request/facility-item"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"

const CreateFacilityItemPage = () => {
  const queryClient = useQueryClient()

  const location = useLocation()
  const { areaId } = location.state || {}

  const campus = useSelector(selectCampus)
  const navigate = useNavigate()
  const { BACKGROUND_PRIMARY_COLOR, TEXT_PRIMARY_COLOR } = usePrimaryColor()

  const createFacilityItem = useCreateFacilityItem()

  // modal state
  const [open, setOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState("")
  const [modalMessage, setModalMessage] = useState("")

  const [name, setName] = useState("")
  const [point, setPoint] = useState("")

  const handleSubmit = () => {
    const request: IFacilityItemRequest = {
      campusId: campus?.campusId || "",
      areaId: areaId || "",
      name: name,
      ...(point ? { point: Number.parseInt(point, 10) } : {}),
    }

    createFacilityItem.mutate(request, {
      onSuccess: (res) => {
        queryClient.refetchQueries({ queryKey: ["facilityItem"], exact: false })
        setModalTitle("Success")
        setModalMessage(res.message)
        setOpen(true)
      },
      onError: (err) => {
        setModalTitle("Error")
        setModalMessage(err.message)
        setOpen(true)
      },
    })
  }

  return (
    <SubLayout>
      <Header title="Create Facility Item" />

      <Modal
        open={open}
        onOpenChange={setOpen}
        title={modalTitle}
        message={modalMessage}
        onConfirm={() => navigate(`/browse-facility-item/${areaId}`)}
      />

      <div className="space-y-4">
        <Card>
          <CardContent className="p-4 text-[#5d5d5d]">
            <h2 className="font-semibold mb-3">Facility Item Name</h2>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Facility Item Name ..."
              className="bg-neutral-50 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-[#5d5d5d]">
            <h2 className="font-semibold mb-3">Point</h2>
            <Input
              value={point}
              onChange={(e) => setPoint(e.target.value)}
              placeholder="Enter point value..."
              type="number"
              className="bg-neutral-50 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            style={TEXT_PRIMARY_COLOR(0.7)}
            variant="outline"
            onClick={() => navigate(`/browse-facility-item/${areaId}`)}
          >
            Back
          </Button>
          <Button onClick={handleSubmit} style={BACKGROUND_PRIMARY_COLOR(0.7)} disabled={createFacilityItem.isLoading}>
            {createFacilityItem.isLoading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </SubLayout>
  )
}

export default CreateFacilityItemPage