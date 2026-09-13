<script lang="ts">
  import { onMount } from "svelte";
  import PostsList from "$lib/components/PostsList.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  import { siteDescription } from "$lib/config.js";
  import { setupCanvas } from "$lib/gridBg/canvasBackground";

  let canvas: HTMLCanvasElement | undefined = $state();

  onMount(() => {
    // Initialize the canvas background effect when the component mounts
    return setupCanvas(canvas!);
  });

  let { data } = $props();
</script>

<svelte:head>
  <title>The Blog of All Time - Joon Suh</title>
  <meta data-key="description" name="description" content={siteDescription} />
</svelte:head>

<!-- Background -->
<canvas
  bind:this={canvas}
  class="top-0 left-0 w-screen h-screen block theme-bg fixed"
></canvas>

<div class="post-content">
  <h1 class="text-4xl font-bold mb-4">The Blog of All Time</h1>
  <PostsList posts={data.posts} />
</div>
<Pagination currentPage={1} totalPosts={data.total} />
