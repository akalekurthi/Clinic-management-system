# Clinic Management System

A modern, full-stack clinic management system built with React, TypeScript, Express.js, and Tailwind CSS.

## Features

- **Multi-role Support**
  - Patient Dashboard
  - Doctor Dashboard
  - Admin Dashboard
  - Lab Assistant Dashboard

- **Patient Features**
  - Book and manage appointments
  - View lab reports
  - Access prescriptions
  - Update profile information

- **Doctor Features**
  - Manage patient appointments
  - Write prescriptions
  - Request lab tests
  - View patient history

- **Admin Features**
  - Manage doctors
  - Handle appointments
  - Generate reports
  - Token management

- **Lab Features**
  - Process lab test requests
  - Upload test reports
  - View test history

## Tech Stack

- **Frontend**
  - React 18
  - TypeScript
  - Tailwind CSS
  - React Query
  - Radix UI Components

- **Backend**
  - Express.js
  - TypeScript
  - Passport.js (Authentication)
  - Express Session

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Clinic-management-system.git
   cd Clinic-management-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Sample Accounts

- **Patient**
  - Username: patient1
  - Password: password

- **Doctor**
  - Username: doctor1
  - Password: password

- **Admin**
  - Username: admin1
  - Password: password

- **Lab Assistant**
  - Username: lab1
  - Password: password

## Project Structure

```
clinic-management-system/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   └── hooks/        # Custom React hooks
├── server/                # Backend Express application
│   ├── routes/           # API routes
│   └── storage/          # Data storage
├── shared/               # Shared types and utilities
└── uploads/             # File uploads directory
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Your Name
- GitHub: [@yourusername](https://github.com/yourusername)

## Acknowledgments

- [React](https://reactjs.org/)
- [Express.js](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/) 