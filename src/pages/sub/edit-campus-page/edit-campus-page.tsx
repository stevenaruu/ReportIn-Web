import React, { useState } from "react";
import { Modal } from "@/components/modal/Modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { getProviderLogo } from "@/lib/get-provider-logo";
import { Info } from "lucide-react";
import { RootLayout } from "@/layouts/layout";
import { usePrimaryColor } from "@/lib/primary-color";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { selectUser } from "@/store/user/selector";
import { useUpdateCampusMutation } from "@/api/services/campus";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Header from "@/components/header/header";
import PreviewLogo from "@/assets/root/preview";

const EditCampusPage = () => {
  const location = useLocation();
  const campus = location.state?.campus;
  const updateCampus = useUpdateCampusMutation();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { BACKGROUND_PRIMARY_COLOR } = usePrimaryColor();

  // Modal state
  const [open, setOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccessModal, setIsSuccessModal] = useState(false);

  // Form state
  const [name, setName] = useState(campus?.name ?? "");
  const [mandatoryEmail, setMandatoryEmail] = useState<string[]>(campus?.mandatoryEmail ?? [""]);
  const [siteName, setSiteName] = useState(campus?.siteName ?? "");
  const [provider, setProvider] = useState(campus?.provider ?? "");
  const [primaryColor, setPrimaryColor] = useState(campus?.customization?.primaryColor ?? "#4b5563");
  const [customizationId] = useState(campus?.customization?.customizationId ?? "");
  // Helper to fetch and convert URL to File
  const urlToFile = async (url: string, filename: string, mimeType: string): Promise<File> => {
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    return new File([buf], filename, { type: mimeType });
  };

  // Initial logo and documents as File
  const [logo, setLogo] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState(campus?.customization?.logo ?? "");
  const [documents, setDocuments] = useState<(File | undefined)[]>([]);
  const [documentUrls, setDocumentUrls] = useState<string[]>(campus?.document ?? []);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

  React.useEffect(() => {
    let isMounted = true;
    setIsLoadingFiles(true);
    // Convert logoUrl to File if exists
    const logoPromise = logoUrl && !logo
      ? urlToFile(logoUrl, logoUrl.split('/').pop() || 'logo.png', 'image/png').then(f => isMounted && setLogo(f))
      : Promise.resolve();
    // Convert documentUrls to File if exists and not already set
    const docsPromise = documentUrls.length > 0 && documents.length === 0
      ? Promise.all(documentUrls.map(url => urlToFile(url, url.split('/').pop() || 'document.pdf', 'application/pdf')))
        .then(files => { if (isMounted) setDocuments(files); })
      : Promise.resolve();
    Promise.all([logoPromise, docsPromise]).finally(() => { if (isMounted) setIsLoadingFiles(false); });
    return () => { isMounted = false; };
    // eslint-disable-next-line
  }, []);

  // Add new document input
  const handleAddDocument = () => {
    setDocuments([...documents, undefined]);
  };

  // Remove document input
  const handleRemoveDocument = (idx: number) => {
    setDocuments(documents.filter((_, i) => i !== idx));
    setDocumentUrls(documentUrls.filter((_, i) => i !== idx));
  };

  // Handle document file change
  const handleDocumentChange = (idx: number, file: File | undefined) => {
    const newDocs = [...documents];
    newDocs[idx] = file;
    setDocuments(newDocs);
    // Remove old url if new file is uploaded
    if (file) {
      setDocumentUrls((urls) => urls.filter((_, i) => i !== idx));
    }
  };

  // Handle mandatory email change
  const handleMandatoryEmailChange = (idx: number, value: string) => {
    const newEmails = [...mandatoryEmail];
    newEmails[idx] = value;
    setMandatoryEmail(newEmails);
  };

  const handleAddMandatoryEmail = () => {
    setMandatoryEmail([...mandatoryEmail, ""]);
  };

  const handleRemoveMandatoryEmail = (idx: number) => {
    setMandatoryEmail(mandatoryEmail.filter((_, i) => i !== idx));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogo(file);
    if (file) setLogoUrl("");
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    setLogoUrl("");
  };

  const handleSubmit = () => {
    if (!name || !siteName || !provider || (!logo && !logoUrl)) {
      setModalTitle("Error");
      setModalMessage("Please fill all required fields and upload a logo.");
      setIsSuccessModal(false);
      setOpen(true);
      return;
    }
    if (mandatoryEmail.some((email) => !email)) {
      setModalTitle("Error");
      setModalMessage("Please fill all mandatory email fields.");
      setIsSuccessModal(false);
      setOpen(true);
      return;
    }
    // Only send new files, not URLs
    const docsToSend = documents.filter(Boolean) as File[];
    updateCampus.mutate({
      id: campus.id,
      data: {
        userId: user?.id || campus.userId || "",
        name,
        mandatoryEmail,
        siteName: siteName.toLowerCase(),
        provider,
        customization: { customizationId, primaryColor },
        logo: logo ? logo : (undefined as unknown as File),
        document: docsToSend,
      },
    }, {
      onSuccess: (res) => {
        setModalTitle("Success");
        setModalMessage(res.message || "Campus updated successfully");
        setIsSuccessModal(true);
        setOpen(true);
      },
      onError: (err) => {
        setModalTitle("Error");
        setModalMessage(err.message || "Failed to update campus");
        setIsSuccessModal(false);
        setOpen(true);
      }
    });
  };

  return (
    <RootLayout>
      <br />
      <Header title="Edit Campus" />
      <Modal
        open={open}
        onOpenChange={setOpen}
        title={modalTitle}
        message={modalMessage}
        onConfirm={isSuccessModal ? () => navigate("/dashboard") : undefined}
      />
      <div className="space-y-4 px-4 sm:px-0">
        <Card>
          <CardContent className="p-4 text-[#5d5d5d]">
            <h2 className="font-semibold mb-3">Campus Name</h2>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Campus Name ..."
              className="bg-neutral-50 focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-[#5d5d5d]">
            <h2 className="font-semibold mb-3">Site Name</h2>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Input
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="Site Name ..."
                className="bg-neutral-50 focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
              />
              <Input
                value={"." + window.location.host}
                disabled
                className="text-black focus-visible:ring-0 focus-visible:ring-offset-0 cursor-not-allowed w-full sm:w-auto"
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-[#5d5d5d]">
            <h2 className="font-semibold mb-3">Provider</h2>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger className="bg-white focus:ring-0 focus:ring-offset-0 border border-gray-200 w-full">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg w-full">
                <SelectItem value="Microsoft" className="flex items-center gap-2">
                  <img src={getProviderLogo("Microsoft")} alt="Microsoft" className="w-5 h-5 inline-block mr-2" />
                  Microsoft
                </SelectItem>
                <SelectItem value="Google" className="flex items-center gap-2">
                  <img src={getProviderLogo("Google")} alt="Google" className="w-5 h-5 inline-block mr-2" />
                  Google
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
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
                      className="bg-transparent border-0 p-0 m-0 cursor-pointer"
                    >
                      <Info size={18} className="text-[#5d5d5d]" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <span>
                      The primary color defines the main accent of your campus
                      application. Your app will visually adapt to this color theme.
                    </span>
                  </TooltipContent>
                </Tooltip>
              </div>

              <Input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-full h-8 p-0 border-none cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-[#5d5d5d]">
            <div className="flex items-center mb-3 gap-2">
              <h2 className="font-semibold">Mandatory Email</h2>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="bg-transparent border-0 p-0 m-0 cursor-pointer">
                    <Info size={18} className="text-[#5d5d5d]" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <span>
                    Mandatory email acts as a whitelist. Only users with emails matching these domains can log in to this campus.
                  </span>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex flex-col gap-2">
              {mandatoryEmail.map((email, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Input
                    value={email}
                    onChange={(e) => handleMandatoryEmailChange(idx, e.target.value)}
                    placeholder="@domain.tld ..."
                    className="bg-neutral-50 focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
                  />
                  <Button type="button" variant="outline" onClick={() => handleRemoveMandatoryEmail(idx)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={handleAddMandatoryEmail}>
                Add Email
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-[#5d5d5d] flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {/* Preview Box */}
              <div className="w-full sm:w-[120px] aspect-square bg-neutral-50 flex items-center justify-center text-sm text-gray-400 border rounded-md overflow-hidden relative">
                {logo ? (
                  <img
                    src={URL.createObjectURL(logo)}
                    alt="Logo Preview"
                    className="w-full h-full object-cover"
                  />
                ) : logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-center">No Preview</span>
                )}
              </div>
              {/* Upload Field */}
              <div className="flex-1">
                <h2 className="font-semibold mb-3">Upload Logo</h2>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="file"
                    accept="image/jpeg, image/png"
                    onChange={handleLogoChange}
                    className="bg-neutral-50 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
                  />
                  {(logo || logoUrl) && (
                    <Button className='bg-neutral-50' type="button" variant="outline" onClick={handleRemoveLogo}>
                      Remove
                    </Button>
                  )}
                </div>
                <p className='mt-3 text-xs'>Logo must be an image (.jpg / .png)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-[#5d5d5d] flex flex-col gap-2">
            <h2 className="font-semibold mb-3">Upload Document(s)</h2>
            {isLoadingFiles ? (
              <div className="text-sm text-gray-400">Loading documents...</div>
            ) : (
              <>
                {documents.map((doc, idx) => (
                  <div key={"doc-" + idx} className="flex gap-2 items-center">
                    <Input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleDocumentChange(idx, e.target.files?.[0])}
                      className="bg-neutral-50 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <Button type="button" variant="outline" onClick={() => handleRemoveDocument(idx)}>
                      Remove
                    </Button>
                    {doc && (
                      <>
                        <span className="text-xs">{doc.name}</span>
                        <a
                          href={URL.createObjectURL(doc)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs underline text-blue-600 ml-2"
                          download={doc.name}
                        >
                          Download
                        </a>
                      </>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={handleAddDocument}>
                  Add Document
                </Button>
              </>
            )}
          </CardContent>
        </Card>
        <div className="flex justify-center sm:justify-end pb-4 px-4 sm:px-0">
          <Button
            style={BACKGROUND_PRIMARY_COLOR(1)}
            variant="default"
            onClick={handleSubmit}
            disabled={updateCampus.isLoading}
            className="w-full sm:w-auto min-w-[120px]"
          >
            {updateCampus.isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </RootLayout>
  );
};

export default EditCampusPage;
