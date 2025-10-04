import { useUpdateCategory } from "@/api/services/category"
import Header from "@/components/header/header"
import { Modal } from "@/components/modal/Modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SubLayout } from "@/layouts/layout"
import { usePrimaryColor } from "@/lib/primary-color"
import { selectCampus } from "@/store/campus/selector"
import { ICategoryRequest } from "@/types/request/category"
import { IGetCategoryResponse } from "@/types/response/category"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"

const EditCategoryPage = () => {
  const queryClient = useQueryClient();

  const location = useLocation()
  const category = location.state as IGetCategoryResponse;

  const campus = useSelector(selectCampus);
  const navigate = useNavigate();
  const { BACKGROUND_PRIMARY_COLOR, TEXT_PRIMARY_COLOR } = usePrimaryColor();

  const updateCategory = useUpdateCategory(category.id);

  // modal state
  const [open, setOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState("")
  const [modalMessage, setModalMessage] = useState("")

  const [name, setName] = useState(category.name);

  const handleSubmit = () => {
    const request: ICategoryRequest = {
      campusId: campus?.campusId || '',
      name: name,
    }

    updateCategory.mutate(request, {
      onSuccess: (res) => {
        queryClient.refetchQueries({ queryKey: ["category"], exact: false });
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
      <Header title="Edit Category" />

      <Modal
        open={open}
        onOpenChange={setOpen}
        title={modalTitle}
        message={modalMessage}
        onConfirm={() => navigate("/browse-category")}
      />

      <div className="space-y-4">
        <Card>
          <CardContent className="p-4 text-[#5d5d5d]">
            <h2 className="font-semibold mb-3">Category Name</h2>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category Name ..."
              className="bg-neutral-50 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            style={TEXT_PRIMARY_COLOR(0.7)}
            variant="outline"
            onClick={() => navigate("/browse-category")}
          >
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            style={BACKGROUND_PRIMARY_COLOR(0.7)}
            disabled={updateCategory.isLoading}
          >
            {updateCategory.isLoading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </SubLayout>
  )
}

export default EditCategoryPage