# Meeting Diary Project

A full-stack web application for managing meetings and participants, built with Node.js (Express) backend and React frontend.

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
<img width="613" height="882" alt="image" src="https://github.com/user-attachments/assets/2ab29d75-69e7-4e54-b62b-9d8b737b1a93" />

*Main dashboard showing the interactive calendar and meetings list for the selected date. The sidebar displays user information and quick action buttons.*

### Meeting Card Details
<img width="472" height="291" alt="image" src="https://github.com/user-attachments/assets/7f8dadf7-0b8c-4304-b50a-251392725203" />
<img width="736" height="552" alt="image" src="https://github.com/user-attachments/assets/6cae6a4d-9404-4cf7-9834-fda024d4cd88" />
*Meeting card showing meeting details, time, location, and action buttons. Owners can edit/delete, participants can change their status.*

### Add Meeting Modal
<img width="1182" height="652" alt="image" src="https://github.com/user-attachments/assets/c22a4d8a-a2cc-408a-9a6f-c6c18681c902" />
*Modal dialog for creating a new meeting. Includes fields for title, date, time, location, notes, and participant selection.*

### Edit Profile
<img width="1755" height="857" alt="image" src="https://github.com/user-attachments/assets/e0d6ac60-191f-4313-8929-c73676ff66fb" />
*User profile editing interface. Allows users to update their name, email, and password.*

### Meeting Details & Participants
<img width="1052" height="566" alt="image" src="https://github.com/user-attachments/assets/6feebc1c-97f7-4bdf-b266-a883b054ea59" />
*Detailed view of a meeting showing all participants, their statuses, and management options for meeting owners.*

### Participant Management
<img width="1502" height="872" alt="image" src="https://github.com/user-attachments/assets/d93ee113-f802-43ca-9109-8ce83e691d63" />

*Participant list with status indicators. Owners can add/remove participants, and all participants can update their attendance status.*

> **Note:** To add screenshots, create a `docs/screenshots/` folder in the project root and place your screenshot images there. Update the image paths above to match your actual screenshot filenames.

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

## PostgreSQL Setup

### Windows Installation

1. Download PostgreSQL from [postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the setup wizard
3. During installation, set a password for the `postgres` superuser (remember this password)
4. Complete the installation

### macOS Installation

Using Homebrew:
```bash
brew install postgresql@14
brew services start postgresql@14
```

### Linux (Ubuntu/Debian) Installation

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Create Database

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

### Connection String Format

The application uses a PostgreSQL connection string. The format is:
```
postgresql://[user]:[password]@[host]:[port]/[database]
```

Example:
```
postgresql://postgres:your_password@localhost:5432/meeting_diary
```

### Database Schema Setup

After creating the database, you need to set up the schema. The project includes SQL scripts in the `meeting-diary-backend/sql/` folder:

**Option 1: Using SQL Scripts (Recommended)**

1. Run the schema creation script:
   ```bash
   psql -U postgres -d meeting_diary -f meeting-diary-backend/sql/01_schema.sql
   ```

2. (Optional) Generate seed data with proper password hashing:
   ```bash
   cd meeting-diary-backend
   node sql/03_generate_seed.js
   ```
   This creates test users with password: `password123`

**Option 2: Using Node.js Script**

You can also run the seed generation script which handles both schema verification and seed data:
```bash
cd meeting-diary-backend
node sql/03_generate_seed.js
```

**Available SQL Scripts (located in `meeting-diary-backend/sql/`):**
- `00_reset.sql` - Drops all tables (use with caution!)
- `01_schema.sql` - Creates all tables, indexes, and constraints (idempotent)
- `02_seed_data.sql` - SQL-only seed data template (requires users to exist first)
- `03_generate_seed.js` - Node.js script that generates seed data with proper bcrypt hashes (recommended)
- `README.md` - Detailed documentation for all SQL scripts

For more details, see `meeting-diary-backend/sql/README.md`.

## Environment Variables

The `.env` file is **not** included in the repository for security reasons. You need to create it manually.

### Backend Environment Variables

1. Navigate to the backend directory:
   ```bash
   cd meeting-diary-backend
   ```

2. Create a `.env` file in the `meeting-diary-backend` directory

3. Copy the contents from `.env.example` (if it exists) or create it with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/meeting_diary

# Server Configuration
PORT=3000

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=1h
```

**Important Security Notes:**
- Never commit the `.env` file to version control
- Use a strong, random string for `JWT_SECRET` in production
- Change default passwords in production environments

### Alternative Database Configuration

If you prefer to use individual database connection parameters instead of `DATABASE_URL`, you can modify `config/db.js` to use:
- `DB_HOST` (default: localhost)
- `DB_PORT` (default: 5432)
- `DB_USER` (default: postgres)
- `DB_PASSWORD` (your database password)
- `DB_NAME` (default: meeting_diary)

## Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd meeting-diary-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create the `.env` file (see Environment Variables section above)

4. Set up the database schema (see Database Schema Setup section above)

5. Test database connection:
   ```bash
   node testDb.js
   ```
   You should see: `DB connection OK! Time is: [timestamp]`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd meeting-diary-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode

1. **Start the Backend Server:**
   ```bash
   cd meeting-diary-backend
   npm start
   ```
   The API server will run on `http://localhost:3000` (or the port specified in your `.env` file)

2. **Start the Frontend Development Server:**
   Open a new terminal window:
   ```bash
   cd meeting-diary-frontend
   npm run dev
   ```
   The React app will typically run on `http://localhost:5173` (Vite default port)

3. Open your browser and navigate to the frontend URL (usually `http://localhost:5173`)

### Production Build

To build the frontend for production:

```bash
cd meeting-diary-frontend
npm run build
```

The built files will be in the `dist` directory.

## API Endpoints

The backend API provides the following main endpoints:

- **Authentication:**
  - `POST /users/login` - User login
  - `POST /users/add` - User registration
  - `POST /users/update` - Update user profile

- **Meetings:**
  - `GET /meetings/user/:userId?date=YYYY-MM-DD` - Get meetings by date
  - `POST /meetings/add` - Create a new meeting
  - `POST /meetings/update` - Update a meeting
  - `DELETE /meetings/:meetingId` - Delete a meeting

- **Participants:**
  - `GET /participants/meeting/:meetingId` - Get participants for a meeting
  - `POST /participants/add` - Add a participant
  - `DELETE /participants` - Remove a participant
  - `POST /participants/update` - Update participant status

**Note:** Most endpoints require JWT authentication via the `Authorization: Bearer <token>` header.

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

### Port Already in Use

If port 3000 is already in use:
- Change the `PORT` value in your `.env` file
- Update the `API_URL` in `meeting-diary-frontend/src/services/api.js` to match

### Module Not Found Errors

- Delete `node_modules` folders and `package-lock.json` files
- Run `npm install` again in both backend and frontend directories

### SQL Script Errors

- Ensure PostgreSQL is running before executing SQL scripts
- Verify database connection string in `.env` file
- Check that the database exists: `psql -U postgres -l`
- For detailed SQL script help, see `meeting-diary-backend/sql/README.md`

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
- Express.js
- PostgreSQL
- JWT (JSON Web Tokens) for authentication
- bcrypt for password hashing

### Frontend
- React 19
- Vite
- Material-UI (MUI)
- Day.js for date handling

## License

ISC

