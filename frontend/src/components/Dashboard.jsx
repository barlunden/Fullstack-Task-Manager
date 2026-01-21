import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // 1. Function to fetch tasks from the server
  const refreshTasks = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get('http://localhost:5555/api/get-tasks', {
      headers: { Authorization: `Bearer ${token}` }
    });
    // Legg merke til at vi nå henter ut både tasks og email
    setTasks(response.data.tasks);
    setUserEmail(response.data.email);
  } catch (err) {
    console.error("Fetch error:", err);
  }
};

  // 2. Initial data load
  useEffect(() => {
    const init = async () => {
      await refreshTasks();
    };
    init();
  }, []);

  const addTask = async (e) => {
  e.preventDefault();

  // --- FRONTEND VALIDATION (Bottleneck) ---
  if (newTask.trim().length < 5) {
    return toast.error("Task must be at least 5 characters long");
  }

  if (newTask.length > 200) {
    return toast.error("Task is too long (max 200 characters)");
  }

  // --- IF OK, SEND TO BACKEND ---
  const token = localStorage.getItem('token');
  try {
    await axios.post('http://localhost:5555/api/add-task', 
      { content: newTask },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    setNewTask(''); 
    refreshTasks();
    toast.success('Task added!');
  } catch (err) {
    // If Backend finds faults anyway
    const errorMsg = err.response?.data?.errors?.[0]?.msg || "Could not add task";
    toast.error(errorMsg);
  }
};

  const deleteTask = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await axios.delete(`http://localhost:5555/api/delete-task/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Task deleted', { icon: '🗑️' });
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.msg || "Could not delete task";
        toast.error(msg);
    }
  };

  const saveUpdate = async (id) => {
  // --- FRONTEND VALIDATION ---
  const trimmedEdit = editText.trim();

  if (trimmedEdit.length < 5) {
    return toast.error("Task must be at least 5 characters long");
  }

  if (trimmedEdit.length > 200) {
    return toast.error("Task is too long (max 200 characters)");
  }

  // --- IF OK, SEND TO BACKEND ---
  const token = localStorage.getItem('token');
  try {
    await axios.patch(`http://localhost:5555/api/update-task/${id}`, 
      { content: trimmedEdit },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setEditingId(null);
    setEditText("");
    refreshTasks();
    toast.success("Task updated!");
  } catch (err) {
    const msg = err.response?.data?.error || "Could not update task";
    toast.error(msg);
  }
};

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="p-8 max-w-2xl mx-auto relative">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 border-b pb-4">
  <div>
    <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
    {userEmail && <p className="text-sm text-gray-500">Logged in as: <span className="font-medium text-blue-600">{userEmail}</span></p>}
  </div>
  <button 
    onClick={logout}
    className="bg-gray-200 hover:bg-red-100 text-gray-700 hover:text-red-600 px-4 py-2 rounded-lg transition-colors cursor-pointer text-sm font-medium"
  >
    Logout
  </button>
</div>

      {/* New Task Form */}
      <form onSubmit={addTask} className="mb-8 flex gap-2">
        <input
          className="flex-1 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-md cursor-pointer">
          Add Task
        </button>
      </form>

      {/* Task List */}
      <ul className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-gray-500 italic">No tasks yet. Add one above!</p>
        ) : (
          tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between p-4 bg-white shadow rounded-lg border"
            >
              {editingId === task.id ? (
                // EDIT MODE
                <div className="flex gap-2 w-full">
                  <input
                    className="flex-1 border p-1 rounded focus:ring-2 focus:ring-green-200 outline-none"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button
                    onClick={() => saveUpdate(task.id)}
                    className="text-green-600 font-bold px-2 hover:text-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-gray-400 px-2 hover:text-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                // VIEW MODE
                <>
                  <span className="text-gray-700">{task.content}</span>
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setEditingId(task.id);
                        setEditText(task.content);
                      }}
                      className="text-blue-500 hover:text-blue-700 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-400 hover:text-red-600 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
