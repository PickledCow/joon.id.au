<script lang="ts">
  import { onMount } from 'svelte';
  import { setupCanvas } from '$lib/reni/games/pong/game';

  let canvas: HTMLCanvasElement;

  onMount(() => {
    // Initialize the canvas
    return setupCanvas(canvas);
  });
  
</script>


<svelte:head>
  <title>Joon Suh's epic game</title>
</svelte:head>

<div class="flex absolute top-32 w-full
	justify-center items-center
">
  <canvas bind:this={canvas} class="rounded-2xl shadow-2xl border-4 border-sky-200 dark:border-sky-700"></canvas>
</div>