import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: false,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  tags: {
    type: [String],
    default: [],
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Todo = mongoose.models.Todo || mongoose.model('Todo', todoSchema);
export default Todo;