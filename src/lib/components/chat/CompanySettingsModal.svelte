<script lang="ts">
	import { getContext, tick, onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { models, settings, user } from '$lib/stores';
	import { updateUserSettings } from '$lib/apis/users';
	import { getModels as _getModels } from '$lib/apis';
	import { goto } from '$app/navigation';

	import Modal from '../common/Modal.svelte';
	import ProfileIcon from '../icons/ProfileIcon.svelte';
    import GeneralSettings from '$lib/components/chat/Settings/CompanySettings/General.svelte';
	import GroupIcon from '../icons/GroupIcon.svelte';
	import UserManagement from './Settings/CompanySettings/UserManagement.svelte';
	import ModelControlIcon from '../icons/ModelControlIcon.svelte';
	import ModelControl from './Settings/CompanySettings/ModelControl.svelte';
	import { getUsers } from '$lib/apis/users';
	import AnalyticsIcon from '../icons/AnalyticsIcon.svelte';
	import Analytics from './Settings/CompanySettings/Analytics.svelte';
	import { getTopModels, getTotalUsers, getTotalMessages, getAdoptionRate, getPowerUsers, getSavedTimeInSeconds, getTopUsers, getTotalBilling, getTotalChats, getTotalAssistants } from '$lib/apis/analytics';
	import BillingIcon from '../icons/BillingIcon.svelte';
	import Billing from './Settings/CompanySettings/Billing.svelte';
	import { getMonthRange } from '$lib/utils';
	import { page } from '$app/stores';
	import {
		getCurrentSubscription,
		getSubscriptionPlans
	} from '$lib/apis/payments';
	import { subscription } from '$lib/stores';
	
	const i18n = getContext('i18n');

	export let show = false;
	let selectedTab = 'general-settings';
	let plans = [];

	interface SettingsTab {
		id: string;
		title: string;
		keywords: string[];
	}

	function updateTabParam(tab) {
		const url = new URL(window.location.href);
		url.searchParams.set('tab', tab);
		url.searchParams.set('modal', 'company-settings'); 
		window.history.replaceState({}, '', url); 
	}

	const searchData: SettingsTab[] = [
		{
			id: 'general-settings',
			title: 'General Settings',
			keywords: [	
			]
		},
		{
			id: 'user-management',
			title: 'User Management',
			keywords: [	
			]
		},
		{
			id: 'model-control',
			title: 'Model Control',
			keywords: [	
			]
		},
		{
			id: 'analytics',
			title: 'Analitics',
			keywords: [

			]
		},
		{
			id: 'billing',
			title: 'Billing',
			keywords: [
		
			]
		}
		];

	let search = '';
	let visibleTabs = searchData.map((tab) => tab.id);
	let searchDebounceTimeout;

	const searchSettings = (query: string): string[] => {
		const lowerCaseQuery = query.toLowerCase().trim();
		return searchData
			.filter(
				(tab) =>
					tab.title.toLowerCase().includes(lowerCaseQuery) ||
					tab.keywords.some((keyword) => keyword.includes(lowerCaseQuery))
			)
			.map((tab) => tab.id);
	};

	const searchDebounceHandler = () => {
		clearTimeout(searchDebounceTimeout);
		searchDebounceTimeout = setTimeout(() => {
			visibleTabs = searchSettings(search);
			if (visibleTabs.length > 0 && !visibleTabs.includes(selectedTab)) {
				selectedTab = visibleTabs[0];
			}
		}, 100);
	};

	const saveSettings = async (updated) => {
		console.log(updated);
		await settings.set({ ...$settings, ...updated });
		await models.set(await getModels());
		await updateUserSettings(localStorage.token, { ui: $settings });
	};

	const getModels = async () => {
		return await _getModels(localStorage.token);
	};


	// Function to handle sideways scrolling
	const scrollHandler = (event) => {
		const settingsTabsContainer = document.getElementById('settings-tabs-container');
		if (settingsTabsContainer) {
			event.preventDefault(); // Prevent default vertical scrolling
			settingsTabsContainer.scrollLeft += event.deltaY; // Scroll sideways
		}
	};

	const addScrollListener = async () => {
		await tick();
		const settingsTabsContainer = document.getElementById('settings-tabs-container');
		if (settingsTabsContainer) {
			settingsTabsContainer.addEventListener('wheel', scrollHandler);
		}
	};

	const removeScrollListener = async () => {
		await tick();
		const settingsTabsContainer = document.getElementById('settings-tabs-container');
		if (settingsTabsContainer) {
			settingsTabsContainer.removeEventListener('wheel', scrollHandler);
		}
	};

	$: if (show) {
		addScrollListener();
	} else {
		removeScrollListener();
	}
	let users = [];
	const getUsersHandler = async () => {
		users = await getUsers(localStorage.token);
	};

	let analytics = null;
	let analyticsLoading = false;

	async function fetchAnalytics() {
	const token = localStorage.token;
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth() + 1;
	const { start, end } = getMonthRange(year, month);
	console.log(start, end)
	try {
		analyticsLoading = true;
		const [
			topModels,
			totalUsers,
			totalMessages,
			adoptionRate,
			powerUsers,
			savedTime,
			topUsers,
			totalBilling,
			totalChats,
			totalAssistants
		] = await Promise.allSettled([
			getTopModels(token, start, end),
			getTotalUsers(token),
			getTotalMessages(token),
			getAdoptionRate(token),
			getPowerUsers(token),
			getSavedTimeInSeconds(token),
			getTopUsers(token, start, end),
			getTotalBilling(token),
			getTotalChats(token),
			getTotalAssistants(token),
		]);
		
		analytics = {
			topModels: topModels?.status === 'fulfilled' && !topModels?.value?.message ? topModels?.value : [],
			totalUsers: totalUsers?.status === 'fulfilled' ? totalUsers?.value : {},
			totalMessages: totalMessages?.status === 'fulfilled' ? totalMessages?.value : {},
			adoptionRate: adoptionRate?.status === 'fulfilled' ? adoptionRate?.value : {},
			powerUsers: powerUsers?.status === 'fulfilled' ? powerUsers?.value : {},
			savedTime: savedTime?.status === 'fulfilled' ? savedTime?.value : {},
			topUsers: topUsers?.status === 'fulfilled' ? topUsers?.value : {},
			totalBilling: totalBilling?.status === 'fulfilled' ? totalBilling?.value : {},
			totalChats: totalChats?.status === 'fulfilled' ? totalChats?.value : {},
			totalAssistants: totalAssistants?.status === 'fulfilled' ? totalAssistants?.value : {},
		}
		console.log(analytics)
		} catch (error) {
			console.error('Error fetching analytics:', error);
		} finally {
			analyticsLoading = false;
		}
	}
	let autoRecharge = false;
	let subscriptionLoading = false;
	async function getSubscription() {
		subscriptionLoading = true;
		const sub = await getCurrentSubscription(localStorage.token).catch(error => {
			console.log(error);
			subscriptionLoading = false;
		});
		if(sub){
			subscription.set(sub);
			autoRecharge = sub?.auto_recharge ? sub?.auto_recharge : false;
			subscriptionLoading = false;
		}
	}
	async function getPlans() {
		const res = await getSubscriptionPlans(localStorage.token).catch((error) => console.log(error));
		if (res) {
			plans = res;
		}
	}


	$: if(show){
		getUsersHandler();
		getSubscription();
		getPlans();
		fetchAnalytics();
		const tabParam = $page.url.searchParams.get('tab');
		selectedTab = tabParam || 'general-settings';
	}

</script>

<Modal size="md-plus" bind:show blockBackdropClick={true} className="dark:bg-customGray-800 rounded-2xl" containerClassName="bg-[#1D1A1A]/50 backdrop-blur-[7.44px]">
	<div class="text-gray-700 dark:text-gray-100">
		<div class="px-7">
			<div class=" flex justify-between dark:text-white pt-5 pb-4 border-b dark:border-customGray-700">
				<div class="self-center">{$i18n.t('Company Settings')}</div>
				<button
					class="self-center"
					on:click={() => {
						const url = new URL(window.location.href);
						url.search = ''; 
						goto(url.pathname, { replaceState: true });
						show = false;	
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="w-5 h-5"
					>
						<path
							d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
						/>
					</svg>
				</button>
			</div>
		</div>

		<div class="flex flex-col md:flex-row w-full pr-7 md:space-x-4">
			<div
				id="settings-tabs-container"
				class="rounded-bl-lg pl-4 pt-5 pr-2 tabs flex flex-row dark:bg-customGray-900 gap-2.5 md:gap-1 md:flex-col flex-1 md:flex-none md:w-[252px] dark:text-gray-200 text-sm font-medium text-left mb-1 md:mb-0"
			>
				<!-- <div class="hidden md:flex w-full rounded-xl -mb-1 px-0.5 gap-2" id="settings-search">
					<div class="self-center rounded-l-xl bg-transparent">
						<Search className="size-3.5" />
					</div>
					<input
						class="w-full py-1.5 text-sm bg-transparent dark:text-gray-300 outline-none"
						bind:value={search}
						on:input={searchDebounceHandler}
						placeholder={$i18n.t('Search')}
					/>
				</div> -->

				{#if visibleTabs.length > 0}
					{#each visibleTabs as tabId (tabId)}
                    {#if tabId === 'general-settings'}
                    <button
                        class="px-3 py-2.5 min-w-fit rounded-md flex-1 md:flex-none text-left transition {selectedTab ===
                        'general-settings'
                            ? 'dark:bg-customGray-800'
                            : ' text-gray-300 dark:text-gray-600 hover:text-gray-700 dark:hover:text-white'}"
                        on:click={() => {
                            selectedTab = 'general-settings';
							updateTabParam(selectedTab);
                        }}
                    >
                        <div class="flex items-center mb-1">
                            <div class=" self-center mr-2">
                                <ProfileIcon/>
                            </div>
                            <div class=" self-center">{$i18n.t('General Settings')}</div>
                        </div>
                    </button>
					{:else if tabId === 'user-management'}
					<button
                        class="px-3 py-2.5 min-w-fit rounded-md flex-1 md:flex-none text-left transition {selectedTab ===
                        'user-management'
                            ? 'dark:bg-customGray-800'
                            : ' text-gray-300 dark:text-gray-600 hover:text-gray-700 dark:hover:text-white'}"
                        on:click={() => {
                            selectedTab = 'user-management';
							updateTabParam(selectedTab);
                        }}
                    >
                        <div class="flex items-center mb-1">
                            <div class=" self-center mr-2">
                                <GroupIcon/>
                            </div>
                            <div class=" self-center">{$i18n.t('User management')}</div>
                        </div>
                    </button>
					{:else if tabId === 'model-control'}
					<button
						class="px-3 py-2.5 min-w-fit rounded-md flex-1 md:flex-none text-left transition {selectedTab ===
						'model-control'
							? 'dark:bg-customGray-800'
							: ' text-gray-300 dark:text-gray-600 hover:text-gray-700 dark:hover:text-white'}"
						on:click={() => {
							selectedTab = 'model-control';
							updateTabParam(selectedTab);
						}}
					>
						<div class="flex items-center mb-1">
							<div class=" self-center mr-2">
								<ModelControlIcon/>
							</div>
							<div class=" self-center">{$i18n.t('Model Control')}</div>
						</div>
					</button>
					{:else if tabId === 'analytics'}
					<button
						class="px-3 py-2.5 min-w-fit rounded-md flex-1 md:flex-none text-left transition {selectedTab ===
						'analytics'
							? 'dark:bg-customGray-800'
							: ' text-gray-300 dark:text-gray-600 hover:text-gray-700 dark:hover:text-white'}"
						on:click={() => {
							selectedTab = 'analytics';
							updateTabParam(selectedTab);
						}}
					>
						<div class="flex items-center mb-1">
							<div class=" self-center mr-2">
								<AnalyticsIcon/>
							</div>
							<div class=" self-center">{$i18n.t('Analytics')}</div>
						</div>
					</button>
					{:else if tabId === 'billing'}
					<button
						class="px-3 py-2.5 min-w-fit rounded-md flex-1 md:flex-none text-left transition {selectedTab ===
						'billing'
							? 'dark:bg-customGray-800'
							: ' text-gray-300 dark:text-gray-600 hover:text-gray-700 dark:hover:text-white'}"
						on:click={() => {
							selectedTab = 'billing';
							updateTabParam(selectedTab);
						}}
					>
						<div class="flex items-center mb-1">
							<div class=" self-center mr-2">
								<BillingIcon/>
							</div>
							<div class=" self-center">{$i18n.t('Billing')}</div>
						</div>
					</button>
                    {/if}

						<!-- {#if tabId === 'general'}
							<button
								class="px-0.5 py-1 min-w-fit rounded-lg flex-1 md:flex-none flex text-left transition {selectedTab ===
								'general'
									? ''
									: ' text-gray-300 dark:text-gray-600 hover:text-gray-700 dark:hover:text-white'}"
								on:click={() => {
									selectedTab = 'general';
								}}
							>
								<div class=" self-center mr-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										class="w-4 h-4"
									>
										<path
											fill-rule="evenodd"
											d="M8.34 1.804A1 1 0 019.32 1h1.36a1 1 0 01.98.804l.295 1.473c.497.144.971.342 1.416.587l1.25-.834a1 1 0 011.262.125l.962.962a1 1 0 01.125 1.262l-.834 1.25c.245.445.443.919.587 1.416l1.473.294a1 1 0 01.804.98v1.361a1 1 0 01-.804.98l-1.473.295a6.95 6.95 0 01-.587 1.416l.834 1.25a1 1 0 01-.125 1.262l-.962.962a1 1 0 01-1.262.125l-1.25-.834a6.953 6.953 0 01-1.416.587l-.294 1.473a1 1 0 01-.98.804H9.32a1 1 0 01-.98-.804l-.295-1.473a6.957 6.957 0 01-1.416-.587l-1.25.834a1 1 0 01-1.262-.125l-.962-.962a1 1 0 01-.125-1.262l.834-1.25a6.957 6.957 0 01-.587-1.416l-1.473-.294A1 1 0 011 10.68V9.32a1 1 0 01.804-.98l1.473-.295c.144-.497.342-.971.587-1.416l-.834-1.25a1 1 0 01.125-1.262l.962-.962A1 1 0 015.38 3.03l1.25.834a6.957 6.957 0 011.416-.587l.294-1.473zM13 10a3 3 0 11-6 0 3 3 0 016 0z"
											clip-rule="evenodd"
										/>
									</svg>
								</div>
								<div class=" self-center">{$i18n.t('General')}</div>
							</button>
						{:else if tabId === 'interface'}
							<button
								class="px-0.5 py-1 min-w-fit rounded-lg flex-1 md:flex-none flex text-left transition {selectedTab ===
								'interface'
									? ''
									: ' text-gray-300 dark:text-gray-600 hover:text-gray-700 dark:hover:text-white'}"
								on:click={() => {
									selectedTab = 'interface';
								}}
							>
								<div class=" self-center mr-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 16 16"
										fill="currentColor"
										class="w-4 h-4"
									>
										<path
											fill-rule="evenodd"
											d="M2 4.25A2.25 2.25 0 0 1 4.25 2h7.5A2.25 2.25 0 0 1 14 4.25v5.5A2.25 2.25 0 0 1 11.75 12h-1.312c.1.128.21.248.328.36a.75.75 0 0 1 .234.545v.345a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1-.75-.75v-.345a.75.75 0 0 1 .234-.545c.118-.111.228-.232.328-.36H4.25A2.25 2.25 0 0 1 2 9.75v-5.5Zm2.25-.75a.75.75 0 0 0-.75.75v4.5c0 .414.336.75.75.75h7.5a.75.75 0 0 0 .75-.75v-4.5a.75.75 0 0 0-.75-.75h-7.5Z"
											clip-rule="evenodd"
										/>
									</svg>
								</div>
								<div class=" self-center">{$i18n.t('Interface')}</div>
							</button>
						{:else if tabId === 'personalization'}
							<button
							class="px-3 py-2.5 min-w-fit rounded-md flex-1 md:flex-none text-left transition {selectedTab ===
							'personalization'
								? 'dark:bg-customGray-800'
								: ' text-gray-300 dark:text-gray-600 hover:text-gray-700 dark:hover:text-white'}"
								on:click={() => {
									selectedTab = 'personalization';
								}}
							>
							<div class="flex items-center mb-1">
								<div class=" self-center mr-2">
									<PersonalizationIcon/>
								</div>
								<div class=" self-center">{$i18n.t('Personalization')}</div>
							</div>
								<div class="{selectedTab ===
								'personalization'
									? ''
									: 'invisible'} font-normal text-xs dark:text-white/50">{$i18n.t('Personalise the look and feel')}</div>
							</button>
						{:else if tabId === 'audio'}
							<button
								class="px-0.5 py-1 min-w-fit rounded-lg flex-1 md:flex-none flex text-left transition {selectedTab ===
								'audio'
									? ''
									: ' text-gray-300 dark:text-gray-600 hover:text-gray-700 dark:hover:text-white'}"
								on:click={() => {
									selectedTab = 'audio';
								}}
							>
								<div class=" self-center mr-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 16 16"
										fill="currentColor"
										class="w-4 h-4"
									>
										<path
											d="M7.557 2.066A.75.75 0 0 1 8 2.75v10.5a.75.75 0 0 1-1.248.56L3.59 11H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.59l3.162-2.81a.75.75 0 0 1 .805-.124ZM12.95 3.05a.75.75 0 1 0-1.06 1.06 5.5 5.5 0 0 1 0 7.78.75.75 0 1 0 1.06 1.06 7 7 0 0 0 0-9.9Z"
										/>
										<path
											d="M10.828 5.172a.75.75 0 1 0-1.06 1.06 2.5 2.5 0 0 1 0 3.536.75.75 0 1 0 1.06 1.06 4 4 0 0 0 0-5.656Z"
										/>
									</svg>
								</div>
								<div class=" self-center">{$i18n.t('Audio')}</div>
							</button>
						{:else if tabId === 'chats'}
							<button
							class="px-3 py-2.5 min-w-fit rounded-md flex-1 md:flex-none text-left transition {selectedTab ===
							'chats'
								? 'dark:bg-customGray-800'
								: ' text-gray-300 dark:text-gray-600 hover:text-gray-700 dark:hover:text-white'}"
								on:click={() => {
									selectedTab = 'chats';
								}}
							>
							<div class="flex items-center mb-1">
								<div class=" self-center mr-2">
									<ChatIcon/>
								</div>
								<div class=" self-center">{$i18n.t('Chats')}</div>
							</div>
							<div class="{selectedTab ===
							'chats'
								? ''
								: 'invisible'} font-normal text-xs dark:text-white/50">{$i18n.t('Manage your personal details')}</div>
							</button>
						{:else if tabId === 'account'}
							<button
								class="px-3 py-2.5 min-w-fit rounded-md flex-1 md:flex-none text-left transition {selectedTab ===
								'account'
									? 'dark:bg-customGray-800'
									: ' text-gray-300 dark:text-gray-600 hover:text-gray-700 dark:hover:text-white'}"
								on:click={() => {
									selectedTab = 'account';
								}}
							>
								<div class="flex items-center mb-1">
									<div class=" self-center mr-2">
										<ProfileIcon/>
									</div>
									<div class=" self-center">{$i18n.t('Profile')}</div>
								</div>
								<div class="{selectedTab ===
								'account'
									? ''
									: 'invisible'} font-normal text-xs dark:text-white/50">{$i18n.t('Manage your personal details')}</div>
							</button>
						{:else if tabId === 'about'}
							<button
								class="px-0.5 py-1 min-w-fit rounded-lg flex-1 md:flex-none flex text-left transition {selectedTab ===
								'about'
									? ''
									: ' text-gray-300 dark:text-gray-600 hover:text-gray-700 dark:hover:text-white'}"
								on:click={() => {
									selectedTab = 'about';
								}}
							>
								<div class=" self-center mr-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										class="w-4 h-4"
									>
										<path
											fill-rule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
											clip-rule="evenodd"
										/>
									</svg>
								</div>
								<div class=" self-center">{$i18n.t('About')}</div>
							</button>
						{:else if tabId === 'admin'}
							{#if $user.role === 'admin'}
								<button
									class="px-0.5 py-1 min-w-fit rounded-lg flex-1 md:flex-none flex text-left transition {selectedTab ===
									'admin'
										? ''
										: ' text-gray-300 dark:text-gray-600 hover:text-gray-700 dark:hover:text-white'}"
									on:click={async () => {
										await goto('/admin/settings');
										show = false;
									}}
								>
									<div class=" self-center mr-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="currentColor"
											class="size-4"
										>
											<path
												fill-rule="evenodd"
												d="M4.5 3.75a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-15Zm4.125 3a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm-3.873 8.703a4.126 4.126 0 0 1 7.746 0 .75.75 0 0 1-.351.92 7.47 7.47 0 0 1-3.522.877 7.47 7.47 0 0 1-3.522-.877.75.75 0 0 1-.351-.92ZM15 8.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15ZM14.25 12a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H15a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15Z"
												clip-rule="evenodd"
											/>
										</svg>
									</div>
									<div class=" self-center">{$i18n.t('Admin Settings')}</div>
								</button>
							{/if}
						{/if} -->
					{/each}
				{:else}
					<div class="text-center text-gray-500 mt-4">
						{$i18n.t('No results found')}
					</div>
				{/if}
			</div>
			<div class="flex-1 md:min-h-[32rem]">
				{#if selectedTab === 'general-settings'}
                    <GeneralSettings
                    {getModels}
						{saveSettings}
						on:save={() => {
							toast.success($i18n.t('Settings saved successfully!'));
						}}
                    />
					
				{:else if selectedTab === 'user-management'}
					<UserManagement
						{users}
						{getSubscription}
						{getUsersHandler}
						on:save={() => {
							toast.success($i18n.t('Settings saved successfully!'));
						}}
					/>
				{:else if selectedTab === 'model-control'}
					<ModelControl/>
				{:else if selectedTab === 'analytics'}
					<Analytics {analytics} {analyticsLoading}/>
				{:else if selectedTab === 'billing'}
					<Billing bind:autoRecharge bind:subscriptionLoading {plans}/>
				{/if}
			</div>
		</div>
	</div>
</Modal>

<style>
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		/* display: none; <- Crashes Chrome on hover */
		-webkit-appearance: none;
		margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
	}

	.tabs::-webkit-scrollbar {
		display: none; /* for Chrome, Safari and Opera */
	}

	.tabs {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	input[type='number'] {
		-moz-appearance: textfield; /* Firefox */
	}
</style>
