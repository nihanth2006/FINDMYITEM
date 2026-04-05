# Deploy on Render

This project can be deployed fully on Render's free tier for demo use.

## What you are deploying

- `findmyitem-api`: Express backend from `server/server.js`
- `findmyitem-web`: React frontend from the root project

## Important limitation

The backend stores data in:

- `server/data/db.json`
- `server/uploads/`

On Render free, local files are not permanent across redeploys or restarts. The app is fine for demos, but uploaded images and saved data may be lost later.

## Option 1: Blueprint deploy

1. Push this repo to GitHub.
2. Open Render.
3. Choose `New +` -> `Blueprint`.
4. Select this repository.
5. Render will read `render.yaml` and create:
   - one `Web Service` for the backend
   - one `Static Site` for the frontend
6. Deploy both services.

## Option 2: Manual deploy

### Backend service

Create a `Web Service` with:

- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`

Environment variables:

- `JWT_SECRET`: set a long random string

After deploy, copy the backend URL. It will look like:

`https://findmyitem-api.onrender.com`

### Frontend service

Create a `Static Site` with:

- Root Directory: project root
- Build Command: `npm install && npm run build`
- Publish Directory: `build`

Environment variables:

- `REACT_APP_API_URL`: your backend URL, for example `https://findmyitem-api.onrender.com`

Add a rewrite rule:

- Source: `/*`
- Destination: `/index.html`
- Action: `Rewrite`

## First login

Current default admin login is:

- Username: `admin`
- Password: `admin123`

You should change this before real use.

## Recommended next improvements

1. Move item data from `db.json` to a real database like Supabase Postgres.
2. Move uploaded images from local disk to Cloudinary or Supabase Storage.
3. Replace the default admin credentials and keep `JWT_SECRET` only in environment variables.
