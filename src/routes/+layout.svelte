<script lang="ts">
  import "../app.css";
  import { enhance } from "$app/forms";
  import { page } from "$app/state";
  import { AppBar } from "@skeletonlabs/skeleton-svelte";
  import { MoonIcon, SunIcon, MenuIcon } from "@lucide/svelte";

  import { onMount } from "svelte";
  import { isDarkMode } from "$lib/stores";
  import type { SubmitFunction } from "@sveltejs/kit";

  onMount(() => {
    if (typeof localStorage !== "undefined") {
      const savedDarkMode = localStorage.getItem("darkMode");

      if (savedDarkMode === "true") {
        isDarkMode.set(true);
      } else if (savedDarkMode === "false") {
        isDarkMode.set(false);
      }

      return isDarkMode.subscribe((value: boolean) => {
        localStorage.setItem("darkMode", value ? "true" : "false");
      });
    }
  });

  function toggleDarkMode() {
    isDarkMode.update((mode: boolean) => !mode);
  }

  $effect(() => {
    if (typeof document !== "undefined") {
      if ($isDarkMode) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    }
  });

  const submitUpdateTheme: SubmitFunction = ({ action }) => {
    const theme = action.searchParams.get("theme");

    if (theme) {
      if (theme === "dark" || theme === "light") {
        document.documentElement.setAttribute("data-theme", theme);
      }
    }
  };
  let { children } = $props();

  let menuOpened: boolean = $state(false);
</script>

<!-- Style -->
<svelte:head>
  <!-- <link rel="stylesheet" href="/css/typography.css" /> -->
</svelte:head>

<!-- Titlebar -->
<AppBar class="site-header">
  <AppBar.Toolbar class="site-header-toolbar">
    <button
      class="mobile-menu-button"
      onclick={() => (menuOpened = !menuOpened)}
    >
      <MenuIcon />
    </button>

    <AppBar.Lead>
      <a class="site-logo" href="/"> Joon Suh </a>
    </AppBar.Lead>

    <AppBar.Headline class="site-nav">
      <a href="/" class:active={page.url.pathname === "/"}> Home </a>

      <a
        href="/projects"
        class:active={page.url.pathname.startsWith("/projects")}
      >
        Projects
      </a>

      <a href="/blog" class:active={page.url.pathname.startsWith("/blog")}>
        Blog
      </a>
    </AppBar.Headline>

    <AppBar.Trail>
      <form method="POST" use:enhance={submitUpdateTheme}>
        <button
          class="theme-toggle"
          onclick={toggleDarkMode}
          formaction="/?/setTheme&theme={$isDarkMode ? 'dark' : 'light'}"
          title="Toggle dark/light mode"
        >
          {#if $isDarkMode}
            <MoonIcon />
          {:else}
            <SunIcon />
          {/if}
        </button>
      </form>
    </AppBar.Trail>
  </AppBar.Toolbar>
</AppBar>

<!-- Mobile Menu -->
{#if menuOpened}
  <div
    class="mobile-menu flex md:hidden absolute top-0 left-0 w-sm h-full flex-col z-10
    bg-gray-400/3 backdrop-blur-sm dark:bg-gray-600/30
    border-r-3 border-gray-500/25
    transition-colors duration-300 ease-in-out
    text-sky-950 dark:text-sky-200
  "
  >
    <button
      class="h-16
      border-b-3 border-b-sky-900 dark:border-b-sky-950
      backdrop-blur-sm bg-sky-700 dark:bg-sky-900
      text-center items-center
      transition-colors duration-300 ease-in-out
    "
      onclick={() => (menuOpened = !menuOpened)}
    >
      <div
        class="flex select-none text-center
        text-4xl font-bold text-transparent
        bg-linear-to-r from-sky-500 to-blue-600
        h-16 p-2 px-8 bg-clip-text drop-shadow-2xl
        transition-[background,text-shadow] duration-300 ease-in-out
        hover:duration-300 hover:text-shadow-[0_0_16px_hsla(210,100%,50%,0.5)]
      "
      >
        Navigation
      </div>
    </button>
    <div class="p-4 gap-2 flex flex-col">
      <a
        href="/"
        class="text-lg drop-shadow-md select-none"
        class:border-b-2={page.url.pathname === "/"}
        class:border-sky-400={page.url.pathname === "/"}
        onclick={() => (menuOpened = false)}
      >
        Home
      </a>
      <a
        href="/projects"
        class="text-lg drop-shadow-md select-none"
        class:border-b-2={page.url.pathname.startsWith("/projects")}
        class:border-sky-400={page.url.pathname.startsWith("/projects")}
        onclick={() => (menuOpened = false)}
      >
        Projects
      </a>
      <a
        href="/test"
        class="text-lg drop-shadow-md select-none"
        class:border-b-2={page.url.pathname.startsWith("/test")}
        class:border-sky-400={page.url.pathname.startsWith("/test")}
        onclick={() => (menuOpened = false)}
      >
        Test
      </a>
    </div>
  </div>
{/if}

{@render children()}
