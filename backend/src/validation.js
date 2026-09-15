export const VALID_STATUSES = new Set(['pending', 'in_progress', 'completed']);

export function validateTask(input) {
  const errors = {};
  if (typeof input.title !== 'string' || input.title.trim().length < 1 || input.title.trim().length > 120) {
    errors.title = 'Title is required and must be 1-120 characters.';
  }
  if (input.description !== undefined && typeof input.description !== 'string') {
    errors.description = 'Description must be text.';
  }
  if (input.status !== undefined && !VALID_STATUSES.has(input.status)) {
    errors.status = 'Status must be pending, in_progress, or completed.';
  }
  if (input.due_date !== undefined && input.due_date !== null && !/^\d{4}-\d{2}-\d{2}$/.test(input.due_date)) {
    errors.due_date = 'Due date must use YYYY-MM-DD format.';
  }
  return errors;
}
