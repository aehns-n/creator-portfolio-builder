# Backend Auth & DB Production Fix - TODO

## Approved Plan Steps:

### Phase 1: Database Config [1]
- [✅] **1.1** Edit `app/database.py` - DATABASE_URL = os.getenv or SQLite fallback, PG support
- [✅] **1.2** Edit `app/main.py` - models.Base.metadata.create_all(bind=engine)

### Phase 2: Production Requirements [2]
- [✅] **2.1** Edit `requirements.txt` - Add psycopg2-binary for PostgreSQL

### Phase 3: Git Ignore [3]
- [✅] **3.1** Create `.gitignore` - *.db, __pycache__, .env

### Phase 4: Deploy [4]
- [ ] **4.1** Render: Add PostgreSQL add-on, DATABASE_URL env
- [ ] **4.2** Test signup/login on Render
- [ ] **4.3** Complete

**Progress: Phase 1 Starting**

