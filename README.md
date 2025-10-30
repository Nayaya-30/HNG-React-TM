# Ticket Management Application - React Version

This is the React implementation of the ticket management application. It features a modern UI with responsive design, dark mode support, and full CRUD operations for tickets.

## 🧰 Frameworks and Libraries Used

- **React** - JavaScript library for building user interfaces
- **React Router** - Declarative routing for React applications
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful & consistent icon toolkit
- **Vite** - Fast build tool and development server
- **D3.js** - Data visualization library (for analytics)
- **Redux Toolkit** - State management solution

## 🚀 Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## 🧩 Components and UI Features

### Public Pages
- **Landing Page** - Hero section with call-to-action buttons and feature highlights
- **Login Page** - Email/password authentication with validation
- **Signup Page** - User registration with password strength indicator

### Protected Pages
- **Dashboard** - Overview with statistics cards and quick actions
- **Ticket Management** - Full CRUD operations for tickets with search functionality

### UI Components
- **Dark Mode Toggle** - Theme switching capability
- **Responsive Navigation** - Adapts to mobile and desktop views
- **Statistics Cards** - Visual display of ticket metrics
- **Ticket Cards** - Display individual tickets with status and priority indicators
- **Form Validation** - Real-time client-side validation
- **Toast Notifications** - User feedback messages
- **Network Status Indicator** - Offline/online status detection

### UI Features
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Dark/Light Theme** - User preference saved in localStorage
- **Interactive Elements** - Hover effects and transitions
- **Accessibility** - Semantic HTML and ARIA attributes

## 🗃️ State Structure

The application uses a combination of React's useState hooks and Redux for state management:

### Local Component State
- Form data in login/signup forms
- UI state like loading indicators
- Modal visibility states

### Redux Store
- **Auth State** - User authentication and session data
- **Tickets State** - Collection of tickets with filtering capabilities
- **UI State** - Toast notifications, theme preferences

## ♿ Accessibility Features

- Semantic HTML structure
- Proper heading hierarchy (h1-h3)
- ARIA labels for icon-only buttons
- Sufficient color contrast
- Focus indicators for keyboard navigation
- Screen reader-friendly content

## ⚠️ Known Issues

1. **Form Validation** - Some edge cases in validation logic
2. **Network Status** - Network detection may not work in all browsers
3. **Analytics Chart** - Visualization could be more detailed

## 🔐 Test Credentials

Use the following credentials to test the application:

- **Email:** test@example.com
- **Password:** test123

## 🔧 Setup and Usage

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```

4. **Preview Production Build:**
   ```bash
   npm run preview
   ```

## 🔄 Switching Between Versions

This project contains three different implementations of the same ticket management application:

1. **React version** (`app/` directory)
2. **Vue version** (`Vue-app/` directory)
3. **Twig version** (`twig-starter-template/` directory)

To switch between versions, navigate to the respective directory and follow the setup instructions in each README.

## 📁 Project Structure

```
app/
├── src/
│   ├── components/           # React components
│   │   ├── auth/            # Authentication components
│   │   ├── common/          # Shared components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── landing/         # Landing page components
│   │   └── tickets/         # Ticket management components
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── App.jsx              # Main application component
│   └── main.jsx             # Entry point
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
└── README.md                # This file
```