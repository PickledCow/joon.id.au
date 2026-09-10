<script lang="ts">
  let { children } = $props();
</script>

<svelte:head>
  <link rel="stylesheet" href="/css/layout.css" />
  <link rel="stylesheet" href="/css/typography.css" />
  <!-- <link rel="stylesheet" href="/css/fonts.css" /> -->
</svelte:head>

{@render children()}
