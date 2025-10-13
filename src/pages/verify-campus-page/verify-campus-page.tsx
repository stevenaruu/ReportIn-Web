import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getProviderLogo } from "@/lib/get-provider-logo";
import { Info } from "lucide-react";
import { RootLayout } from "@/layouts/layout";
import { useLocation, useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Header from "@/components/header/header";
import PreviewLogo from "@/assets/root/preview";
import { Button } from "@/components/ui/button";
import { usePrimaryColor } from "@/lib/primary-color";
import RejectReasonModal from "@/components/reject-reason-modal/reject-reason-modal";
import { useVerifyCampus } from "@/api/services/campus";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/user/selector";
import { Modal } from "@/components/modal/Modal";
import { Textarea } from "@/components/ui/textarea";

const VerifyCampusPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const campus = location.state?.campus;
  const user = useSelector(selectUser);

  const { BACKGROUND_PRIMARY_COLOR } = usePrimaryColor();

  // View data states
  const [name] = useState(campus?.name ?? "");
  const [mandatoryEmail] = useState<string[]>(campus?.mandatoryEmail ?? [""]);
  const [siteName] = useState(campus?.siteName ?? "");
  const [provider] = useState(campus?.provider ?? "");
  const [primaryColor] = useState(campus?.customization?.primaryColor ?? "#4b5563");
  const [logoUrl] = useState(campus?.customization?.logo ?? "");
  const [documentUrls] = useState<string[]>(campus?.document ?? []);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  // modal state
  const [open, setOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState("")
  const [modalMessage, setModalMessage] = useState("")
  const [comment] = useState(campus?.comment ?? "");

  const verifyCampus = useVerifyCampus();

  useEffect(() => {
    setIsLoadingFiles(false);
  }, []);

  const handleReject = (reason: string) => {
    verifyCampus.mutate(
      {
        campusId: campus?.id ?? "",
        comment: reason,
        status: "Rejected",
        userId: user?.id ?? ""
      },
      {
        onSuccess: (res) => {
          setModalTitle("Success");
          setModalMessage(res.message);
          setOpen(true);
        },
        onError: (err) => {
          setModalTitle("Error");
          setModalMessage(err.message);
          setOpen(true);
        }
      });
  };

  const handleApprove = () => {
    verifyCampus.mutate(
      {
        campusId: campus?.id ?? "",
        comment: "The campus information and documentation have been verified and meet all required standards for approval.",
        status: "Approved",
        userId: user?.id ?? ""
      },
      {
        onSuccess: (res) => {
          setModalTitle("Success");
          setModalMessage(res.message);
          setOpen(true);
        },
        onError: (err) => {
          setModalTitle("Error");
          setModalMessage(err.message);
          setOpen(true);
        }
      });
  }

  return (
    <RootLayout>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title={modalTitle}
        message={modalMessage}
        onConfirm={() => navigate("/dashboard")}
      />
      <br />
      <Header title="View Campus" />
      <div className="space-y-4 px-4 sm:px-0">
        {/* Campus Name */}
        <Card>
          <CardContent className="p-4 text-[#5d5d5d]">
            <h2 className="font-semibold mb-3">Campus Name</h2>
            <Input
              value={name}
              disabled
              className="bg-neutral-100 cursor-not-allowed w-full"
            />
          </CardContent>
        </Card>

        {/* Site Name */}
        <Card>
          <CardContent className="p-4 text-[#5d5d5d]">
            <h2 className="font-semibold mb-3">Site Name</h2>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Input
                value={siteName}
                disabled
                className="bg-neutral-100 cursor-not-allowed w-full"
              />
              <Input
                value={"." + window.location.host}
                disabled
                className="text-black bg-neutral-100 cursor-not-allowed w-full sm:w-auto"
              />
            </div>
          </CardContent>
        </Card>

        {/* Provider */}
        <Card>
          <CardContent className="p-4 text-[#5d5d5d]">
            <h2 className="font-semibold mb-3">Provider</h2>
            <div className="flex items-center gap-2 border rounded-md bg-neutral-100 p-2">
              {provider && (
                <img
                  src={getProviderLogo(provider)}
                  alt={provider}
                  className="w-5 h-5"
                />
              )}
              <span>{provider || "-"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Primary Color */}
        <Card>
          <CardContent className="p-4 flex gap-6 text-[#5d5d5d]">
            <div className="w-2/12 flex">
              <PreviewLogo color={primaryColor} className="w-16 h-16" />
            </div>
            <div className="w-10/12">
              <div className="flex items-center mb-3 gap-2">
                <h2 className="font-semibold">Primary Color</h2>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="bg-transparent border-0 p-0 m-0 cursor-default"
                    >
                      <Info size={18} className="text-[#5d5d5d]" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <span>
                      The primary color defines the main accent of your campus application.
                    </span>
                  </TooltipContent>
                </Tooltip>
              </div>

              <Input
                type="color"
                value={primaryColor}
                disabled
                className="w-full h-8 p-0 border-none cursor-not-allowed bg-neutral-100"
              />
            </div>
          </CardContent>
        </Card>

        {/* Mandatory Email */}
        <Card>
          <CardContent className="p-4 text-[#5d5d5d]">
            <div className="flex items-center mb-3 gap-2">
              <h2 className="font-semibold">Mandatory Email</h2>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="bg-transparent border-0 p-0 m-0 cursor-default">
                    <Info size={18} className="text-[#5d5d5d]" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <span>
                    Only users with emails matching these domains can log in to this campus.
                  </span>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex flex-col gap-2">
              {mandatoryEmail.map((email, idx) => (
                <Input
                  key={idx}
                  value={email}
                  disabled
                  className="bg-neutral-100 cursor-not-allowed w-full"
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Logo */}
        <Card>
          <CardContent className="p-4 text-[#5d5d5d] flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-full sm:w-[120px] aspect-square bg-neutral-50 flex items-center justify-center text-sm text-gray-400 border rounded-md overflow-hidden relative">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-center">No Preview</span>
                )}
              </div>
              <div className="flex-1">
                <h2 className="font-semibold mb-3">Logo</h2>
                <Input
                  value={logoUrl ? logoUrl.split("/").pop() ?? "Logo.png" : "No file"}
                  disabled
                  className="bg-neutral-100 cursor-not-allowed w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardContent className="p-4 text-[#5d5d5d] flex flex-col gap-2">
            <h2 className="font-semibold mb-3">Document(s)</h2>
            {isLoadingFiles ? (
              <div className="text-sm text-gray-400">Loading documents...</div>
            ) : (
              <>
                {documentUrls.length > 0 ? (
                  documentUrls.map((url, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        value={url.split("/").pop() ?? "Document.pdf"}
                        disabled
                        className="bg-neutral-100 cursor-not-allowed"
                      />
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs underline text-blue-600"
                      >
                        View
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No documents uploaded</p>
                )}
              </>
            )}
          </CardContent>
        </Card>
        {/* Comment Input: Only show if campus exists */}
        {campus ? (
          <Card>
            <CardContent className="p-4 text-[#5d5d5d]">
              <h2 className="font-semibold mb-3">Comment</h2>
              <Textarea
                className="bg-neutral-100"
                value={comment}
                disabled
                placeholder="No comment"
              />
            </CardContent>
          </Card>
        ) : null}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center sm:justify-end pb-4 px-4 sm:px-0">
          <Button
            style={BACKGROUND_PRIMARY_COLOR(1)}
            variant="default"
            className="w-full sm:w-auto min-w-[120px]"
            onClick={() => setIsRejectModalOpen(true)}
            disabled={verifyCampus.isLoading}
          >
            {verifyCampus.isLoading ? "Loading..." : "Reject"}
          </Button>
          <Button
            style={BACKGROUND_PRIMARY_COLOR(1)}
            variant="default"
            className="w-full sm:w-auto min-w-[120px]"
            onClick={() => handleApprove()}
            disabled={verifyCampus.isLoading}
          >
            {verifyCampus.isLoading ? "Loading..." : "Approve"}
          </Button>
        </div>
      </div>

      <RejectReasonModal
        open={isRejectModalOpen}
        onOpenChange={setIsRejectModalOpen}
        onConfirm={handleReject}
      />
    </RootLayout>
  );
};

export default VerifyCampusPage;