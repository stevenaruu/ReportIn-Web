/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { SubLayout } from "@/layouts/layout"
import type { IGetAllPersonResponse } from "@/types/response/person"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { hexToRgba } from "@/lib/hex-to-rgba"
import Header from "@/components/header/header"
import { useSelector } from "react-redux"
import { selectCampus } from "@/store/campus/selector"
import { usePrimaryColor } from "@/lib/primary-color"
import { Modal } from "@/components/modal/Modal"
import { useGetAllCategoryQuery } from "@/api/services/category"
import type { IGetCategoryResponse } from "@/types/response/category"
import { useCreateTechnicianPreference } from "@/api/services/technician-preference"

const TechnicianPreferencePage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const person = location.state as IGetAllPersonResponse
  const campus = useSelector(selectCampus)
  const { BACKGROUND_PRIMARY_COLOR } = usePrimaryColor()

  const { data: categoryData, isLoading: isCategoryLoading } = useGetAllCategoryQuery(campus?.campusId ?? "")
  const { mutate: createTechnicianPreference, isPending: isSubmitting } = useCreateTechnicianPreference()

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // modal state
  const [open, setOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState("")
  const [modalMessage, setModalMessage] = useState("")

  // useEffect(() => {
  //   if (person?.technicianPreference) {
  //     setSelectedCategories(person.technicianPreference.map((pref: any) => pref.categoryId))
  //   }
  // }, [person])

  const handleToggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const handleSubmit = () => {
    if (!person || !campus) return

    const payload = {
      preferences: selectedCategories.map((categoryId) => ({
        personId: person.id,
        campusId: campus.campusId,
        categoryId,
      })),
    }

    createTechnicianPreference(payload, {
      onSuccess: () => {
        setModalTitle("Success")
        setModalMessage("Technician preferences updated successfully")
        setOpen(true)
      },
      onError: (error) => {
        setModalTitle("Error")
        setModalMessage(error.message || "Failed to update technician preferences")
        setOpen(true)
      },
    })
  }

  const handleBack = () => {
    navigate(-1)
  }

  const categories = categoryData?.data || []

  return (
    <SubLayout>
      <Header title="Technician Preference" />

      <Modal
        open={open}
        onOpenChange={setOpen}
        title={modalTitle}
        message={modalMessage}
        onConfirm={() => navigate(-1)}
      />

      {person && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 text-[#5d5d5d]">
              {isCategoryLoading ? (
                <div className="border rounded-md">
                  <div className="grid grid-cols-1 divide-y">
                    <div className="p-3">
                      <Skeleton className="h-4 w-24" />
                    </div>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <div key={`skeleton-${idx}`} className="flex items-center gap-3 p-3">
                        <Skeleton className="h-5 w-5 rounded" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : categories.length === 0 ? (
                <p className="text-sm text-gray-500">No categories available</p>
              ) : (
                <div className="border rounded-md">
                  <div className="grid grid-cols-1 divide-y">
                    <p className="p-3">Preferences</p>
                    {categories.map((category: IGetCategoryResponse) => (
                      <label key={category.id} className="flex items-center gap-3 p-3">
                        <Checkbox
                          style={{
                            backgroundColor: selectedCategories.includes(category.id)
                              ? hexToRgba(campus?.customization.primaryColor, 0.7)
                              : undefined,
                          }}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => handleToggleCategory(category.id)}
                        />
                        <span>{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <Button onClick={handleBack} variant="outline">
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  style={BACKGROUND_PRIMARY_COLOR(0.7)}
                  disabled={isCategoryLoading || isSubmitting}
                >
                  Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </SubLayout>
  )
}

export default TechnicianPreferencePage