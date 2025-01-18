<script lang="ts">
	import { dbPath } from '@/stores/db';
	import { Button, Input } from '@kksh/svelte5';
</script>

<Input bind:value={$dbPath} disabled />
<Button type="submit">Pick DB</Button>
