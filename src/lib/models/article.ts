import mongoose from 'mongoose';

// Define the Article schema
const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this article'],
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Please provide content for this article']
  },
  coverImage: {
    type: String,
    required: [true, 'Please provide a cover image URL']
  },
  date: {
    type: Date,
    default: Date.now
  },
  author: {
    name: {
      type: String,
      required: [true, 'Please provide author name']
    },
    image: {
      type: String,
      default: '/images/authors/default.jpg'
    }
  },
  published: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Use existing model or create a new one
let Article;

try {
  // Try to get the existing model to prevent OverwriteModelError
  Article = mongoose.model('Article');
} catch (error) {
  // Model doesn't exist yet, so create it
  Article = mongoose.model('Article', ArticleSchema);
}

export default Article;