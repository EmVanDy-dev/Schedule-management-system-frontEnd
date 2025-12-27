import { Modal, Button } from "react-bootstrap";

type DeleteModalProps = {
  show: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  message?: string;
};

export default function DeleteModal({
  show,
  onCancel,
  onConfirm,
  message = "Are you sure you want to delete this item?",
}: DeleteModalProps) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header>
        <Modal.Title>⚠️ Confirm Delete</Modal.Title>
      </Modal.Header>

      <Modal.Body>{message}</Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Yes, Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
