import { postsPerPage } from '$lib/config';
import fetchPosts from '$lib/assets/ts/fetchPosts';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = async ({ params }) => {
  const page = Number(params.page);

  const options = {
    offset: (page - 1) * postsPerPage,
    limit: postsPerPage
  };

  const { posts } = await fetchPosts(options);

  return json(posts);
};
