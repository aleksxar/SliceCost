# 3D Printing Cost Calculator

A user-friendly, responsive web application for calculating the total cost of 3D printing jobs. Features a modern interface, real-time calculations, and detailed cost breakdowns.

## Features

- **Job Input**: Enter filament weight (grams) and print time (hours/minutes)
- **Configurable Parameters**: Customize pricing for materials, labor, electricity, and markup
- **Real-time Calculations**: Instant cost updates as you modify inputs
- **Detailed Breakdown**: Itemized cost analysis with expandable details
- **Parameter Management**: Enable/disable cost components and edit values
- **Persistent Settings**: Parameters saved to localStorage
- **Print Support**: Print-friendly cost breakdown
- **Responsive Design**: Works on desktop and mobile devices
- **Accessibility**: Screen reader friendly with proper ARIA labels
- **Dark Mode**: High contrast interface for better visibility

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/3d-printing-calculator.git
cd 3d-printing-calculator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Running Tests

```bash
npm run test
```

For interactive test UI:
```bash
npm run test:ui
```

## Deployment to GitHub Pages

### Quick Deploy

1. Make sure you have the repository initialized and pushed to GitHub:
```bash
git add .
git commit -m "Prepare for GitHub Pages deployment"
git push origin main
```

2. Build and deploy:
```bash
npm run deploy
```

Your app will be available at: `https://yourusername.github.io/calc/`

### Note on Repository Name

If your repository is not named "calc", update the `base` value in `vite.config.ts` to match your repository name. For example, if your repo is named "my-calculator", change:
```typescript
base: '/calc/',
```
to:
```typescript
base: '/my-calculator/',
```

### First Time GitHub Pages Setup

1. Go to your repository on GitHub
2. Navigate to Settings → Pages
3. Under "Source", select "Deploy from a branch"
4. Choose "gh-pages" branch and "/ (root)" folder
5. Save

After the first deployment, running `npm run deploy` will automatically update your site.

## Usage

### Basic Calculation

1. Enter the filament weight in grams
2. Set the print time (hours and minutes)
3. View the calculated total cost

### Customizing Parameters

1. Click "Edit Parameters" to modify cost factors
2. Enable/disable parameters using checkboxes
3. Adjust values as needed
4. Click "Save" to apply changes
5. Use "Reset to Defaults" to restore original values

### Cost Breakdown

- Click "View detailed breakdown" to see itemized costs
- Use the print button to generate a printable receipt
- All calculations update in real-time

### G-code Upload (Coming Soon)

The "Open G-code" button is a placeholder for future functionality that will automatically extract filament weight and print time from G-code files.

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Sonner** - Toast notifications
- **Vitest** - Testing framework

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons provided by [Lucide](https://lucide.dev/)
- Built with [Vite](https://vitejs.dev/) and [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
