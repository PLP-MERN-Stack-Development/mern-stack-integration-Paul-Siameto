const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Category = require('./models/Category');
const Post = require('./models/Post');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-blog');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Post.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create categories one by one to ensure slug generation
    const categoryData = [
      {
        name: 'Technology',
        description: 'Posts about technology, programming, and software development'
      },
      {
        name: 'Web Development',
        description: 'Articles about web development, frameworks, and best practices'
      },
      {
        name: 'JavaScript',
        description: 'JavaScript tutorials, tips, and tricks'
      },
      {
        name: 'React',
        description: 'React.js tutorials, components, and advanced topics'
      },
      {
        name: 'Node.js',
        description: 'Server-side JavaScript with Node.js'
      },
      {
        name: 'MongoDB',
        description: 'Database design and MongoDB best practices'
      },
      {
        name: 'Tutorials',
        description: 'Step-by-step guides and tutorials'
      },
      {
        name: 'Tips & Tricks',
        description: 'Useful tips and tricks for developers'
      }
    ];

    const categories = [];
    for (const categoryInfo of categoryData) {
      const category = new Category(categoryInfo);
      await category.save();
      categories.push(category);
    }
    console.log(`✅ Created ${categories.length} categories`);

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'admin',
        bio: 'Full-stack developer with 5+ years of experience in web development.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: hashedPassword,
        role: 'user',
        bio: 'Frontend developer passionate about creating beautiful user interfaces.',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: hashedPassword,
        role: 'user',
        bio: 'Backend developer specializing in Node.js and database design.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        password: hashedPassword,
        role: 'user',
        bio: 'UI/UX designer and React developer.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      }
    ]);
    console.log(`✅ Created ${users.length} users`);

    // Create posts one by one to ensure slug generation
    const postData = [
      {
        title: 'Getting Started with React Hooks',
        content: `React Hooks revolutionized how we write React components by allowing us to use state and other React features in functional components. In this comprehensive guide, we'll explore the most commonly used hooks and how to implement them in your applications.

## What are React Hooks?

React Hooks are functions that let you "hook into" React state and lifecycle features from functional components. They were introduced in React 16.8 and have become the standard way to manage state and side effects in functional components.

## useState Hook

The useState hook is the most fundamental hook in React. It allows you to add state to functional components:

\`\`\`javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## useEffect Hook

The useEffect hook lets you perform side effects in functional components. It's similar to componentDidMount, componentDidUpdate, and componentWillUnmount combined:

\`\`\`javascript
import React, { useState, useEffect } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{JSON.stringify(data)}</div>;
}
\`\`\`

## Custom Hooks

You can also create your own custom hooks to extract component logic into reusable functions:

\`\`\`javascript
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(initialValue);
  
  return { count, increment, decrement, reset };
}
\`\`\`

## Conclusion

React Hooks provide a powerful and flexible way to manage state and side effects in functional components. By understanding and using hooks effectively, you can write cleaner, more maintainable React code.`,
        category: categories.find(c => c.name === 'React')._id,
        author: users[0]._id,
        tags: ['React', 'Hooks', 'JavaScript', 'Frontend'],
        status: 'published',
        featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
        publishedAt: new Date('2024-01-15'),
        views: 1250
      },
      {
        title: 'Building RESTful APIs with Node.js and Express',
        content: `Creating robust RESTful APIs is a fundamental skill for backend developers. In this tutorial, we'll build a complete API using Node.js and Express.js with proper error handling, validation, and authentication.

## Setting Up the Project

First, let's initialize our Node.js project:

\`\`\`bash
mkdir my-api
cd my-api
npm init -y
npm install express mongoose cors dotenv
npm install -D nodemon
\`\`\`

## Basic Express Server

Let's create a basic Express server:

\`\`\`javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to our API!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
\`\`\`

## Database Connection

Connect to MongoDB using Mongoose:

\`\`\`javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(\`MongoDB Connected: \${conn.connection.host}\`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

connectDB();
\`\`\`

## Creating Models

Define your data models with Mongoose:

\`\`\`javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
\`\`\`

## API Routes

Create organized route handlers:

\`\`\`javascript
// routes/users.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();

// GET /api/users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/users
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
\`\`\`

## Error Handling

Implement proper error handling middleware:

\`\`\`javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});
\`\`\`

## Conclusion

Building RESTful APIs with Node.js and Express is straightforward when you follow best practices. Remember to always validate input, handle errors gracefully, and use proper HTTP status codes.`,
        category: categories.find(c => c.name === 'Node.js')._id,
        author: users[1]._id,
        tags: ['Node.js', 'Express', 'API', 'Backend', 'REST'],
        status: 'published',
        featuredImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
        publishedAt: new Date('2024-01-20'),
        views: 980
      },
      {
        title: 'MongoDB Best Practices for Web Applications',
        content: `MongoDB is a powerful NoSQL database that's perfect for modern web applications. In this guide, we'll explore best practices for designing schemas, optimizing queries, and ensuring data integrity.

## Schema Design Principles

### Embedding vs Referencing

When designing MongoDB schemas, you need to decide between embedding documents or using references:

**Embedding** is good for:
- Small, related data that doesn't change often
- Data that's always accessed together
- One-to-few relationships

**Referencing** is good for:
- Large documents
- Data that changes frequently
- One-to-many or many-to-many relationships

### Example Schema Design

\`\`\`javascript
// User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profile: {
    bio: String,
    avatar: String,
    location: String
  },
  preferences: {
    theme: { type: String, default: 'light' },
    notifications: { type: Boolean, default: true }
  }
}, { timestamps: true });

// Post schema with embedded comments
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comments: [{
    content: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
  tags: [String],
  metadata: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 }
  }
}, { timestamps: true });
\`\`\`

## Indexing Strategies

Proper indexing is crucial for MongoDB performance:

\`\`\`javascript
// Create indexes for frequently queried fields
userSchema.index({ email: 1 });
userSchema.index({ 'profile.location': 1 });
postSchema.index({ title: 'text', content: 'text' });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
\`\`\`

## Query Optimization

### Use Projection to Limit Fields

\`\`\`javascript
// Only fetch required fields
const users = await User.find({}, 'name email profile.avatar');
\`\`\`

### Use Aggregation for Complex Queries

\`\`\`javascript
const popularPosts = await Post.aggregate([
  { $match: { status: 'published' } },
  { $lookup: {
    from: 'users',
    localField: 'author',
    foreignField: '_id',
    as: 'author'
  }},
  { $unwind: '$author' },
  { $sort: { 'metadata.views': -1 } },
  { $limit: 10 }
]);
\`\`\`

## Data Validation

Use Mongoose validation and custom validators:

\`\`\`javascript
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid email'
    }
  }
});
\`\`\`

## Security Considerations

### Input Sanitization

\`\`\`javascript
const sanitizeInput = (input) => {
  return input.trim().replace(/[<>]/g, '');
};

// Use in pre-save middleware
postSchema.pre('save', function(next) {
  this.title = sanitizeInput(this.title);
  this.content = sanitizeInput(this.content);
  next();
});
\`\`\`

### Connection Security

\`\`\`javascript
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(\`MongoDB Connected: \${conn.connection.host}\`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};
\`\`\`

## Performance Monitoring

Monitor your MongoDB performance:

\`\`\`javascript
// Enable query logging in development
if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

// Monitor slow queries
mongoose.connection.on('open', () => {
  mongoose.connection.db.admin().command({
    setParameter: 1,
    slowms: 100
  });
});
\`\`\`

## Conclusion

Following these MongoDB best practices will help you build scalable, performant web applications. Remember to always profile your queries, use appropriate indexes, and design your schemas based on your application's access patterns.`,
        category: categories.find(c => c.name === 'MongoDB')._id,
        author: users[2]._id,
        tags: ['MongoDB', 'Database', 'NoSQL', 'Performance', 'Best Practices'],
        status: 'published',
        featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
        publishedAt: new Date('2024-01-25'),
        views: 756
      },
      {
        title: 'Modern JavaScript ES6+ Features You Should Know',
        content: `JavaScript has evolved significantly with ES6+ features that make development more efficient and code more readable. Let's explore the most important modern JavaScript features every developer should know.

## Arrow Functions

Arrow functions provide a more concise syntax for writing functions:

\`\`\`javascript
// Traditional function
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;

// With single parameter
const square = x => x * x;

// With no parameters
const greet = () => 'Hello World!';
\`\`\`

## Destructuring Assignment

Destructuring allows you to extract values from arrays or objects:

\`\`\`javascript
// Array destructuring
const [first, second, third] = [1, 2, 3];

// Object destructuring
const { name, age, email } = user;

// With default values
const { name = 'Anonymous', age = 0 } = user;

// Nested destructuring
const { address: { city, country } } = user;
\`\`\`

## Template Literals

Template literals make string interpolation much cleaner:

\`\`\`javascript
const name = 'John';
const age = 30;

// Old way
const message = 'Hello, my name is ' + name + ' and I am ' + age + ' years old.';

// New way
const message = \`Hello, my name is \${name} and I am \${age} years old.\`;

// Multi-line strings
const html = \`
  <div class="user">
    <h1>\${name}</h1>
    <p>Age: \${age}</p>
  </div>
\`;
\`\`\`

## Spread Operator

The spread operator allows you to expand arrays or objects:

\`\`\`javascript
// Array spreading
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// Object spreading
const user = { name: 'John', age: 30 };
const updatedUser = { ...user, email: 'john@example.com' };

// Function arguments
const numbers = [1, 2, 3, 4, 5];
const max = Math.max(...numbers);
\`\`\`

## Promises and Async/Await

Modern JavaScript provides better ways to handle asynchronous operations:

\`\`\`javascript
// Promise
function fetchUser(id) {
  return fetch(\`/api/users/\${id}\`)
    .then(response => response.json())
    .then(data => data)
    .catch(error => console.error('Error:', error));
}

// Async/Await
async function fetchUser(id) {
  try {
    const response = await fetch(\`/api/users/\${id}\`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
\`\`\`

## Modules (ES6 Modules)

ES6 modules provide a clean way to organize and share code:

\`\`\`javascript
// math.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// Default export
export default class Calculator {
  constructor() {
    this.result = 0;
  }
  
  add(value) {
    this.result += value;
    return this;
  }
}

// main.js
import Calculator, { add, subtract } from './math.js';
\`\`\`

## Classes

ES6 classes provide a cleaner syntax for object-oriented programming:

\`\`\`javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  greet() {
    return \`Hello, I'm \${this.name}\`;
  }
  
  // Static method
  static createAdult(name) {
    return new Person(name, 18);
  }
}

class Developer extends Person {
  constructor(name, age, language) {
    super(name, age);
    this.language = language;
  }
  
  code() {
    return \`\${this.name} is coding in \${this.language}\`;
  }
}
\`\`\`

## Map and Set

New data structures for better performance and functionality:

\`\`\`javascript
// Map - better than objects for key-value pairs
const userMap = new Map();
userMap.set('john', { name: 'John', age: 30 });
userMap.set('jane', { name: 'Jane', age: 25 });

// Set - unique values only
const uniqueNumbers = new Set([1, 2, 2, 3, 3, 4]); // {1, 2, 3, 4}
\`\`\`

## Conclusion

These modern JavaScript features make your code more readable, maintainable, and efficient. Start incorporating them into your projects to write better JavaScript code.`,
        category: categories.find(c => c.name === 'JavaScript')._id,
        author: users[3]._id,
        tags: ['JavaScript', 'ES6', 'ES2015', 'Modern JavaScript', 'Features'],
        status: 'published',
        featuredImage: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=400&fit=crop',
        publishedAt: new Date('2024-01-30'),
        views: 1100
      },
      {
        title: 'CSS Grid vs Flexbox: When to Use Which',
        content: `CSS Grid and Flexbox are both powerful layout tools, but they serve different purposes. Understanding when to use each one will make you a more effective CSS developer.

## CSS Grid: Two-Dimensional Layouts

CSS Grid is perfect for creating complex, two-dimensional layouts:

\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr auto;
  gap: 20px;
  height: 100vh;
}

.header {
  grid-column: 1 / -1;
  background: #333;
  color: white;
  padding: 1rem;
}

.sidebar {
  grid-row: 2;
  background: #f4f4f4;
  padding: 1rem;
}

.main-content {
  grid-column: 2 / -1;
  background: white;
  padding: 1rem;
}

.footer {
  grid-column: 1 / -1;
  background: #333;
  color: white;
  padding: 1rem;
}
\`\`\`

## Flexbox: One-Dimensional Layouts

Flexbox excels at one-dimensional layouts and component-level styling:

\`\`\`css
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.card {
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 300px;
}

.card-header {
  flex-shrink: 0;
}

.card-content {
  flex-grow: 1;
}

.card-footer {
  flex-shrink: 0;
  margin-top: auto;
}
\`\`\`

## When to Use Grid

Use CSS Grid for:
- **Page layouts** (header, sidebar, main content, footer)
- **Two-dimensional layouts** where you need control over both rows and columns
- **Complex card layouts** with varying sizes
- **Image galleries** with different sized images

\`\`\`css
.image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.image-gallery img:nth-child(1) {
  grid-row: span 2;
  grid-column: span 2;
}
\`\`\`

## When to Use Flexbox

Use Flexbox for:
- **Navigation bars** and menus
- **Button groups** and form controls
- **Card components** with flexible content
- **Centering content** both horizontally and vertically

\`\`\`css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.button-group {
  display: flex;
  gap: 0.5rem;
}

.centered-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
\`\`\`

## Combining Grid and Flexbox

You can use both together for optimal layouts:

\`\`\`css
.page-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar {
  grid-row: 2;
  display: flex;
  flex-direction: column;
}

.main-content {
  grid-column: 2;
  display: flex;
  flex-direction: column;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.card {
  display: flex;
  flex-direction: column;
}
\`\`\`

## Browser Support

Both Grid and Flexbox have excellent modern browser support:

- **Flexbox**: Supported in all modern browsers
- **CSS Grid**: Supported in all modern browsers (IE11 with some limitations)

## Performance Considerations

- **Flexbox** is generally faster for simple layouts
- **Grid** can be more efficient for complex layouts
- Use **CSS containment** for better performance with large layouts

\`\`\`css
.complex-layout {
  contain: layout style paint;
}
\`\`\`

## Conclusion

Choose CSS Grid for overall page layouts and complex two-dimensional designs. Use Flexbox for component-level layouts and one-dimensional arrangements. Don't be afraid to combine both for the best results!`,
        category: categories.find(c => c.name === 'Web Development')._id,
        author: users[0]._id,
        tags: ['CSS', 'Grid', 'Flexbox', 'Layout', 'Frontend'],
        status: 'published',
        featuredImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
        publishedAt: new Date('2024-02-05'),
        views: 890
      }
    ];

    const posts = [];
    for (const postInfo of postData) {
      const post = new Post(postInfo);
      await post.save();
      posts.push(post);
    }
    console.log(`✅ Created ${posts.length} sample posts`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - ${categories.length} categories created`);
    console.log(`   - ${users.length} users created`);
    console.log(`   - ${posts.length} posts created`);
    console.log('\n🔑 Test Credentials:');
    console.log('   Admin: john@example.com / password123');
    console.log('   User:  jane@example.com / password123');
    console.log('   User:  mike@example.com / password123');
    console.log('   User:  sarah@example.com / password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeding
connectDB().then(() => {
  seedDatabase();
});
