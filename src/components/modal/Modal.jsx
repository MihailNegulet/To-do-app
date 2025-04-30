import React, { useState, useEffect, useRef } from "react";
import "./Modal.css";
import Card from "../card/Card";
import Input from "../input/Input";
import TextArea from "../input/TextArea";
import Button from "../button/Button";
import { v4 as uuidv4 } from "uuid";

const Modal = ({ onClose, isModalOpen, todoForModal, onTodoCreate, onTodoUpdate, onSubtaskCreate }) => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const newSubtaskInputRef = useRef(null);


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

  const onSubmit = (e) => {
    e?.preventDefault();

    if (todoForModal) {
      onTodoUpdate(todoForModal.id, title, description, subtasks);
    } else {
      onTodoCreate(title, description, subtasks);
    }

    handleCloseModal();
  }

  const handleAddSubtask = () => {
    const trimmedTitle = newSubtaskTitle.trim();
    if (trimmedTitle !== "") {
      const subtaskId = uuidv4();
      const newSubtask = { id: subtaskId, title: trimmedTitle, completed: false };
      setSubtasks((prevSubtasks) => [...prevSubtasks, newSubtask]);
      setNewSubtaskTitle(""); // golește inputul după adăugare
    }  else {
      alert("Subtask title cannot be empty!");
    }
  };

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
                <ul className="subtasks-list">
                  {subtasks.map((subtask) => (
                    <li key={subtask.id} className="subtask-item">
                      <span>{subtask.title}</span>
                      <button
                        type="button"
                        className="delete-subtask-btn"
                        onClick={() => {
                          setSubtasks((prevSubtasks) => prevSubtasks.filter((s) => s.id !== subtask.id));
                        }}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="add-subtask-section">
                  <input
                    type="text"
                    placeholder="Add a new subtask..."
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddSubtask();
                      }
                    }}
                    ref={newSubtaskInputRef}
                  />
                  <Button type="button" onClick={handleAddSubtask}>
                    Add
                  </Button>
                </div>

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