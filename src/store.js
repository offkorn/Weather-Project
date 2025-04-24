// store.js
import { writable } from 'svelte/store';

export const weatherStore = writable(null);
export const savedCities = writable([]); 
export const location = writable({ lat: null, lon: null });
export const preferences = writable({
    unit: 'metric',
  });
  
  // Hibakeresés
  preferences.subscribe(value => {
    console.log("Preferences store updated:", value);
  });