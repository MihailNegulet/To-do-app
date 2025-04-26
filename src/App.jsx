import React from "react";
import Card from "./components/card/Card";
import TodoItem from "./components/todo-item/TodoItem";
import Button from "./components/button/Button";
import "./App.css";
import Modal from "./components/modal/Modal";
import { v4 as uuidv4 } from 'uuid';

const INITIAL_TODOS = [
  {
    id: uuidv4(),
    title: "Todo 1",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. At id illo repellendus non maiores in pariatur aliquam iure fugit amet!",
    completed: false,
    subtasks: []
  },
  {
    id: uuidv4(),
    title: "Todo 2",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit!",
    completed: false,
    subtasks: []
  },
  {
    id: uuidv4(),
    title: "Todo 3",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit!",
    completed: true,
    subtasks: []
  },
  {
    id: uuidv4(),
    title: "Todo 6",
    description: "Terminam cursul de React",
    completed: false,
    subtasks: []
  },
  {
    id: uuidv4(),
    title: "Todo 4",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit!",
    completed: true,
    subtasks: []
  },
  {
    id: uuidv4(),
    title: "Todo 5",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit!",
    completed: true,
    subtasks: []
  },
];

function App() {

  const LOCAL_STORAGE_TODOS_KEY = "todos";
  const compareTodosIdFn = (todo1, todo2) => parseInt(todo1.id) > parseInt(todo2.id) ? 1 : -1;
  const [todos, setTodos] = React.useState(() => {
    const storedTodos = localStorage.getItem(LOCAL_STORAGE_TODOS_KEY);
    return storedTodos ? JSON.parse(storedTodos) : INITIAL_TODOS;
  });

  React.useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_TODOS_KEY, JSON.stringify(todos));
  }, [todos]);


  const onSubtaskCreate = (todoId, newSubtasks) => {
    setTodos(todos => todos.map(todo => {
        if (todo.id !== todoId) {
          return todo;
        }
        return {
          ...todo,
          subtasks: [...todo.subtasks, ...newSubtasks]
        };
    }));
    };
   
    const onEditSubtask = (todoId, subtaskId, newTitle) => {
      setTodos(todos => todos.map(todo => {
        if (todo.id === todoId) {
          return { ...todo, subtasks: todo.subtasks.map(subtask => subtask.id === subtaskId ? { ...subtask, title: newTitle } : subtask) };
        }
        return todo;
      }));
    };
  
    const onDeleteSubtask = (todoId, subtaskId) => {
      setTodos(todos => todos.map(todo => {
        if (todo.id === todoId) {
          return { ...todo, subtasks: todo.subtasks.filter(subtask => subtask.id !== subtaskId) };
        }
        return todo;
      }));
    };
  
    const onChangeSubtask = (todoId, subtaskId, completed) => {
      setTodos(todos => todos.map(todo => {
        if (todo.id === todoId) {
          return { ...todo, subtasks: todo.subtasks.map(subtask => subtask.id === subtaskId ? { ...subtask, completed } : subtask) };
        }
        return todo;
      }));
    };

  const uncompletedTodos = todos.filter(todo => !todo.completed);
  const onCreateTodoItemFn = todo =>
    <TodoItem
      key={todo.id}
      todo={todo}
      onDeleteTodo={() => onDeleteTodo(todo.id)}
      onChangeTodo={(id, changes) => onChangeTodo(id, changes)}
      onEditModalOpen={() => onEditModalOpen(todo)}
      onSubtaskCreate={onSubtaskCreate}
      onEditSubtask={onEditSubtask}
      onDeleteSubtask={onDeleteSubtask}
      onChangeSubtask={onChangeSubtask}
    />
    ;
  const uncompletedTodosTags = uncompletedTodos.map(onCreateTodoItemFn);
  const completedTodos = todos.filter(todo => todo.completed);
  const completedTodosTags = completedTodos.map(onCreateTodoItemFn);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [todoForModal, setTodoForModal] = React.useState(null);

  const onModalClose = () => {
    setIsModalOpen(false);
    setTodoForModal(null);
  }
  const onTodoCreate = (title, description, subtasks) => {
    setTodos(todos => [...todos,
    {
      id: uuidv4(),
      title: title,
      description: description,
      completed: false,
      subtasks
    }]);
  };

  const onDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  }

  const onEditModalOpen = (todo) => {
    setIsModalOpen(true);
    setTodoForModal(todo);
  }

  const onChangeTodo = (id, todoChanges) => {

    setTodos(todos => todos.map(todo => {
      if (todo.id !== id) {
        return todo;
      }
      const newTodo = { ...todo };
      if (todoChanges.subtasks) {
        newTodo.subtasks = todoChanges.subtasks;
      } else {
        for (const [key, value] of Object.entries(todoChanges)) {
          newTodo[key] = value;
        }
      }
      if (todoChanges.subtasks) {
        newTodo.subtasks = todoChanges.subtasks
      }

      return newTodo;
    }));
  }

  const onTodoModalUpdate = (id, title, description) => {
    onChangeTodo(id, {
      title,
      description,
    });
  }

  

  return (
    <div className="App">
      <div className="app-container">
        <Modal
          isModalOpen={isModalOpen}
          todoForModal={todoForModal}
          onClose={onModalClose}
          onTodoCreate={onTodoCreate}
          onTodoUpdate={onTodoModalUpdate}
          onSubtaskCreate={onSubtaskCreate}
        >
        </Modal>

        <Card>
          <h1>My todos</h1>
          <Button onClick={() => { setIsModalOpen(true); setTodoForModal(null) }}>Add +</Button>
          <div className="list-container">
            {uncompletedTodosTags}
          </div>
          <div className="separator"></div>
          <h2>Completed</h2>
          <div className="list-container">
            {completedTodosTags}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default App;