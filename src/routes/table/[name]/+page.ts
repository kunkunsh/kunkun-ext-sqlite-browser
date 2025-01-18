import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	return { name: params.name };
};
export let csr = true;
export let prerender = false;
