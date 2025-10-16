# Development Mode - Fast Country-Specific Development

This document explains the new development mode that allows you to work with only specific countries' data for faster development.

## Problem Solved

Previously, during development, the application would fetch and cache ALL data from Filebrowser, which could take a very long time and slow down development. Now you can work with just one country's data for much faster iteration.

## Usage

### Quick Start

```bash
# Work with Australia data only (fastest)
npm run dev:australia

# Work with India data only
npm run dev:india

# Work with Singapore data only
npm run dev:singapore

# Work with Germany data only
npm run dev:germany

# Work with UK data only
npm run dev:uk

# Work with ALL countries (slower, like before)
npm run dev:all
```

### Manual Usage

You can also use the dev.js script directly:

```bash
# Set development mode with Australia filter
node dev.js development australia

# Set development mode with India filter
node dev.js development india

# Set development mode without filter (all countries)
node dev.js development

# Switch back to production mode
node dev.js production
```

## How It Works

1. **Environment Variable**: The script sets `DEV_COUNTRY_FILTER` in `.env.local`
2. **File Filtering**: The Filebrowser client filters CSV files to only include those matching the country name
3. **Caching**: Different cache keys are used for filtered vs unfiltered data
4. **Production Safety**: Production builds always load all countries regardless of the filter

## Benefits

- **Faster Development**: Only load data for the country you're working on
- **Reduced API Calls**: Fewer Filebrowser API requests during development
- **Faster Caching**: Less data to cache and process
- **Production Unaffected**: Production builds always use all data
- **Easy Switching**: Simple commands to switch between countries

## Examples

### Working on Australia Features
```bash
npm run dev:australia
# Now only Australia CSV files will be loaded
# Much faster development experience
```

### Working on India Features
```bash
npm run dev:india
# Now only India CSV files will be loaded
```

### Testing All Countries
```bash
npm run dev:all
# Loads all countries (slower but complete)
```

### Building for Production
```bash
npm run build
# Automatically switches to production mode and loads all countries
```

## Technical Details

- The filter works by checking if the CSV file path contains the country name
- Different cache keys prevent conflicts between filtered and unfiltered data
- The filter is completely bypassed in production builds
- Environment variables are automatically managed by the dev.js script

## Troubleshooting

If you encounter issues:

1. **No data loading**: Make sure the country name matches the CSV file structure
2. **Cache issues**: Clear your browser cache or restart the dev server
3. **Wrong country**: Use `node dev.js production` then `node dev.js development [country]` to reset

## File Structure

The system expects CSV files to be organized like:
```
/rollthepay/
├── oceania/
│   └── australia.csv
├── asia/
│   ├── india.csv
│   └── singapore.csv
├── europe/
│   ├── germany.csv
│   └── uk.csv
└── ...
```

The filter will match any file path containing the country name (case-insensitive).
