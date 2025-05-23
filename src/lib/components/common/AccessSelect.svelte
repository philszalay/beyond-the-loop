<script lang="ts">
	// import { onClickOutside } from '$lib/utils/onClickOutside'; // optional if you have a helper
	import { getContext, onMount } from 'svelte';
	import { getGroups } from '$lib/apis/groups';
    import { onClickOutside } from '$lib/utils';

	const i18n = getContext('i18n');

	import PrivateIcon from '../icons/PrivateIcon.svelte';
	import PublicIcon from '../icons/PublicIcon.svelte';
	import GroupIcon from '../icons/GroupIcon.svelte';
	import { AllSelection } from 'prosemirror-state';
	import CheckmarkIcon from '../icons/CheckmarkIcon.svelte';
    import ChevronDown from '../icons/ChevronDown.svelte';

	export let onChange: Function = () => {};

	export let accessRoles = ['read'];
	export let accessControl = null;

	// let selectedGroupId = '';
	let groups = [];

	onMount(async () => {
		groups = await getGroups(localStorage.token);

		if (accessControl === null) {
			accessControl = null;
		} else {
			accessControl = {
				read: {
					group_ids: accessControl?.read?.group_ids ?? [],
					user_ids: accessControl?.read?.user_ids ?? []
				},
				write: {
					group_ids: accessControl?.write?.group_ids ?? [],
					user_ids: accessControl?.write?.user_ids ?? []
				}
			};
		}
	});

	$: onChange(accessControl);

	// $: if (selectedGroupId) {
	// 	onSelectGroup();
	// }

	const toggleGroup = (groupId) => {
		if (accessControl === null || !accessControl.read) {
			accessControl = {
				read: { group_ids: [], user_ids: [] },
				write: { group_ids: [], user_ids: [] }
			};
		}
		const current = accessControl.read.group_ids;
		const updated = current.includes(groupId)
			? current.filter((id) => id !== groupId)
			: [...current, groupId];

		accessControl = {
			...accessControl,
			read: {
				...accessControl.read,
				group_ids: updated
			}
		};
	};

	$: activeGroupIds = [
		...(accessControl?.read?.group_ids ?? []),
		...(accessControl?.write?.group_ids ?? [])
	];

	function isGroupActive(groupId) {
		if (accessControl !== null && accessControl.read) {
			const isInRead = accessControl.read.group_ids.includes(groupId);
			const isInWrite = accessControl.write.group_ids.includes(groupId);
			return isInRead || isInWrite;
		}
		return false;
	}

	let showDropdown = false;
	let hoveringGroup = false;
	let hoveringSubmenu = false;

	$: showSubmenu = hoveringGroup || hoveringSubmenu;
	let root;

	let submenuX = 0;
	let submenuY = 0;
	let groupTriggerEl: HTMLElement;

</script>

