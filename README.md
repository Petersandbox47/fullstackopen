# Full Stack Open

Exercises for the [Full Stack Open](https://fullstackopen.com/) course.

## Phonebook App (Part 3)

Backend deployed at: <!-- add your Render URL here after deploying -->

### Running locally

**Backend:**
```bash
cd part3/phonebook
npm run dev       # development (nodemon)
npm start         # production
```

**Frontend (dev mode with proxy):**
```bash
cd part2/phonebook
npm run dev
```

### Rebuilding and deploying

```bash
cd part3/phonebook
npm run build:ui   # build frontend and copy dist to backend
npm run deploy:full  # build + git commit + push (triggers Render auto-deploy)
```

### Render setup

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repository
3. Set the **Root Directory** to `part3/phonebook`
4. Build command: `npm install`
5. Start command: `node index.js`
