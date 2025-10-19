# Azlo Admin Dashboard

A modern, full-featured admin dashboard for managing movies, series, reels, and content with industry-standard video upload capabilities and NextAuth authentication.

## Features

- **Authentication**: NextAuth integration with JWT tokens
- **Video Upload System**: Multipart upload to S3 with AWS MediaConvert integration for HLS streaming
- **Genre Management**: Full CRUD operations for managing content genres
- **Movie Management**: Comprehensive movie management with metadata, cast, directors, and more
- **Series Management**: Complete series management with seasons and episodes
- **Reels Management**: Short-form video content management
- **HLS Video Player**: Built-in support for playing m3u8 format videos
- **Dashboard Analytics**: Revenue tracking, content statistics, and genre analytics
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Type-Safe**: Full TypeScript support
- **State Management**: TanStack Query for efficient data fetching and caching
- **Toast Notifications**: Sonner for beautiful toast notifications

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Authentication**: NextAuth.js v4
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **State Management**: TanStack Query
- **HTTP Client**: Axios with interceptors
- **Video Player**: HLS.js for adaptive streaming
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

1. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

2. **Set up environment variables**:
   Create a `.env.local` file and add:
   \`\`\`bash
   # API Configuration
   NEXT_PUBLIC_BASE_URL=http://localhost:5000/api

   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here

   # Generate a secret with: openssl rand -base64 32
   \`\`\`

3. **Run the development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Login**:
   Navigate to [http://localhost:3000/login](http://localhost:3000/login)
   
   Default credentials (from your API):
   - Email: `admin@gmail.com`
   - Password: Your admin password

## Project Structure

\`\`\`
├── app/
│   ├── (auth)/               # Authentication routes
│   │   ├── login/            # Login page
│   │   └── layout.tsx        # Auth layout
│   ├── (dashboard)/          # Dashboard layout group
│   │   ├── layout.tsx        # Dashboard layout with sidebar
│   │   ├── page.tsx          # Dashboard home
│   │   ├── genres/           # Genre management
│   │   ├── movies/           # Movie management
│   │   ├── series/           # Series management
│   │   ├── reels/            # Reels management
│   │   └── ...
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/ # NextAuth API routes
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── genres/               # Genre components
│   ├── movies/               # Movie components
│   ├── series/               # Series components
│   │   ├── series-table.tsx
│   │   ├── series-form-dialog.tsx
│   │   ├── season-management-dialog.tsx
│   │   ├── add-season-dialog.tsx
│   │   └── add-episode-dialog.tsx
│   ├── reels/                # Reels components
│   ├── video-uploader/       # Video upload components
│   ├── layout/               # Layout components
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── api.ts                # API functions with axios
│   ├── auth.ts               # NextAuth configuration
│   ├── types.ts              # TypeScript types
│   ├── utils.ts              # Utility functions
│   └── query-provider.tsx    # TanStack Query provider
├── types/
│   └── next-auth.d.ts        # NextAuth type definitions
├── middleware.ts             # NextAuth middleware for protected routes
└── public/
    └── logo.png              # Azlo logo
\`\`\`

## Authentication

The dashboard uses NextAuth.js for authentication:

- **Login**: POST to `{{baseURL}}/auth/login` with email and password
- **Session Management**: JWT-based sessions stored in cookies
- **Token Refresh**: Automatic token injection in API requests
- **Protected Routes**: All dashboard routes require authentication
- **Sign Out**: Clears session and redirects to login

### Authentication Flow

1. User enters credentials on `/login`
2. NextAuth sends credentials to your API endpoint
3. API returns `accessToken`, `refreshToken`, and user data
4. Tokens are stored in the session
5. All API requests automatically include the `accessToken` in headers
6. Middleware protects dashboard routes

## Key Features

### Video Upload System

The video uploader supports:
- Multipart upload for large files (10MB chunks)
- Progress tracking with visual feedback
- AWS S3 integration
- AWS MediaConvert for HLS transcoding
- Multiple quality levels (1080p, 720p, 480p, 360p)
- Video preview with HLS.js player
- Drag and drop support
- Automatic upload on file selection
- Cancel upload functionality

### Series Management

Complete series management system with:
- Create/edit/delete series
- Add multiple seasons to a series
- Add episodes to seasons with video uploads
- Nested collapsible UI for seasons and episodes
- Trailer preview functionality
- Cast and director management
- Genre categorization
- Premium content toggle
- Release date tracking

### Reels Management

Short-form video content management:
- Create/edit/delete reels
- Video and thumbnail uploads
- Preview functionality
- View and like tracking
- Automatic video upload with progress

### Styling Improvements

All forms now include:
- Proper spacing between labels and inputs (`space-y-2`)
- Cursor pointer on interactive elements
- Hover states for better UX
- Consistent padding and margins
- Responsive layouts

### API Integration

All API calls are centralized in `lib/api.ts` with:
- Axios interceptors for authentication
- Automatic token injection from NextAuth session
- Error handling with user-friendly messages
- FormData support for file uploads
- Multipart upload support

### State Management

TanStack Query provides:
- Automatic caching
- Background refetching
- Optimistic updates
- Loading and error states
- Query invalidation

## API Endpoints

The dashboard integrates with the following endpoints:

### Authentication
- `POST /auth/login` - Login with email and password

### Genres
- `GET /genres` - Get all genres
- `POST /genres` - Create genre (multipart/form-data)
- `PUT /genres/:id` - Update genre (multipart/form-data)
- `DELETE /genres/:id` - Delete genre

### Movies
- `GET /movies` - Get all movies
- `POST /movies` - Create movie (multipart/form-data)
- `PUT /movies/:id` - Update movie (multipart/form-data)
- `DELETE /movies/:id` - Delete movie

### Series
- `GET /v1/series` - Get all series with nested seasons and episodes
- `GET /v1/series/:id` - Get series by ID
- `POST /series` - Create series (multipart/form-data)
- `PATCH /series/:id` - Update series (multipart/form-data)
- `DELETE /series/:id` - Delete series
- `POST /series/:id/season` - Add season to series (multipart/form-data)
- `POST /series/:id/season/:seasonNumber/episode` - Add episode to season (multipart/form-data)

### Reels
- `GET /reels` - Get all reels
- `POST /reels` - Create reel (multipart/form-data)
- `PATCH /reels/:id` - Update reel (multipart/form-data)
- `DELETE /reels/:id` - Delete reel

### Upload
- `POST /upload/initiate` - Initiate multipart upload
- `POST /upload/part-url` - Get signed URL for part upload
- `POST /upload/complete` - Complete multipart upload and trigger MediaConvert

## Video Upload Flow

1. **File Selection**: User selects video file via drag-drop or file picker
2. **Initiate Upload**: Request upload ID and key from backend
3. **Chunk Upload**: Split file into 10MB chunks and upload to S3
4. **Progress Tracking**: Real-time progress updates
5. **Complete Upload**: Notify backend to trigger MediaConvert
6. **HLS Processing**: MediaConvert creates m3u8 playlist and segments
7. **Playback URL**: Backend returns HLS playback URL
8. **Form Submission**: URL is included in form data

## Customization

### Colors

Update the color scheme in `app/globals.css` by modifying the CSS variables:

\`\`\`css
@theme inline {
  --color-background: 0 0% 100%;
  --color-foreground: 222.2 84% 4.9%;
  /* ... more variables */
}
\`\`\`

### Components

All UI components are in `components/ui/` and can be customized as needed. They follow the shadcn/ui pattern.

### API Base URL

Update `NEXT_PUBLIC_BASE_URL` in `.env.local` to point to your backend API.

## Development

### Adding New Features

1. Create API functions in `lib/api.ts`
2. Add TypeScript types in `lib/types.ts`
3. Create UI components in `components/`
4. Add pages in `app/(dashboard)/`
5. Use TanStack Query for data fetching

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use Tailwind CSS for styling
- Implement proper error handling
- Add loading states for async operations

## Deployment

1. Build the application:
   \`\`\`bash
   npm run build
   \`\`\`

2. Set production environment variables:
   \`\`\`bash
   NEXT_PUBLIC_BASE_URL=https://your-production-api.com/api
   NEXTAUTH_URL=https://your-domain.com
   NEXTAUTH_SECRET=your-production-secret
   \`\`\`

3. Deploy to Vercel, Netlify, or your preferred platform

## Troubleshooting

### Video Upload Issues
- Check S3 bucket permissions
- Verify MediaConvert job settings
- Ensure CORS is configured on S3

### Authentication Issues
- Verify API endpoint is correct
- Check NEXTAUTH_SECRET is set
- Ensure cookies are enabled

### API Connection Issues
- Verify NEXT_PUBLIC_BASE_URL is correct
- Check CORS settings on backend
- Ensure API is running and accessible

## License

MIT
#   f i l m s a _ d a s h b o a r d  
 