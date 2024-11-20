import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface IConfirmDialogProps {
  titleMessage?: string;
  descriptionMessage?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  isInformative?: boolean;
  onConfirm?: () => void;
  confirmButtonId?: string;
}

const DEFAULT_MESSAGES = {
  title: "¿Estás completamente seguro?",
  description:
    "Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar permanentemente este registro de nuestros servidores?",
  cancel: "Cancelar",
  confirm: "Confirmar",
};

const ConfirmDialog = ({
  titleMessage = DEFAULT_MESSAGES.title,
  descriptionMessage = DEFAULT_MESSAGES.description,
  cancelLabel = DEFAULT_MESSAGES.cancel,
  confirmLabel = DEFAULT_MESSAGES.confirm,
  isInformative = false,
  onConfirm = () => {},
  confirmButtonId,
  ...props
}: IConfirmDialogProps) => {
  return (
    <DialogContent className="top-[20%]" {...props}>
      <DialogHeader>
        <DialogTitle>{titleMessage}</DialogTitle>
        <DialogDescription>{descriptionMessage}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        {!isInformative ? (
          <>
            <DialogClose asChild>
              <Button variant="outline">{cancelLabel}</Button>
            </DialogClose>
            <Button
              id={confirmButtonId}
              type="submit"
              variant="destructive"
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </>
        ) : (
          <DialogClose asChild>
            <Button variant="outline">{confirmLabel}</Button>
          </DialogClose>
        )}
      </DialogFooter>
    </DialogContent>
  );
};

export default ConfirmDialog;
