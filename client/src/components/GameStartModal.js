import React from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";

import { useFormFields } from "../hooks";

const GameState = {
  NOT_STARTED: 1,
  WAITING_FOR_PLAYER: 2,
  ACTIVE: 3,
};
Object.freeze(GameState);

export default function GameStartModal(props) {
  const [fields, handleFieldChange] = useFormFields({
    username: "",
    room: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    props.joinRoom(fields.username, fields.room);
    if (props.gameStartMode && props.gameStartMode === 'start') {
      props.setMyTurn(true);
    } else if (props.gameStartMode && props.gameStartMode === 'join') {
      props.setMyTurn(false);
    }
    props.hideModal();
  };

  return (
    <Modal
      show={props.showModal}
      style={{ marginTop: 60 }}
      onHide={props.hideModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>Start the game</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={handleSubmit}
          style={{
            marginTop: 0,
            marginBottom: 10,
            display: "block",
            whiteSpace: "nowrap",
          }}
        >
          <Form.Group controlId="username" bssize="large">
            <FormControl
              value={fields.username}
              onChange={handleFieldChange}
              placeholder="Username"
              style={{ marginBottom: 10 }}
            />
          </Form.Group>
          <Form.Group controlId="room" bssize="large">
            <FormControl
              value={fields.room}
              onChange={handleFieldChange}
              placeholder="Room Name"
              style={{ marginBottom: 10 }}
            />
          </Form.Group>
          <Button type="submit" id="large-button" style={{ marginTop: 15 }}>
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
