import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  image: {
    type: String,
    default: '/images/authors/default.jpg'
  },
  role: {
    type: String,
    default: 'author',
    enum: ['author', 'admin']
  }
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model('User', UserSchema);