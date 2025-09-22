import { useUpdateArea } from "@/api/services/area"
import Header from "@/components/header/header"
import { Modal } from "@/components/modal/Modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SubLayout } from "@/layouts/layout"
import { usePrimaryColor } from "@/lib/primary-color"
import { selectCampus } from "@/store/campus/selector"
import { IAreaRequest } from "@/types/request/area"
import { IGetAreaResponse } from "@/types/response/area"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"

const EditAreaPage = () => {
  const queryClient = useQueryClient();

  const location = useLocation()
  const area = location.state as IGetAreaResponse;

  const campus = useSelector(selectCampus);
  const navigate = useNavigate();
  const { BACKGROUND_PRIMARY_COLOR, TEXT_PRIMARY_COLOR } = usePrimaryColor();

  const updateArea = useUpdateArea(area.id);

  // modal state
  const [open, setOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState("")
  const [modalMessage, setModalMessage] = useState("")

  const [name, setName] = useState(area.name);
  const [beaconId, setBeaconId] = useState(area.beaconId);

  const handleSubmit = () => {
    const request: IAreaRequest = {
      campusId: campus?.campusId || '',
      areaName: name,
      beaconId: beaconId,
    }

    updateArea.mutate(request, {
      onSuccess: (res) => {
        queryClient.refetchQueries({ queryKey: ["area"], exact: false });
        setModalTitle("Success");
        setModalMessage(res.message);
        setOpen(true);
      },
      onError: (err) => {
        setModalTitle("Error");
        setModalMessage(err.message);
        setOpen(true);
      }
    })
  }

  return (
    <SubLayout>
      <Header title="Edit Area" />

      <Modal
        open={open}
        onOpenChange={setOpen}
        title={modalTitle}
        message={modalMessage}
        onConfirm={() => navigate("/browse-area")}
      />

      <div className="space-y-4">
        <Card>
          <CardContent className="p-4 text-[#5d5d5d]">
            <h2 className="font-semibold mb-3">Area Name</h2>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Area Name ..."
              className="bg-neutral-50 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-[#5d5d5d]">
            <h2 className="font-semibold mb-3">Beacon ID</h2>
            <Input
              value={beaconId}
              onChange={(e) => setBeaconId(e.target.value)}
              placeholder="Beacon ID ..."
              className="bg-neutral-50 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            style={TEXT_PRIMARY_COLOR(0.7)}
            variant="outline"
            onClick={() => navigate("/browse-area")}
          >
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            style={BACKGROUND_PRIMARY_COLOR(0.7)}
            disabled={updateArea.isLoading}
          >
            {updateArea.isLoading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </SubLayout>
  )
}

export default EditAreaPage