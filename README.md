# Graduation Ceremony Admin Dashboard

A modern admin dashboard for managing graduation ceremonies, built with React, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

- Real-time graduate display with name, order, and faculty information
- Progress tracking with total, called, and remaining graduates counter
- Call next graduate functionality
- Admin settings for configuring ceremony year and graduate order ranges
- Modern, responsive UI built with Tailwind CSS and shadcn/ui
- TypeScript for type safety and better developer experience

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm 7.x or later

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd graduation-ceremony
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
  ├── components/          # React components
  │   ├── GraduationDisplay.tsx
  │   ├── ProgressTracker.tsx
  │   └── AdminSettings.tsx
  ├── App.tsx             # Main application component
  └── index.css           # Global styles and Tailwind imports
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Backend Integration

This project is designed to work with Supabase for backend functionality. To integrate with Supabase:

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Add your Supabase URL and anon key to your environment variables
3. Update the API calls in the components to use Supabase client

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
