# Pulse Manga - Important Configurations

**Created:** 2025-12-29  
**Purpose:** Backup of essential configurations and keys for frontend rebuild

---

## Firebase Configuration

```javascript
export const CONFIG = {
  firebase: {
    apiKey: "AIzaSyCjrr7PseOZgerNqZdXQ-kbIMGdH1HoA04",
    authDomain: "pulse-manga-vault.firebaseapp.com",
    projectId: "pulse-manga-vault",
    storageBucket: "pulse-manga-vault.firebasestorage.app",
    messagingSenderId: "101746697024",
    appId: "1:101746697024:web:82bc621b8b4450166d90a5",
  },
  mangadex: {
    apiUrl: "https://api.mangadex.org",
  },
  wordpress: {
    // Current dev backend
    apiUrl: "https://dev-pulse-manga.pantheonsite.io/wp-json",
  },
};
```

---

## Project Information

- **Project Name:** Pulse Manga
- **Firebase Project:** pulse-manga-vault
- **Backend:** WordPress (Dev environment)
- **API Source:** MangaDex

---

## Notes for Rebuild

1. **Firebase Auth:** Already configured with the above credentials
2. **MangaDex API:** Used for manga data and images
3. **WordPress Backend:** Dev backend at pantheonsite.io
4. **Authentication Methods:** Email/Password, Gmail, and other email services (no temporary emails)

---

## Additional Resources

- Original frontend code is backed up in a ZIP file
- Reference the ZIP for component implementations if needed
- Branding details will be extracted next
