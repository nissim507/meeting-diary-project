# Meeting Diary Project

A full-stack web application for managing meetings and participants, built with Node.js (Express) backend and React frontend.

## Quick Start

1. **Prerequisites**: Install Node.js 20.x and PostgreSQL 12+
2. **Database**: Create database `meeting_diary` and run schema script
3. **Backend**: 
   ```bash
   cd meeting-diary-backend
   npm install
   # Create .env file (see Environment Variables section)
   npm start
   ```
4. **Frontend**: 
   ```bash
   cd meeting-diary-frontend
   npm install
   npm run dev
   ```
5. **Access**: Open http://localhost:5173 in your browser

For detailed step-by-step instructions, see the sections below.

## Features

### 🔐 Authentication & User Management
- **User Registration & Login**: Secure authentication with JWT tokens
- **User Profile Management**: Edit profile information (name, email, password)
- **Session Persistence**: Automatic login using localStorage
- **Password Security**: Bcrypt password hashing

### 📅 Calendar & Meeting View
- **Interactive Calendar**: Date picker to view meetings by specific date
- **Meeting List**: Displays all meetings for the selected date, sorted by time
- **Meeting Cards**: Visual cards showing meeting details at a glance
- **Real-time Updates**: Automatic refresh when meetings are added or modified

### 📝 Meeting Management
- **Create Meetings**: Add new meetings with title, date, time, location, and notes
- **Edit Meetings**: Update meeting details (owners only)
- **Delete Meetings**: Remove meetings (owners only)
- **Meeting Details Modal**: View comprehensive meeting information
- **Google Maps Integration**: Quick access to meeting locations via Google Maps

### 👥 Participant Management
- **View Participants**: See all participants for each meeting with their status
- **Add Participants**: Invite users to meetings (owners only)
- **Remove Participants**: Remove users from meetings (owners only)
- **Status Tracking**: Update participant status (Pending, Arrived, Absent)
- **User Discovery**: View list of users not yet in a meeting

### 🎨 User Interface
- **Modern Design**: Clean, intuitive interface built with Material-UI
- **Sidebar Navigation**: Quick access menu with user information
- **Modal Dialogs**: Smooth animations for add/edit forms
- **Responsive Layout**: Works on different screen sizes
- **Status Indicators**: Visual status badges for meeting participants

## UI Screenshots

### Login & Signup Page
<img width="1900" height="990" alt="image" src="https://github.com/user-attachments/assets/3677b66a-3322-4634-8b69-7747adacda5c" />
<img width="1907" height="886" alt="image" src="https://github.com/user-attachments/assets/68bb1f84-0bbe-42af-bb00-0c128ba5bd61" />

*Welcome page with login and signup functionality. Users can toggle between login and registration forms.*

### Main Dashboard - Calendar View
<img width="1728" height="866" alt="image" src="https://github.com/user-attachments/assets/9edff325-75a2-4fed-bb53-a2b1e3aefc63" />
<img width="1897" height="888" alt="image" src="https://github.com/user-attachments/assets/2cb687ca-2834-4f49-a29f-baad060b197a" />

*Main dashboard showing the interactive calendar and meetings list for the selected date. The sidebar displays user information and quick action buttons.*

### Meeting Card Details
<img width="1893" height="895" alt="image" src="https://github.com/user-attachments/assets/91618ce1-dedd-434e-bd67-e85e79c1952b" />
<img width="1895" height="881" alt="image" src="https://github.com/user-attachments/assets/7a526e85-55ed-4ef8-ae25-e0572d2bfff8" />
*Meeting card showing meeting details, time, location, and action buttons. Owners can edit/delete, participants can change their status.*

### Add Meeting Modal
<img width="1895" height="881" alt="image" src="https://github.com/user-attachments/assets/643a62c2-902c-497d-ad24-9ccecde8daee" />
*Modal dialog for creating a new meeting. Includes fields for title, date, time, location, notes, and participant selection.*

