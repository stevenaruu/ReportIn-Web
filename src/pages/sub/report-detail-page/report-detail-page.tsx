import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useUpdateReportMutation } from '@/api/services/report'
import { useGetAllAreaQuery } from '@/api/services/area'
import { useGetAllCategoryQuery } from '@/api/services/category'
import Header from '@/components/header/header'
import { Modal } from '@/components/modal/Modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SubLayout } from '@/layouts/layout'
import { usePrimaryColor } from '@/lib/primary-color'
import { selectCampus } from '@/store/campus/selector'
import { selectPerson, selectPersonActiveRole } from '@/store/person/selector'
import { useSelector } from 'react-redux'
import { useReportById } from '@/hooks/use-report'
import CameraModal from '@/components/camera/camera-modal'
import { IPersonReport } from '@/types/model/report'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const ReportDetailPage = () => {
  const { reportId } = useParams<{ reportId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const updateReport = useUpdateReportMutation()

  const person = useSelector(selectPerson)
  const activeRole = useSelector(selectPersonActiveRole);
  const campus = useSelector(selectCampus)
  const { BACKGROUND_PRIMARY_COLOR } = usePrimaryColor()

  // Get mode from URL path
  // Initial mode detection
  const initialEditMode = location.pathname.includes('/edit/');
  const initialViewMode = location.pathname.includes('/view/');

  // Fetch report data
  const { report, loading, error } = useReportById(reportId)

  // Mode state, guarded by report status
  let isEditMode = initialEditMode;
  let isViewMode = initialViewMode;
  if (report && initialEditMode && report.status !== 'PENDING') {
    isEditMode = false;
    isViewMode = true;
  }

  // Modal state
  const [open, setOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState("")
  const [modalMessage, setModalMessage] = useState("")
  const [isSuccessModal, setIsSuccessModal] = useState(false)

  // Form state
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [selectedAreaId, setSelectedAreaId] = useState('')
  const [selectedAreaName, setSelectedAreaName] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [selectedCategoryName, setSelectedCategoryName] = useState('')
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false)
  const [isProcessingImage, setIsProcessingImage] = useState(false)

  // Multiple complainants navigation
  const [currentComplainantIndex, setCurrentComplainantIndex] = useState(0)
  const [currentComplainant, setCurrentComplainant] = useState<IPersonReport | null>(null)

  const { data: areasData, isLoading: isLoadingAreas } = useGetAllAreaQuery(campus?.campusId || '')
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetAllCategoryQuery(campus?.campusId || '')

  // Find current user's complainant data
  useEffect(() => {
    if (report && person) {
      if (isEditMode) {
        // For edit mode, find the current user's complainant data
        const userComplainant = report.complainant.find(c => c.personId === person.id)
        if (userComplainant) {
          setCurrentComplainant(userComplainant)
          setDescription(userComplainant.description)
        }
      } else if (isViewMode) {
        // For view mode, start with the first complainant
        if (report.complainant.length > 0) {
          setCurrentComplainant(report.complainant[0])
          setDescription(report.complainant[0].description)
        }
      }
    }
  }, [report, person, isEditMode, isViewMode])

  // Set form data when report loads
  useEffect(() => {
    if (report) {
      setSelectedAreaId(report.area.areaId)
      setSelectedAreaName(report.area.name)
      setSelectedCategoryId(report.category.categoryId)
      setSelectedCategoryName(report.category.name)
    }
  }, [report])

  // Handle complainant navigation for view mode
  const handlePreviousComplainant = () => {
    if (report && currentComplainantIndex > 0) {
      const newIndex = currentComplainantIndex - 1
      setCurrentComplainantIndex(newIndex)
      setCurrentComplainant(report.complainant[newIndex])
      setDescription(report.complainant[newIndex].description)
    }
  }

  const handleNextComplainant = () => {
    if (report && currentComplainantIndex < report.complainant.length - 1) {
      const newIndex = currentComplainantIndex + 1
      setCurrentComplainantIndex(newIndex)
      setCurrentComplainant(report.complainant[newIndex])
      setDescription(report.complainant[newIndex].description)
    }
  }

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

  const convertImageUrlToFile = async (imageUrl: string, fileName: string = 'existing-image.jpg'): Promise<File> => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      return new File([blob], fileName, { type: blob.type })
    } catch {
      console.error('Error converting image URL to file')
      // Fallback: create empty file with proper type
      return new File([''], fileName, { type: 'image/jpeg' })
    }
  }

  const handleTakeReport = () => {

  }

  const handleSubmit = async () => {
    if (!report || !currentComplainant) return

    setIsProcessingImage(true)

    // For update, if no new file is selected, we need to handle the existing image
    if (!file && !currentComplainant.image) {
      setModalTitle("Error")
      setModalMessage("Please upload a file")
      setIsSuccessModal(false)
      setOpen(true)
      setIsProcessingImage(false)
      return
    }

    if (!selectedAreaId) {
      setModalTitle("Error")
      setModalMessage("Please select an area")
      setIsSuccessModal(false)
      setOpen(true)
      setIsProcessingImage(false)
      return
    }

    if (!selectedCategoryId) {
      setModalTitle("Error")
      setModalMessage("Please select a category")
      setIsSuccessModal(false)
      setOpen(true)
      setIsProcessingImage(false)
      return
    }

    // Handle image: use new file or convert existing image URL to file
    let imageToUpload: File
    if (file) {
      // User uploaded a new file
      imageToUpload = file
    } else if (currentComplainant.image) {
      // Convert existing image URL to File object
      try {
        imageToUpload = await convertImageUrlToFile(currentComplainant.image)
      } catch {
        setModalTitle("Error")
        setModalMessage("Failed to process existing image")
        setIsSuccessModal(false)
        setOpen(true)
        setIsProcessingImage(false)
        return
      }
    } else {
      // Should not reach here due to validation above
      setModalTitle("Error")
      setModalMessage("No image available")
      setIsSuccessModal(false)
      setOpen(true)
      setIsProcessingImage(false)
      return
    }

    setIsProcessingImage(false)

    updateReport.mutate({
      id: reportId!,
      data: {
        campusId: campus?.campusId || '',
        complainantId: person?.id || '',
        complainantName: person?.name || '',
        complainantEmail: person?.email || '',
        areaId: selectedAreaId,
        areaName: selectedAreaName,
        categoryId: selectedCategoryId,
        categoryName: selectedCategoryName,
        description,
        image: imageToUpload,
      }
    }, {
      onSuccess: (res) => {
        setModalTitle("Success")
        setModalMessage(res.message || "Report updated successfully")
        setIsSuccessModal(true)
        setOpen(true)
      },
      onError: (err) => {
        setModalTitle("Error")
        setModalMessage(err.message || "Failed to update report")
        setIsSuccessModal(false)
        setOpen(true)
      }
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

  if (loading) {
    return (
      <SubLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading report...</div>
        </div>
      </SubLayout>
    )
  }

  if (error || !report) {
    return (
      <SubLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">{error || "Report not found"}</div>
        </div>
      </SubLayout>
    )
  }

  const isComplainant = activeRole.roleName === 'Custodian';

  const getHeaderTitle = () => {
    if (isEditMode) return "Edit Report"
    if (isViewMode) return "View Report"
    return "Report Details"
  }

  return (
    <SubLayout>
      <Header title={getHeaderTitle()} />

      <Modal
        open={open}
        onOpenChange={setOpen}
        title={modalTitle}
        message={modalMessage}
        onConfirm={isSuccessModal ? () => navigate("/dashboard") : undefined}
      />

      <div className="space-y-4 px-4 sm:px-0">
        {/* Multiple Complainants Navigation - Only for View Mode */}
        {isViewMode && report.complainant.length > 1 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Button
                  onClick={handlePreviousComplainant}
                  disabled={currentComplainantIndex === 0}
                  variant="outline"
                  size="sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <span className="text-sm text-gray-600">
                  Report {currentComplainantIndex + 1} of {report.complainant.length}
                </span>

                <Button
                  onClick={handleNextComplainant}
                  disabled={currentComplainantIndex === report.complainant.length - 1}
                  variant="outline"
                  size="sm"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Complainant Information - Only for View Mode */}
        {isViewMode && currentComplainant && (
          <Card>
            <CardContent className="p-4 text-[#5d5d5d]">
              <h2 className="font-semibold mb-3">Complainant Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={currentComplainant.name}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    value={currentComplainant.email}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Description */}
        <Card>
          <CardContent className="p-4 text-[#5d5d5d]">
            <h2 className="font-semibold mb-3">Description</h2>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description ..."
              disabled={isViewMode}
              className={isViewMode ? "bg-gray-100" : "bg-neutral-50 focus-visible:ring-0 focus-visible:ring-offset-0 w-full"}
            />
          </CardContent>
        </Card>

        {/* Area Select */}
        <Card>
          <CardContent className="p-4 text-[#5d5d5d]">
            <h2 className="font-semibold mb-3">Area</h2>
            <Select
              value={selectedAreaId}
              onValueChange={handleAreaSelect}
              disabled={isViewMode || isLoadingAreas}
            >
              <SelectTrigger className={`${isViewMode ? "bg-gray-100" : "bg-white focus:ring-0 focus:ring-offset-0"} border border-gray-200 w-full`}>
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
            <Select
              value={selectedCategoryId}
              onValueChange={handleCategorySelect}
              disabled={isViewMode || isLoadingCategories}
            >
              <SelectTrigger className={`${isViewMode ? "bg-gray-100" : "bg-white focus:ring-0 focus:ring-offset-0"} border border-gray-200 w-full`}>
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
              {/* Preview Box - Moved to bottom as requested */}
              <div className="w-full sm:w-[120px] aspect-square bg-neutral-50 flex items-center justify-center text-sm text-gray-400 border rounded-md overflow-hidden relative order-2 sm:order-1">
                {file ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : currentComplainant?.image ? (
                  <img
                    src={currentComplainant.image}
                    alt="Current"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-center">No Preview</span>
                )}
              </div>

              {/* Upload Field */}
              <div className="flex-1 order-1 sm:order-2">
                <h2 className="font-semibold mb-3">Upload File</h2>
                {!isViewMode ? (
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
                ) : (
                  <div className="text-sm text-gray-500">
                    {currentComplainant?.image ? "Image attached" : "No image"}
                  </div>
                )}

                <p className='mt-3 text-xs'>
                  File must be an image (.jpg / .png) or use camera to take photo
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit - Only for Edit Mode */}
        {isEditMode && (
          <div className="flex justify-center sm:justify-end px-4 sm:px-0">
            <Button
              style={BACKGROUND_PRIMARY_COLOR(0.7)}
              variant="default"
              onClick={handleSubmit}
              disabled={updateReport.isLoading || isProcessingImage}
              className="w-full sm:w-auto min-w-[120px]"
            >
              {isProcessingImage
                ? "Processing Image..."
                : updateReport.isLoading
                  ? "Updating..."
                  : "Update"
              }
            </Button>
          </div>
        )}

        {/* Take Report - Only for Custodian */}
        {isComplainant && (
          <div className="flex justify-center sm:justify-end px-4 sm:px-0">
            <Button
              style={BACKGROUND_PRIMARY_COLOR(0.7)}
              variant="default"
              onClick={handleTakeReport}
              disabled={updateReport.isLoading || isProcessingImage}
              className="w-full sm:w-auto min-w-[120px]"
            >
              Take Report
            </Button>
          </div>
        )}
      </div>

      {/* Camera Modal - Only for Edit Mode */}
      {isEditMode && (
        <CameraModal
          isOpen={isCameraModalOpen}
          onClose={handleCameraClose}
          onCapture={handleCameraCapture}
        />
      )}
    </SubLayout>
  )
}

export default ReportDetailPage