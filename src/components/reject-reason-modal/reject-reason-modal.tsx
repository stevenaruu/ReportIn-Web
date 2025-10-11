import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { usePrimaryColor } from "@/lib/primary-color";

interface RejectReasonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
  loading?: boolean;
}

const RejectReasonModal: React.FC<RejectReasonModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
  loading = false,
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const { BACKGROUND_PRIMARY_COLOR } = usePrimaryColor();

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError("Please provide a reason before rejecting.");
      return;
    }
    setError("");
    onConfirm(reason);
    onOpenChange(false);
    setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Reject Campus Verification</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this campus request.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-1">
          <Textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError("");
            }}
            placeholder="Enter your rejection reason..."
            className={`min-h-[120px] ${error ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-0 focus-visible:ring-offset-0"}`}
          />
          {error && (
            <span className="text-sm text-red-500">{error}</span>
          )}
        </div>

        <DialogFooter className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => {
              setError("");
              onOpenChange(false);
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            style={BACKGROUND_PRIMARY_COLOR(1)}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectReasonModal;