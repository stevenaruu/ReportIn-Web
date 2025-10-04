import { useCreateReportMutation } from '@/api/services/report'
import { useGetAllAreaQuery } from '@/api/services/area'
import Header from '@/components/header/header'
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
import { useGetAllCategoryQuery } from '@/api/services/category'
import CameraModal from '@/components/camera/camera-modal'

const ReportPage = () => {
  const report = useCreateReportMutation();

  const person = useSelector(selectPerson);
  const campus = useSelector(selectCampus);
  const { BACKGROUND_PRIMARY_COLOR } = usePrimaryColor();

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
      alert('Please upload a file')
      return
    }

    if (!selectedAreaId) {
      alert('Please select an area')
      return
    }

    if (!selectedCategoryId) {
      alert('Please select a category')
      return
    }

    report.mutate({
      campusId: campus?.campusId || '',
      complainantId: person?.id || '',
      complainantName: person?.name || '',
      complainantEmail: person?.email || '',
      areaId: selectedAreaId,
      areaName: selectedAreaName,
      categoryId: selectedCategoryId,
      categoryName: selectedCategoryName,
      description,
      image: file,
    })
  }

  const handleAreaSelect = (areaId: string) => {
    const selectedArea = areasData?.data?.find(area => area.id === areaId)
    if (selectedArea) {
      setSelectedAreaId(areaId)
      setSelectedAreaName(selectedArea.name)
    }
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

      <div className="space-y-4 px-4 sm:px-0">
        {/* Description */}
        <Card>
          <CardContent className="p-4 text-[#5d5d5d]">
            <h2 className="font-semibold mb-3">Description</h2>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description ..."
              className="bg-neutral-50 focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
            />
          </CardContent>
        </Card>

        {/* Area Select */}
        <Card>
          <CardContent className="p-4 text-[#5d5d5d]">
            <h2 className="font-semibold mb-3">Area</h2>
            <Select onValueChange={handleAreaSelect} disabled={isLoadingAreas}>
              <SelectTrigger className="bg-white focus:ring-0 focus:ring-offset-0 border border-gray-200 w-full">
                <SelectValue placeholder={isLoadingAreas ? "Loading areas..." : "Select an area"} />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg w-full">
                {areasData?.data?.map((area) => (
                  <SelectItem
                    key={area.id}
                    value={area.id}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Category Select */}
        <Card>
          <CardContent className="p-4 text-[#5d5d5d]">
            <h2 className="font-semibold mb-3">Category</h2>
            <Select onValueChange={handleCategorySelect} disabled={isLoadingCategories}>
              <SelectTrigger className="bg-white focus:ring-0 focus:ring-offset-0 border border-gray-200 w-full">
                <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select a category"} />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg w-full">
                {categoriesData?.data?.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id}
                    className="hover:bg-gray-50 cursor-pointer"
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
              <div className="w-full sm:w-[120px] h-[120px] bg-neutral-50 flex items-center justify-center text-sm text-gray-400 border rounded-md overflow-hidden relative">
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
        <div className="flex justify-center sm:justify-end px-4 sm:px-0">
          <Button
            style={BACKGROUND_PRIMARY_COLOR(0.7)}
            variant="default"
            onClick={handleSubmit}
            disabled={report.isLoading}
            className="w-full sm:w-auto min-w-[120px]"
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