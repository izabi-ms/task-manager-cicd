import { useEffect, useMemo, useState } from 'react';
import { api } from './api.js';

const emptyForm = { title: '', description: '', status: 'pending', due_date: '' };
const labels = { pending: 'Pending', in_progress: 'In progress', completed: 'Completed' };

function TaskForm({ editing, onSave, onCancel }) {
  const [form, setForm] = useState(editing || emptyForm);
  const [error, setError] = useState('');
  useEffect(() => setForm(editing || emptyForm), [editing]);
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) return setError('Please enter a task title.');
    try { await onSave({ ...form, due_date: form.due_date || null }); setForm(emptyForm); setError(''); }
    catch (e) { setError(e.message); }
  };
  return <form className="task-form" onSubmit={submit}>
    <div className="form-heading"><h2>{editing ? 'Edit task' : 'Create a task'}</h2>{editing && <button type="button" className="text-button" onClick={onCancel}>Cancel</button>}</div>
    <label>Title<input name="title" value={form.title} onChange={change} maxLength="120" placeholder="e.g. Prepare project report" required /></label>
    <label>Description<textarea name="description" value={form.description} onChange={change} rows="4" placeholder="Add useful details" /></label>
    <div className="form-grid"><label>Status<select name="status" value={form.status} onChange={change}>{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label>Due date<input type="date" name="due_date" value={form.due_date || ''} onChange={change} /></label></div>
    {error && <p className="error">{error}</p>}<button className="primary" type="submit">{editing ? 'Save changes' : 'Add task'}</button>
  </form>;
}

function TaskCard({ task, onEdit, onDelete, onStatus }) {
  return <article className={`task-card ${task.status}`}>
    <div className="task-main"><div className="task-title-row"><h3>{task.title}</h3><span className={`badge ${task.status}`}>{labels[task.status]}</span></div>{task.description && <p>{task.description}</p>}<small>{task.due_date ? `Due ${new Date(`${task.due_date}T00:00:00`).toLocaleDateString()}` : 'No due date'}</small></div>
    <div className="task-actions"><select aria-label={`Change status for ${task.title}`} value={task.status} onChange={(e) => onStatus(task.id, e.target.value)}>{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><button onClick={() => onEdit(task)}>Edit</button><button className="danger" onClick={() => onDelete(task.id)}>Delete</button></div>
  </article>;
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = async () => { try { setLoading(true); setTasks(await api.list()); setError(''); } catch (e) { setError(e.message); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const save = async (task) => { editing ? await api.update(editing.id, task) : await api.create(task); setEditing(null); await load(); };
  const remove = async (id) => { if (window.confirm('Delete this task?')) { await api.remove(id); await load(); } };
  const status = async (id, value) => { try { await api.updateStatus(id, value); await load(); } catch (e) { setError(e.message); } };
  const visible = useMemo(() => filter === 'all' ? tasks : tasks.filter((task) => task.status === filter), [tasks, filter]);
  const counts = { all: tasks.length, pending: tasks.filter(t => t.status === 'pending').length, in_progress: tasks.filter(t => t.status === 'in_progress').length, completed: tasks.filter(t => t.status === 'completed').length };
  return <main className="shell"><header><div><p className="eyebrow">PERSONAL WORKSPACE</p><h1>Task Manager</h1><p className="subtitle">Plan clearly. Make steady progress.</p></div><div className="summary"><strong>{counts.completed}</strong><span>completed</span></div></header><section className="layout"><TaskForm editing={editing} onSave={save} onCancel={() => setEditing(null)} /><section className="tasks-panel"><div className="panel-heading"><div><h2>Your tasks</h2><p>{tasks.length} total {tasks.length === 1 ? 'task' : 'tasks'}</p></div><div className="filters">{['all', 'pending', 'in_progress', 'completed'].map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item === 'all' ? 'All' : labels[item]} <span>{counts[item]}</span></button>)}</div></div>{error && <div className="alert">{error} <button onClick={load}>Retry</button></div>}{loading ? <p className="empty">Loading tasks...</p> : visible.length ? <div className="task-list">{visible.map(task => <TaskCard key={task.id} task={task} onEdit={setEditing} onDelete={remove} onStatus={status} />)}</div> : <div className="empty"><span>✓</span><h3>No tasks here</h3><p>Create a task to get started.</p></div>}</section></section></main>;
}
