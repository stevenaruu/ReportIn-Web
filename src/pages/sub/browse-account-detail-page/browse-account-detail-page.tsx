/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"
import { SubLayout } from "@/layouts/layout"
import type { IGetAllPersonResponse } from "@/types/response/person"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { hexToRgba } from "@/lib/hex-to-rgba"
import { ROLES } from "@/lib/roles"
import Header from "@/components/header/header"
import type { IUpdatePersonRoleRequest } from "@/types/request/person"
import { useUpdatePersonRole } from "@/api/services/person"
import { useSelector } from "react-redux"
import { selectCampus } from "@/store/campus/selector"
import { usePrimaryColor } from "@/lib/primary-color"
import { Modal } from "@/components/modal/Modal"
import { Edit2 } from "lucide-react"

const BrowseAccountDetailPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const person = location.state as IGetAllPersonResponse
  const updateRole = useUpdatePersonRole(person.id)
  const campus = useSelector(selectCampus)
  const { BACKGROUND_PRIMARY_COLOR } = usePrimaryColor()

  const [selectedRoles, setSelectedRoles] = useState<string[]>(person?.role.map((r) => r.roleId) || [])

  // modal state
  const [open, setOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState("")
  const [modalMessage, setModalMessage] = useState("")

  const handleToggleRole = (roleId: string) => {
    setSelectedRoles((prev) => (prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]))
  }

  const handleSubmit = () => {
    const checkedRoles = ROLES.filter((r) => selectedRoles.includes(r.roleId))

    const request: IUpdatePersonRoleRequest = {
      campusId: campus?.campusId ?? "",
      role: checkedRoles.map((role) => ({
        roleId: role.roleId,
        roleName: role.roleName,
      })),
    }

    updateRole.mutate(request, {
      onSuccess: (res) => {
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

  const handleEditTechnicianPreference = () => {
    navigate("/technician-preference", { state: person })
  }

  return (
    <SubLayout>
      <Header title="Edit Account" />

      <Modal open={open} onOpenChange={setOpen} title={modalTitle} message={modalMessage} />

      {person && (
        <div className="space-y-4">
          {/* Name */}
          <Card>
            <CardContent className="p-4 text-[#5d5d5d]">
              <h2 className="font-semibold mb-3">Name</h2>
              <Input className="bg-gray-100" value={person.name} disabled />
            </CardContent>
          </Card>

          {/* Email */}
          <Card>
            <CardContent className="p-4 text-[#5d5d5d]">
              <h2 className="font-semibold mb-3">Email</h2>
              <Input className="bg-gray-100" value={person.email} disabled />
            </CardContent>
          </Card>

          {/* Role Mapping */}
          <Card>
            <CardContent className="p-4 text-[#5d5d5d]">
              <div className="mb-3">
                <h2 className="font-semibold">Role Mapping</h2>
              </div>
              <div className="border rounded-md">
                <div className="grid grid-cols-1 divide-y">
                  <p className="p-3">Role Name</p>
                  {ROLES.map((role) => (
                    <label key={role.roleId} className="flex items-center justify-between gap-3 p-3">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          style={{
                            backgroundColor: selectedRoles.includes(role.roleId)
                              ? hexToRgba(campus?.customization.primaryColor, 0.7)
                              : undefined,
                          }}
                          checked={selectedRoles.includes(role.roleId)}
                          onCheckedChange={() => handleToggleRole(role.roleId)}
                        />
                        <span>{role.roleName}</span>
                      </div>
                      {role.roleName === "Custodian" && (
                        <button
                          onClick={handleEditTechnicianPreference}
                          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                          title="Edit Technician Preference"
                        >
                          <Edit2 size={18} className="text-gray-600" />
                        </button>
                      )}
                    </label>
                  ))}
                </div>
              </div>
              <Button
                onClick={handleSubmit}
                style={BACKGROUND_PRIMARY_COLOR(0.7)}
                className="mt-4"
                disabled={updateRole.isLoading}
              >
                {updateRole.isLoading ? "Submitting..." : "Submit"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </SubLayout>
  )
}

export default BrowseAccountDetailPage