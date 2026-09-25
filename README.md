# 🗺️ Mappit - Indie Brand Discovery PWA

![PWA](https://img.shields.io/badge/PWA-Ready-purple?style=for-the-badge&logo=pwa)
![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

**Mappit** is a mobile-first Progressive Web Application (PWA) designed to help users graphically map and discover indie brands locally and globally. Built from the ground up without heavy frameworks, it utilizes modern web APIs, service workers, and vanilla Javascript to deliver a snappy, app-like native experience on both iOS and Android.

## ✨ The Vision
Current maps are saturated with chain stores and sponsored ads. Mappit solves this by providing a highly curated, aesthetic cartography experience where indie brands, boutiques, and lifestyle stores are the sole focus. 

## 🛠️ Tech Stack & Architecture
- **Frontend Architecture:** Vanilla JavaScript (ES6+), HTML5, CSS3.
- **Offline & Caching Backend:** Implements advanced Service Workers (`sw.js`) to cache map assets and application shells, allowing lightning-fast cold boots and offline capabilities.
- **Manifest:** Fully compliant Web App Manifest ensuring true PWA installability on mobile devices with standalone display modes.
- **Mobile-First Aesthetic:** Clean, neutral UI (`#f6f1e8` theme) optimized for portrait orientation.

## 🚀 Getting Started

Since Mappit is a pure native web app, no complicated build steps or Node.js servers are required.

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/YOUR_GITHUB/mappit.git
cd mappit

# 2. Serve the directory
# Examples:
# Use Python:
python -m http.server 8000
# Or use VS Code Live Server extension
```

Navigate to `http://localhost:8000` on your phone or browser, and select "Add to Home Screen" to see the full PWA experience!

## 🧠 Project Roadmap
- **Geo-location Hooks:** Implementing live proximity sorting based on the user's GPS data.
- **Mapbox API Integration:** Replacing static mapping with custom styled Mapbox GL layers.
- **Brand Parsing AI:** Scraping indie directories to automatically populate points of interest on the map.

---
*Mapping the underground, one brand at a time.*
