# Real Estate CRM System

A comprehensive Customer Relationship Management system designed specifically for real estate businesses to manage properties, leads, employees, and sales pipeline.

## Features

- **Dashboard**: Overview with KPIs, charts, and notifications
- **Inventory Management**: Property listings with auto-sync to website
- **Lead Management**: Lead capture, pipeline tracking, and communication logs
- **Employee Management**: Role-based access control and performance tracking
- **Post-Sales Management**: Payment tracking, document management, and customer support
- **Reports & Analytics**: Comprehensive reporting and insights
- **Website Integration**: Auto-sync inventory to client websites
- **Admin Settings**: User management, branding, and system configuration

## Technology Stack

### Backend
- Python Flask (REST API)
- MySQL Database
- SQLAlchemy ORM
- JWT Authentication
- Flask-Migrate for database migrations

### Frontend
- React.js
- Tailwind CSS
- Recharts for data visualization
- React Router for navigation
- Axios for API calls

## Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- MySQL Server
- XAMPP (for local development)

### Backend Setup
1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Initialize database:
```bash
python app.py
```

### Frontend Setup
1. Install Node.js dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

## Database Setup

1. Start XAMPP and ensure MySQL is running
2. Create database: `real_estate_crm`
3. Run the application to auto-create tables

## Usage

1. Access the application at `http://localhost:3000`
2. Create admin account on first run
3. Configure your real estate business settings
4. Start adding properties, employees, and managing leads

## API Endpoints

- `/api/auth` - Authentication endpoints
- `/api/properties` - Property management
- `/api/leads` - Lead management
- `/api/employees` - Employee management
- `/api/reports` - Reports and analytics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
