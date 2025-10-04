import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { usePrimaryColor } from "@/lib/primary-color"
import { useSelector } from "react-redux"
import { selectCampus } from "@/store/campus/selector"

interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  message: string
  onConfirm?: () => void
  confirmText?: string
  onCancel?: () => void
  cancelText?: string
  loading?: boolean
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onOpenChange,
  title,
  message,
  onConfirm,
  confirmText = "OK",
  onCancel,
  cancelText = "Cancel",
  loading = false,
}) => {
  const campus = useSelector(selectCampus);
  const { BACKGROUND_PRIMARY_COLOR, TEXT_PRIMARY_COLOR } = usePrimaryColor();
  const opacity = campus ? 0.7 : 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {onCancel && (
            <Button
              variant="outline"
              style={TEXT_PRIMARY_COLOR(opacity)}
              onClick={() => {
                onCancel();
                onOpenChange(false);
              }}
              disabled={loading}
            >
              {cancelText}
            </Button>
          )}
          <Button
            style={BACKGROUND_PRIMARY_COLOR(opacity)}
            onClick={() => {
              if (onConfirm) onConfirm();
              if (confirmText === "OK") onOpenChange(false);
            }}
            disabled={loading}
          >
            {loading ? "Loading..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
