# Deepali's Blog

A modern blog website built with Next.js, MongoDB, and shadcn/ui components. Features a clean, responsive design with an admin panel for content management.

## Features

- Responsive blog with horizontal card layout
- Admin panel for article management
- Image upload functionality with Cloudinary
- Markdown support for article content
- MongoDB integration for data storage
- Authentication system for admin access

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **Image Storage**: Cloudinary
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- MongoDB (local or Atlas)
- Cloudinary account (free tier)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/deepali-blog.git
   cd deepali-blog
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your MongoDB connection string, NextAuth secret, and Cloudinary credentials

4. Run the development server
   ```bash
   npm run dev
   ```

5. Initialize the database (creates admin user and sample articles)
   ```
   Visit: http://localhost:3000/api/seed
   ```

6. Access the admin panel
   ```
   Visit: http://localhost:3000/admin/login
   Login with: admin@example.com / password123
   ```

## Deployment to Netlify

1. Push your code to GitHub

2. Connect your repository to Netlify

3. Configure environment variables in Netlify dashboard:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NEXTAUTH_SECRET`: A secure random string for NextAuth
   - `NEXTAUTH_URL`: Your Netlify site URL
   - `CLOUDINARY_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_KEY`: Your Cloudinary API key
   - `CLOUDINARY_SECRET`: Your Cloudinary API secret

4. Add the following build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

5. Deploy your site

## API Reference

### Authentication Endpoints

#### Login
```
POST /api/auth/signin
```
Request body:
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

#### Get Session
```
GET /api/auth/session
```

#### Logout
```
POST /api/auth/signout
```

### Article Endpoints

#### Get All Articles
```
GET /api/articles
```
Query parameters:
- `published=true` - Get only published articles
- `published=false` - Get only draft articles
- `published=all` - Get all articles (requires authentication)

#### Get Single Article
```
GET /api/articles/{id}
```

#### Create Article
```
POST /api/articles
```
Request body:
```json
{
  "title": "Article Title",
  "description": "Short description",
  "content": "Full article content with markdown support",
  "coverImage": "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/blog/image.jpg",
  "published": true,
  "author": {
    "name": "Author Name",
    "image": "/images/authors/default.jpg"
  }
}
```

#### Update Article
```
PUT /api/articles/{id}
```
Request body: Same as Create Article

#### Delete Article
```
DELETE /api/articles/{id}
```

### Image Upload Endpoint

```
POST /api/upload
```
Form data:
- `file`: Image file (JPEG, PNG, or SVG)

Response:
```json
{
  "message": "File uploaded successfully",
  "url": "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/blog/image.jpg"
}
```

### Database Seeding Endpoint

```
GET /api/seed
```
Response:
```json
{
  "message": "Database seeded successfully",
  "adminEmail": "admin@example.com",
  "adminPassword": "password123"
}
```

## Frontend Routes

### Public Routes
- `/` - Home page with article listings
- `/articles/{id}` - Individual article page

### Admin Routes
- `/admin/login` - Admin login page
- `/admin` - Admin dashboard
- `/admin/articles` - Article management page
- `/admin/articles/new` - Create new article
- `/admin/articles/edit/{id}` - Edit existing article

## Project Structure

```
/
├── public/               # Static files
│   └── images/           # Image assets
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── admin/        # Admin panel pages
│   │   ├── api/          # API routes
│   │   └── articles/     # Article pages
│   ├── components/       # React components
│   │   └── ui/           # UI components
│   ├── lib/              # Utility functions
│   │   └── models/       # MongoDB models
│   └── types/            # TypeScript type definitions
├── .env.example          # Example environment variables
├── .env.local            # Local environment variables (git-ignored)
└── README.md             # Project documentation
```

## License

MIT

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [MongoDB](https://www.mongodb.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Cloudinary](https://cloudinary.com/)
- [Netlify](https://www.netlify.com/)