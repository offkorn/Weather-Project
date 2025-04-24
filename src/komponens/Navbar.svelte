<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores'; // Importáljuk a $page store-t
</script>

<!-- Navbar -->
<nav>
  <ul>
    <li>
      <button
        on:click={(e) => goto('/')}
        class="nav-button {($page.url.pathname === '/' ? 'active' : '')}"
      >
        Home
      </button>
    </li>
    <li>
      <button
        on:click={(e) => goto('/weather')}
        class="nav-button {($page.url.pathname === '/weather' ? 'active' : '')}"
      >
        Weather
      </button>
    </li>
    <li>
      <button
        on:click={(e) => goto('/facts')}
        class="nav-button {($page.url.pathname === '/facts' ? 'active' : '')}"
      >
        What to do
      </button>
    </li>
  </ul>
</nav>

<style>
  nav 
  {
    background-color: rgb(40, 54, 78);
    padding: 15px;
    font-size: 0px;
    color: white;
    border-radius: 13px;
    margin-right: 20px;
    margin-left: 20px;
    margin-top: 20px;
  }

  ul 
  {
    list-style-type: none;
    display: flex;
    justify-content: space-around;
  }

  li 
  {
    display: inline;
  }

  .nav-button 
  {
    background: none;
    border: none;
    color: rgb(159, 186, 236);
    font-size: 22px;
    cursor: pointer;
    padding: 10px 20px;
    transition: background-color 0.3s, color 0.3s;
  }

  .nav-button:hover 
  {
    color: wheat;
  }

  
  .nav-button.active 
  {
    color: wheat;
  }


</style>