# TicketFlow - Ticket Management System

A premium, full-featured ticket management web application built with React, TypeScript, and Tailwind CSS. Features a beautiful glassmorphism design with 3D effects, magnetic interactions, and smooth animations.

## 🚀 Features

### Core Functionality
- ✅ **Landing Page** - Hero section with wavy SVG background and decorative circles
- ✅ **Authentication** - Login & Signup with form validation
- ✅ **Dashboard** - Statistics overview with real-time metrics
- ✅ **Ticket Management** - Full CRUD operations (Create, Read, Update, Delete)
- ✅ **Protected Routes** - Session-based authentication
- ✅ **Toast Notifications** - Success and error feedback
- ✅ **Form Validation** - Real-time inline error messages

### Design Features
- 🎨 **3D Card Effects** - Cards tilt on hover using perspective transforms
- 🧲 **Magnetic Buttons** - Buttons follow cursor movement
- 💫 **Smooth Animations** - 300-500ms transitions throughout
- 🌊 **Wavy Background** - SVG wave shapes in hero section
- ⭕ **Decorative Circles** - Gradient blur circles for visual depth
- 📱 **Responsive Layout** - Max-width 1440px, centered on large screens
- 🎭 **Glassmorphism** - Frosted glass effects with backdrop blur

## 🛠️ Technology Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon system
- **localStorage** - Data persistence
- **CSS Transforms** - 3D effects and animations

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Steps

1. **Clone or download the project**
```bash
git clone https://github.com/yourusername/ticketflow.git
cd ticketflow
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open in browser**
```
http://localhost:3000
```

## 🔐 Demo Credentials

Use these credentials to test the application:

- **Email**: `demo@ticketapp.com`
- **Password**: `demo123`

Or create a new account using the Signup page.

## 📋 Application Structure

### Pages

#### 1. Landing Page
- Hero section with gradient title
- Wavy SVG background at bottom
- 3 feature cards with 3D hover effects
- "Login" and "Get Started" CTAs
- Footer section

#### 2. Authentication
- **Login Page**: Email/password with validation
- **Signup Page**: Name/email/password registration
- Toast notifications for feedback
- Session stored in `localStorage` as `ticketapp_session`
- Automatic redirect on success

#### 3. Dashboard
- **Statistics Cards**:
  - Total Tickets (blue gradient)
  - Open Tickets (green gradient)
  - In Progress (amber gradient)
  - Closed Tickets (gray gradient)
- Quick action buttons
- User greeting with name
- Logout functionality

#### 4. Ticket Management
- **Create Modal**: Form with validation
  - Title* (required)
  - Description (optional)
  - Status* (open/in_progress/closed)
  - Priority (low/medium/high)
- **Ticket Cards Grid**: 
  - Color-coded status badges
  - Priority indicators
  - Edit and delete buttons
  - Creation date
- **Edit Modal**: Pre-filled form for updates
- **Delete Confirmation**: Dialog before deletion

## 🎨 Status Colors

- **Open**: Green (`#10b981`)
- **In Progress**: Amber (`#f59e0b`)
- **Closed**: Gray (`#64748b`)

## 🎯 Priority Levels

- **High**: Red indicator
- **Medium**: Amber indicator
- **Low**: Green indicator

## 🔒 Data Persistence

All data is stored in browser `localStorage`:

- **Session**: `ticketapp_session` - User authentication
- **Tickets**: `tickets` - Array of ticket objects

### Data Structure

```typescript
// User Session
{
  email: string;
  name: string;
  token: string;
}

// Ticket
{
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string; // ISO timestamp
}
```

## ✅ Validation Rules

### Authentication
- **Email**: Required, must be valid format
- **Password**: Required, minimum 6 characters
- **Name** (Signup): Required

### Tickets
- **Title**: Required, cannot be empty
- **Status**: Required, must be one of: open, in_progress, closed
- **Description**: Optional
- **Priority**: Optional, defaults to medium

## 🎭 Component Architecture

### Core Services (`ticket_core_services.ts`)
- `AuthService` - Authentication logic
- `TicketService` - CRUD operations
- `ValidationUtils` - Form validation
- `Card3D` - 3D hover component
- `MagneticButton` - Cursor-following button
- `Toast` - Notification component

### Main Application (`ticket_app_fixed.tsx`)
- `LandingPage` - Hero and features
- `AuthPage` - Login/Signup forms
- `Dashboard` - Statistics overview
- `TicketManagement` - CRUD interface
- `App` - Router and auth guard

## 🚨 Error Handling

The application handles errors gracefully:

- **Invalid Login**: Toast notification with demo credentials hint
- **Validation Errors**: Inline red text below fields
- **Empty Title**: "Title is required" error
- **Invalid Status**: "Invalid status" error
- **Unauthorized Access**: Auto-redirect to login page
- **Network Errors**: Toast notifications (if using real API)

## 🔐 Security Features

- Session-based authentication
- Protected routes (Dashboard, Tickets)
- Auto-logout on session clear
- Token validation on page load
- Redirect unauthorized users to login

## 📱 Responsive Design

- **Mobile** (< 768px): Stacked layout, full-width cards
- **Tablet** (768px - 1024px): 2-column grid
- **Desktop** (> 1024px): 3-column grid, max-width 1440px

## 🎨 Premium UI Features

### 3D Card Tilt
Cards rotate based on mouse position using CSS perspective transforms.

### Magnetic Buttons
Buttons translate toward cursor position within their bounds.

### Glassmorphism
Frosted glass effect using `backdrop-blur-xl` and semi-transparent backgrounds.

### Smooth Animations
All transitions use cubic-bezier easing for professional feel.

## 🐛 Known Issues

- Data is lost on browser cache clear (localStorage limitation)
- No real backend - uses mock authentication
- No email verification
- Single-user system (no multi-user support)

## 🔄 Future Enhancements

- [ ] Real backend API integration
- [ ] Multi-user support with roles
- [ ] Ticket assignment to users
- [ ] Comment system on tickets
- [ ] File attachments
- [ ] Email notifications
- [ ] Advanced filtering and search
- [ ] Export tickets to CSV/PDF
- [ ] Dark/Light theme toggle
- [ ] Ticket history/audit log

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 👨‍💻 Author

Built with ❤️ using React, TypeScript, and Tailwind CSS.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Support

For questions or issues, please open an issue on GitHub or contact the development team.

---

**Remember**: This is a demo application. For production use, implement:
- Real backend API
- Proper authentication (JWT, OAuth)
- Database storage
- Server-side validation
- Security headers
- HTTPS encryption