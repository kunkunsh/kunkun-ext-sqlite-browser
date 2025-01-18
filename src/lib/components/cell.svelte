<script lang="ts">
	let { type, value }: { type: string; value: string | number } = $props();
</script>

<p class="text-ellipsis overflow-hidden text-nowrap truncate max-w-64">{value}</p>
