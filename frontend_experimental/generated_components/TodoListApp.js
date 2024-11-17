import React, { useState } from 'react';

const TodoListApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', category: 'Work' });
  const [category, setCategory] = useState('Work');

  const categories = ['Work', 'Personal', 'Shopping'];

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTasks([...tasks, newTask]);
    setNewTask({ title: '', description: '', dueDate: '', category: 'Work' });
  };

  const filteredTasks = tasks.filter((task) => task.category === category);

  return (
    <div className="todo-list-app">
      <h2>Todo List App with Task Categorization</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={newTask.title}
          onChange={handleInputChange}
          placeholder="Task title"
        />
        <textarea
          name="description"
          value={newTask.description}
          onChange={handleInputChange}
          placeholder="Task description"
        />
        <input
          type="date"
          name="dueDate"
          value={newTask.dueDate}
          onChange={handleInputChange}
        />
        <select value={newTask.category} onChange={handleInputChange} name="category">
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <button type="submit">Add task</button>
      </form>
      <div className="category-filter">
        <select value={category} onChange={handleCategoryChange}>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <ul>
        {filteredTasks.map((task, index) => (
          <li key={index}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Due date: {task.dueDate}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoListApp;