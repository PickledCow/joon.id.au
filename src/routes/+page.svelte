<script lang="ts">
  import { onMount } from 'svelte';
  import { setupCanvas } from '$lib/gridBg/canvasBackground';
  import { eatRockNative } from '$lib/eatRock';

  let canvas: HTMLCanvasElement;

  onMount(() => {
    // Initialize the canvas background effect when the component mounts
    return setupCanvas(canvas);
  });
  
  const eatRock = (rock: HTMLElement) => {
    window.location.href = eatRockNative(eatRockNative(eatRockNative((rock.getAttribute('class')?.split(' ')[0] || '') + (rock.getAttribute('id')?.split(' ')[0] || ''))));
  }


</script>

<svelte:head>
  <title>Joon Suh's epic site</title>
</svelte:head>

<!-- Background -->
<canvas bind:this={canvas} class="absolute top-0 left-0 w-screen h-screen block theme-bg"></canvas>

<!-- Card -->
<div class="card
    absolute top-1/2 left-1/2 w-4xl
    -translate-x-1/2 -translate-y-1/2
    text-center text-black p-2.5
    bg-white/5 backdrop-blur-[2px]
    border-[3px] border-[rgba(104,104,104,0.25)] rounded-[10px]
    z-1
    transition-colors duration-300 ease-in-out
    dark:text-white dark:bg-black/30 dark:border-[rgba(0,0,0,0.5)]
  "
>
  <h1 class="text-4xl font-bold mb-4">Joon Suh</h1>
  <p class="text-lg mb-2">Hello! Welcome to my website. This place will act as my portfolio and some other random stuff.</p>
  <p class="text-lg mb-2">It's pretty lonely here right now, but perhaps one day there will actually be more content.</p>
  <p class="text-lg mb-2">You can contact me at
    <button id="Rmt6VWtGaGJUbDJZbWsxY0ZwRE5XaGtVVDA5" class="WWxkR2NHSklVblpQYlU1MlltNVNh inline-flex
      font-bold text-transparent
      bg-linear-to-r from-sky-500 to-blue-600 bg-clip-text
      transition-[background,text-shadow] duration-300 ease-in-out
      hover:duration-300 hover:text-shadow-[0_0_16px_hsla(210,100%,50%,0.5)]
    " on:click={(e) => eatRock(e.currentTarget as HTMLElement)}>
      contact
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="rgb(0, 132, 255)" class="w-4 h-4 translate-y-3" data-astro-cid-j7pv25f6="">
        <path d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" data-astro-cid-j7pv25f6=""></path> 
      </svg>
      joon.id.au
    </button>.
  </p>
</div>

