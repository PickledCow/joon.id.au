import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	try {
		const post = await import(`../../../lib/posts/${params.post}.md`);

		return {
			PostContent: post.default,
			meta: {
				...post.metadata,
				slug: params.post
			}
		};
	} catch {
		error(404);
	}
};