import React, { useState } from "react";
import { Alert, Modal } from "react-bootstrap";
import AddMember from "./AddMember";
import UpdateImage from "./UpdateImage";
import UpdateNumber from "./UpdateNumber";
export default function ModalX({
  cbShow,
  cshow,
  modalTitle,
  familyID,
  modalAction,
  alertmessage,
}) {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    // console.log("Ram");
    setShow(false);
    cbShow();
  };
  const handleShow = () => {
    setShow(true);
  };
  if (!show && cshow) {
    handleShow();
  }

  function ShowForm(props) {
    const selected = props.value;
    if (selected === 0) {
      return <UpdateNumber familyID={familyID} handleClose={handleClose} />;
    } else if (selected === 1) {
      return <UpdateImage familyID={familyID} handleClose={handleClose} />;
    } else {
      return <AddMember familyID={familyID} handleClose={handleClose} />;
    }
  }
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {alertmessage ? <Alert variant="danger">{alertmessage}</Alert> : ""}
          <ShowForm value={modalAction} />
        </Modal.Body>
      </Modal>
    </>
  );
}
