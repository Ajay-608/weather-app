# WeatherAI — Full Stack Weather App
### Built by Ajay Dammalapati | PM Accelerator AI Engineer Intern Assessment

---

## 🌤️ Overview
A premium full-stack weather application built with React.js (frontend) and Django (backend) that provides real-time weather data, 5-day forecasts, interactive maps, and full CRUD functionality with data export.

---

## 🚀 Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React.js + Vite + CSS |
| Backend | Django + Django REST Framework |
| Database | SQLite |
| Weather API | OpenWeatherMap |
| Maps | Leaflet.js (OpenStreetMap) |

---

## ✅ Features
- 🔍 Search by city, ZIP code, landmark, or coordinates
- 📍 Auto-detect current location via GPS
- 🌡️ Real-time weather with full details
- 📅 5-day forecast
- 🗺️ Interactive map view
- 📋 Search history with full CRUD (Create, Read, Update, Delete)
- 📤 Export data as JSON, CSV, XML
- 📱 Fully responsive design
- 🎨 Dynamic backgrounds based on weather conditions
- ⚠️ Full error handling

---

## 🛠️ How to Run

### Prerequisites
- Node.js v18+
- Python 3.10+
- OpenWeatherMap API Key

### Backend Setup
```bash
cd backend
pip install django djangorestframework django-cors-headers requests
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```
Backend runs at: http://localhost:8000

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: http://localhost:5173

---

## 📡 API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/weather/current/ | Get current weather |
| GET | /api/weather/forecast/ | Get 5-day forecast |
| GET | /api/weather/searches/ | Get all saved searches |
| POST | /api/weather/searches/ | Save a search |
| PATCH | /api/weather/searches/{id}/ | Update a search |
| DELETE | /api/weather/searches/{id}/ | Delete a search |
| GET | /api/weather/searches/export_json/ | Export as JSON |
| GET | /api/weather/searches/export_csv/ | Export as CSV |
| GET | /api/weather/searches/export_xml/ | Export as XML |

---

