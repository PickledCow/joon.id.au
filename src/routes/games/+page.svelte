<script lang="ts">
  import { onMount } from 'svelte';
  import { setupCanvas } from '$lib/reni/reniCore';

  let canvas: HTMLCanvasElement;

  onMount(() => {
    // Initialize the canvas
    return setupCanvas(canvas);
  });
  
</script>


<svelte:head>
  <title>Joon Suh's epic game</title>
</svelte:head>

<div class="flex absolute x-0 y-16 w-full h-full
	justify-center items-center
">
  <canvas bind:this={canvas} class="rounded-2xl shadow-2xl"></canvas>
</div>