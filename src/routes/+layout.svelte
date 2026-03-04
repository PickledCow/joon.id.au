<script lang="ts">
	import '@skeletonlabs/skeleton-svelte'; 
	import '../app.css';
  import { enhance } from '$app/forms';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	import { MoonIcon, SunIcon } from '@lucide/svelte';

  import { onMount } from 'svelte';
  import { isDarkMode } from '$lib/stores';
  import type { SubmitFunction } from '@sveltejs/kit';
  
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
      isDarkMode.subscribe((value: boolean) => {
          localStorage.setItem('darkMode', value ? 'true' : 'false');
      });
    }
  });

  function toggleDarkMode() {
    isDarkMode.update((mode: boolean) => !mode);
  }

  $effect(() => {
    if (typeof document !== 'undefined') {
      if ($isDarkMode) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    }
  })

  const submitUpdateTheme: SubmitFunction  = ({ action }) => {
    const theme = action.searchParams.get('theme');

    if (theme) {
      if (theme === "dark" || theme === "light") {
        document.documentElement.setAttribute('data-theme', theme);
      }
    }
  };
	let { children } = $props();
</script>

<div class="text-red-500"></div>

<!-- Titlebar -->
<AppBar class="absolute top-0 left-0 w-full h-16
    flex items-center px-3 pl-8
    box-border bg-sky-700 border-b-[3px] border-b-sky-900
    z-2 gap-4
    transition-colors duration-300 ease-in-out

    dark:bg-sky-900
    dark:border-b-sky-950
">

  <AppBar.Toolbar class="flex w-full items-center justify-between grid-cols-[auto_1fr_auto] md:grid-cols-[auto_auto]">
    <AppBar.Lead>
      <a class="flex p-1 select-none
      text-4xl font-bold text-transparent
      bg-linear-to-r from-sky-500 to-blue-600
      bg-clip-text
      transition-[background,text-shadow] duration-300 ease-in-out
      hover:duration-300 hover:text-shadow-[0_0_16px_hsla(210,100%,50%,0.5)]
    " href="/">
        Joon Suh
      </a>
    </AppBar.Lead>
    <AppBar.Headline>
      <nav class="flex gap-x-[1em] text-left">
        <p>ar</p>
        <p>ar</p>
        <p>ar</p>
      </nav>
    </AppBar.Headline>
    <AppBar.Trail>
      <form method="POST" use:enhance={submitUpdateTheme}>
        <button class="theme-toggle noselect cursor-pointer p-3 rounded-lg hover:bg-[rgba(0,0,0,0.2)]" onclick={toggleDarkMode} formaction="/?/setTheme&theme={$isDarkMode ? "dark": "light"}" title="Toggle dark/light mode">
          {#if $isDarkMode}
            <MoonIcon class="stroke-sky-500 scale-150"> </MoonIcon>
          {:else}
            <SunIcon class="stroke-sky-400 scale-150"> </SunIcon>
          {/if}
        </button>
      </form>
    </AppBar.Trail>
  </AppBar.Toolbar>
</AppBar>




{@render children()}
