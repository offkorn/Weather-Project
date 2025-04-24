<script>
  import { onMount } from 'svelte';
  import Navbar from '../../komponens/Navbar.svelte';
  import { location } from '../../store.js'; 
  import ActivityCard from '../../komponens/ActivityCard.svelte';

  let activity = null;
  let lat, lon;

  // Aktivitás ajánlás lekérése 
  async function fetchActivity() 
  {
      console.log("Fetching activity for lat:", lat, "lon:", lon);  // debug log
      try {
          const response = await fetch(`http://localhost:3000/activity/recommend?lat=${lat}&lon=${lon}`);
          if (!response.ok) throw new Error("Nem sikerült lekérni az aktivitást!");
          const data = await response.json();
          
          // az aktivitás hozzáadása
          activity = data.activity;
          
          console.log("Activity:", activity); 
      } catch (error) {
          console.error("Hiba történt az aktivitás lekérésekor:", error);
          activity = "Nem sikerült aktivitást lekérni.";
      }
  }

  
  onMount(() => {
      const unsubscribe = location.subscribe(({ lat: newLat, lon: newLon }) => {
          console.log("location updated:", newLat, newLon);  
          lat = newLat;
          lon = newLon;
          if (lat && lon) {
              console.log("Calling fetchActivity...");
              fetchActivity(); 
          }
      });
      
      return () => unsubscribe();
  });
</script>

<Navbar />

<div>
    <h1>Recommended Activities For Today</h1>
    {#if activity}
        <ActivityCard {activity} />
    {:else}
        <p>Loading...</p>
    {/if}
  </div>
  

  <style>

 
  div 
  {
      text-align: center;
  }

    
  p 
  {
      color: #666;
  }

  h1
  {
    padding: 20px;
    color: white;
  }
</style>
