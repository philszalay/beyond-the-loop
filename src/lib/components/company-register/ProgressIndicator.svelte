<script lang="ts">
	import SuccessIcon from '../icons/SuccessIcon.svelte';
	export let step = 1;

	const steps = [
		'Account creation',
		'Verify mail',
		'Personal information',
		'Create company profile',
		'Invite team members'
	];
</script>

<div class="flex mb-7 mx-auto">
	{#each steps as s, index}
		<div class="pb-2.5 border-b {index + 1 <= step ? 'border-customBlue-500' : 'border-customGray-700'}">
			<div
				class="{index + 1 < steps.length
					? 'border-r'
					: ''} border-customGray-700 flex items-center text-xs px-2.5 {index + 1 <= step
					? 'text-customGray-300'
					: 'text-customGray-300/50'}"
			>	
				{#if index + 1 < step}
					<SuccessIcon className="size-3 mr-1"/>
				{:else}
					{index + 1}
				{/if}
				{s}
			</div>
		</div>
	{/each}
</div>
