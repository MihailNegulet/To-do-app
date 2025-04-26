import React, { useState, useEffect } from "react";
import "./Modal.css";
import Card from "../card/Card";
import Input from "../input/Input";
import TextArea from "../input/TextArea";
import Button from "../button/Button";
import { v4 as uuidv4 } from "uuid";

const Modal = ({ onClose, isModalOpen, todoForModal, onTodoCreate, onTodoUpdate, onSubtaskCreate }) => {

  // const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState([]);

  const handleCloseModal = (e) => {
    e?.stopPropagation();
      onClose();
  };

  useEffect(() => {
    if (isModalOpen) {
      setTitle(todoForModal?.title ?? "");
      setDescription(todoForModal?.description ?? "");
      setSubtasks(todoForModal?.subtasks ?? []);
    } else {
      setTitle("");
      setDescription("");
      setSubtasks([]);
    }
  }, [isModalOpen, todoForModal]);

  useEffect(() => {
    setTitle(todoForModal?.title ?? "");
    setDescription(todoForModal?.description ?? "");
  }, [todoForModal]);

  const onSubmit = (e) => {
    e?.preventDefault();

    if (todoForModal) {
      onTodoUpdate(todoForModal.id, title, description);
    } else {
      onTodoCreate(title, description);
    }

    handleCloseModal();
  }

  return (
    <>
      {isModalOpen && (
        <div className="modal-wrapper">
          <i
            onClick={handleCloseModal}
            className="close-icon fa fa-times-circle-o"
            aria-hidden="true"
          ></i>

          <div className="modal-content">
            <Card>
              <h2>{todoForModal ? "Edit" : "Create"} Todo</h2>
              <form onSubmit={onSubmit}>
                <Input onChange={(e) => setTitle(e.target.value)} placeholder="Title" type="text" value={title} />
                <TextArea
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  value={description}
                />
                <h3>Subtasks</h3>
                <ul>
                  {subtasks.map((subtask) => (
                    <li key={subtask.id}>{subtask.title}</li>
                  ))}
                </ul>

                <Button type="button" onClick={() => {
                  const subtaskId = uuidv4();
                  const newSubtaskTitle = prompt("Subtask title")
                    setSubtasks([...subtasks, { id: subtaskId, title: newSubtaskTitle, completed: false }])
                }}>Add subtask</Button>

                <Button type="submit">{todoForModal ? "Edit" : "Create"}</Button>
              </form>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;