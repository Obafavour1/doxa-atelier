import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Button from "./Button";

type ModalProps = {
  isOpen: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
};

export const Modal = ({ isOpen, title, description, onClose, children }: ModalProps) => (
  <AnimatePresence>
    {isOpen ? (
      <motion.div
        className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-950/70 px-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="surface-card w-full max-w-lg rounded-[32px] p-6"
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-white">{title}</h3>
              {description ? <p className="mt-2 text-sm text-ink-300">{description}</p> : null}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close dialog">
              <X className="h-4 w-4" />
            </Button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    ) : null}
  </AnimatePresence>
);

export default Modal;
