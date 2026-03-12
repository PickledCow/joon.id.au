<script lang="ts">
	import '@skeletonlabs/skeleton-svelte'; 
	import '../app.css';
  import { enhance } from '$app/forms';
  import { page } from '$app/state';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	import { MoonIcon, SunIcon, MenuIcon } from '@lucide/svelte';

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

  let menuOpened: boolean = $state(false);

</script>

<!-- Titlebar -->
<AppBar class="absolute top-0 left-0 w-full h-16
    flex items-center px-3 pl-8
    box-border border-b-[3px] 
    z-2 gap-4
    transition-colors duration-300 ease-in-out
    bg-sky-700 dark:bg-sky-900
    border-b-sky-900 dark:border-b-sky-950
">

  <AppBar.Toolbar class="grid w-full items-center grid-cols-[auto_1fr_auto] gap-x-4">

    <!-- Mobile Menu Button -->
    <button class="md:hidden" onclick={() => menuOpened = !menuOpened}>
      <MenuIcon class="stroke-sky-500 scale-150"></MenuIcon>
    </button>

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

    <!-- Desktop Menu -->
    <AppBar.Headline class="hidden md:flex gap-4 justify-self-start">
      <a href="/" class="btn-md text-xl select-none" 
        class:border-b-2={page.url.pathname === "/"} 
        class:border-sky-200={page.url.pathname === "/"}
        class:text-sky-200={page.url.pathname === "/"}
        class:text-sky-50={page.url.pathname !== "/"}
      >
        Home
      </a>
      <a href="/projects" class="btn-md text-xl select-none" 
        class:border-b-2={page.url.pathname.startsWith("/projects")} 
        class:border-sky-200={page.url.pathname.startsWith("/projects")}
        class:text-sky-200={page.url.pathname.startsWith("/projects")}
        class:text-sky-50={!page.url.pathname.startsWith("/projects")}
      >
        Projects
      </a>
      <a href="/test" class="btn-md text-xl select-none" 
        class:border-b-2={page.url.pathname.startsWith("/test")} 
        class:border-sky-200={page.url.pathname.startsWith("/test")}
        class:text-sky-200={page.url.pathname.startsWith("/test")}
        class:text-sky-50={!page.url.pathname.startsWith("/test")}
      >
        Test
      </a>
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

<!-- Mobile Menu -->
{#if menuOpened}
  <div class="mobile-menu flex md:hidden absolute top-0 left-0 w-sm h-full flex-col z-10
    bg-gray-400/3 backdrop-blur-sm dark:bg-gray-600/30
    border-r-3 border-gray-500/25
    transition-colors duration-300 ease-in-out
    text-sky-950 dark:text-sky-200
  ">
    <button class="h-16 
      border-b-3 border-b-sky-900 dark:border-b-sky-950
      backdrop-blur-sm bg-sky-700 dark:bg-sky-900
      text-center items-center
      transition-colors duration-300 ease-in-out
    " onclick={() => menuOpened = !menuOpened}>
      <div class="flex select-none text-center
        text-4xl font-bold text-transparent
        bg-linear-to-r from-sky-500 to-blue-600
        h-16 p-2 px-8 bg-clip-text drop-shadow-2xl
        transition-[background,text-shadow] duration-300 ease-in-out
        hover:duration-300 hover:text-shadow-[0_0_16px_hsla(210,100%,50%,0.5)]
      ">
        Navigation
      </div>
    </button>
    <div class="p-4 gap-2 flex flex-col ">
      <a href="/" class="text-lg drop-shadow-md select-none" 
        class:border-b-2={page.url.pathname === "/"} 
        class:border-sky-400={page.url.pathname === "/"}
        onclick={() => menuOpened = false}
      >
        Home
      </a>
        <a href="/projects" class="text-lg drop-shadow-md select-none" 
          class:border-b-2={page.url.pathname.startsWith("/projects")} 
          class:border-sky-400={page.url.pathname.startsWith("/projects")}
        onclick={() => menuOpened = false}
        >
          Projects
        </a>
        <a href="/test" class="text-lg drop-shadow-md select-none" 
          class:border-b-2={page.url.pathname.startsWith("/test")} 
          class:border-sky-400={page.url.pathname.startsWith("/test")}
        onclick={() => menuOpened = false}
        >
          Test
        </a>

    </div>
  </div>
{/if}

{@render children()}
