export const modelsInfo = {
	'Claude 3.5 Haiku': {
		organization: 'Anthropic',
		hosted_in: 'US',
		description: 'Efficient for quick tasks',
		context_window: '200K',
		knowledge_cutoff: null,
		intelligence_score: null,
		speed: 3.0,
		multimodal: false,
		reasoning: false,
		included: true,
		creditsPerMessage: 20
	},
	'Claude 3.5 Sonnet': {
		organization: 'Anthropic',
		hosted_in: 'EU',
		description: 'Best for creative writing',
		context_window: '200K',
		knowledge_cutoff: '2024-04-01',
		intelligence_score: 4.5,
		speed: 3.0,
		multimodal: true,
		reasoning: false,
		included: true,
		creditsPerMessage: 20
	},
	'Claude 3.7 Sonnet': {
		organization: 'Anthropic',
		hosted_in: 'US',
		description: 'Balanced general-purpose performance',
		context_window: '200K',
		knowledge_cutoff: '2024-10-01',
		intelligence_score: null,
		speed: 2.0,
		multimodal: true,
		reasoning: false,
		included: true,
		creditsPerMessage: 20
	},
	'DeepSeek-R1': {
		organization: 'Deep Seek',
		hosted_in: null,
		description: 'Advanced reasoning capabilities',
		context_window: '128K',
		knowledge_cutoff: null,
		intelligence_score: 4.5,
		speed: 1.0,
		multimodal: false,
		reasoning: true,
		included: false,
		creditsPerMessage: 20
	},
	'DeepSeek-V3': {
		organization: 'Deep Seek',
		hosted_in: null,
		description: 'Advanced reasoning capabilities',
		context_window: '128K',
		knowledge_cutoff: null,
		intelligence_score: 4.5,
		speed: 3.0,
		multimodal: false,
		reasoning: false,
		included: false,
		creditsPerMessage: 20
	},
	'Gemini 2.0 Flash': {
		organization: 'Google',
		hosted_in: 'EU',
		description: 'Fast & cost-effective',
		context_window: '1M',
		knowledge_cutoff: '2024-06-01',
		intelligence_score: null,
		speed: 1.0,
		multimodal: true,
		reasoning: false,
		included: true,
		creditsPerMessage: 20
	},
	'Gemini 2.0 Flash Thinking': {
		organization: 'Google',
		hosted_in: 'US',
		description: 'Rapid decision-making tasks',
		context_window: '1M',
		knowledge_cutoff: '2024-06-01',
		intelligence_score: null,
		speed: 1.0,
		multimodal: true,
		reasoning: true,
		included: true,
		creditsPerMessage: 20
	},
	'GPT-4.5': {
		organization: 'OpenAI',
		hosted_in: 'EU',
		description: 'High accuracy across domains',
		context_window: '128K',
		knowledge_cutoff: '2023-10-01',
		intelligence_score: 4.5,
		speed: 1.0,
		multimodal: true,
		reasoning: false,
		included: false,
		creditsPerMessage: 20
	},
	'GPT 4o': {
		organization: 'OpenAI',
		hosted_in: 'EU',
		description: 'Balanced general-purpose performance',
		context_window: '128K',
		knowledge_cutoff: '2023-10-01',
		intelligence_score: 4.5,
		speed: 3.5,
		multimodal: true,
		reasoning: false,
		included: true,
		creditsPerMessage: 20
	},
	'GPT 4o-mini': {
		organization: 'OpenAI',
		hosted_in: 'EU',
		description: 'Great for basic tasks',
		context_window: '128K',
		knowledge_cutoff: '2023-10-01',
		intelligence_score: 4.0,
		speed: 3.0,
		multimodal: true,
		reasoning: false,
		included: true,
		creditsPerMessage: 20
	},
	'Mistral Large 2': {
		organization: 'Mistral',
		hosted_in: 'France',
		description: 'Great for basic tasks',
		context_window: '128K',
		knowledge_cutoff: '2023-10-01',
		intelligence_score: 4.0,
		speed: 2.0,
		multimodal: false,
		reasoning: false,
		included: true,
		creditsPerMessage: 20
	},
	"GPT o1": {
		organization: 'OpenAI',
		hosted_in: 'EU',
		description: 'Optimized for coding & reasoning',
		context_window: '200K',
		knowledge_cutoff: '2023-10-01',
		intelligence_score: 4.5,
		speed: 2.5,
		multimodal: false,
		reasoning: true,
		included: true,
		creditsPerMessage: 20
	},
	'GPT o1-mini': {
		organization: 'OpenAI',
		hosted_in: 'EU',
		description: 'Lightweight coding assistant',
		context_window: '128K',
		knowledge_cutoff: '2023-10-01',
		intelligence_score: 4.5,
		speed: 3.5,
		multimodal: false,
		reasoning: true,
		included: true,
		creditsPerMessage: 20
	},
	'GPT o3-mini': {
		organization: 'OpenAI',
		hosted_in: 'EU',
		description: 'Optimized for coding & reasoning',
		context_window: '200K',
		knowledge_cutoff: '2023-10-01',
		intelligence_score: 4.5,
		speed: 3.5,
		multimodal: false,
		reasoning: true,
		included: true,
		creditsPerMessage: 20
	},
	'Pixtral Large': {
		organization: 'Mistral',
		hosted_in: 'France',
		description: 'Image-text multimodal integration',
		context_window: '128K',
		knowledge_cutoff: null,
		intelligence_score: null,
		speed: 0.5,
		multimodal: true,
		reasoning: false,
		included: true,
		creditsPerMessage: 20
	},
	'Llama 3.1': {
		organization: 'Meta',
		hosted_in: 'EU',
		description: 'Balanced general-purpose performance',
		context_window: '128K',
		knowledge_cutoff: '2023-12-01',
		intelligence_score: 4.5,
		speed: 3.0,
		multimodal: false,
		reasoning: false,
		included: true,
		creditsPerMessage: 20
	},
	'Perplexity Sonar Deep Research': {
		organization: 'Perplexity',
		hosted_in: 'US',
		description: 'Deep research & analysis',
		context_window: '128K',
		knowledge_cutoff: null,
		intelligence_score: null,
		speed: 1.0,
		multimodal: false,
		reasoning: false,
		included: true,
		creditsPerMessage: 20
	},
	'Perplexity Sonar Reasoning Pro': {
		organization: 'Perplexity',
		hosted_in: 'US',
		description: 'Advanced reasoning capabilities',
		context_window: '128K',
		knowledge_cutoff: null,
		intelligence_score: null,
		speed: 1.0,
		multimodal: false,
		reasoning: true,
		included: true,
		creditsPerMessage: 20
	},
	'Perplexity Sonar Pro': {
		organization: 'Perplexity',
		hosted_in: 'US',
		description: 'Balanced general-purpose performance',
		context_window: '200K',
		knowledge_cutoff: null,
		intelligence_score: null,
		speed: 1.0,
		multimodal: false,
		reasoning: false,
		included: true,
		creditsPerMessage: 20
	},
	"Perplexity Sonar": {
		organization: 'Perplexity',
		hosted_in: 'US',
		description: 'Great for basic tasks',
		context_window: '128K',
		knowledge_cutoff: null,
		intelligence_score: null,
		speed: 1.0,
		multimodal: false,
		reasoning: false,
		included: true,
		creditsPerMessage: 20
	}
};

export const mapModelsToOrganizations = (modelsInfo) => {
	const organizations = {};

	for (const [modelName, modelData] of Object.entries(modelsInfo)) {
		const { organization, description } = modelData;
		if(organization === "Deep Seek") {
			continue;
		}

		if (!organizations[organization]) {
			organizations[organization] = [];
		}
	
		organizations[organization].push(modelName);
		
		
	}

	return organizations;
};
