# ITnightInsight

A real-time tracking platform for Nuit d'Info 2025 teams and challenges.

## Project Overview

ITnightInsight is a web application designed to track and display teams, challenges, and participant data during the Nuit d'Info coding competition.

## Development

### Local Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your API configuration:
```
VITE_API_BASE_URL=your_api_url_here
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:8080 to view the app

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Features

- Real-time team tracking with auto-refresh every 10 seconds
- Challenge details and participating teams
- Team profiles with member information
- Lazy loading for optimal performance
- Responsive design with accessibility features

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library
- **Icons**: Lucide React

## API Integration

The app consumes the following endpoints:
- `/teams-principal` - List of all teams
- `/team/:id` - Individual team details
- `/challenge/:id` - Challenge information

## Contributing

This is a project for Nuit d'Info 2025. For any questions or contributions, please contact the development team.
