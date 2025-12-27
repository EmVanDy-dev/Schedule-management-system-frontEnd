import type React from "react";
import { Modal } from "react-bootstrap";

type CrudModalProps = {
  show: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  submitText: string;
  isValid: boolean;
  children: React.ReactNode;
};

// Reusable CRUD Modal

export default function CrudModal({
  show,
  onClose,
  onSubmit,
  title,
  submitText,
  isValid,
  children,
}: CrudModalProps) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <Modal.Header >
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>{children}</Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-outline-primary"
            disabled={!isValid}
          >
            {submitText}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
