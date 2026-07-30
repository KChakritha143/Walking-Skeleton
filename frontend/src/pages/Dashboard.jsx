import React, { useState, useEffect } from 'react';
import { useAuth, API_BASE_URL } from '../context/AuthContext';
import { Plus, Trash2, Calendar, CheckSquare, Square, AlertCircle, ListTodo } from 'lucide-react';
const Dashboard = () => {
  const { user, authFetch } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  useEffect(() => {
    fetchTasks();
  }, []);
  const fetchTasks = async () => {
    setLoading(true);
    setActionError('');
    try {
      const response = await authFetch(`${API_BASE_URL}/tasks`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch tasks');
      }
      setTasks(data);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleAddTask = async (e) => {
    e.preventDefault();
    setActionError('');
    setActionSuccess('');
    if (!title) {
      setActionError('Task title is required');
      return;
    }
    try {
      const response = await authFetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          priority,
          dueDate: dueDate || undefined
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create task');
      }
      setTasks([data, ...tasks]);
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setActionSuccess('Task created successfully');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      setActionError(err.message);
    }
  };
  const handleToggleComplete = async (task) => {
    setActionError('');
    try {
      const response = await authFetch(`${API_BASE_URL}/tasks/${task._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          completed: !task.completed
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update task');
      }
      setTasks(tasks.map(t => t._id === task._id ? data : t));
    } catch (err) {
      setActionError(err.message);
    }
  };
  const handleDeleteTask = async (id) => {
    setActionError('');
    setActionSuccess('');
    const originalTasks = tasks;
    setTasks(prevTasks => prevTasks.filter(t => t._id !== id));
    try {
      const response = await authFetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete task');
      }
      setActionSuccess('Task deleted successfully');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      setTasks(originalTasks);
      setActionError(err.message);
    }
  };
  const handleUpgrade = async () => {
    setActionError('');
    try {
      const response = await authFetch(`${API_BASE_URL}/payments/create-checkout-session`, {
        method: 'POST'
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to initialize payment');
      }
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Checkout session URL is invalid');
      }
    } catch (err) {
      setActionError(err.message);
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    task => task.completed
  ).length;

  const pendingTasks = tasks.filter(
    task => !task.completed
  ).length;

  const highPriorityTasks = tasks.filter(
    task => task.priority === "high"
  ).length;
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>User Task Space</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Welcome back, <span style={{ color: '#a5b4fc', fontWeight: '500' }}>{user?.name}</span>. Secure session active.
          </p>
        </div>
      </div>
      <div className="stats-grid">

  <div className="stat-card">
    <h4>Total Tasks</h4>
    <span>{totalTasks}</span>
  </div>

  <div className="stat-card pending">
    <h4>Pending</h4>
    <span>{pendingTasks}</span>
  </div>

  <div className="stat-card completed">
    <h4>Completed</h4>
    <span>{completedTasks}</span>
  </div>

  <div className="stat-card high">
    <h4>High Priority</h4>
    <span>{highPriorityTasks}</span>
  </div>

</div>
      {actionError && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{actionError}</span>
        </div>
      )}
      {actionSuccess && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <CheckSquare size={18} />
          <span>{actionSuccess}</span>
        </div>
      )}
      {!user?.isPro ? (
        <div className="premium-promo-banner" style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)',
          border: '1px solid #c084fc',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 4px 20px rgba(192, 132, 252, 0.15)'
        }}>
          <div>
            <h3 style={{ color: '#f3e8ff', margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Upgrade to Premium Pro</span>
              <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '9999px', background: '#fbbf24', color: '#000', fontWeight: 'bold' }}>POPULAR</span>
            </h3>
            <p style={{ color: '#d8b4fe', margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
              Unlock advanced task management capabilities, high priority flags, and integration utilities.
            </p>
          </div>
          <button 
            onClick={handleUpgrade}
            className="btn" 
            style={{ 
              background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)', 
              color: '#fff', 
              border: 'none', 
              fontWeight: '600',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(124, 58, 237, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 58, 237, 0.3)';
            }}
          >
            Upgrade to Pro
          </button>
        </div>
      ) : (
        <div className="premium-promo-banner" style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
          border: '1px solid #34d399',
          borderRadius: '12px',
          padding: '1rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          boxShadow: '0 4px 20px rgba(52, 211, 153, 0.1)'
        }}>
          <span style={{ fontSize: '1.5rem' }}>👑</span>
          <div>
            <h4 style={{ color: '#ecfdf5', margin: 0 }}>Pro Access Activated</h4>
            <p style={{ color: '#a7f3d0', margin: '0.2rem 0 0 0', fontSize: '0.85rem' }}>
              Thank you for supporting SecureAuth Task Manager! You have full access to all premium features.
            </p>
          </div>
        </div>
      )}
      <div className="task-creator-card">
        <h3>Create New Task</h3>
        <form onSubmit={handleAddTask} className="task-form-grid">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="taskTitle">Task Name</label>
            <input
              id="taskTitle"
              type="text"
              className="form-input"
              style={{ paddingLeft: '1rem' }}
              placeholder="E.g., Complete security audit report"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="taskPriority">Priority</label>
            <select
              id="taskPriority"
              className="form-input"
              style={{ paddingLeft: '1rem' }}
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="taskDueDate">Due Date</label>
            <input
              id="taskDueDate"
              type="date"
              className="form-input"
              style={{ paddingLeft: '1rem' }}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '1rem' }}>
            <label htmlFor="taskDescription">Task Description</label>
            <input
              id="taskDescription"
              type="text"
              className="form-input"
              style={{ paddingLeft: '1rem' }}
              placeholder="Additional details and notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1', alignSelf: 'stretch' }}>
            <Plus size={18} />
            <span>Create Task</span>
          </button>
        </form>
      </div>
      <div className="tasks-section">
        <div className="tasks-grid-header">
          <h2>Your Tasks</h2>
          <span>{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} registered</span>
        </div>
        {loading ? (
          <div className="spinner"></div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <ListTodo />
            <h4>No tasks found</h4>
            <p>Get started by creating your very first task above!</p>
          </div>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <div key={task._id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                <div className="task-card-content">
                 <div className="task-checkbox-container">
                    <button
                      onClick={() => handleToggleComplete(task)}
                      className={`task-status-btn ${task.completed ? "completed-btn" : ""}`}
                    >
                    {task.completed ? "Completed ✓" : "Mark Complete"}
                    </button>
                  </div>                 
                  <div className="task-details">
                    <span className="task-title">{task.title}</span>
                    {task.description && <span className="task-desc">{task.description}</span>}
                    <div className="task-meta">
                      <span className={`priority-badge priority-${task.priority}`}>
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <span className="date-badge">
                          <Calendar />
                          <span>{formatDate(task.dueDate)}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="task-actions">
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="btn btn-danger btn-icon"
                    title="Delete Task"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Dashboard;