<script lang="ts">
  import { onMount } from 'svelte';
  import { setupCanvas } from '$lib/canvasBackground';
  import { isDarkMode } from '$lib/stores';
  import { enhance } from '$app/forms';
  import type { SubmitFunction } from '@sveltejs/kit';

  let canvas: HTMLCanvasElement;

  onMount(() => {
    // If localStorage has a saved dark mode preference, apply it
    if (typeof localStorage !== 'undefined') {
      const savedDarkMode = localStorage.getItem('darkMode');
      if (savedDarkMode === 'true') {
        isDarkMode.set(true);
      } else if (savedDarkMode === 'false') {
        isDarkMode.set(false);
      }
    }

    // Sync dark mode state with localStorage
    if (typeof localStorage !== 'undefined') {
      isDarkMode.subscribe(value => {
          localStorage.setItem('darkMode', value ? 'true' : 'false');
          console.log(localStorage.getItem('darkMode'));
      });
    }

    // Initialize the canvas background effect when the component mounts
    
    return setupCanvas(canvas);
  });

  function toggleDarkMode() {
    isDarkMode.update(mode => !mode);
  }

  $: if (typeof document !== 'undefined') {
    if ($isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  const submitUpdateTheme: SubmitFunction  = ({ action }) => {
    const theme = action.searchParams.get('theme');

    if (theme) {
      if (theme === "dark" || theme === "light") {
        console.log(theme);
        document.documentElement.setAttribute('data-theme', theme);
      }
    }
  };

</script>

<svelte:head>
  <title>Joon Suh</title>
</svelte:head>

<canvas bind:this={canvas} class="bg-canvas"></canvas>

<div class="toolbar">
  <a class="logo" href="/">
    <p class="logo-name">Joon Suh</p>
  </a>
  <div class="toolbar-spacer"></div>

  <form method="POST" use:enhance={submitUpdateTheme}>
    <button class="theme-toggle" on:click={toggleDarkMode} formaction="/?/setTheme&theme={$isDarkMode ? "dark": "light"}" title="Toggle dark/light mode">
      {#if $isDarkMode}
        🌙
      {:else}
        ☀️
      {/if}
    </button>
  </form>
</div>


<div class="mainbox">
  <h1 class="text-4xl font-bold mb-4">Joon Suh</h1>
  <p class="text-lg mb-2">Hello!</p>
  <p class="text-lg mb-2">Welcome to my website. This place will act as part portfolio and part random stuff I think of.</p>
  <p class="text-lg mb-2">It's pretty lonely here right now, but perhaps one day there will actually be more content.</p>
</div>

<style lang="postcss">
  /* full‑screen canvas background */
  .bg-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    display: block;
    background-color: hsl(210, 50%, 95%);
    transition: background-color 0.3s ease;
  }

  :global(body.dark-mode) .bg-canvas {
    background-color: hsl(210, 33%, 15%);
  }

  /* toolbar at the top of the screen */
  .toolbar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 64px;
    display: flex;
    align-items: center;
    padding: 8px 12px 8px 32px;
    box-sizing: border-box;
    background-color: hsla(213, 100%, 50%, 0.1);
    border-bottom: 3px solid rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(4px);
    z-index: 2;
    gap: 1rem;
    transition: background-color 0.3s ease, border-color 0.3s ease;
  }

  :global(body.dark-mode) .toolbar {
    background-color: hsla(213, 100%, 50%, 0.05);
    border-color: rgba(0, 0, 0, 0.25);
  }

  .toolbar-spacer {
    flex: 1;
  }

  .theme-toggle {
    background: none;
    border: none;
    font-size: 1.75rem;
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    transition: background-color 0.2s ease;
  }

  .theme-toggle:hover {
    background-color: rgba(0, 0, 0, 0.1);
    transition: background-color 0.2s ease;
  }

  :global(body.dark-mode) .theme-toggle:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
  
  /* logo in the toolbar */
  .logo {
  }

  .logo-name {
    font-size: 2.25rem;
    font-weight: bold;
    font: "Comic Sans MS", cursive, sans-serif;
    background: linear-gradient(90deg, hsl(200, 100%, 50%), hsl(220, 100%, 50%));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: background 2s ease;
  }

  .logo-name:hover {
    font-size: 2.25rem;
    font-weight: bold;
    font: "Comic Sans MS", cursive, sans-serif;
    background: linear-gradient(90deg,  hsl(220, 100%, 60%), hsl(200, 100%, 60%));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  /* main content box in the centre of the screen */
  .mainbox {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: rgb(0, 0, 0);
    background-color: rgba(255, 255, 255, 0.05);
    padding: 10px;
    border: 3px solid rgba(255, 255, 255, 0.25);
    border-radius: 10px;
    backdrop-filter: blur(2px);
    z-index: 1;
    transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
  }

  :global(body.dark-mode) .mainbox {
    color: rgb(255, 255, 255);
    background-color: rgba(0, 0, 0, 0.3);
    border-color: rgba(0, 0, 0, 0.5);
  }


</style>
