<script lang="ts">
  import PostsList from "$lib/components/PostsList.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  import { siteDescription } from "$lib/config.js";

  let { data } = $props();
</script>

<svelte:head>
  <title>The Blog of All Time - Joon Suh</title>
  <meta data-key="description" name="description" content={siteDescription} />
</svelte:head>

<div class="post-content">
  <h1 class="text-4xl font-bold mb-4">The Blog of All Time</h1>
  <PostsList posts={data.posts} />
</div>
<Pagination currentPage={1} totalPosts={data.total} />