### Edit Profile
<img width="1897" height="887" alt="image" src="https://github.com/user-attachments/assets/62c547b3-d4d1-4691-9b87-06455663fd2d" />
*User profile editing interface. Allows users to update their name, email, and password.*

### Meeting Details & Participants
<img width="1052" height="566" alt="image" src="https://github.com/user-attachments/assets/6feebc1c-97f7-4bdf-b266-a883b054ea59" />
*Detailed view of a meeting showing all participants, their statuses, and management options for meeting owners.*

### Participant Management
<img width="1502" height="872" alt="image" src="https://github.com/user-attachments/assets/d93ee113-f802-43ca-9109-8ce83e691d63" />

*Participant list with status indicators. Owners can add/remove participants, and all participants can update their attendance status.*

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 20.x or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`

- **PostgreSQL** (version 12 or higher)
  - Download from [postgresql.org](https://www.postgresql.org/download/)
  - Verify installation: `psql --version`

- **npm** (comes with Node.js)
  - Verify installation: `npm --version`

## Installation Guide

### Step 1: Set Up PostgreSQL Database

#### Windows Installation

1. Download PostgreSQL from [postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the setup wizard
3. During installation, set a password for the `postgres` superuser (remember this password)
4. Complete the installation

#### macOS Installation

Using Homebrew:
```bash
brew install postgresql@14
brew services start postgresql@14
```

#### Linux (Ubuntu/Debian) Installation

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Create Database

1. Open PostgreSQL command line (psql) or use pgAdmin:
   ```bash
   psql -U postgres
   ```

2. Create a new database:
   ```sql
   CREATE DATABASE meeting_diary;
   ```

3. (Optional) Create a dedicated user:
   ```sql
   CREATE USER meeting_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE meeting_diary TO meeting_user;
   ```

4. Exit psql:
   ```sql
   \q
   ```

#### Set Up Database Schema

After creating the database, run the schema creation script:

```bash
psql -U postgres -d meeting_diary -f meeting-diary-backend/sql/01_schema.sql
```

**Available SQL Scripts (located in `meeting-diary-backend/sql/`):**
- `00_reset.sql` - Drops all tables (use with caution!)
- `01_schema.sql` - Creates all tables, indexes, and constraints (idempotent)
- `02_seed_data.sql` - SQL-only seed data template (requires users to exist first)
- `03_generate_seed.js` - Node.js script that generates seed data with proper bcrypt hashes (recommended)
- `README.md` - Detailed documentation for all SQL scripts

For more details, see `meeting-diary-backend/sql/README.md`.

### Step 2: Configure Environment Variables

The `.env` file is **not** included in the repository for security reasons. You need to create it manually.

1. Navigate to the backend directory:
   ```bash
   cd meeting-diary-backend
   ```

2. Create a `.env` file in the `meeting-diary-backend` directory with the following content:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=meeting_diary

# Server Configuration
PORT=3000

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=1h

# Optional: For seed script (03_generate_seed.js)
# DATABASE_URL=postgresql://postgres:your_password@localhost:5432/meeting_diary
```

**Important Security Notes:**
- Never commit the `.env` file to version control
- Use a strong, random string for `JWT_SECRET` in production
- Change default passwords in production environments
- Replace `your_password` with your actual PostgreSQL password

**Note:** The seed generation script (`sql/03_generate_seed.js`) uses `DATABASE_URL` connection string format. If you want to use the seed script, uncomment and add the `DATABASE_URL` line in your `.env` file.

### Step 3: Install Backend Dependencies

1. Navigate to the backend directory:
   ```bash
   cd meeting-diary-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Test database connection:
   ```bash
   node testDb.js
   ```
   You should see: `DB connection OK! Time is: [timestamp]`

### Step 4: Install Frontend Dependencies

1. Navigate to the frontend directory:
   ```bash
   cd meeting-diary-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Step 5: (Optional) Generate Seed Data

If you want to start with test data, run the seed generation script:

```bash
cd meeting-diary-backend
node sql/03_generate_seed.js
```

