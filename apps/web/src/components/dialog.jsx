import React, { useRef } from "react";
import { Box } from "theme-ui";

const Dialog = ({ isOpen, onClose, children }) => {
  const dialogRef = useRef(null);

  React.useEffect(() => {
    const dialog = dialogRef.current;

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

export default Dialog;
