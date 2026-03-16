## Placement Preparation and Interview Tracking System — Backend (Flask + MySQL)

### 1) Setup (Windows PowerShell)

Create a virtualenv and install deps:

```bash
cd D:\placement-app\placement-app\backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

### 2) Create MySQL DB + tables

Run the schema:

```sql
SOURCE D:/placement-app/placement-app/backend/schema.sql;
```

Or from command line:

```bash
mysql -u root -p < schema.sql
```

### 3) Configure environment variables

Set these (example values shown):

- `PORT` (default `5000`)
- `CLIENT_ORIGIN` = `http://localhost:5173`
- `JWT_SECRET_KEY`
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`

PowerShell example:

```powershell
$env:DB_HOST="localhost"
$env:DB_USER="root"
$env:DB_PASSWORD="your_password"
$env:DB_NAME="placement_app"
$env:JWT_SECRET_KEY="change-me"
```

### 4) Create an admin user

This backend authenticates admins against a `users` row with `role='admin'`.
Create one by inserting a row (password must be **bcrypt** hashed).

Quick way: temporarily register a student via `/api/register`, then update that row in MySQL:

```sql
UPDATE users SET role='admin' WHERE email='admin@college.edu';
```

### 5) Run the server

```bash
python app.py
```

Server runs at `http://localhost:5000` and the React app should call APIs at `http://localhost:5000/api`.

### API quick check

- `GET /api/health`


