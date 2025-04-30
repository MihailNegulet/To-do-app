import React, { useState, useEffect, useCallback} from "react";
import Card from "./components/card/Card";
import TodoItem from "./components/todo-item/TodoItem";
import Button from "./components/button/Button";
import Modal from "./components/modal/Modal";
import Loader from "./components/loader/Loader";
import { v4 as uuidv4 } from 'uuid';
import "./App.css";

const LOCAL_STORAGE_TODOS_KEY = "todos";

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
];

function App() {
  // --- State  ---
  
  const [todos, setTodos] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_TODOS_KEY);
      return stored ? JSON.parse(stored) : INITIAL_TODOS;
    } catch (e) {
      console.error("Failed to parse todos from localStorage:", e);
      return INITIAL_TODOS;
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todoForModal, setTodoForModal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);


  // --- Effects ---
  
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_TODOS_KEY, JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);


  // --- Functions ---
  
  const onTodoCreate = useCallback((title, description, subtasks) => {
    setTodos(prev => [...prev,
    {
      id: uuidv4(),
      title,
      description,
      completed: false,
      subtasks,
    }]);
  }, []);
   
  const onDeleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const onChangeTodo = useCallback((id, changes) => {
    setTodos(prev => prev.map(todo => {
      if (todo.id !== id) return todo;
      return { ...todo, ...changes };
    }));
  }, []);

  const onTodoModalUpdate = (id, title, description) => {
    onChangeTodo(id, {
      title,
      description,
    });
  };
  
  const onSubtaskCreate = (todoId, newSubtasks) => {
    setTodos(prev => prev.map(todo => (
      todo.id === todoId 
        ? { ...todo, subtasks: [...todo.subtasks, ...newSubtasks] }
        : todo    
    )));
  };
  
    const onEditSubtask = (todoId, subtaskId, newTitle) => {
      setTodos(prev => prev.map(todo => {
        if (todo.id !== todoId) return todo;
        return {
          ...todo,
          subtasks: todo.subtasks.map(subtask =>
            subtask.id === subtaskId ? { ...subtask, title: newTitle } : subtask
          )
        };
      }));
    };
  
    const onDeleteSubtask = (todoId, subtaskId) => {
      setTodos(prev => prev.map(todo => {
        if (todo.id !== todoId) return todo;
        return {
          ...todo,
          subtasks: todo.subtasks.filter(subtask => subtask.id !== subtaskId)
        };
      }));
    };
  
    const onChangeSubtask = (todoId, subtaskId, completed) => {
      setTodos(prev => prev.map(todo => {
        if (todo.id !== todoId) return todo;
        return {
          ...todo,
          subtasks: todo.subtasks.map(subtask =>
            subtask.id === subtaskId ? { ...subtask, completed } : subtask
          )
        };
      }));
    };

  const openModalForCreate = () => {
    setIsModalOpen(true);
    setTodoForModal(null);
  };
  
  const onModalClose = () => {
    setIsModalOpen(false);
    setTodoForModal(null);
  }

  const onEditModalOpen = (todo) => {
    setIsModalOpen(true);
    setTodoForModal(todo);
  }

  const onCreateTodoItemFn = (todo) => (
    <div className="fade-in" key={todo.id}>
      <TodoItem
        todo={todo}
        onDeleteTodo={() => onDeleteTodo(todo.id)}
        onChangeTodo={onChangeTodo}
        onEditModalOpen={() => onEditModalOpen(todo)}
        onSubtaskCreate={onSubtaskCreate}
        onEditSubtask={onEditSubtask}
        onDeleteSubtask={onDeleteSubtask}
        onChangeSubtask={onChangeSubtask}
      />
    </div>
  );

  // --- Render ---
  const uncompletedTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={`App ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="app-container">
        <Modal
          isModalOpen={isModalOpen}
          todoForModal={todoForModal}
          onClose={onModalClose}
          onTodoCreate={onTodoCreate}
          onTodoUpdate={onTodoModalUpdate}
          onSubtaskCreate={onSubtaskCreate}
        />

        <Card>
          <h1>My todos</h1>
          <Button onClick={openModalForCreate}>Add +</Button>

          <Button onClick={() => setIsDarkMode(prev => !prev)}>
            {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </Button>

          <div className="list-container">
            {uncompletedTodos.map(onCreateTodoItemFn)}
          </div>

          <div className="separator"></div>

          <h2>Completed</h2>
          <div className="list-container">
            {completedTodos.map(onCreateTodoItemFn)}
          </div>
        </Card>
      </div>
    </div> 
  );
}

export default App;