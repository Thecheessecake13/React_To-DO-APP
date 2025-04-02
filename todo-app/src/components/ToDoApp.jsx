import React, { useState, useEffect } from 'react';

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() === '') return;

    const newTaskItem = {
      id: Date.now(),
      text: newTask,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, newTaskItem]);
    setNewTask('');
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEditing = (task) => {
    setEditTaskId(task.id);
    setEditTaskText(task.text);
  };

  const updateTask = () => {
    if (editTaskText.trim() === '') return;

    setTasks(tasks.map(task =>
      task.id === editTaskId ? { ...task, text: editTaskText } : task
    ));

    setEditTaskId(null);
    setEditTaskText('');
  };

  const cancelEditing = () => {
    setEditTaskId(null);
    setEditTaskText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true; // 'all'
  });

  const pendingTasksCount = tasks.filter(task => !task.completed).length;

  return (
    <div className="max-w-lg mx-auto p-4 bg-black shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-center text-blue-300 mb-6">To-Do List</h1>

      <div className="flex mb-4">
        <input
          type="text"
          className="flex-grow px-4 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition duration-200"
        >
          Add
        </button>
      </div>

      <div className="flex justify-between mb-4">
        <div className="text-sm text-gray-500">
          {pendingTasksCount} {pendingTasksCount === 1 ? 'task' : 'tasks'} remaining
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-2 py-1 text-xs rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-2 py-1 text-xs rounded ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-2 py-1 text-xs rounded ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Completed
          </button>
        </div>
      </div>

      <ul className="space-y-2">
        {filteredTasks.map(task => (
          <li
            key={task.id}
            className={`p-3 rounded border ${task.completed ? 'bg-gray-50' : 'bg-white'} hover:shadow transition duration-200`}
          >
            {editTaskId === task.id ? (
              <div className="flex items-center">
                <input
                  type="text"
                  className="flex-grow px-2 py-1 border rounded mr-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={editTaskText}
                  onChange={(e) => setEditTaskText(e.target.value)}
                  autoFocus
                />
                <button
                  onClick={updateTask}
                  className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600 mr-2"
                >
                  Save
                </button>
                <button
                  onClick={cancelEditing}
                  className="bg-gray-500 text-white px-2 py-1 rounded text-sm hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task.id)}
                    className="h-4 w-4 text-blue-600 rounded mr-3 focus:ring-blue-500"
                  />
                  <span className={`${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {task.text}
                  </span>
                </div>
                <div className="flex">
                  <button
                    onClick={() => startEditing(task)}
                    className="text-blue-500 hover:text-blue-700 px-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 hover:text-red-700 px-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
        {filteredTasks.length === 0 && (
          <li className="text-center p-4 text-gray-500">
            No tasks {filter !== 'all' ? `(${filter})` : ''} to display
          </li>
        )}
      </ul>
    </div>
  );
};

export default TodoApp;