import { useCreateReportMutation } from '@/api/services/report'
import { useGetAllAreaQuery } from '@/api/services/area'
import Header from '@/components/header/header'
import { Modal } from '@/components/modal/Modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SubLayout } from '@/layouts/layout'
import { usePrimaryColor } from '@/lib/primary-color'
import { selectCampus } from '@/store/campus/selector'
import { selectPerson } from '@/store/person/selector'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useGetAllCategoryQuery } from '@/api/services/category'
import CameraModal from '@/components/camera/camera-modal'
import UnifiedAreaInput from '@/components/unified-area-input/unified-area-input'

const ReportPage = () => {
  const report = useCreateReportMutation();
  const navigate = useNavigate();

  const person = useSelector(selectPerson);
  const campus = useSelector(selectCampus);
  const { BACKGROUND_PRIMARY_COLOR } = usePrimaryColor();

  // modal state
  const [open, setOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState("")
  const [modalMessage, setModalMessage] = useState("")
  const [isSuccessModal, setIsSuccessModal] = useState(false)

  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [selectedAreaId, setSelectedAreaId] = useState('')
  const [selectedAreaName, setSelectedAreaName] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [selectedCategoryName, setSelectedCategoryName] = useState('')
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false)

  const { data: areasData, isLoading: isLoadingAreas } = useGetAllAreaQuery(campus?.campusId || '')
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetAllCategoryQuery(campus?.campusId || '')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const openCameraApp = () => {
    setIsCameraModalOpen(true)
  }

  const handleCameraCapture = (capturedFile: File) => {
    setFile(capturedFile)
    setIsCameraModalOpen(false)
  }

  const handleCameraClose = () => {
    setIsCameraModalOpen(false)
  }

  const handleSubmit = () => {
    if (!file) {
      setModalTitle("Error");
      setModalMessage("Please upload a file");
      setIsSuccessModal(false);
      setOpen(true);
      return;
    }

    if (!selectedAreaId) {
      setModalTitle("Error");
      setModalMessage("Please select an area");
      setIsSuccessModal(false);
      setOpen(true);
      return;
    }

    if (!selectedCategoryId) {
      setModalTitle("Error");
      setModalMessage("Please select a category");
      setIsSuccessModal(false);
      setOpen(true);
      return;
    }

    report.mutate({
      campusId: campus?.campusId || '',
      facilityUserId: person?.id || '',
      facilityUserName: person?.name || '',
      facilityUserEmail: person?.email || '',
      areaId: selectedAreaId,
      areaName: selectedAreaName,
      categoryId: selectedCategoryId,
      categoryName: selectedCategoryName,
      description,
      image: file,
    }, {
      onSuccess: (res) => {
        setModalTitle("Success");
        setModalMessage(res.message || "Report created successfully");
        setIsSuccessModal(true);
        setOpen(true);
      },
      onError: (err) => {
        setModalTitle("Error");
        setModalMessage(err.message || "Failed to create report");
        setIsSuccessModal(false);
        setOpen(true);
      }
    })
  }

  const handleCategorySelect = (categoryId: string) => {
    const selectedCategory = categoriesData?.data?.find(category => category.id === categoryId)
    if (selectedCategory) {
      setSelectedCategoryId(categoryId)
      setSelectedCategoryName(selectedCategory.name)
    }
  }

  return (
    <SubLayout>
      <Header title="Create Report" />

      <Modal
        open={open}
        onOpenChange={setOpen}
        title={modalTitle}
        message={modalMessage}
        onConfirm={isSuccessModal ? () => navigate("/dashboard") : undefined}
      />

      <div className="space-y-6 px-4 sm:px-0">
        {/* Description */}
        <Card>
          <CardContent className="p-4 sm:p-4 text-[#5d5d5d]">
            <h2 className="font-semibold mb-4 text-lg sm:text-base">Description</h2>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description ..."
              className="h-12 text-base sm:h-10 sm:text-sm bg-neutral-50 focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
            />
          </CardContent>
        </Card>

        {/* Area Input - Unified Beacon Detection / Area Selection */}
        <UnifiedAreaInput
          onAreaSelected={(areaId, areaName) => {
            console.log('🎯 Parent received area selection:', { areaId, areaName });
            setSelectedAreaId(areaId);
            setSelectedAreaName(areaName);
          }}
          availableAreas={areasData?.data || []}
          isLoadingAreas={isLoadingAreas}
          selectedAreaId={selectedAreaId}
          selectedAreaName={selectedAreaName}
        />

        {/* Category Select */}
        <Card>
          <CardContent className="p-4 sm:p-4 text-[#5d5d5d]">
            <h2 className="font-semibold mb-4 text-lg sm:text-base">Category</h2>
            <Select onValueChange={handleCategorySelect} disabled={isLoadingCategories}>
              <SelectTrigger className="bg-white focus:ring-0 focus:ring-offset-0 border border-gray-200 w-full h-12 text-base sm:h-10 sm:text-sm">
                <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select a category"} />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg w-full max-h-60">
                {categoriesData?.data?.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id}
                    className="hover:bg-gray-50 cursor-pointer py-3 text-base sm:py-2 sm:text-sm"
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Upload & Camera */}
        <Card>
          <CardContent className="p-4 text-[#5d5d5d] flex flex-col gap-2">
            <div className='flex flex-col sm:flex-row gap-4 items-start'>
              {/* Preview Box */}
              <div className="w-full sm:w-[120px] aspect-square bg-neutral-50 flex items-center justify-center text-sm text-gray-400 border rounded-md overflow-hidden relative">
                {file ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-center">No Preview</span>
                )}
              </div>

              {/* Upload Field */}
              <div className="flex-1">
                <h2 className="font-semibold mb-3">Upload File</h2>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    className='bg-neutral-50'
                    type="button"
                    variant="outline"
                    onClick={openCameraApp}
                  >
                    Use Camera
                  </Button>

                  <Input
                    type="file"
                    accept="image/jpeg, image/png"
                    onChange={handleFileChange}
                    className="bg-neutral-50 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
                  />

                  {file && (
                    <Button className='bg-neutral-50' type="button" variant="outline" onClick={() => setFile(null)}>
                      Remove
                    </Button>
                  )}
                </div>

                <p className='mt-3 text-xs'>
                  File must be an image (.jpg / .png) or use camera to take photo
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-center sm:justify-end">
          <Button
            style={BACKGROUND_PRIMARY_COLOR(0.7)}
            variant="default"
            onClick={handleSubmit}
            disabled={report.isLoading}
            className="w-full sm:w-auto min-w-[120px] py-3 text-base sm:py-2 sm:text-sm h-12 sm:h-10"
          >
            {report.isLoading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>

      {/* Camera Modal */}
      <CameraModal
        isOpen={isCameraModalOpen}
        onClose={handleCameraClose}
        onCapture={handleCameraCapture}
      />
    </SubLayout>
  )
}

export default ReportPage;