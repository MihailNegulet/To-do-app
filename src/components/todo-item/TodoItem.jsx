import React, { useState } from "react";
import "./TodoItem.css";
import Checkbox from "../checkbox/CheckBox";

const TodoItem = ({todo, onDeleteTodo, onEditModalOpen, onChangeTodo}) => {
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
        <div>
          <i className="fa fa-pencil" aria-hidden="true" onClick={onEditModalOpen}></i>
          <i className="fa fa-trash" aria-hidden="true" onClick={onDeleteTodo}></i>
        </div>
      </div>

      <div className="separator"></div>

      <p>
        {todo.description}
      </p>
    </div>
  );
};

export default TodoItem;
