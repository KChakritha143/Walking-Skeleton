const { z } = require('zod');

const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: (error.issues || error.errors || []).map((err) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};
const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});
const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.string().refine((val) => !val || !isNaN(Date.parse(val)), {
    message: 'Invalid due date format'
  }).optional(),
  subtasks: z.array(z.object({
    text: z.string().trim().min(1, 'Subtask text is required'),
    completed: z.boolean().optional()
  })).optional()
});

const updateTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title cannot be empty').optional(),
  description: z.string().trim().optional(),
  completed: z.boolean().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.string().refine((val) => !val || !isNaN(Date.parse(val)), {
    message: 'Invalid due date format'
  }).optional(),
  subtasks: z.array(z.object({
    text: z.string().trim().min(1, 'Subtask text is required'),
    completed: z.boolean().optional()
  })).optional()
});
const verifySessionSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required')
});
const aiSuggestSchema = z.object({
  title: z.string().trim().min(1, 'Task title is required for suggestions'),
  description: z.string().trim().optional()
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  createTaskSchema,
  updateTaskSchema,
  verifySessionSchema,
  aiSuggestSchema
};
