<script lang="ts">
	
	let open = false;
	export let id;
</script>

<div class="mb-1">
	<div
		class="flex justify-between items-center w-full text-left py-2 text-xs dark:text-customGray-300 border-b dark:border-customGray-700"
	>
		<button id={`group-${id}`} class="flex items-center" on:click={() => (open = !open)}>
			<svg
				width="4"
				height="6"
				class={`mr-1 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
				viewBox="0 0 4 6"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M3.52601 3C3.52601 3.13325 3.47691 3.26651 3.37171 3.37171L0.895967 5.84746C0.692577 6.05085 0.355932 6.05085 0.152542 5.84746C-0.0508475 5.64407 -0.0508475 5.30742 0.152542 5.10403L2.25658 3L0.152542 0.895967C-0.0508475 0.692577 -0.0508475 0.355932 0.152542 0.152542C0.355932 -0.050848 0.692577 -0.050848 0.895967 0.152542L3.37171 2.62829C3.47691 2.73349 3.52601 2.86674 3.52601 3Z"
					fill="#939292"
				/>
			</svg>
			<slot name="title" />
		</button>
		<slot name="right" />
	</div>

	{#if open}
		<div class="py-2">
			<slot />
		</div>
	{/if}
</div>
