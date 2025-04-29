const mongoose = require('mongoose');


const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, required: true, default: false },
});


const takenSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { type: String, enum: ['pending', 'inprogress', 'completed'], required: true }, 
    dueDate: { type: Date, required: true },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    attachment: [{ type: String }],
    todoChecklist: [todoSchema], 
    progress: { type: Number, default: 0 },
  },
  {
    timestamps: true, 
  }
);



module.exports = mongoose.model('Task', takenSchema);
