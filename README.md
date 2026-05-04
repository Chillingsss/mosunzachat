# Laravel Chat Application

A real-time chat application built with Laravel, React, TypeScript, and the musonza/chat package.

## Features

- Real-time messaging between users
- Private conversations
- Responsive design with Tailwind CSS
- Modern UI with shadcn/ui components
- TypeScript frontend with React and Inertia.js
- Real-time messaging with WebSockets (Laravel Reverb)

## Requirements

- PHP 8.1+
- Composer
- Node.js 16+
- npm or yarn
- MySQL/MariaDB database
- Laravel development environment (Laragon, Valet, etc.)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mosunzachat
```

### 2. Install Backend Dependencies

```bash
composer install
```

### 3. Install Frontend Dependencies

```bash
npm install
# or
yarn install
```

### 4. Environment Configuration

```bash
cp .env.example .env
php artisan key:generate
```

Configure your `.env` file:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mosunzachat
DB_USERNAME=root
DB_PASSWORD=

APP_URL=http://127.0.0.1:8000
```

### 5. Database Setup

Create the database and run migrations:

```bash
php artisan migrate
```

### 6. Seed Test Users (Optional)

```bash
php artisan db:seed --class=TestUserSeeder
```

This creates test users:
- John Doe (john@example.com / password)
- Jane Smith (jane@example.com / password)
- Bob Wilson (bob@example.com / password)

### 7. Start Development Servers

#### Backend Server:
```bash
php artisan serve
```

#### Frontend Development:
```bash
npm run dev
# or
yarn dev
```

## Usage

### 1. Access the Application

Open your browser and navigate to `http://127.0.0.1:8000`

### 2. Login/Register

- Register a new account or login with existing credentials
- For testing, use the seeded users (email: `john@example.com`, password: `password`)

### 3. Start Chatting

1. **View Conversations**: Click "Chat" in the sidebar to see all conversations
2. **Create New Conversation**: Click "+ New Conversation" button
3. **Select Participants**: Choose users to chat with from the available list
4. **Send Messages**: Type your message and click "Send" or press Enter
5. **Real-time Updates**: Messages appear instantly using WebSocket connections

## Project Structure

```
mosunzachat/
|-- app/
|   |-- Http/Controllers/
|   |   |-- ChatController.php          # Chat API endpoints
|   |-- Models/
|   |   |-- User.php                     # User model with chat traits
|-- database/
|   |-- migrations/                      # Database migrations
|   |-- seeders/                        # Database seeders
|-- resources/
|   |-- js/
|   |   |-- pages/
|   |   |   |-- chat/
|   |   |   |   |-- index.tsx           # Chat conversation list
|   |   |   |   |-- conversation.tsx    # Individual chat view
|   |-- views/
|   |   |-- app.blade.php               # Main layout
|-- routes/
|   |-- web.php                         # Web routes
|   |-- chat.php                        # Chat-specific routes
```

## API Endpoints

### Conversations
- `GET /chat/conversations` - Get all conversations for current user
- `POST /chat/conversations` - Create new conversation

### Messages
- `GET /chat/conversation/{id}/messages` - Get messages for a conversation
- `POST /chat/conversation/{id}/message` - Send message to conversation

### Users
- `GET /chat/users` - Get all users available for chat

## Key Components

### ChatController (Backend)
- Handles conversation creation and management
- Manages message sending and retrieval
- Integrates with musonza/chat package

### Chat Index (Frontend)
- Displays list of all conversations
- Shows conversation participants and last messages
- Handles conversation creation

### Chat Conversation (Frontend)
- Displays individual conversation messages
- Handles message sending
- Auto-scrolls to new messages
- Real-time WebSocket updates via Laravel Reverb

## Troubleshooting

### Common Issues

1. **"No conversations yet" despite creating conversations**
   - Check that the musonza/chat migrations have run
   - Verify the ChatController is returning proper data structure
   - Check browser console for JavaScript errors

2. **Messages not displaying**
   - Ensure the `name` column exists in `chat_conversations` table
   - Check that User model has the `Messageable` trait
   - Verify the frontend is receiving proper message data structure

3. **Conversation creation fails**
   - Check that User models are passed to `createConversation()` not IDs
   - Verify all participants exist in the database
   - Check Laravel logs for detailed error messages

### Database Issues

If you encounter database-related errors, try:

```bash
php artisan migrate:fresh --seed
```

This will reset the database and run all migrations and seeders.

### Frontend Build Issues

If the frontend doesn't build correctly:

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Dependencies

### Backend (Composer)
- `laravel/framework` - Laravel framework
- `musonza/chat` - Chat package
- `inertiajs/inertia-laravel` - Inertia.js adapter
- `tightenco/ziggy` - Route generation
- `laravel/reverb` - WebSocket server for real-time communication

### Frontend (npm)
- `react` - React library
- `typescript` - TypeScript compiler
- `@inertiajs/react` - Inertia.js React adapter
- `@inertiajs/core` - Inertia.js core
- `laravel-echo` - WebSocket client for real-time communication
- `pusher-js` - WebSocket protocol implementation
- `lucide-react` - Icon library
- `tailwindcss` - CSS framework
- `shadcn/ui` - UI component library

## Development

### Adding New Features

1. **Backend**: Add new methods to `ChatController.php`
2. **Frontend**: Create new components in `resources/js/pages/chat/`
3. **Routes**: Add new routes in `routes/chat.php`
4. **Database**: Create migrations in `database/migrations/`

### Code Style

- Follow PSR-12 for PHP code
- Use TypeScript strict mode
- Follow React and TypeScript best practices
- Use ESLint and Prettier for code formatting

## License

This project is open-sourced software licensed under the MIT license.
"# musonza"  git init git add README.md git commit -m "first commit" git branch -M main git remote add origin https://github.com/Chillingsss/musonza.git git push -u origin main
