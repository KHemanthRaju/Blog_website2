export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  coverImage: string;
  date: string;
  author: {
    name: string;
    image: string;
  };
}

export const articles: Article[] = [
  {
    id: "1",
    title: "Getting Started with Web Development",
    description: "Learn the basics of HTML, CSS, and JavaScript to kickstart your web development journey.",
    content: `
# Getting Started with Web Development

Web development is an exciting field that allows you to create interactive websites and applications. In this article, we'll cover the basics of HTML, CSS, and JavaScript to help you get started.

## HTML: The Structure

HTML (HyperText Markup Language) is the backbone of any website. It provides the structure and content of web pages.

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <title>My First Web Page</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>This is my first web page.</p>
</body>
</html>
\`\`\`

## CSS: The Style

CSS (Cascading Style Sheets) is used to style and layout web pages. It controls how HTML elements look on the screen.

\`\`\`css
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: #f5f5f5;
}

h1 {
  color: #333;
}

p {
  line-height: 1.6;
}
\`\`\`

## JavaScript: The Behavior

JavaScript adds interactivity to web pages. It allows you to create dynamic content and handle user interactions.

\`\`\`javascript
// Simple function to change text when a button is clicked
function changeText() {
  document.getElementById("demo").innerHTML = "Text changed!";
}
\`\`\`

## Next Steps

Once you've mastered the basics, you can explore:

1. Responsive design with media queries
2. CSS frameworks like Bootstrap or Tailwind CSS
3. JavaScript libraries and frameworks like React, Vue, or Angular
4. Backend development with Node.js, Python, or PHP

Remember, practice is key in web development. Start with small projects and gradually build more complex applications as you gain confidence.
    `,
    coverImage: "/images/web-development.jpg",
    date: "2023-11-15",
    author: {
      name: "Jane Doe",
      image: "/images/authors/jane.jpg"
    }
  },
  {
    id: "2",
    title: "Introduction to React Hooks",
    description: "Discover how React Hooks simplify state management and side effects in functional components.",
    content: `
# Introduction to React Hooks

React Hooks were introduced in React 16.8 as a way to use state and other React features without writing a class. They allow you to "hook into" React state and lifecycle features from function components.

## Why Hooks?

Before Hooks, you had to use class components if you needed state or lifecycle methods. This led to complex components and made it difficult to reuse stateful logic between components. Hooks solve these problems by:

- Allowing you to reuse stateful logic without changing your component hierarchy
- Organizing related code in one place instead of splitting it across lifecycle methods
- Using functions instead of classes (which can be confusing with 'this')

## useState: Managing State

The useState hook lets you add state to functional components:

\`\`\`jsx
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

## useEffect: Handling Side Effects

The useEffect hook lets you perform side effects in function components:

\`\`\`jsx
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
  });

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

## Other Common Hooks

- useContext: Access React context
- useReducer: Manage complex state logic
- useRef: Access DOM elements directly
- useMemo and useCallback: Optimize performance

## Custom Hooks

You can create your own hooks to extract and reuse stateful logic:

\`\`\`jsx
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return width;
}
\`\`\`

Hooks have transformed how React applications are built, making code more readable, maintainable, and reusable.
    `,
    coverImage: "/images/react-hooks.jpg",
    date: "2023-11-20",
    author: {
      name: "John Smith",
      image: "/images/authors/john.jpg"
    }
  },
  {
    id: "3",
    title: "CSS Grid Layout: A Complete Guide",
    description: "Master CSS Grid Layout to create complex web layouts with ease.",
    content: `
# CSS Grid Layout: A Complete Guide

CSS Grid Layout is a powerful two-dimensional layout system designed for the web. It allows you to create complex responsive web layouts with ease.

## Basic Concepts

CSS Grid Layout introduces a grid-based layout system, with rows and columns, making it easier to design web pages without having to use floats and positioning.

### Setting up a Grid

To create a grid container, you set the display property to 'grid' or 'inline-grid':

\`\`\`css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 100px 200px;
  gap: 20px;
}
\`\`\`

This creates a grid with 3 columns of equal width and 2 rows with specific heights, with 20px gaps between cells.

## Grid Properties

### For the Container

- grid-template-columns: Defines the columns of the grid
- grid-template-rows: Defines the rows of the grid
- gap: Sets the gap between rows and columns
- justify-items: Aligns grid items along the row axis
- align-items: Aligns grid items along the column axis

### For the Items

- grid-column: Specifies which column(s) the item will span
- grid-row: Specifies which row(s) the item will span
- justify-self: Overrides the container's justify-items for specific items
- align-self: Overrides the container's align-items for specific items

## The fr Unit

The 'fr' unit represents a fraction of the available space:

\`\`\`css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
}
\`\`\`

This creates three columns where the middle one is twice as wide as the others.

## Grid Areas

You can name grid areas and place items in them:

\`\`\`css
.container {
  display: grid;
  grid-template-areas: 
    "header header header"
    "sidebar content content"
    "footer footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.footer { grid-area: footer; }
\`\`\`

## Responsive Grids

CSS Grid works beautifully with media queries for responsive designs:

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}
\`\`\`

This creates as many columns as can fit with a minimum width of 200px.

## Browser Support

CSS Grid is supported in all modern browsers, making it a reliable choice for modern web development.

By mastering CSS Grid, you'll be able to create complex layouts that were previously difficult or impossible with traditional CSS techniques.
    `,
    coverImage: "/images/css-grid.jpg",
    date: "2023-11-25",
    author: {
      name: "Sarah Johnson",
      image: "/images/authors/sarah.jpg"
    }
  }
];