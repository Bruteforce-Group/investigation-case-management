// Local LLM Integration Service for Case Management System
// This service provides a unified interface for AI analysis using either local LLM or cloud providers

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const LOCAL_LLM_URL = process.env.LOCAL_LLM_URL || 'http://ollama:11434';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const DEFAULT_LOCAL_MODEL = process.env.DEFAULT_LOCAL_MODEL || 'llama2';
const CACHE_DIR = process.env.CACHE_DIR || './cache/llm';

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// LLM Provider Types
const LLMProvider = {
  LOCAL: 'local',
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic'
};

// Cache implementation for LLM responses
class LLMCache {
  constructor(cacheDir) {
    this.cacheDir = cacheDir;
  }

  getCacheKey(prompt, provider, model) {
    // Create a deterministic cache key from the input
    const hash = require('crypto')
      .createHash('md5')
      .update(`${prompt}-${provider}-${model}`)
      .digest('hex');
    return hash;
  }

  getCachedResponse(prompt, provider, model) {
    const cacheKey = this.getCacheKey(prompt, provider, model);
    const cachePath = path.join(this.cacheDir, `${cacheKey}.json`);
    
    if (fs.existsSync(cachePath)) {
      try {
        const cacheData = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
        // Check if cache is still valid (24 hours)
        const cacheTime = new Date(cacheData.timestamp);
        const now = new Date();
        const cacheAgeHours = (now - cacheTime) / (1000 * 60 * 60);
        
        if (cacheAgeHours < 24) {
          console.log(`Using cached LLM response for: ${prompt.substring(0, 50)}...`);
          return cacheData.response;
        }
      } catch (error) {
        console.error('Error reading cache:', error);
      }
    }
    
    return null;
  }

  cacheResponse(prompt, provider, model, response) {
    const cacheKey = this.getCacheKey(prompt, provider, model);
    const cachePath = path.join(this.cacheDir, `${cacheKey}.json`);
    
    try {
      const cacheData = {
        timestamp: new Date().toISOString(),
        prompt,
        provider,
        model,
        response
      };
      
      fs.writeFileSync(cachePath, JSON.stringify(cacheData, null, 2));
      console.log(`Cached LLM response for: ${prompt.substring(0, 50)}...`);
    } catch (error) {
      console.error('Error writing cache:', error);
    }
  }
}

// Initialize cache
const llmCache = new LLMCache(CACHE_DIR);

// Main LLM Service class
class LLMService {
  constructor() {
    this.provider = this.determineProvider();
    console.log(`LLM Service initialized with provider: ${this.provider}`);
  }

  // Determine which provider to use based on available API keys
  determineProvider() {
    if (OPENAI_API_KEY && OPENAI_API_KEY.length > 0) {
      return LLMProvider.OPENAI;
    } else if (ANTHROPIC_API_KEY && ANTHROPIC_API_KEY.length > 0) {
      return LLMProvider.ANTHROPIC;
    } else {
      return LLMProvider.LOCAL;
    }
  }

  // Set provider explicitly
  setProvider(provider) {
    if (provider === LLMProvider.OPENAI && (!OPENAI_API_KEY || OPENAI_API_KEY.length === 0)) {
      throw new Error('OpenAI API key not provided');
    }
    
    if (provider === LLMProvider.ANTHROPIC && (!ANTHROPIC_API_KEY || ANTHROPIC_API_KEY.length === 0)) {
      throw new Error('Anthropic API key not provided');
    }
    
    this.provider = provider;
    console.log(`LLM provider set to: ${provider}`);
    return this.provider;
  }

  // Get current provider
  getProvider() {
    return this.provider;
  }

  // Check if local LLM is available
  async isLocalLLMAvailable() {
    try {
      const response = await axios.get(`${LOCAL_LLM_URL}/api/version`);
      return response.status === 200;
    } catch (error) {
      console.error('Local LLM not available:', error.message);
      return false;
    }
  }

  // Generate text completion
  async generateCompletion(prompt, options = {}) {
    const model = options.model || this.getDefaultModel();
    const maxTokens = options.maxTokens || 1000;
    const temperature = options.temperature || 0.7;
    
    // Check cache first
    const cachedResponse = llmCache.getCachedResponse(prompt, this.provider, model);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    try {
      let response;
      
      switch (this.provider) {
        case LLMProvider.LOCAL:
          response = await this.generateLocalCompletion(prompt, model, maxTokens, temperature);
          break;
        case LLMProvider.OPENAI:
          response = await this.generateOpenAICompletion(prompt, model, maxTokens, temperature);
          break;
        case LLMProvider.ANTHROPIC:
          response = await this.generateAnthropicCompletion(prompt, model, maxTokens, temperature);
          break;
        default:
          throw new Error(`Unknown provider: ${this.provider}`);
      }
      
      // Cache the response
      llmCache.cacheResponse(prompt, this.provider, model, response);
      
      return response;
    } catch (error) {
      console.error(`Error generating completion with ${this.provider}:`, error.message);
      
      // Try fallback to local if cloud provider fails
      if (this.provider !== LLMProvider.LOCAL) {
        console.log('Falling back to local LLM...');
        const localAvailable = await this.isLocalLLMAvailable();
        
        if (localAvailable) {
          const fallbackProvider = this.provider;
          this.provider = LLMProvider.LOCAL;
          
          try {
            const fallbackResponse = await this.generateLocalCompletion(
              prompt, DEFAULT_LOCAL_MODEL, maxTokens, temperature
            );
            
            // Restore original provider
            this.provider = fallbackProvider;
            
            // Cache the fallback response
            llmCache.cacheResponse(prompt, LLMProvider.LOCAL, DEFAULT_LOCAL_MODEL, fallbackResponse);
            
            return fallbackResponse;
          } catch (fallbackError) {
            // Restore original provider
            this.provider = fallbackProvider;
            throw fallbackError;
          }
        }
      }
      
      throw error;
    }
  }