This creates test users with password: `password123`
- Username: `admin`, `john.doe`, or `jane.smith`
- Password: `password123`

**Note:** Make sure `DATABASE_URL` is set in your `.env` file for the seed script to work.

## Running the Application

### Development Mode

1. **Start the Backend Server:**
   ```bash
   cd meeting-diary-backend
   npm start
   ```
   The API server will run on `http://localhost:3000` (or the port specified in your `.env` file)
   
   You should see: `Server running on port 3000`

2. **Start the Frontend Development Server:**
   Open a new terminal window:
   ```bash
   cd meeting-diary-frontend
   npm run dev
   ```
   The React app will typically run on `http://localhost:5173` (Vite default port)

3. **Open your browser** and navigate to `http://localhost:5173`

### Production Build

To build the frontend for production:

```bash
cd meeting-diary-frontend
npm run build
```

The built files will be in the `dist` directory.

## First Steps After Installation

After starting the application:

1. **Navigate to** http://localhost:5173 in your browser
2. **Create an account**: Click "SignUp" to create your first account, OR
3. **Use test account** (if you ran the seed script):
   - Username: `admin`, `john.doe`, or `jane.smith`
   - Password: `password123`
4. **Log in** with your credentials
5. **Create your first meeting** using the "Add Meeting" button in the sidebar
6. **Explore features**: Try adding participants, editing meetings, and updating your profile

## Project Structure

```
meeting-diary-project/
├── meeting-diary-backend/    # Node.js/Express API
│   ├── api/                  # API routes
│   ├── config/              # Database configuration
│   ├── controllers/         # Business logic
│   ├── middleware/          # Authentication middleware
│   ├── models/              # Database queries
│   ├── sql/                 # PostgreSQL database scripts
│   │   ├── 00_reset.sql     # Database reset script
│   │   ├── 01_schema.sql   # Schema creation script
│   │   ├── 02_seed_data.sql # SQL seed data template
│   │   ├── 03_generate_seed.js # Node.js seed data generator
│   │   └── README.md        # SQL scripts documentation
│   ├── test-data/           # JSON test data for API endpoints
│   │   ├── users/           # User API test data
│   │   ├── meetings/        # Meeting API test data
│   │   ├── participants/   # Participant API test data
│   │   ├── auth/            # Authentication examples
│   │   ├── complete-test-scenario.json # Full workflow example
│   │   └── README.md        # Test data documentation
│   └── index.js             # Server entry point
│
└── meeting-diary-frontend/   # React application
    └── src/                 # React source code
```

## API Endpoints

The backend API provides the following main endpoints:

- **Authentication:**
  - `POST /users/login` - User login
  - `POST /users/add` - User registration
  - `POST /users/update` - Update user profile (requires auth)
  - `DELETE /users/:id` - Delete user (requires auth)

- **Users:**
  - `GET /users?username=xxx` - Get users by username (requires auth)
  - `GET /allusers` - Get all users with names (requires auth)

- **Meetings:**
  - `GET /meetings` - Get all meetings (requires auth)
  - `GET /meetings/user/:userId?date=YYYY-MM-DD` - Get meetings by user and date (requires auth)
  - `GET /meetings/:id` - Get meeting by ID (requires auth)
  - `POST /meetings/add` - Create a new meeting (requires auth)
  - `POST /meetings/update` - Update a meeting (requires auth)
  - `DELETE /meetings/:id` - Delete a meeting (requires auth)

- **Participants:**
  - `GET /participants/meeting/:meetingId` - Get participants for a meeting (requires auth)
  - `GET /participants/not-in-meeting/:meetingId` - Get users not in a meeting (requires auth)
  - `POST /participants/add` - Add a participant (requires auth)
  - `POST /participants/update` - Update participant status (requires auth)
  - `DELETE /participants` - Remove a participant (requires auth)

**Note:** Most endpoints require JWT authentication via the `Authorization: Bearer <token>` header. Only `/users/login` and `/users/add` are public endpoints.

