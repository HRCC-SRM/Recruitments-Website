# HRCC Recruitment System

A comprehensive recruitment management system for HackerRank Campus Crew (HRCC) with separate admin dashboards for Technical, Creative, and Corporate domains.

## Features

- **User Registration**: Students can register for recruitment with domain selection
- **Admin Authentication**: Role-based access control for different admin types
- **Domain Dashboards**: Separate dashboards for Technical, Creative, and Corporate domains
- **User Management**: View, filter, search, and manage applications
- **Status Management**: Update application status (active, shortlisted, rejected, omitted)
- **Task Assignment**: Send tasks to users and manage assignments
- **Export Functionality**: Export application data to CSV
- **Responsive Design**: Modern UI with Tailwind CSS and shadcn/ui components

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- Nodemailer for email functionality
- CORS enabled

### Frontend
- Next.js 15 with TypeScript
- Tailwind CSS for styling
- shadcn/ui components
- React Context for state management
- Custom API client

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

4. Start the backend server:
```bash
npm start
```

The backend will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the client directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be running on `http://localhost:3000`

## Admin Credentials

### Super Admin
- **Username:** `superadmin`
- **Password:** `admin123`
- **Access:** All dashboards and features

### Technical Lead
- **Username:** `technical_lead`
- **Password:** `technical123`
- **Access:** Technical dashboard only

### Creative Lead
- **Username:** `creative_lead`
- **Password:** `creative123`
- **Access:** Creative dashboard only

### Corporate Lead
- **Username:** `corporate_lead`
- **Password:** `corporate123`
- **Access:** Corporate dashboard only

## API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/profile` - Get admin profile

### User Registration
- `POST /api/auth/register` - Register new user

### Dashboard APIs
- `GET /api/{domain}-dashboard/users` - Get users for domain
- `GET /api/{domain}-dashboard/stats` - Get domain statistics
- `GET /api/{domain}-dashboard/users/:id` - Get specific user
- `PATCH /api/{domain}-dashboard/users/:id/status` - Update user status
- `PATCH /api/{domain}-dashboard/users/bulk-status` - Bulk update status
- `POST /api/{domain}-dashboard/tasks/send` - Send task to users
- `GET /api/{domain}-dashboard/shortlisted` - Get shortlisted users
- `POST /api/{domain}-dashboard/tasks/send-to-shortlisted` - Send task to shortlisted users

Where `{domain}` can be: `technical`, `creative`, or `corporate`

## Project Structure

```
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Authentication middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── server.js        # Main server file
├── client/
│   ├── app/             # Next.js app directory
│   │   ├── dashboard/   # Dashboard pages
│   │   ├── login/       # Login page
│   │   ├── register/    # Registration page
│   │   └── contact/     # Contact page
│   ├── components/      # Reusable components
│   ├── lib/             # API client and utilities
│   └── public/          # Static assets
└── README.md
```

## Usage

1. **User Registration**: Students can visit `/register` to apply for recruitment
2. **Admin Login**: Admins can login at `/login` with their credentials
3. **Dashboard Access**: After login, admins are redirected to their respective dashboards
4. **User Management**: Admins can view, search, filter, and manage applications
5. **Status Updates**: Update application status and add notes
6. **Task Assignment**: Send tasks to selected users or all shortlisted users
7. **Data Export**: Export application data to CSV format

## Features Implemented

✅ User registration with domain selection  
✅ Admin authentication with role-based access  
✅ Protected routes and middleware  
✅ Dashboard pages for all three domains  
✅ Real-time data fetching from backend APIs  
✅ Search and filter functionality  
✅ Status management with visual indicators  
✅ CSV export functionality  
✅ Responsive design with modern UI  
✅ Error handling and loading states  
✅ Form validation and user feedback  

## Development Notes

- The system uses JWT tokens for authentication
- All API calls are made through a centralized API client
- State management is handled with React Context
- The UI is built with Tailwind CSS and shadcn/ui components
- The backend uses MongoDB for data persistence
- Email functionality is ready for integration with services like SendGrid or Mailtrap

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
