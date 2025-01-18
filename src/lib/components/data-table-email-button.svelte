<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';
	import { Button } from '@kksh/svelte5';

	let { variant = 'ghost', ...restProps }: ComponentProps<typeof Button> = $props();
</script>

<Button {variant} {...restProps}>
	Email
	<ArrowUpDown class="ml-2 size-4" />
</Button>
