# 🌊 Flood Guard - Flood Monitoring System

A comprehensive flood monitoring and management system built with Next.js 15, TypeScript, and Prisma. This application provides real-time monitoring of water levels, weather conditions, and environmental data to help with flood prevention and disaster management.

![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.1.0-green?logo=prisma)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-blue?logo=tailwindcss)

## 🚀 Features

- **📊 Real-time Dashboard**: Interactive dashboard with charts and data visualization
- **🌊 Water Level Monitoring**: TMAS (Tinggi Muka Air Sungai) and TMAT (Tinggi Muka Air Tanah) tracking
- **🌤️ Weather Station**: AWS (Automatic Weather Station) data collection and monitoring
- **🗺️ Geographic Mapping**: Interactive maps with Leaflet for location-based data
- **📱 Responsive Design**: Mobile-friendly interface with TailwindCSS
- **👥 User Management**: Role-based access control and authentication
- **📈 Data Export**: Export data to PDF, CSV, and other formats
- **⚡ Real-time Updates**: Live data updates and notifications

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.7
- **UI Library**: React 19
- **Styling**: TailwindCSS 4.0
- **Charts**: Chart.js 4.4 with react-chartjs-2
- **Maps**: Leaflet 1.9 with react-leaflet
- **Forms**: React Hook Form with Yup validation
- **State Management**: Recoil
- **Icons**: Heroicons, FontAwesome

### Backend

- **Database**: PostgreSQL
- **ORM**: Prisma 6.1
- **API**: Next.js API Routes
- **Authentication**: Custom authentication system

### Development Tools

- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript
- **Build Tool**: Turbopack (Next.js)

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database
- **Git** for version control

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/KillerQueen59/flood-guard.git
cd flood-guard
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/flood_guard"
DIRECT_URL="postgresql://username:password@localhost:5432/flood_guard"

# Add other environment variables as needed
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Optional: Seed database with sample data
npx prisma db seed
```

### 5. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
flood-guard/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 📁 (web)/             # Main application routes
│   │   │   ├── 📁 dashboard/     # Dashboard pages & components
│   │   │   ├── 📁 device/        # Device management (AWS/TMAS)
│   │   │   └── 📁 sumber/        # Data sources (AWL/AWS)
│   │   ├── 📁 api/               # API routes
│   │   ├── 📁 login/             # Authentication pages
│   │   └── 📁 map/               # Geographic mapping
│   ├── 📁 components/            # Reusable UI components
│   │   ├── 📁 Chart/             # Data visualization components
│   │   ├── 📁 Map/               # Map components
│   │   ├── 📁 Table/             # Data table components
│   │   └── 📁 Sidebar/           # Navigation components
│   ├── 📁 hooks/                 # Custom React hooks
│   ├── 📁 shared/                # Shared utilities & helpers
│   ├── 📁 types/                 # TypeScript type definitions
│   └── 📁 utils/                 # Utility functions
├── 📁 prisma/                    # Database schema & migrations
│   ├── schema.prisma             # Prisma database schema
│   ├── 📁 migrations/            # Database migration files
│   └── *.csv                     # Sample data files
├── 📁 public/                    # Static assets
└── 📄 Configuration files        # Next.js, TypeScript, ESLint configs
```

## 🗃️ Database Models

The application uses the following main data models:

- **User**: User authentication and management
- **AlatAWS**: Automatic Weather Station devices
- **AlatAWL**: Water level monitoring devices
- **WeatherData**: Weather station measurements
- **TMASData**: River water level data
- **TMATData**: Groundwater level data
- **PT & Kebun**: Plantation and garden management
- **Device**: General device management
- **AlatDashboard**: Dashboard device statistics

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint

# Database
npx prisma studio    # Open Prisma Studio
npx prisma migrate   # Run database migrations
npx prisma generate  # Generate Prisma client
```

## 🌐 API Endpoints

### Main API Routes

- `/api/dashboard` - Dashboard data and statistics
- `/api/aws` - Automatic Weather Station data
- `/api/awl` - Water level monitoring data
- `/api/user` - User management

### Data Endpoints

- Weather data, TMAS/TMAT water levels
- Device status and management
- User authentication and authorization

## 📊 Monitoring Features

### Weather Monitoring

- Temperature (min/max/average)
- Humidity and atmospheric pressure
- Wind speed and direction
- Solar radiation and evapotranspiration
- UV index monitoring

### Water Level Monitoring

- River water levels (TMAS)
- Groundwater levels (TMAT)
- Historical data tracking
- Alert thresholds

### Device Management

- Device status monitoring (Active/Idle/Alert/Broken)
- Battery and signal strength tracking
- Maintenance scheduling

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy automatically

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```
