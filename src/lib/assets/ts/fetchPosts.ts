import { postsPerPage } from '$lib/config';

interface FetchPostsOptions {
	offset?: number;
	limit?: number;
	category?: string;
}

interface PostMetadata {
	title: string;
	slug: string;
	excerpt: string;
	coverImage?: string;
	coverWidth?: number;
	coverHeight?: number;
	date: string;
	categories: string[];
}

interface PostModule {
	metadata: Omit<PostMetadata, 'slug'>;
}

const fetchPosts = async ({
	offset = 0,
	limit = postsPerPage,
	category = ''
}: FetchPostsOptions = {}) => {
	const posts = await Promise.all(
		Object.entries(import.meta.glob<PostModule>('/src/lib/posts/*.md')).map(
			async ([path, resolver]) => {
				const { metadata } = await resolver();
				const slug = path.split('/').pop()?.slice(0, -3) ?? '';

				return {
					...metadata,
					slug
				};
			}
		)
	);

	let sortedPosts = posts.sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	);

	if (category) {
		sortedPosts = sortedPosts.filter((post) =>
			post.categories.includes(category)
		);
	}

	if (offset) {
		sortedPosts = sortedPosts.slice(offset);
	}

	if (limit && limit < sortedPosts.length && limit !== -1) {
		sortedPosts = sortedPosts.slice(0, limit);
	}

	sortedPosts = sortedPosts.map((post) => ({
		title: post.title,
		slug: post.slug,
		excerpt: post.excerpt,
		coverImage: post.coverImage,
		coverWidth: post.coverWidth,
		coverHeight: post.coverHeight,
		date: post.date,
		categories: post.categories
	}));

	return {
		posts: sortedPosts
	};
};

export default fetchPosts;