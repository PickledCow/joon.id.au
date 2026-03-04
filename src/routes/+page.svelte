<script lang="ts">
  import { onMount } from 'svelte';
  import { setupCanvas } from '$lib/canvasBackground';
  import { isDarkMode } from '$lib/stores';
  import { enhance } from '$app/forms';
  import { eatRockNative } from '$lib/eatRock';
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
        document.documentElement.setAttribute('data-theme', theme);
      }
    }
  };

  const eatRock = (rock: HTMLElement) => {
    window.location.href = eatRockNative(eatRockNative(eatRockNative(rock.getAttribute('class')?.split(' ')[0] || '')));
  }

</script>

<svelte:head>
  <title>Joon Suh's epic site</title>
</svelte:head>

<canvas bind:this={canvas} class="bg-canvas"></canvas>

<div class="toolbar">
  <a class="logo" href="/">
    <p class="logo-name noselect">Joon Suh</p>
  </a>
  <div class="toolbar-spacer"></div>

  <form method="POST" use:enhance={submitUpdateTheme}>
    <button class="theme-toggle noselect" on:click={toggleDarkMode} formaction="/?/setTheme&theme={$isDarkMode ? "dark": "light"}" title="Toggle dark/light mode">
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
  <p class="text-lg mb-2">Hello! Welcome to my website. This place will act as my portfolio and some other random stuff.</p>
  <p class="text-lg mb-2">It's pretty lonely here right now, but perhaps one day there will actually be more content.</p>
  <p class="text-lg mb-2">You can contact me at
    <button class="WWxkR2NHSklVblpQYlU1MlltNVNhRmt6VWtGaGJUbDJZbWsxY0ZwRE5XaGtVVDA5" on:click={(e) => eatRock(e.currentTarget as HTMLElement)}>
      contact
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="rgb(0, 132, 255)" class="w-4 h-4 -mx-[0.03em] translate-y-2" data-astro-cid-j7pv25f6="">
        <path d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" data-astro-cid-j7pv25f6=""></path> 
      </svg>
      joon.id.au
    </button>.
  </p>
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

  .noselect {
    -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
        -moz-user-select: none;
          -ms-user-select: none;
              user-select: none;
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
    border: 3px solid rgba(104, 104, 104, 0.25);
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

  .WWxkR2NHSklVblpQYlU1MlltNVNhRmt6VWtGaGJUbDJZbWsxY0ZwRE5XaGtVVDA5 {
    display: inline-flex;
    font-weight: bold;
    font: "Comic Sans MS", cursive, sans-serif;
    background: linear-gradient(90deg, hsl(200, 100%, 50%), hsl(220, 100%, 50%));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: background 2s ease;
  }
  
  
</style>
