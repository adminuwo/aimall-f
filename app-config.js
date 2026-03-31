/**
 * AI-Mall™ Frontend Configuration
 * Switched to LOCALHOST mode for development.
 */

// --- LIVE BACKEND (Commented out) ---
// window.AI_MALL_CONFIG = { API_BASE_URL: 'https://aimall-b-246449377479.asia-south1.run.app' };

// --- LOCALHOST (Active) ---
window.AI_MALL_CONFIG = { API_BASE_URL: 'http://localhost:8080' };

console.log('🏠 AI-Mall Localhost Config Active:', window.AI_MALL_CONFIG.API_BASE_URL);
