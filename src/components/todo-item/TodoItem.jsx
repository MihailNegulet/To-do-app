import React, { useState } from "react";
import "./TodoItem.css";
import Checkbox from "../checkbox/CheckBox";
import Button from "../button/Button";
import { v4 as uuidv4 } from "uuid";

const TodoItem = ({ todo, onDeleteTodo, onEditModalOpen, onChangeTodo, onSubtaskCreate, onEditSubtask, onDeleteSubtask, onChangeSubtask }) => {
  const [editingSubtaskId, setEditingSubtaskId] = useState(null);
  const [editedSubtaskTitle, setEditedSubtaskTitle] = useState("");

  console.log("TodoItem rendered with todo:", todo);
  
  const showSubtasks = () => {
    if (todo.subtasks && todo.subtasks.length > 0) {
      return (
        <ul>
          {todo.subtasks.map((subtask) => (
            <li key={subtask.id} className={`subtask-item ${!subtask.completed ? 'subtask-completed' : ''}`}>
              {editingSubtaskId === subtask.id ? (
                <input
                  type="text"
                  key={subtask.id}
                  value={editedSubtaskTitle}
                  onChange={(e) => {
                    setEditedSubtaskTitle(e.target.value);
                  }}
                  onBlur={(e) => {
                  
                  }}
                  onFocus={() => setEditedSubtaskTitle(subtask.title)}
                />

              ) : (
                  <span className="subtask-title">{subtask.title}</span>
              )}
              
         
              {editingSubtaskId === subtask.id ? (
                <>
                  <Button onClick={() => {
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
                  // <Button onClick={() => setEditingSubtaskId(subtask.id)}>Edit</Button>
                  <div className="subtask-actions">
                      <Checkbox
                        checked={subtask.completed}
                        onChange={() => onChangeSubtask(todo.id, subtask.id, !subtask.completed)}
                      />
              
                      <i className="fa fa-pencil" aria-hidden="true" onClick={() => setEditingSubtaskId(subtask.id)}></i>
                      <i className="fa fa-trash" aria-hidden="true" onClick={() => onDeleteSubtask(todo.id, subtask.id)}></i>
                    </div> 
               
              )}
              
              {/* <Button onClick={() => onDeleteSubtask(todo.id, subtask.id)}>Delete</Button> */} 
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

      <Button onClick={() => {
        const subtaskId = uuidv4();
        const newSubtaskTitle = prompt("Subtask title");
          onSubtaskCreate(todo.id, [{ id: subtaskId, title: newSubtaskTitle, completed: false }])
      }}>Add subtask</Button>
    </div>
  );
};

export default TodoItem;
