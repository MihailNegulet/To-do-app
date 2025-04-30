import React, { useState, useRef, useEffect } from "react";
import "./TodoItem.css";
import Checkbox from "../checkbox/CheckBox";
import Button from "../button/Button";
import { v4 as uuidv4 } from "uuid";

const TodoItem = ({ todo, onDeleteTodo, onEditModalOpen, onChangeTodo, onSubtaskCreate, onEditSubtask, onDeleteSubtask, onChangeSubtask }) => {
  const [editingSubtaskId, setEditingSubtaskId] = useState(null);
  const [editedSubtaskTitle, setEditedSubtaskTitle] = useState("");
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const newSubtaskInputRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingSubtaskId !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingSubtaskId]);
  
  const showSubtasks = () => {
    if (todo.subtasks && todo.subtasks.length > 0) {
      return (
        <ul>
          {todo.subtasks.map((subtask) => (
            
            <li key={subtask.id} className={`subtask-item ${subtask.completed ? 'subtask-completed' : ''}`}>
                <Checkbox
                    checked={subtask.completed}
                    onChange={() => onChangeSubtask(todo.id, subtask.id, !subtask.completed)}
                />
              {editingSubtaskId === subtask.id ? (
                <input
                  type="text"
                  className={`subtask-edit-input ${editingSubtaskId === subtask.id ? 'show' : ''}`}
                  key={subtask.id}
                  value={editedSubtaskTitle}
                  onChange={(e) => setEditedSubtaskTitle(e.target.value)}
                  onBlur={() => {}}
                  ref={inputRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onEditSubtask(todo.id, subtask.id, editedSubtaskTitle);
                      setEditingSubtaskId(null);
                      setEditedSubtaskTitle("");
                    }
                    if (e.key === "Escape") {
                      setEditingSubtaskId(null);
                      setEditedSubtaskTitle("");
                    }
                  }}
                />

              ) : (
                  <span className="subtask-title">{subtask.title}</span>
              )}
              
          
              {editingSubtaskId === subtask.id ? (
                <>
                  <Button
                    onClick={() => {
                    onEditSubtask(todo.id, subtask.id, editedSubtaskTitle);
                    setEditingSubtaskId(null);
                    setEditedSubtaskTitle("");
                  }}>Save</Button>
                  <Button onClick={() => {
                    setEditingSubtaskId(null);
                    setEditedSubtaskTitle("");
                  }}>Cancel</Button>
                </>
              ) : (
                  <div className="subtask-actions">
                 
              
                    <i className="fa fa-pencil" aria-hidden="true" onClick={() => {
                      setEditingSubtaskId(subtask.id);
                      setEditedSubtaskTitle(subtask.title);
                    }}>
                    
                    </i>
                      <i className="fa fa-trash" aria-hidden="true" onClick={() => onDeleteSubtask(todo.id, subtask.id)}></i>
                    </div> 
               
              )}              
            </li>
          ))}
        </ul>
      );
    }
  };

  const handleCheckboxChange = (value) => {
    onChangeTodo(todo.id, {
      completed: value,
    });
  };

  const handleAddSubtask = () => {
    const trimmedTitle = newSubtaskTitle.trim();
    if (trimmedTitle !== "") {
      const subtaskId = uuidv4();
      onSubtaskCreate(todo.id, [{ id: subtaskId, title: trimmedTitle, completed: false }]);
      setNewSubtaskTitle(""); // reset inputul după adăugare
    }
  };

  return (
    <div className={`todo-item ${todo.completed && "todo-completed"}`}>
      <div className="todo-item-header">
        <div className="title-area">
          <Checkbox
            checked={todo.completed}
            onChange={handleCheckboxChange}
          />

          <h4>{todo.title}</h4>
        </div>
        <div className="subtask-actions">
          <i className="fa fa-pencil" aria-hidden="true" onClick={onEditModalOpen}></i>
          <i className="fa fa-trash" aria-hidden="true" onClick={onDeleteTodo}></i>
        </div>
      </div>

      <div className="separator"></div>

      <p>
        {todo.description}
      </p>

      {showSubtasks()}

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
      <div className="separator"></div>
      <p className="subtask-count">{todo.subtasks ? todo.subtasks.length : 0} subtasks</p>


      {/* <Button onClick={() => {
        const newSubtaskTitle = prompt("Subtask title");
        if (newSubtaskTitle && newSubtaskTitle.trim() !== "") {
          const subtaskId = uuidv4();
          onSubtaskCreate(todo.id, [{ id: subtaskId, title: newSubtaskTitle.trim(), completed: false }])
        }
      }}
      >Add subtask</Button> */}
    </div>
  );
};

export default TodoItem;
