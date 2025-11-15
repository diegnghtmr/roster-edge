# RosterEdge

<div align="center">

**A modern, full-stack sports team management platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.4-6DB33F?logo=spring)](https://spring.io/projects/spring-boot)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Java](https://img.shields.io/badge/Java-21-007396?logo=openjdk)](https://openjdk.org/)

RosterEdge is a community-driven, open-source project designed to revolutionize sports team management. We believe in the power of collaboration to build exceptional tools. Whether you're a developer, a designer, or someone with a great idea, we invite you to be part of our journey.

[Features](#-features) •
[Tech Stack](#-tech-stack) •
[Getting Started](#-getting-started) •
[Architecture](#-architecture) •
[Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Testing](#-testing)
- [Internationalization](#-internationalization)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

RosterEdge is a comprehensive sports team management platform that enables clubs, coaches, and administrators to efficiently manage teams, track matches, organize staff, and generate detailed reports. Built with modern web technologies and following industry best practices, RosterEdge provides a scalable, maintainable, and user-friendly solution for sports organizations of all sizes.

## ✨ Features

### Team Management
- **Team Organization**: Create and manage multiple teams with categories, genders, and seasons
- **Staff Management**: Assign coaches, trainers, and support staff with role-based access
- **Roster Control**: Build and maintain team rosters with detailed player information

### Match Operations
- **Match Scheduling**: Plan and organize matches with venues, dates, and opponent details
- **Matchday Management**: Track matchdays and tournament schedules
- **Event Tracking**: Record and monitor match events in real-time
- **Team Assignments**: Assign teams and staff to specific matches

### Analytics & Reports
- **Dashboard Analytics**: Visualize team performance, streaks, and key metrics
- **Report Generation**: Create detailed reports with PDF export capabilities
- **Performance Tracking**: Monitor wins, losses, and team statistics over time

### Administrative Features
- **Multi-language Support**: Full internationalization with English and Spanish
- **Notification System**: Real-time notifications for important events
- **User Management**: Role-based access control and user administration
- **Geographic Data**: Manage countries, cities, stadiums, and venues
- **Currency Support**: Multi-currency support for financial tracking

### Technical Features
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Dark Mode**: Built-in theme support for better user experience
- **Accessibility**: WCAG-compliant interface with full keyboard navigation
- **Offline Support**: Progressive Web App capabilities
- **Real-time Updates**: Live data synchronization with React Query

## 🛠 Tech Stack

### Frontend

#### Core
- **React 19.1.1** - Latest React with concurrent features
- **TypeScript 5.8.3** - Type-safe development
- **Vite 7.1.6** - Lightning-fast build tool and dev server

#### State Management & Data Fetching
- **TanStack Query 5.89.0** - Powerful async state management
- **Zustand 5.0.8** - Lightweight global state management
- **React Router DOM 7.9.1** - Client-side routing

#### UI & Styling
- **Material-UI 7.3.2** - Comprehensive component library
- **Radix UI** - Unstyled, accessible components
- **Tailwind CSS 4.1.13** - Utility-first CSS framework
- **Emotion** - CSS-in-JS styling solution
- **Lucide React** - Beautiful icon set

#### Utilities
- **i18next & react-i18next** - Internationalization framework
- **React PDF Renderer** - PDF generation
- **Recharts** - Data visualization
- **Sonner** - Toast notifications
- **JWT Decode** - Token management
- **React Cookie** - Cookie handling

#### Development Tools
- **Vitest 4.0.8** - Unit testing framework
- **Testing Library** - React component testing
- **ESLint 9.35.0** - Code linting
- **Prettier 3.6.2** - Code formatting
- **Husky 9.1.7** - Git hooks
- **lint-staged** - Pre-commit linting

### Backend

#### Core
- **Spring Boot 3.5.4** - Enterprise-grade Java framework
- **Java 21** - Latest LTS version with modern features

#### Data & Persistence
- **Spring Data JDBC** - Simplified data access
- **PostgreSQL 42.7.4** - Robust relational database
- **Caffeine Cache** - High-performance caching

#### Utilities
- **Lombok** - Boilerplate code reduction
- **Spring Validation** - Request validation
- **Spring Dotenv** - Environment configuration

#### Development Tools
- **Maven** - Dependency management and build
- **Spring Boot Test** - Testing framework

### Infrastructure
- **Docker Compose** - Containerized development environment
- **Git** - Version control
- **GitHub Actions** - CI/CD pipelines (future)

## 🏗 Architecture

RosterEdge follows the **Scope Rule** architectural pattern and **Screaming Architecture** principles, ensuring the codebase is maintainable, scalable, and immediately understandable.

### Frontend Architecture Principles

#### The Scope Rule
> **"Code used by 2+ features MUST go in global/shared directories. Code used by 1 feature MUST stay local."**

This strict rule ensures:
- Clear component ownership and responsibility
- Reduced coupling between features
- Easy refactoring and maintenance
- Intuitive code discovery

#### Screaming Architecture
The directory structure immediately communicates what the application does:

```
src/
├── modules/              # Feature modules (business functionality)
│   ├── dashboard/        # Analytics and overview
│   ├── matches/          # Match management
│   ├── teams/            # Team organization
│   ├── staff/            # Staff management
│   ├── reports/          # Report generation
│   ├── notifications/    # Notification system
│   └── ...
├── shared/               # Cross-feature components (used by 2+ features)
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Shared custom hooks
│   ├── types/            # Shared TypeScript types
│   └── utils/            # Shared utilities
└── infrastructure/       # Cross-cutting concerns
    └── config/           # App configuration
```

#### Container/Presentational Pattern
- **Containers**: Handle business logic, state, and data fetching
- **Presentational**: Pure UI components receiving props
- Main containers match their feature names exactly

### Backend Architecture

The backend follows a layered architecture with clear separation of concerns:

```
src/main/java/
└── co/edu/uniquindio/rosteredge/
    ├── controller/      # REST API endpoints
    ├── service/         # Business logic
    ├── repository/      # Data access layer
    ├── model/           # Domain entities
    ├── dto/             # Data transfer objects
    ├── exception/       # Custom exceptions
    └── config/          # Spring configuration
```

### Design Patterns & Principles

- **SOLID Principles**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **Repository Pattern**: Data access abstraction
- **DTO Pattern**: Clean data transfer between layers
- **Dependency Injection**: Loose coupling via Spring IoC
- **Custom Hooks**: React logic encapsulation
- **Composition over Inheritance**: Flexible component design

## 🚀 Getting Started

### Prerequisites

#### Frontend
- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher (or **pnpm**/**yarn**)

#### Backend
- **Java** 21 or higher
- **Maven** 3.8.0 or higher
- **PostgreSQL** 14.0 or higher

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/diegnghtmr/roster-edge.git
cd roster-edge
```

#### 2. Backend Setup

```bash
cd backend

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# Install dependencies and run
./mvnw clean install
./mvnw spring-boot:run
```

The backend API will be available at `http://localhost:8080`

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Environment Variables

#### Backend (.env)
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rosteredge
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Application Configuration
SERVER_PORT=8080
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=86400000
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=RosterEdge
```

### Docker Setup (Alternative)

```bash
# Start all services with Docker Compose
docker-compose up -d

# Stop services
docker-compose down
```

## 📁 Project Structure

### Frontend Structure

```
frontend/
├── public/                      # Static assets
├── src/
│   ├── api/                     # API client configuration
│   ├── components/              # Global UI components
│   │   ├── ui/                  # Base UI components (shadcn/ui)
│   │   └── reports/             # Report-specific components
│   ├── constants/               # Application constants
│   ├── hooks/                   # Global custom hooks
│   ├── i18n/                    # Internationalization
│   │   ├── locales/
│   │   │   ├── en/             # English translations
│   │   │   └── es/             # Spanish translations
│   │   └── index.ts
│   ├── infrastructure/          # Cross-cutting concerns
│   │   └── config/             # App configuration
│   ├── interface/               # TypeScript interfaces
│   ├── lib/                     # Third-party library configs
│   ├── modules/                 # Feature modules
│   │   ├── cities/
│   │   ├── contact/
│   │   ├── countries/
│   │   ├── currencies/
│   │   ├── dashboard/
│   │   ├── events/
│   │   ├── matchdays/
│   │   ├── matches/
│   │   ├── notifications/
│   │   ├── reports/
│   │   ├── seasons/
│   │   ├── stadiums/
│   │   ├── staff/
│   │   ├── staff-roles/
│   │   ├── support/
│   │   ├── team-categories/
│   │   ├── team-genders/
│   │   ├── teams/
│   │   ├── users/
│   │   └── venues/
│   ├── page/                    # Page components
│   │   ├── login/
│   │   └── ErrorPage.tsx
│   ├── router/                  # Routing configuration
│   ├── shared/                  # Shared utilities (2+ features)
│   │   ├── components/         # Shared components
│   │   ├── hooks/              # Shared hooks
│   │   ├── types/              # Shared types
│   │   └── utils/              # Shared utilities
│   ├── storage/                 # Local storage utilities
│   ├── test/                    # Test utilities and setup
│   ├── utils/                   # General utilities
│   ├── App.tsx                  # Main App component
│   ├── App.css                  # Global styles
│   └── main.tsx                 # Application entry point
├── .husky/                      # Git hooks
├── eslint.config.js             # ESLint configuration
├── prettier.config.js           # Prettier configuration
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration
└── package.json                 # Dependencies and scripts
```

### Backend Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── co/edu/uniquindio/rosteredge/
│   │   │       ├── config/           # Configuration classes
│   │   │       ├── controller/       # REST controllers
│   │   │       ├── dto/              # Data transfer objects
│   │   │       ├── exception/        # Exception handlers
│   │   │       ├── model/            # Domain entities
│   │   │       ├── repository/       # Data repositories
│   │   │       ├── service/          # Business logic
│   │   │       └── RosterEdgeApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── schema.sql
│   └── test/                         # Unit and integration tests
├── .mvn/                             # Maven wrapper
├── mvnw                              # Maven wrapper script (Unix)
├── mvnw.cmd                          # Maven wrapper script (Windows)
├── pom.xml                           # Maven configuration
└── compose.yml                       # Docker Compose config
```

## 💻 Development

### Available Scripts

#### Frontend

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run preview          # Preview production build

# Build
npm run build            # Build for production
npm run type-check       # TypeScript type checking

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting

# Testing
npm run test             # Run tests in watch mode
npm run test:ui          # Run tests with UI
npm run test:coverage    # Generate coverage report

# Git Hooks
npm run lint-staged      # Run lint-staged (pre-commit)
```

#### Backend

```bash
# Development
./mvnw spring-boot:run              # Run application
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev  # Run with dev profile

# Build
./mvnw clean install                # Build and install
./mvnw clean package                # Build JAR

# Testing
./mvnw test                         # Run tests
./mvnw test -Dtest=ClassName        # Run specific test

# Code Quality
./mvnw checkstyle:check             # Check code style
./mvnw spotbugs:check               # Static analysis
```

### Code Style Guidelines

#### TypeScript/React
- Use **functional components** with hooks
- Prefer **const** over let
- Use **named exports** for components
- Follow **Container/Presentational** pattern
- Keep components **small and focused**
- Use **TypeScript interfaces** for props
- Apply **SOLID principles**

#### Java
- Follow **Spring Boot conventions**
- Use **Lombok** to reduce boilerplate
- Implement **proper exception handling**
- Write **meaningful tests**
- Use **constructor injection** for dependencies
- Keep **services thin**, **repositories focused**

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/your-feature-name
```

#### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: resolve bug
docs: update documentation
style: format code
refactor: restructure code
test: add tests
chore: update dependencies
```

### Pre-commit Hooks

Husky automatically runs on commit:
- **lint-staged**: Lints and formats staged files
- **type-check**: Validates TypeScript types
- Prevents commits with errors

## 🧪 Testing

### Frontend Testing

```bash
# Run all tests
npm run test

# Run with UI
npm run test:ui

# Generate coverage
npm run test:coverage
```

#### Testing Stack
- **Vitest**: Fast unit testing
- **Testing Library**: React component testing
- **jsdom**: DOM environment simulation

#### Example Test

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Dashboard } from './Dashboard';

describe('Dashboard', () => {
  it('renders dashboard title', () => {
    render(<Dashboard />);
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });
});
```

### Backend Testing

```bash
# Run all tests
./mvnw test

# Run specific test
./mvnw test -Dtest=TeamServiceTest
```

## 🌐 Internationalization

RosterEdge supports multiple languages using **i18next**:

### Supported Languages
- **English (en)** - Default
- **Spanish (es)**

### Adding Translations

1. Add translation keys to locale files:

```json
// frontend/src/i18n/locales/en/common.json
{
  "actions": {
    "create": "Create",
    "edit": "Edit"
  }
}
```

2. Use in components:

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return <button>{t('actions.create')}</button>;
}
```

### Adding New Language

1. Create directory: `frontend/src/i18n/locales/[lang-code]/`
2. Add translation files
3. Register in `frontend/src/i18n/index.ts`

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Submit pull requests
- ⭐ Star the project

### Contribution Process

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes following our guidelines
4. **Test** your changes thoroughly
5. **Commit** with conventional commit messages
6. **Push** to your fork
7. **Open** a Pull Request

### Development Guidelines

- Follow the **Scope Rule** for component placement
- Write **tests** for new features
- Update **documentation** as needed
- Ensure **code quality** with linters
- Follow **architectural patterns**
- Consider **accessibility** and **i18n**

### Code Review Process

All pull requests require:
- ✅ Passing CI/CD checks
- ✅ Code review approval
- ✅ Up-to-date with main branch
- ✅ No merge conflicts

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Diego Alejandro Flores Quintero

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 🙏 Acknowledgments

- Built with ❤️ by the RosterEdge community
- Powered by [React](https://reactjs.org/), [Spring Boot](https://spring.io/), and amazing open-source libraries
- Inspired by modern architectural patterns and best practices

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/diegnghtmr/roster-edge/issues)
- **Discussions**: [GitHub Discussions](https://github.com/diegnghtmr/roster-edge/discussions)
- **Email**: [Contact Form](https://github.com/diegnghtmr/roster-edge)

---

<div align="center">

**Made with ❤️ by the RosterEdge Community**

[⬆ Back to Top](#rosteredge)

</div>
