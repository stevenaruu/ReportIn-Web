import { useCreateReportMutation } from '@/api/services/report'
import Header from '@/components/header/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { SubLayout } from '@/layouts/layout'
import { usePrimaryColor } from '@/lib/primary-color'
import { selectCampus } from '@/store/campus/selector'
import { selectPerson } from '@/store/person/selector'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

const ReportPage = () => {
  const report = useCreateReportMutation();

  const person = useSelector(selectPerson);
  const campus = useSelector(selectCampus);
  const { BACKGROUND_PRIMARY_COLOR } = usePrimaryColor();    

  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = () => {
    if (!file) {
      alert('Please upload a file')
      return
    }

    report.mutate({
      campusId: campus?.campusId || '',
      complainantId: person?.id || '',
      complainantName: person?.name || '',
      complainantEmail: person?.email || '',
      areaId: 'area-id-12',
      areaName: 'RUANG 404',
      categoryId: 'category-123-123-123',
      categoryName: 'KEBERSIHAN',
      description,
      image: file,
    })
  }

  return (
    <SubLayout>
      <Header title="Create Report" />

      <div className="space-y-4">
        <Card>
          <CardContent className="p-4 text-[#5d5d5d]">
            <h2 className="font-semibold mb-3">Description</h2>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description ..."
              className="bg-neutral-50 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex gap-4 p-4 text-[#5d5d5d] items-center justify-start">
            {/* Preview Box */}
            <div className="w-[120px] h-[120px] bg-neutral-50 flex items-center justify-center text-sm text-gray-400 border rounded-md overflow-hidden">
              {file ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>No Preview</span>
              )}
            </div>

            {/* Upload Field */}
            <div className="flex-1">
              <h2 className="font-semibold mb-3">Upload File</h2>
              <Input
                type="file"
                accept="image/jpeg, image/png"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="bg-neutral-50 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <p className='mt-3 text-xs'>File must be an image (.jpg / .png)</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            style={BACKGROUND_PRIMARY_COLOR(0.7)}
            variant="default"
            onClick={handleSubmit}
            disabled={report.isLoading}
          >
            {report.isLoading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </SubLayout>
  )
}

export default ReportPage