<div>
	<div bind:this={root} class="relative w-full" use:onClickOutside={() => (showDropdown = false)}>
		<button
			type="button"
			class={`${showDropdown ? 'border ' : ''} dark:border-customGray-700 flex justify-between items-center px-3 py-1.5 rounded-md dark:bg-customGray-900 cursor-pointer select-none h-10 w-full`}
			on:click={() => (showDropdown = !showDropdown)}
		>
			{#if activeGroupIds.length > 0}
				<div>
					<p class="text-2xs dark:text-customGray-100/50 leading-none">{$i18n.t('Access Rights')}</p>
					<div class="flex items-center gap-1 text-xs-plus dark:text-customGray-100">
						<PublicIcon className="size-3" />{$i18n.t('Group')}
					</div>
				</div>
			{:else}
				<div class="text-sm dark:text-customGray-100">{$i18n.t('Access Rights')}</div>
			{/if}
            <div class="flex items-center gap-2">
                <div class="text-sm">
                    {#if accessControl === null}
                        <div class="flex items-center gap-1 text-xs dark:text-customGray-100/50 leading-none">
                            <PublicIcon className="size-3" />{$i18n.t('Public')}
                        </div>
                    {:else if activeGroupIds.length > 0}
                        <div class="text-xs dark:text-customGray-100 leading-none">
                            {groups
                                .filter((group) => activeGroupIds.includes(group.id))
                                .map((group) => group.name)
                                .join(', ')}
                        </div>
                    {:else}
                        <div class="flex items-center gap-1 text-xs dark:text-customGray-100/50 leading-none">
                            <PrivateIcon className="size-3" />{$i18n.t('Private')}
                        </div>
                    {/if}
                </div>
                <ChevronDown className="size-3"/>
            </div>
		</button>

		{#if showDropdown}
			<div
				class="flex flex-col absolute left-0 right-0 -mt-1 bg-white dark:bg-customGray-900 px-1 py-2 border-l border-b border-r border-gray-300 dark:border-customGray-700 rounded-b-lg shadow z-10"
			>
                <hr class=" border-gray-50 dark:border-gray-850 my-1.5" />
				<button
					type="button"
					class="flex justify-between items-center px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-customGray-950 cursor-pointer"
					on:click={() => {
						accessControl = {
							read: {
								group_ids: []
							},
							write: {
								group_ids: []
							}
						};
						showDropdown = false;
					}}
				>
					<div>
						<div class="flex items-center gap-2 text-xs dark:text-customGray-100">
							<PrivateIcon className="size-3" />{$i18n.t('Private')}
                            {#if accessControl !== null && activeGroupIds.length < 1}
                                <CheckmarkIcon className="size-4" />
                            {/if}
						</div>
						<p class="text-xs dark:text-customGray-100/50">
							{$i18n.t('Only select user can access')}
						</p>
					</div>
					<p class="text-xs dark:text-customGray-100/50">{$i18n.t('By default')}</p>
				</button>

				<button
					type="button"
					class="flex justify-start items-center px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-customGray-950 cursor-pointer"
					on:click={() => {
						accessControl = null;
						showDropdown = false;
					}}
				>
					<div>
						<div class="flex items-center gap-2 text-xs dark:text-customGray-100">
							<PublicIcon className="size-3" />{$i18n.t('Public')}
                            {#if accessControl === null}
                                <CheckmarkIcon className="size-4" />
                            {/if}
						</div>
						<p class="text-xs dark:text-customGray-100/50">
							{$i18n.t('Accessible to all users')}
						</p>
					</div>
				</button>
                {#if groups.length > 0}
                    <button
                        type="button"
                        class="relative"
                        bind:this={groupTriggerEl}
                        on:mouseenter={() => {
                            hoveringGroup = true;
                            if (groupTriggerEl) {
                                const rect = groupTriggerEl.getBoundingClientRect();
                                submenuX = rect.right + 8;
                                submenuY = rect.top - ((groups.length - 1) * 30);
                                showSubmenu = true;
                            }
                        }}
                        on:mouseleave={() => {
                            hoveringGroup = false;
                            setTimeout(() => {
                                if (!hoveringSubmenu) showSubmenu = false;
                            }, 100);
                        }}
                    >
                        <button
                        on:click={() => (showDropdown = false)}
                            class="flex w-full justify-start items-center rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-customGray-950 cursor-pointer"
                        >
                            <div>
                                <div class="flex items-center gap-2 text-xs dark:text-customGray-100">
                                    <GroupIcon className="size-3" />{$i18n.t('Group')}
                                    {#if activeGroupIds.length > 0}
                                        <CheckmarkIcon className="size-4" />
                                    {/if}
                                </div>
                                <p class="text-xs dark:text-customGray-100/50">
                                    {$i18n.t('Only groups with permission can access')}
                                </p>
                            </div>
                        </button>
                        <div
                            class="absolute left-full top-0 w-4 h-full z-10"
                            on:mouseenter={() => (hoveringSubmenu = true)}
                            on:mouseleave={() => (hoveringSubmenu = false)}
                        ></div>

                        <!-- Submenu -->
                        {#if showSubmenu}
                            <button
                                type="button"
                                class="fixed bg-white dark:bg-customGray-900 border px-1 py-2 border-gray-300 dark:border-customGray-700 rounded-xl shadow z-20 min-w-30"
                                style="top: {submenuY}px; left: {submenuX}px"
                                on:mouseenter={() => (hoveringSubmenu = true)}
                                on:mouseleave={() => {
                                    hoveringSubmenu = false;
                                    showSubmenu = false;
                                }}
                            >
                                {#each groups as group}
                                    <button
                                        type="button"
                                        on:click={() => toggleGroup(group.id)}
                                        class="grid grid-cols-[16px_1fr] text-xs w-full gap-1 justify-center px-2 py-2 hover:bg-gray-100 dark:hover:bg-customGray-950 rounded-xl"
                                    >
                                        <div>
                                            {#if activeGroupIds.includes(group.id)}
                                                <CheckmarkIcon className="size-4" />
                                            {/if}
                                        </div>
                                        <div class="text-left">
                                            {group.name}
                                        </div>
                                    </button>
                                {/each}
                            </button>
                        {/if}
                    </button>
                {/if}
			</div>
		{/if}
	</div>
</div>
