import React, { useRef } from "react";
import { Box } from "theme-ui";

export interface DialogProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

export const Dialog = ({ isOpen, onClose, children }: DialogProps) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog ref={dialogRef} onClose={onClose}>
      <Box sx={{ p: 3 }}>{children}</Box>
    </dialog>
  );
};
