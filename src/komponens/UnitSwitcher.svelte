<script>
    import { preferences } from '../store.js';
    let unit = $preferences.unit || 'metric';   // alapertelmezett ertek

    function setUnit(newUnit) {
        preferences.set({ unit: newUnit });
    }
</script>

<div class="unit-switcher">
    <label>
        <input type="radio" name="unit" value="metric" bind:group={unit} on:change={() => setUnit('metric')} />
        Metric
    </label>
    <label>
        <input type="radio" name="unit" value="imperial" bind:group={unit} on:change={() => setUnit('imperial')} />
        Imperial
    </label>
</div>

<style>
    .unit-switcher 
    {
        margin-top: 30px;
    }

    label 
    {
        color: white;
        font-size: 16px;
        margin: 5px 10px;
        display: inline-block;
    }


</style>