import { Router } from 'express';
import { pool } from './db.js';
import { validateTask, VALID_STATUSES } from './validation.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({
    status: "OK"
  });
});

router.get('/tasks', async (_req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) { next(error); }
});

router.get('/tasks/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Task not found.' });
    res.json(rows[0]);
  } catch (error) { next(error); }
});

router.post('/tasks', async (req, res, next) => {
  try {
    const input = req.body ?? {};
    const errors = validateTask(input);
    if (Object.keys(errors).length) return res.status(400).json({ error: 'Validation failed.', details: errors });
    const values = [input.title.trim(), input.description?.trim() ?? '', input.status ?? 'pending', input.due_date ?? null];
    const { rows } = await pool.query('INSERT INTO tasks (title, description, status, due_date) VALUES ($1, $2, $3, $4) RETURNING *', values);
    res.status(201).json(rows[0]);
  } catch (error) { next(error); }
});

router.put('/tasks/:id', async (req, res, next) => {
  try {
    const input = req.body ?? {};
    const errors = validateTask(input);
    if (Object.keys(errors).length) return res.status(400).json({ error: 'Validation failed.', details: errors });
    const values = [input.title.trim(), input.description?.trim() ?? '', input.status ?? 'pending', input.due_date ?? null, req.params.id];
    const { rows } = await pool.query('UPDATE tasks SET title=$1, description=$2, status=$3, due_date=$4, updated_at=NOW() WHERE id=$5 RETURNING *', values);
    if (!rows[0]) return res.status(404).json({ error: 'Task not found.' });
    res.json(rows[0]);
  } catch (error) { next(error); }
});

router.patch('/tasks/:id/status', async (req, res, next) => {
  try {
    if (!VALID_STATUSES.has(req.body?.status)) return res.status(400).json({ error: 'Invalid status.' });
    const { rows } = await pool.query('UPDATE tasks SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *', [req.body.status, req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Task not found.' });
    res.json(rows[0]);
  } catch (error) { next(error); }
});

router.delete('/tasks/:id', async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM tasks WHERE id=$1', [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ error: 'Task not found.' });
    res.status(204).send();
  } catch (error) { next(error); }
});

export default router;
