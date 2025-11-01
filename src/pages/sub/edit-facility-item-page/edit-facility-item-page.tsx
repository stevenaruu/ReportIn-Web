"use client"

import { useUpdateFacilityItem } from "@/api/services/facility-item"
import Header from "@/components/header/header"
import { Modal } from "@/components/modal/Modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SubLayout } from "@/layouts/layout"
import { usePrimaryColor } from "@/lib/primary-color"
import type { IFacilityItemEditRequest } from "@/types/request/facility-item"
import type { IGetFacilityItemResponse } from "@/types/response/facility-item"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const EditFacilityItemPage = () => {
  const queryClient = useQueryClient()

  const location = useLocation()
  const facilityItem = location.state as IGetFacilityItemResponse

  const navigate = useNavigate()
  const { BACKGROUND_PRIMARY_COLOR, TEXT_PRIMARY_COLOR } = usePrimaryColor()

  const updateFacilityItem = useUpdateFacilityItem(facilityItem.id)

  // modal state
  const [open, setOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState("")
  const [modalMessage, setModalMessage] = useState("")

  const [name, setName] = useState(facilityItem.name)

  const handleSubmit = () => {
    const request: IFacilityItemEditRequest = {
      name: name,
    }

    updateFacilityItem.mutate(request, {
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
      <Header title="Edit Facility Item" />

      <Modal
        open={open}
        onOpenChange={setOpen}
        title={modalTitle}
        message={modalMessage}
        onConfirm={() => navigate(`/browse-facility-item/${facilityItem.areaId}`)}
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

        <div className="flex justify-end gap-4">
          <Button
            style={TEXT_PRIMARY_COLOR(0.7)}
            variant="outline"
            onClick={() => navigate(`/browse-facility-item/${facilityItem.areaId}`)}
          >
            Back
          </Button>
          <Button onClick={handleSubmit} style={BACKGROUND_PRIMARY_COLOR(0.7)} disabled={updateFacilityItem.isLoading}>
            {updateFacilityItem.isLoading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </SubLayout>
  )
}

export default EditFacilityItemPage