  // Generate embeddings for vector search
  async generateEmbeddings(text, options = {}) {
    const model = options.model || this.getDefaultEmbeddingModel();
    
    try {
      let embeddings;
      
      switch (this.provider) {
        case LLMProvider.LOCAL:
          embeddings = await this.generateLocalEmbeddings(text, model);
          break;
        case LLMProvider.OPENAI:
          embeddings = await this.generateOpenAIEmbeddings(text, model);
          break;
        case LLMProvider.ANTHROPIC:
          // Anthropic doesn't have a dedicated embeddings API, fallback to OpenAI or local
          if (OPENAI_API_KEY && OPENAI_API_KEY.length > 0) {
            embeddings = await this.generateOpenAIEmbeddings(text, 'text-embedding-ada-002');
          } else {
            embeddings = await this.generateLocalEmbeddings(text, model);
          }
          break;
        default:
          throw new Error(`Unknown provider: ${this.provider}`);
      }
      
      return embeddings;
    } catch (error) {
      console.error(`Error generating embeddings with ${this.provider}:`, error.message);
      
      // Try fallback to local if cloud provider fails
      if (this.provider !== LLMProvider.LOCAL) {
        console.log('Falling back to local LLM for embeddings...');
        const localAvailable = await this.isLocalLLMAvailable();
        
        if (localAvailable) {
          try {
            return await this.generateLocalEmbeddings(text, DEFAULT_LOCAL_MODEL);
          } catch (fallbackError) {
            throw fallbackError;
          }
        }
      }
      
      throw error;
    }
  }

  // Get default model based on provider
  getDefaultModel() {
    switch (this.provider) {
      case LLMProvider.LOCAL:
        return DEFAULT_LOCAL_MODEL;
      case LLMProvider.OPENAI:
        return 'gpt-3.5-turbo';
      case LLMProvider.ANTHROPIC:
        return 'claude-2';
      default:
        return DEFAULT_LOCAL_MODEL;
    }
  }

  // Get default embedding model based on provider
  getDefaultEmbeddingModel() {
    switch (this.provider) {
      case LLMProvider.LOCAL:
        return DEFAULT_LOCAL_MODEL;
      case LLMProvider.OPENAI:
        return 'text-embedding-ada-002';
      case LLMProvider.ANTHROPIC:
        // Anthropic doesn't have embeddings, use OpenAI if available, otherwise local
        return OPENAI_API_KEY ? 'text-embedding-ada-002' : DEFAULT_LOCAL_MODEL;
      default:
        return DEFAULT_LOCAL_MODEL;
    }
  }

  // Generate completion using local LLM (Ollama)
  async generateLocalCompletion(prompt, model, maxTokens, temperature) {
    try {
      const response = await axios.post(`${LOCAL_LLM_URL}/api/generate`, {
        model: model,
        prompt: prompt,
        max_tokens: maxTokens,
        temperature: temperature,
        stream: false
      });
      
      return response.data.response;
    } catch (error) {
      console.error('Error with local LLM:', error.message);
      throw new Error(`Local LLM error: ${error.message}`);
    }
  }

  // Generate completion using OpenAI
  async generateOpenAICompletion(prompt, model, maxTokens, temperature) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: maxTokens,
          temperature: temperature
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error with OpenAI:', error.message);
      throw new Error(`OpenAI error: ${error.message}`);
    }
  }

  // Generate completion using Anthropic
  async generateAnthropicCompletion(prompt, model, maxTokens, temperature) {
    try {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: maxTokens,
          temperature: temperature
        },
        {
          headers: {
            'x-api-key': ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data.content[0].text;
    } catch (error) {
      console.error('Error with Anthropic:', error.message);
      throw new Error(`Anthropic error: ${error.message}`);
    }
  }

  // Generate embeddings using local LLM
  async generateLocalEmbeddings(text, model) {
    try {
      const response = await axios.post(`${LOCAL_LLM_URL}/api/embeddings`, {
        model: model,
        prompt: text
      });
      
      return response.data.embedding;
    } catch (error) {
      console.error('Error with local embeddings:', error.message);
      throw new Error(`Local embeddings error: ${error.message}`);
    }
  }

  // Generate embeddings using OpenAI
  async generateOpenAIEmbeddings(text, model) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/embeddings',
        {
          model: model,
          input: text
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data.data[0].embedding;
    } catch (error) {
      console.error('Error with OpenAI embeddings:', error.message);
      throw new Error(`OpenAI embeddings error: ${error.message}`);
    }
  }
}

// Export the LLM service
module.exports = {
  LLMService,
  LLMProvider
};
