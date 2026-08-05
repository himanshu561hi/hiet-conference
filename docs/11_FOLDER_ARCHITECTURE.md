# Folder Architecture

## Client (Frontend)
```text
client/
├── public/                 # Static assets (favicons, etc.)
├── src/
│   ├── assets/             # Images, SVGs, etc.
│   ├── components/         # Reusable React components
│   │   ├── ui/             # Design System components (Buttons, Inputs)
│   │   └── common/         # Domain-specific reusable (e.g. Navbar, Footer)
│   ├── layouts/            # Page layouts (Public, Auth, Dashboard, Admin)
│   ├── pages/              # Route level components
│   ├── routes/             # React Router configuration
│   ├── hooks/              # Custom React Hooks
│   ├── services/           # API interaction (Axios)
│   ├── context/            # React Context Providers
│   ├── constants/          # Static data (Dropdown options, Error msgs)
│   ├── utils/              # Helper functions (Formatting, Validation)
│   ├── lib/                # Third-party library configs (Animations)
│   └── styles/             # Global CSS
└── vite.config.js          # Vite config (Aliases)
```

## Server (Backend)
```text
server/
├── config/                 # DB, Cloudinary config
├── controllers/            # Route logic / Request handling
├── models/                 # Mongoose DB Schemas
├── routes/                 # Express Router files
├── middlewares/            # Auth, Error handling, Multer
├── validators/             # Request payload validation (Zod/Joi)
├── services/               # Complex business logic
├── emails/                 # Email templates
├── uploads/                # Local temp storage (if needed)
├── utils/                  # Helpers (Token Gen, Password Hash)
└── logs/                   # Error logs
```
