<script lang="ts">
	import { page } from '$app/state';
</script>
<div class="flex absolute x-0 y-16 w-full h-full 
	text-center text-6xl
	justify-center
	items-center
">
	AAAAAA! 
	<br>
	{page.status} {page.error?.message}
</div>