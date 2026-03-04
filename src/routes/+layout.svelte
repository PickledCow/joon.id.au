<script lang="ts">
	import '@skeletonlabs/skeleton-svelte'; 
	import '../app.postcss';
	let { children } = $props();
</script>

{@render children()}
