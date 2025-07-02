# URL Shortener

A simple URL shortening service with analytics built with Node.js/Express backend and vanilla JavaScript frontend example.

## Features

- Shorten long URLs into compact links
- Track visit analytics for shortened URLs

## Setup

### Backend

1. Install dependencies:

```bash
cd backend
npm install
```

2. Start the server:

```bash
npm start
```

The backend runs on `http://localhost:3000`

### Frontend

1. Open `frontend/index.html` in your browser, or serve it locally:

```bash
cd frontend
npx http-server -p 8000
```

2. Open `http://localhost:8000` in your browser

## Usage

1. Enter a long URL in the input field
2. Click "Shorten" to generate a short link
3. Copy the shortened URL using the copy button
4. View analytics by clicking "Update Analytics"

## API Endpoints

- `POST /shorten` - Create shortened URL
- `GET /:short_code` - Redirect to original URL
- `GET /analytics/:short_code` - Get visit analytics

## Credits

- Project by KemJiga
- Inspired by open-source URL shortener projects

## License

This project is licensed under the MIT License.  
See the [LICENSE](./LICENSE) file for details.
