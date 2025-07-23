# Identity Reconciliation Service

This is a structured backend service for the Identity Reconciliation task, built with Node.js, Express, and Sequelize.

## Project Structure

The project follows a standard structure to separate concerns:

- `src/config`: Database configuration.
- `src/models`: Sequelize data models.
- `src/services`: Core business logic.
- `src/controllers`: Request/response handlers.
- `src/routes`: API route definitions.

---

## Live API Endpoint

The `/identify` endpoint is hosted on Render and is publicly accessible.

**Live URL:** ` https://bitespeed-identity-reconciliation-yskz.onrender.com`

### `POST /identify`

This endpoint identifies a user and returns a consolidated contact profile.

**Example `curl` Request:**

```bash

curl -X POST  https://bitespeed-identity-reconciliation-yskz.onrender.com/identify \
-H "Content-Type: application/json" \
-d '{
  "email": "mcfly@hillvalley.edu",
  "phoneNumber": "112233"
}'
```

---

## Local Setup

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Set up a PostgreSQL database and create a `.env` file with your credentials.
4.  Run the server in development mode: `npm run dev`
