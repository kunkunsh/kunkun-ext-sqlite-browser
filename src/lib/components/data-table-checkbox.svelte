<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { Checkbox } from '@kksh/svelte5';

	let {
		checked = false,
		controlledChecked = true,
		...restProps
	}: ComponentProps<typeof Checkbox> = $props();
</script>

<Checkbox {checked} {controlledChecked} {...restProps} />
