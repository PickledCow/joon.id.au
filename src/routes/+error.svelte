<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
  <title>404 ruh roh</title>
</svelte:head>

<div class="flex absolute top-4 w-full h-full 
	text-center text-6xl
	justify-center
	items-center
	text-black dark:text-white
  transition-colors duration-300 ease-in-out
">
	AAAAAA! 
	<br>
	{page.status} {page.error?.message}
</div>