## Testing the API

The project includes comprehensive JSON test data for all API endpoints located in `meeting-diary-backend/test-data/`.

### Test Data Structure

- **`test-data/users/`** - User API test data (signup, login, update, etc.)
- **`test-data/meetings/`** - Meeting API test data (create, update, delete, etc.)
- **`test-data/participants/`** - Participant API test data (add, update, remove, etc.)
- **`test-data/auth/`** - Authentication examples and JWT token samples
- **`test-data/complete-test-scenario.json`** - Complete workflow example

### Quick Test Example

Using curl to test the login endpoint:

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d @meeting-diary-backend/test-data/users/login-request.json
```

Create a meeting (replace `YOUR_TOKEN` with actual token from login):

```bash
curl -X POST http://localhost:3000/meetings/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d @meeting-diary-backend/test-data/meetings/create-meeting-request.json
```

### Using Test Data

The test data files can be used with:
- **Postman** - Import JSON files as request bodies
- **curl** - Use with `-d @filename.json`
- **REST Client extensions** (VS Code, etc.)
- **Automated testing scripts**

For complete documentation and examples, see `meeting-diary-backend/test-data/README.md`.

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running:
  - Windows: Check Services or use `pg_ctl status`
  - macOS/Linux: `sudo systemctl status postgresql` or `brew services list`

- Verify database credentials in `.env` file
- Ensure the database exists: `psql -U postgres -l` (lists all databases)
- Check if PostgreSQL is listening on the correct port (default: 5432)
- Test connection: `node meeting-diary-backend/testDb.js`

### Port Already in Use

If port 3000 is already in use:
- Change the `PORT` value in your `.env` file
- Update the `API_URL` constant in `meeting-diary-frontend/src/services/api.js` to match your backend URL

### Module Not Found Errors

- Delete `node_modules` folders and `package-lock.json` files
- Run `npm install` again in both backend and frontend directories

### SQL Script Errors

- Ensure PostgreSQL is running before executing SQL scripts
- Verify database connection variables in `.env` file (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`)
- For the seed script (`03_generate_seed.js`), ensure `DATABASE_URL` is set in `.env`
- Check that the database exists: `psql -U postgres -l`
- For detailed SQL script help, see `meeting-diary-backend/sql/README.md`

### Frontend Not Connecting to Backend

- Verify backend is running on the correct port (check console output)
- Check that `API_URL` in `meeting-diary-frontend/src/services/api.js` matches your backend URL
- Check browser console for CORS errors (backend should have CORS enabled)
- Verify JWT token is being sent in Authorization header

## Project Resources

### Database Scripts
- **Location:** `meeting-diary-backend/sql/`
- **Purpose:** Database schema creation, reset, and seed data generation
- **Documentation:** `meeting-diary-backend/sql/README.md`

### Test Data
- **Location:** `meeting-diary-backend/test-data/`
- **Purpose:** JSON test files for all API endpoints
- **Documentation:** `meeting-diary-backend/test-data/README.md`
- **Includes:** Request/response examples, error cases, and complete test scenarios

## Technologies Used

### Backend
- Node.js 20.x
- Express.js 5.x
- PostgreSQL (using `pg` library)
- JWT (JSON Web Tokens) for authentication
- bcrypt/bcryptjs for password hashing
- dotenv for environment variable management
- CORS for cross-origin resource sharing

**Note:** The `package.json` includes `mysql2` and `sequelize` dependencies, but the application currently uses PostgreSQL with the `pg` library directly. These MySQL dependencies are not used in the current implementation.

### Frontend
- React 19
- Vite
- Material-UI (MUI) - UI components and date picker
- @mui/x-date-pickers - Date and time picker components
- Day.js - Date manipulation and formatting
- Emotion - CSS-in-JS styling (used by MUI)

**Note:** The frontend API URL is configured in `meeting-diary-frontend/src/services/api.js` and defaults to `http://localhost:3000`. Update this if your backend runs on a different port or host.

## License

ISC
