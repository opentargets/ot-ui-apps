# Environment Variables

Environment variables are now managed at the project root level and will be automatically loaded by the Platform app.

## Setup

1. Create a `.env.local` file in the project root:
```bash
OT_API_URL=http://localhost:8080
OT_AI_API_URL=http://localhost:8081
VITE_GOOGLE_TAG_MANAGER_ID=
VITE_GENETICS_PORTAL_URL=https://genetics.opentargets.org
OT_PROFILE=platform
```

2. Run the development server:
```bash
yarn dev:platform
```

The Vite config has been updated to load environment variables from the project root, so they will work in both dev and build modes.

## Available Variables

- `OT_API_URL` - Main API endpoint
- `OT_AI_API_URL` - AI API endpoint  
- `VITE_GOOGLE_TAG_MANAGER_ID` - Google Analytics ID
- `VITE_GENETICS_PORTAL_URL` - Genetics portal URL
- `OT_PROFILE` - Profile configuration

## Priority Order

1. Window globals (for deployment overrides)
2. Environment variables (from .env files)
3. Default values (hardcoded fallbacks)
