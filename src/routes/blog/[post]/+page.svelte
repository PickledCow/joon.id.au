<!-- This file renders each individual blog post for reading. Be sure to update the svelte:head below -->
<script lang="ts">
	let { data } = $props();

	let title = $derived(data.meta.title);
	let excerpt = $derived(data.meta.excerpt);
	let date = $derived(data.meta.date);
	let updated = $derived(data.meta.updated);
	let coverImage = $derived(data.meta.coverImage);
	let coverWidth = $derived(data.meta.coverWidth);
	let coverHeight = $derived(data.meta.coverHeight);
	let categories = $derived(data.meta.categories);
	let PostContent = $derived(data.PostContent);
</script>

<svelte:head>
	<!-- Be sure to add your image files and un-comment the lines below -->
	<title>{title}</title>
	<meta data-key="description" name="description" content={excerpt} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={title} />
	<meta name="twitter:title" content={title} />
	<meta property="og:description" content={excerpt} />
	<meta name="twitter:description" content={excerpt} />
	<!-- <meta property="og:image" content="https://files.joon.id.au/public" /> -->
	<meta property="og:image:width" content={coverWidth} />
	<meta property="og:image:height" content={coverHeight} />
	<!-- <meta name="twitter:image" content="https://yourdomain.com/image_path" /> -->
</svelte:head>

<article class="post">
	<!-- You might want to add an alt frontmatter attribute. If not, leaving alt blank here works, too. -->

	<div class="post-content">
		<img
			class="cover-image"
			src={coverImage}
			alt=""
			style="aspect-ratio: {coverWidth} / {coverHeight};"
			width={coverWidth}
			height={coverHeight}
		/>

		<h1>{title}</h1>

		<div class="meta">
			<b>Published:</b>
			<span class="post-date">{date}</span>
			<br />
			<b>Updated:</b>
			<span class="post-date">{updated}</span>
		</div>

		<PostContent />
		<br />

		{#if categories}
			<aside class="post-footer">
				<h5>Posted in:</h5>
				<ul class="post-footer__categories">
					{#each categories as category}
						<li>
							<a href="/blog/category/{category}/">
								{category}
							</a>
						</li>
					{/each}
				</ul>
			</aside>
		{/if}
	</div>
</article>
