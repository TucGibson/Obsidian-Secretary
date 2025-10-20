// ============================================================================
// VERSION: 2.0.2 - API Key Validation & Debugging
// LAST UPDATED: 2025-10-20
// CHANGES: Added API key length validation, format checking, and detailed debugging logs
// ============================================================================

///// PART 1 START ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ============================================================================
// OBSIDIAN AI AGENT - PART 1: CONSTANTS & SETUP
// ============================================================================

const { Plugin, Notice, ItemView, PluginSettingTab, Setting, requestUrl } = require('obsidian');

// ============================================================================
// CONSTANTS
// ============================================================================

const VIEW_TYPE = 'ai-chat-view';

const DEFAULT_SETTINGS = {
  apiKey: '',
  model: 'gpt-5-nano',
  embeddingModel: 'text-embedding-3-small',
  reasoningEffort: 'medium',
  textVerbosity: 'medium',
  riskThreshold: 50,
  chunkSize: 800,
  chunkOverlap: 150
};

// Pricing per million tokens
const PRICING = {
  'gpt-5-nano': {
    cache_in: 0.005,
    input: 0.05,
    output: 0.40
  },
  'text-embedding-3-small': {
    input: 0.02 // per 1M tokens
  }
};

///// PART 1 END ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///// PART 2 START ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ============================================================================
// CONTEXT BUILDER - 5 Pillars System
// ============================================================================

class ContextBuilder {
  constructor(plugin) {
    this.plugin = plugin;
  }
  
  buildSystemMessages() {
    return [
      { 
        role: 'system', 
        content: this.buildPillar1() 
      },
      { 
        role: 'system', 
        content: this.buildPillar5() 
      },
      { 
        role: 'system', 
        content: this.buildPillar2() 
      }
    ];
  }
  
  buildPillar1() {
    return this.plugin.pillar1Content || this.getDefaultPillar1();
  }
  
  buildPillar5() {
    return this.plugin.pillar5Content || this.getDefaultPillar5();
  }
  
  buildPillar2() {
    const vaultStats = this.plugin.ragSystem?.getIndexStats() || { 
      totalFiles: 0, 
      totalChunks: 0, 
      indexed: false,
      embeddingMethod: 'Not loaded'
    };
    
    return `# WHAT YOU KNOW

## Vault Index Status
- Total Files: ${vaultStats.totalFiles}
- Total Chunks: ${vaultStats.totalChunks}
- Search Method: ${vaultStats.embeddingMethod}
- Index Ready: ${vaultStats.indexed ? 'YES' : 'NO'}

## Memory System
(Long-term memory not yet implemented)

## Available Context
You have semantic search via embeddings. Use retrieve_relevant_chunks for meaning-based queries after narrowing with list_files or search_lexical.`;
  }
  
  getDefaultPillar1() {
    return `# Pillar 1 – Tool Use (Read-Only Agent)

## Core Rules
- **Global facts** (contains "how many", "total", "list all"):
  1) Use \`list_files\` with filters (folder/tag/frontmatter).
  2) Paginate with \`cursor\` until \`next_cursor=null\` OR use \`mode:"count"\`.
  3) Compute the result, then call \`output_to_user\`.
  4) Never infer counts from passages.

- **Content/meaning questions** ("what did I write about X?", summarize, compare):
  1) First bound the set with \`list_files\` or \`search_lexical\` (filenames, headings, frontmatter only).
  2) Use \`retrieve_relevant_chunks\` - now with SEMANTIC SEARCH via embeddings.
  3) Synthesize an answer, cite paths/sections, then \`output_to_user\`.

- **Semantic understanding**: retrieve_relevant_chunks now finds conceptually similar content, not just keyword matches. "burnout" will find "exhaustion", "stress", "overwhelmed".

## Budget
- Estimate tokens ≈ chars/4, round up to 1k bands.
- Bands: ≤5k proceed; 5–10k narrow/paginate; 10–20k ask user; >20k revise plan.

## Termination
- Loop ends when you call \`output_to_user\`.
- Every \`function_call\` must receive matching \`function_call_output\` before next turn.

## Examples
- **Query: "What did I write about productivity?"**
  1) \`list_files(folder="Journal/")\`
  2) \`retrieve_relevant_chunks(query="productivity", within_paths=items, k=8)\` - finds semantic matches
  3) \`output_to_user("[summary with citations]")\`

- **Query: "How many journal entries?"**
  1) \`list_files(folder="Journal/", mode:"count")\`
  2) \`output_to_user("You have N entries.")\``;
  }
  
  getDefaultPillar5() {
    return `# WHAT NEEDS TO BE TRUE

## Completion Criteria
☐ Understand user intent (confidence ≥ 80%)
☐ Have necessary context from tools
☐ Plan formulated
☐ Operations safe/approved (if risky)
☐ Execution successful
☐ User request fulfilled

When all items are ✓, call output_to_user with final results.

## Important Notes
- output_to_user terminates the loop - use it ONLY when done
- If you need more information, use more tools
- Always verify before presenting final answer`;
  }
}

///// PART 2 END ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///// PART 3 START ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ============================================================================
// RAG SYSTEM - True Semantic Search with OpenAI Embeddings
// ============================================================================

class RAGSystem {
  constructor(plugin) {
    this.plugin = plugin;
    this.metadataCache = new Map();
    this.embeddings = new Map(); // path -> {chunks: [{text, embedding, start, end}]}
    this.isIndexing = false;
    this.indexed = false;
  }
  
  getCachedMetadata(file) {
    const path = file.path;
    if (!this.metadataCache.has(path)) {
      const cache = this.plugin.app.metadataCache.getFileCache(file);
      this.metadataCache.set(path, cache);
    }
    return this.metadataCache.get(path);
  }
  
  clearCache() {
    this.metadataCache.clear();
  }
  
  getIndexStats() {
    const files = this.plugin.app.vault.getMarkdownFiles();
    let totalChunks = 0;
    
    for (const [_, data] of this.embeddings) {
      totalChunks += data.chunks.length;
    }
    
    return {
      totalFiles: files.length,
      totalChunks: totalChunks,
      indexed: this.indexed,
      indexing: this.isIndexing,
      embeddingMethod: 'OpenAI Embeddings (semantic)'
    };
  }
  
  /**
   * Get embedding from OpenAI API
   */
  async getEmbedding(text) {
    const response = await requestUrl({
      url: 'https://api.openai.com/v1/embeddings',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.plugin.settings.apiKey}`
      },
      body: JSON.stringify({
        model: this.plugin.settings.embeddingModel,
        input: text,
        encoding_format: 'float'
      }),
      throw: false
    });

    if (response.status !== 200) {
      // Provide helpful error messages
      if (response.status === 401) {
        throw new Error(`Invalid API key. Please update your OpenAI API key in Settings → AI Agent.`);
      } else if (response.status === 429) {
        throw new Error(`Rate limit exceeded. Please wait and try again.`);
      } else {
        throw new Error(`Embedding API error: ${response.status}`);
      }
    }

    return response.json.data[0].embedding;
  }
  
  /**
   * Compute cosine similarity between two vectors
   */
  cosineSimilarity(a, b) {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    if (normA === 0 || normB === 0) return 0;
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
  
  /**
   * Chunk text into overlapping pieces
   */
  chunkText(text, chunkSize = 800, overlap = 150) {
    const chunks = [];
    let start = 0;
    let index = 0;
    
    // Handle empty text
    if (!text || text.length === 0) return chunks;
    
    // Ensure overlap is reasonable
    if (overlap >= chunkSize) {
      overlap = Math.floor(chunkSize / 2);
      console.warn('[RAG] Overlap >= chunkSize, capping at', overlap);
    }
    
    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      const chunkText = text.slice(start, end);
      
      if (chunkText.trim()) {
        chunks.push({
          text: chunkText.trim(),
          start: start,
          end: end,
          index: index++
        });
      }
      
      // Move to next chunk position
      const nextStart = end - overlap;
      
      // Ensure we always make progress (avoid infinite loops)
      if (nextStart <= start) {
        // If overlap would cause us to go backwards or stay put, just move to end
        start = end;
      } else {
        start = nextStart;
      }
      
      // Break if we've processed the entire text
      if (start >= text.length) break;
    }
    
    return chunks;
  }
  
  /**
   * Index a single file
   */
  async indexFile(file, progressCallback) {
    try {
      const content = await this.plugin.app.vault.read(file);
      
      // Skip empty files
      if (!content || content.trim().length === 0) {
        console.log(`[RAG] Skipping empty file: ${file.path}`);
        return true;
      }
      
      const chunks = this.chunkText(
        content,
        this.plugin.settings.chunkSize,
        this.plugin.settings.chunkOverlap
      );
      
      if (chunks.length === 0) {
        console.log(`[RAG] No chunks generated for: ${file.path}`);
        return true;
      }
      
      const chunksWithEmbeddings = [];
      
      // Batch embeddings to reduce API calls (up to 8 at once)
      const batchSize = 8;
      for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        
        // Filter and truncate texts to fit API limits
        // OpenAI embedding models have ~8191 token limit (~32k chars)
        const texts = batch.map(c => {
          let text = c.text.trim();
          // Truncate if too long (conservative limit)
          if (text.length > 30000) {
            text = text.substring(0, 30000);
            console.warn(`[RAG] Truncated chunk in ${file.path}`);
          }
          return text;
        }).filter(t => t.length > 0);
        
        if (texts.length === 0) {
          console.warn(`[RAG] Batch had no valid texts in ${file.path}`);
          continue;
        }
        
        // Log the request for debugging
        console.log(`[RAG] Requesting embeddings for ${file.path}: ${texts.length} chunks, model: ${this.plugin.settings.embeddingModel}`);
        
        // Get embeddings for batch
        const response = await requestUrl({
          url: 'https://api.openai.com/v1/embeddings',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.plugin.settings.apiKey}`
          },
          body: JSON.stringify({
            model: this.plugin.settings.embeddingModel,
            input: texts,
            encoding_format: 'float'
          }),
          throw: false
        });
        
        if (response.status !== 200) {
          console.error(`[RAG] API error for ${file.path}:`, response.status, response.json);

          // Provide helpful error messages based on status code
          if (response.status === 401) {
            throw new Error(`Invalid API key. Please check your OpenAI API key in plugin settings. Go to Settings → AI Agent → OpenAI API Key and update it. You can get a valid key at https://platform.openai.com/api-keys`);
          } else if (response.status === 429) {
            throw new Error(`Rate limit exceeded. Please wait a moment and try again, or check your OpenAI API quota.`);
          } else if (response.status === 403) {
            throw new Error(`Access forbidden. Your API key may not have permission to use the embeddings API.`);
          } else {
            throw new Error(`Embedding API error ${response.status}: ${JSON.stringify(response.json)}`);
          }
        }
        
        const embeddings = response.json.data;
        
        for (let j = 0; j < batch.length; j++) {
          if (embeddings[j] && embeddings[j].embedding) {
            chunksWithEmbeddings.push({
              ...batch[j],
              embedding: embeddings[j].embedding
            });
          }
        }
        
        if (progressCallback) {
          progressCallback(file.path, i + batch.length, chunks.length);
        }
      }
      
      if (chunksWithEmbeddings.length === 0) {
        console.warn(`[RAG] No embeddings generated for ${file.path}`);
        return false;
      }
      
      this.embeddings.set(file.path, {
        chunks: chunksWithEmbeddings,
        indexed_at: Date.now()
      });
      
      console.log(`[RAG] Indexed ${file.path}: ${chunksWithEmbeddings.length} chunks`);
      return true;
    } catch (error) {
      console.error(`[RAG] Error indexing ${file.path}:`, error);
      return false;
    }
  }
  
  /**
   * Index entire vault
   */
  async indexVault(progressCallback) {
    if (this.isIndexing) {
      throw new Error('Indexing already in progress');
    }

    // Validate settings
    if (!this.plugin.settings.apiKey) {
      throw new Error('OpenAI API key not set. Please add it in plugin settings.');
    }

    // Validate API key format
    const apiKey = this.plugin.settings.apiKey.trim();
    if (!apiKey.startsWith('sk-')) {
      throw new Error('Invalid API key format. OpenAI API keys should start with "sk-". Please check your API key in Settings → AI Agent.');
    }

    // Log API key info (first 10 chars only for security)
    console.log(`[RAG] API Key prefix: ${apiKey.substring(0, 10)}...`);
    console.log(`[RAG] API Key suffix: ...${apiKey.substring(apiKey.length - 4)}`);
    console.log(`[RAG] API Key length: ${apiKey.length} characters`);

    // Warn if key length is unusual
    if (apiKey.length > 200) {
      throw new Error(`API key is unusually long (${apiKey.length} characters). It may be corrupted. Please get a fresh API key from https://platform.openai.com/api-keys and paste it carefully.`);
    } else if (apiKey.length < 40) {
      throw new Error(`API key is too short (${apiKey.length} characters). Please check that you copied the complete key.`);
    }

    if (!this.plugin.settings.embeddingModel) {
      throw new Error('Embedding model not set. Please configure in plugin settings.');
    }

    console.log(`[RAG] Using embedding model: ${this.plugin.settings.embeddingModel}`);
    
    this.isIndexing = true;
    this.indexed = false;
    
    try {
      const files = this.plugin.app.vault.getMarkdownFiles();
      let completed = 0;
      let successful = 0;
      let failed = 0;
      
      console.log(`[RAG] Starting indexing of ${files.length} files`);
      
      for (const file of files) {
        const success = await this.indexFile(file, progressCallback);
        completed++;
        
        if (success) {
          successful++;
        } else {
          failed++;
        }
        
        if (progressCallback) {
          progressCallback(file.path, completed, files.length);
        }
      }
      
      this.indexed = successful > 0;
      console.log(`[RAG] Indexing complete: ${successful} succeeded, ${failed} failed, ${this.embeddings.size} files indexed`);
      
      if (failed > 0) {
        console.warn(`[RAG] ${failed} files failed to index`);
      }
      
    } finally {
      this.isIndexing = false;
    }
  }
  
  /**
   * Apply Maximal Marginal Relevance for diversity
   */
  applyMMR(candidates, queryEmbedding, lambda = 0.7, topK = 8) {
    if (candidates.length === 0) return [];
    
    const selected = [];
    const remaining = [...candidates];
    
    // Select first (highest scoring)
    selected.push(remaining.shift());
    
    while (selected.length < topK && remaining.length > 0) {
      let bestIdx = 0;
      let bestScore = -Infinity;
      
      for (let i = 0; i < remaining.length; i++) {
        const candidate = remaining[i];
        
        // Relevance score (already computed)
        const relevance = candidate.score;
        
        // Max similarity to already selected
        let maxSim = 0;
        for (const sel of selected) {
          const sim = this.cosineSimilarity(candidate.embedding, sel.embedding);
          maxSim = Math.max(maxSim, sim);
        }
        
        // MMR score
        const mmrScore = lambda * relevance - (1 - lambda) * maxSim;
        
        if (mmrScore > bestScore) {
          bestScore = mmrScore;
          bestIdx = i;
        }
      }
      
      selected.push(remaining.splice(bestIdx, 1)[0]);
    }
    
    return selected;
  }
  
  /**
   * Retrieve relevant chunks using semantic search
   */
  async retrieveRelevantChunks(options = {}) {
    const {
      query,
      k = 8,
      within_paths = [],
      max_chunks_per_file = 2,
      min_score = 0.3,
      max_total_chars = 16000
    } = options;
    
    if (!this.indexed) {
      return {
        error: 'Vault not indexed. Please run "Index Vault" command first.',
        hits: []
      };
    }
    
    console.log('[RAG] Retrieving chunks:', { query, k, within_paths: within_paths.length });
    
    // Get query embedding
    const queryEmbedding = await this.getEmbedding(query);
    
    // Determine which files to search
    let searchPaths = within_paths;
    
    if (searchPaths.length === 0) {
      // Search all indexed files
      searchPaths = Array.from(this.embeddings.keys());
      console.log('[RAG] Searching all', searchPaths.length, 'indexed files');
    }
    
    // Collect all chunks with scores
    const allChunks = [];
    
    for (const path of searchPaths) {
      const fileData = this.embeddings.get(path);
      if (!fileData) continue;
      
      for (const chunk of fileData.chunks) {
        const score = this.cosineSimilarity(queryEmbedding, chunk.embedding);
        
        if (score >= min_score) {
          allChunks.push({
            path: path,
            score: score,
            start: chunk.start,
            end: chunk.end,
            text: chunk.text,
            embedding: chunk.embedding,
            heading_path: []
          });
        }
      }
    }
    
    console.log('[RAG] Scored', allChunks.length, 'chunks (min_score:', min_score, ')');
    
    // Sort by score
    allChunks.sort((a, b) => b.score - a.score);
    
    // Apply MMR for diversity
    const diversified = this.applyMMR(allChunks, queryEmbedding, 0.7, k * 3);
    
    // Apply per-file cap
    const perFileCount = new Map();
    const finalHits = [];
    
    for (const chunk of diversified) {
      const count = perFileCount.get(chunk.path) || 0;
      
      if (count < max_chunks_per_file) {
        // Remove embedding from output (too large)
        const { embedding, ...chunkWithoutEmbedding } = chunk;
        finalHits.push(chunkWithoutEmbedding);
        perFileCount.set(chunk.path, count + 1);
      }
      
      if (finalHits.length >= k) break;
    }
    
    console.log('[RAG] Returning', finalHits.length, 'chunks after MMR and per-file cap');
    
    return {
      query: query,
      hits: finalHits
    };
  }
}

///// PART 3 END ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///// PART 4 START ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ============================================================================
// TOOL MANAGER & TOOL IMPLEMENTATIONS
// ============================================================================

class ToolManager {
  constructor(plugin) {
    this.plugin = plugin;
    this.tools = this.initializeTools();
    this.toolCallHistory = new Map();
  }
  
  normalizePaths(within_paths) {
    let p = within_paths || [];

    if (Array.isArray(p) && p.length === 1 && Array.isArray(p[0])) {
      console.log('[ToolManager] Unwrapping nested within_paths array');
      p = p[0];
    }

    p = p.filter(x => typeof x === "string");
    return Array.from(new Set(p));
  }

  initializeTools() {
    return {
      list_files: {
        schema: {
          type: 'function',
          name: 'list_files',
          description: 'Enumerate files with optional filters. Use for counts, lists, discovery. Supports pagination.',
          parameters: {
            type: 'object',
            properties: {
              folder: {
                type: 'string',
                description: 'Filter by folder path'
              },
              tag: {
                type: 'string',
                description: 'Filter by tag'
              },
              query: {
                type: 'string',
                description: 'Simple filename pattern match'
              },
              mode: {
                type: 'string',
                enum: ['page', 'count'],
                description: 'Return paginated results or just count. Default: page'
              },
              cursor: {
                type: 'number',
                description: 'Pagination cursor'
              },
              limit: {
                type: 'number',
                description: 'Max results per page. Default: 200'
              }
            }
          }
        },
        execute: async (args) => {
          const mode = args.mode || 'page';
          const limit = args.limit || 200;
          const cursor = args.cursor || 0;
          
          let files = this.plugin.app.vault.getMarkdownFiles();
          
          if (args.folder) {
            const folderPath = args.folder.toLowerCase().replace(/^\/+|\/+$/g, '');
            files = files.filter(f => 
              f.path.toLowerCase().startsWith(folderPath + '/') ||
              f.path.toLowerCase().startsWith(folderPath)
            );
          }
          
          if (args.query) {
            const q = args.query.toLowerCase();
            files = files.filter(f => 
              f.path.toLowerCase().includes(q) ||
              f.name.toLowerCase().includes(q)
            );
          }
          
          if (args.tag) {
            const tagToFind = args.tag.replace(/^#/, '').toLowerCase();
            const filesWithTag = [];
            
            for (const file of files) {
              const cache = this.plugin.ragSystem.getCachedMetadata(file);
              if (cache?.tags) {
                const hasTags = cache.tags.some(t => 
                  t.tag.toLowerCase().replace(/^#/, '') === tagToFind
                );
                if (hasTags) filesWithTag.push(file);
              }
              if (cache?.frontmatter?.tags) {
                const fmTags = Array.isArray(cache.frontmatter.tags) 
                  ? cache.frontmatter.tags 
                  : [cache.frontmatter.tags];
                const hasFmTag = fmTags.some(t => 
                  String(t).toLowerCase().replace(/^#/, '') === tagToFind
                );
                if (hasFmTag) filesWithTag.push(file);
              }
            }
            files = filesWithTag;
          }
          
          const totalCount = files.length;
          
          if (mode === 'count') {
            return { count: totalCount };
          }
          
          const pagedFiles = files.slice(cursor, cursor + limit);
          const items = Array.from(new Set(pagedFiles.map(f => f.path)));
          const hasMore = cursor + items.length < totalCount;
          
          return {
            items: items,
            next_cursor: hasMore ? cursor + limit : null,
            total: totalCount
          };
        }
      },
      
      get_files_metadata: {
        schema: {
          type: 'function',
          name: 'get_files_metadata',
          description: 'Get metadata (size, dates) for multiple files.',
          parameters: {
            type: 'object',
            properties: {
              paths: {
                type: 'array',
                items: { type: 'string' },
                description: 'Array of file paths'
              }
            },
            required: ['paths']
          }
        },
        execute: async (args) => {
          const metadata = [];
          let totalSize = 0;
          
          for (const path of args.paths) {
            const file = this.plugin.app.vault.getAbstractFileByPath(path);
            if (file && file.stat) {
              const size = file.stat.size;
              metadata.push({
                path: path,
                size: size,
                created: file.stat.ctime,
                modified: file.stat.mtime
              });
              totalSize += size;
            }
          }
          
          return {
            items: metadata,
            total_size_bytes: totalSize,
            total_size_kb: Math.round(totalSize / 1024),
            estimated_tokens_1k: Math.ceil(totalSize / 4 / 1000) * 1000
          };
        }
      },
      
      get_frontmatter: {
        schema: {
          type: 'function',
          name: 'get_frontmatter',
          description: 'Read frontmatter only (cheap, no content).',
          parameters: {
            type: 'object',
            properties: {
              paths: {
                type: 'array',
                items: { type: 'string' },
                description: 'Array of file paths'
              }
            },
            required: ['paths']
          }
        },
        execute: async (args) => {
          const results = [];
          
          for (const path of args.paths) {
            const file = this.plugin.app.vault.getAbstractFileByPath(path);
            if (file) {
              const cache = this.plugin.ragSystem.getCachedMetadata(file);
              results.push({
                path: path,
                frontmatter: cache?.frontmatter || null
              });
            }
          }
          
          return { items: results };
        }
      },
      
      list_tags: {
        schema: {
          type: 'function',
          name: 'list_tags',
          description: 'Get all tags in vault or filter by prefix.',
          parameters: {
            type: 'object',
            properties: {
              prefix: {
                type: 'string',
                description: 'Optional prefix filter'
              }
            }
          }
        },
        execute: async (args) => {
          const allTags = {};
          const files = this.plugin.app.vault.getMarkdownFiles();
          
          for (const file of files) {
            const cache = this.plugin.ragSystem.getCachedMetadata(file);
            
            if (cache?.tags) {
              for (const tagRef of cache.tags) {
                const tag = tagRef.tag.replace(/^#/, '');
                allTags[tag] = (allTags[tag] || 0) + 1;
              }
            }
            
            if (cache?.frontmatter?.tags) {
              const fmTags = Array.isArray(cache.frontmatter.tags)
                ? cache.frontmatter.tags
                : [cache.frontmatter.tags];
              
              for (const tag of fmTags) {
                const cleanTag = String(tag).replace(/^#/, '');
                allTags[cleanTag] = (allTags[cleanTag] || 0) + 1;
              }
            }
          }
          
          let tagList = Object.entries(allTags).map(([tag, count]) => ({ tag, count }));
          
          if (args.prefix) {
            const prefix = args.prefix.toLowerCase().replace(/^#/, '');
            tagList = tagList.filter(t => t.tag.toLowerCase().startsWith(prefix));
          }
          
          tagList.sort((a, b) => b.count - a.count);
          
          return { tags: tagList };
        }
      },
      
      list_backlinks: {
        schema: {
          type: 'function',
          name: 'list_backlinks',
          description: 'Get incoming links to a file.',
          parameters: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'Target file path'
              }
            },
            required: ['path']
          }
        },
        execute: async (args) => {
          const file = this.plugin.app.vault.getAbstractFileByPath(args.path);
          if (!file) {
            return { error: 'File not found', backlinks: [] };
          }
          
          const backlinks = [];
          const backlinkData = this.plugin.app.metadataCache.getBacklinksForFile(file);
          
          if (backlinkData && backlinkData.data) {
            for (const [sourcePath, refs] of Object.entries(backlinkData.data)) {
              backlinks.push({
                from_path: sourcePath,
                count: refs.length
              });
            }
          }
          
          return { backlinks };
        }
      },
      
      read_files_batch: {
        schema: {
          type: 'function',
          name: 'read_files_batch',
          description: 'Read multiple files with budget protection.',
          parameters: {
            type: 'object',
            properties: {
              paths: {
                type: 'array',
                items: { type: 'string' },
                description: 'Array of file paths to read'
              },
              max_total_chars: {
                type: 'number',
                description: 'Maximum total characters. Default: 50000'
              }
            },
            required: ['paths']
          }
        },
        execute: async (args) => {
          const maxChars = args.max_total_chars || 50000;
          const results = [];
          const truncated = [];
          let totalChars = 0;

          for (const path of args.paths) {
            if (totalChars >= maxChars) {
              truncated.push(path);
              continue;
            }

            const file = this.plugin.app.vault.getAbstractFileByPath(path);
            if (file) {
              try {
                const content = await this.plugin.app.vault.read(file);
                const remaining = maxChars - totalChars;

                if (content.length <= remaining) {
                  results.push({ path, text: content });
                  totalChars += content.length;
                } else {
                  results.push({
                    path,
                    text: content.substring(0, remaining),
                    truncated: true
                  });
                  totalChars += remaining;
                  truncated.push(path);
                }
              } catch (error) {
                results.push({ path, error: error.message });
              }
            }
          }

          return {
            items: results,
            truncated_paths: truncated,
            total_chars: totalChars,
            estimated_tokens_1k: Math.ceil(totalChars / 4 / 1000) * 1000
          };
        }
      },

      retrieve_relevant_chunks: {
        schema: {
          type: 'function',
          name: 'retrieve_relevant_chunks',
          description: 'SEMANTIC passage retrieval using OpenAI embeddings. Finds conceptually similar content, not just keyword matches. Use AFTER narrowing with list_files.',
          parameters: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Query for semantic content retrieval'
              },
              k: {
                type: 'number',
                description: 'Number of chunks to retrieve. Default: 8'
              },
              within_paths: {
                type: 'array',
                items: { type: 'string' },
                description: 'Optional: restrict to these file paths'
              },
              max_chunks_per_file: {
                type: 'number',
                description: 'Maximum chunks per file. Default: 2'
              },
              min_score: {
                type: 'number',
                description: 'Minimum similarity score. Default: 0.3'
              },
              max_total_chars: {
                type: 'number',
                description: 'Max chars to read. Default: 16000'
              }
            },
            required: ['query']
          }
        },
        execute: async (args) => {
          const normalizedArgs = {
            ...args,
            within_paths: this.normalizePaths(args.within_paths)
          };
          
          const result = await this.plugin.ragSystem.retrieveRelevantChunks(normalizedArgs);
          
          if (result.error) {
            return result;
          }
          
          const totalChars = result.hits.reduce((sum, h) => sum + h.text.length, 0);
          result.estimated_tokens_1k = Math.ceil(totalChars / 4 / 1000) * 1000;
          
          return result;
        }
      },
      
      output_to_user: {
        schema: {
          type: 'function',
          name: 'output_to_user',
          description: 'Present final answer. This TERMINATES the loop. Only call when task is complete.',
          parameters: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                description: 'Final answer to display'
              }
            },
            required: ['message']
          }
        },
        execute: async (args) => {
          return {
            final_output: true,
            message: args.message
          };
        }
      }
    };
  }
  
  getToolSchemas() {
    return Object.values(this.tools).map(tool => tool.schema);
  }
  
  async executeTool(name, args) {
    const tool = this.tools[name];
    if (!tool) {
      throw new Error(`Tool not found: ${name}`);
    }
    
    console.log(`[Tool] Executing ${name}`, args);
    
    try {
      const result = await tool.execute(args);
      
      const callKey = `${name}:${JSON.stringify(args)}`;
      const isZeroResult = this.isZeroResult(name, result);
      
      if (isZeroResult) {
        const prevCount = this.toolCallHistory.get(callKey) || 0;
        this.toolCallHistory.set(callKey, prevCount + 1);
        
        if (prevCount > 0) {
          console.warn(`[Tool] ${name} returned 0 results ${prevCount + 1} times`);
          result.repeated_zero_result = true;
          result.escalation_hint = 'Consider broadening search scope';
        }
      }
      
      console.log(`[Tool] ${name} completed`, result);
      return result;
    } catch (error) {
      console.error(`[Tool] Error executing ${name}:`, error);
      return {
        error: error.message,
        tool: name
      };
    }
  }
  
  isZeroResult(toolName, result) {
    if (!result) return true;

    if (toolName === 'list_files') {
      return result.count === 0 || result.items?.length === 0;
    }

    if (toolName === 'retrieve_relevant_chunks') {
      return !result.hits?.length;
    }

    return false;
  }
  
  clearHistory() {
    this.toolCallHistory.clear();
  }
}

///// PART 4 END ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///// PART 5-9 are identical to original, so I'll include them for completeness ////

///// PART 5 START ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class AgentLoop {
  constructor(plugin, userMessage) {
    this.plugin = plugin;
    this.userMessage = userMessage;
    this.maxIterations = 20;
    this.iteration = 0;
    this.callbacks = {};
  }
  
  async run(callbacks = {}) {
    this.callbacks = callbacks;
    
    try {
      const systemMessages = this.plugin.contextBuilder.buildSystemMessages();
      const firstTurnInput = [
        ...systemMessages,
        { role: 'user', content: this.userMessage }
      ];
      
      let response = await this.step(firstTurnInput);
      
      if (this.isDone) {
        return {
          success: true,
          finalOutput: this.finalOutput,
          iterations: this.iteration,
          usage: response.usage
        };
      }
      
      while (this.iteration < this.maxIterations && !this.isDone) {
        this.iteration++;
        console.log(`\n=== AGENT LOOP ITERATION ${this.iteration} ===`);
        
        const parsed = this.plugin.apiHandler.parseResponse(response);
        
        if (parsed.toolCalls && parsed.toolCalls.length > 0) {
          const outputs = await this.executeToolCalls(parsed.toolCalls);
          response = await this.plugin.apiHandler.flushToolOutputs(outputs);
          
          if (this.isDone) {
            return {
              success: true,
              finalOutput: this.finalOutput,
              iterations: this.iteration,
              usage: response.usage
            };
          }
        } else if (parsed.text) {
          console.warn('[AgentLoop] Model returned free text without output_to_user');
          this.finalOutput = parsed.text;
          this.isDone = true;
          return {
            success: true,
            finalOutput: this.finalOutput,
            iterations: this.iteration,
            usage: response.usage
          };
        } else {
          throw new Error('Model stopped without calling output_to_user or providing text');
        }
      }
      
      throw new Error(`Agent reached maximum iterations (${this.maxIterations})`);
      
    } catch (error) {
      console.error('[AgentLoop] Error:', error);
      return {
        success: false,
        error: error.message,
        iterations: this.iteration
      };
    }
  }
  
  async step(firstTurnInput) {
    this.iteration++;
    console.log(`\n=== AGENT LOOP ITERATION ${this.iteration} ===`);
    
    const firstResponse = await this.plugin.apiHandler.sendMessageWithTools(firstTurnInput);
    
    const parsed = this.plugin.apiHandler.parseResponse(firstResponse);
    
    if (!parsed.toolCalls || parsed.toolCalls.length === 0) {
      if (parsed.text) {
        console.warn('[AgentLoop] Model returned text without tools on first turn');
        this.isDone = true;
        this.finalOutput = parsed.text;
        return firstResponse;
      }
      throw new Error('Model returned no tool calls and no text');
    }
    
    const outputs = await this.executeToolCalls(parsed.toolCalls);
    const followupResponse = await this.plugin.apiHandler.flushToolOutputs(outputs);
    
    return followupResponse;
  }
  
  async executeToolCalls(toolCalls) {
    const outputs = [];
    
    for (const toolCall of toolCalls) {
      const { name, arguments: args, id } = toolCall;
      
      this.sendToolCall(name, args);
      
      if (name === 'output_to_user') {
        this.finalOutput = args.message;
        this.isDone = true;
        this.sendUpdate('✓ Final output ready');
        
        const result = {
          final_output: true,
          message: args.message
        };
        
        outputs.push({
          type: "function_call_output",
          call_id: id,
          output: JSON.stringify(result)
        });
        
        this.sendToolResult(name, result);
        continue;
      }
      
      if (name === 'request_approval') {
        const approved = await this.getUserApproval(args.operation_details);
        const result = {
          approved: approved,
          message: approved ? 'User approved' : 'User denied'
        };
        
        outputs.push({
          type: "function_call_output",
          call_id: id,
          output: JSON.stringify(result)
        });
        
        this.sendToolResult(name, result);
        continue;
      }
      
      const result = await this.plugin.toolManager.executeTool(name, args);
      
      outputs.push({
        type: "function_call_output",
        call_id: id,
        output: JSON.stringify(result)
      });
      
      this.sendToolResult(name, result);
    }
    
    return outputs;
  }
  
  async getUserApproval(operationDetails) {
    if (this.callbacks.onApprovalNeeded) {
      return await this.callbacks.onApprovalNeeded(operationDetails);
    }
    return false;
  }
  
  sendUpdate(message) {
    if (this.callbacks.onUpdate) {
      this.callbacks.onUpdate(message);
    }
  }
  
  sendToolCall(name, args) {
    if (this.callbacks.onToolCall) {
      this.callbacks.onToolCall(name, args);
    }
  }
  
  sendToolResult(name, result) {
    if (this.callbacks.onToolResult) {
      this.callbacks.onToolResult(name, result);
    }
  }
}

///// PART 5 END ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///// PART 6 START (APIHandler - unchanged) ////

class APIHandler {
  constructor(plugin) {
    this.plugin = plugin;
  }
  
  async sendMessageWithTools(inputItems) {
    const tools = this.plugin.toolManager.getToolSchemas();
    
    console.log('[API] Sending request');
    console.log('[API] Input items:', inputItems.length);
    
    const requestBody = {
      model: this.plugin.settings.model,
      input: inputItems,
      tools: tools,
      reasoning: { effort: this.plugin.settings.reasoningEffort },
      text: { verbosity: this.plugin.settings.textVerbosity },
      store: true,
      stream: false
    };
    
    if (this.plugin.previousResponseId) {
      requestBody.previous_response_id = this.plugin.previousResponseId;
      console.log('[API] Threading with previous_response_id:', this.plugin.previousResponseId.substring(0, 20) + '...');
    }
    
    const response = await requestUrl({
      url: 'https://api.openai.com/v1/responses',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.plugin.settings.apiKey}`
      },
      body: JSON.stringify(requestBody),
      throw: false
    });
    
    if (response.status !== 200) {
      console.error('[API] Error response:', response.json);
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = response.json;
    this.plugin.previousResponseId = data.id;
    
    console.log('[API] Response received');
    
    return data;
  }
  
  async flushToolOutputs(outputs) {
    if (!outputs || outputs.length === 0) {
      return null;
    }
    
    console.log('[API] Flushing', outputs.length, 'function_call_output items');
    
    for (const output of outputs) {
      if (!output.call_id) {
        throw new Error('Cannot flush output without call_id');
      }
    }
    
    const response = await this.sendMessageWithTools(outputs);
    console.log('[API] Tool outputs flushed successfully');
    
    return response;
  }
  
  parseResponse(data) {
    const result = {
      text: '',
      toolCalls: [],
      usage: data.usage
    };
    
    if (!data.output || !Array.isArray(data.output)) {
      return result;
    }
    
    for (const item of data.output) {
      if (item.type === 'message' && item.content) {
        for (const content of item.content) {
          if (content.type === 'output_text' || content.type === 'text') {
            const text = content.text || content.content || '';
            if (text) result.text += text;
          }
          
          if (content.type === 'function_call' || content.type === 'tool_call') {
            const toolCall = this.extractToolCall(content);
            if (toolCall) result.toolCalls.push(toolCall);
          }
        }
      }
      
      if (item.type === 'function_call') {
        const toolCall = this.extractToolCall(item);
        if (toolCall) result.toolCalls.push(toolCall);
      }
    }
    
    return result;
  }
  
  extractToolCall(item) {
    try {
      const callId = item.call_id || item.id;
      if (!callId) {
        console.error('[API] Missing call_id on function_call');
        return null;
      }
      
      const args = typeof item.arguments === 'string' 
        ? JSON.parse(item.arguments)
        : item.arguments;
      
      return {
        id: callId,
        name: item.name || item.function?.name,
        arguments: args
      };
    } catch (error) {
      console.error('[API] Error parsing tool call:', error);
      return null;
    }
  }
  
  getItemPreview(item) {
    if (item.content && typeof item.content === 'string') {
      return `"${item.content.substring(0, 80)}..."`;
    }
    if (item.output && typeof item.output === 'string') {
      return item.output.substring(0, 80) + '...';
    }
    if (item.type && item.call_id) {
      return `[${item.type} id=${item.call_id.substring(0, 20)}...]`;
    }
    return 'N/A';
  }
}

///// PART 6 END ////

///// PART 7 START (ChatView with indexing UI) ////

class ChatView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }
  
  getViewType() {
    return VIEW_TYPE;
  }
  
  getDisplayText() {
    return 'AI Agent';
  }
  
  getIcon() {
    return 'bot';
  }
  
  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    container.addClass('chat-view');

    const header = container.createDiv({ cls: 'chat-header' });
    header.createEl('strong', { text: 'AI Agent - Semantic RAG' });

    // Version display
    const versionEl = header.createEl('span', {
      cls: 'version-tag',
      text: 'v2.0.2'
    });
    versionEl.style.fontSize = '11px';
    versionEl.style.opacity = '0.7';
    versionEl.style.marginLeft = '10px';

    // Index button
    const indexBtn = header.createEl('button', {
      cls: 'chat-btn',
      text: 'Index Vault'
    });
    indexBtn.onclick = () => this.indexVault();
    
    // Reset button
    const resetBtn = header.createEl('button', {
      cls: 'chat-btn',
      text: 'New Chat'
    });
    resetBtn.onclick = () => {
      this.chatEl.empty();
      this.plugin.resetConversation();
      this.addMessage('system', '=== New conversation started ===');
      this.updateIndexStatus();
    };
    
    // Index status
    this.statusEl = container.createDiv({ cls: 'index-status' });
    this.updateIndexStatus();
    
    this.chatEl = container.createDiv({ cls: 'chat-messages' });
    
    const stats = this.plugin.ragSystem.getIndexStats();
    let welcomeMsg = 'AI Agent with Semantic RAG - v2.0.2\n\n';

    if (stats.indexed) {
      welcomeMsg += `✓ Vault indexed: ${stats.totalFiles} files, ${stats.totalChunks} chunks\nReady to answer questions with semantic understanding!`;
    } else {
      welcomeMsg += '⚠️ Vault not indexed yet. Click "Index Vault" to enable semantic search.';
    }
    
    this.addMessage('system', welcomeMsg);
    
    const inputContainer = container.createDiv({ cls: 'chat-input-container' });
    
    this.inputEl = inputContainer.createEl('textarea', {
      cls: 'chat-input',
      placeholder: 'Ask me anything about your vault...'
    });
    
    this.sendBtn = inputContainer.createEl('button', {
      cls: 'chat-send-btn',
      text: 'Send'
    });
    
    this.sendBtn.onclick = () => this.handleSend();
    this.inputEl.onkeydown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSend();
      }
    };
  }
  
  updateIndexStatus() {
    if (!this.statusEl) return;
    
    const stats = this.plugin.ragSystem.getIndexStats();
    
    if (stats.indexing) {
      this.statusEl.textContent = '⏳ Indexing in progress...';
      this.statusEl.className = 'index-status indexing';
    } else if (stats.indexed) {
      this.statusEl.textContent = `✓ Indexed: ${stats.totalFiles} files, ${stats.totalChunks} chunks`;
      this.statusEl.className = 'index-status indexed';
    } else {
      this.statusEl.textContent = '⚠️ Not indexed - click "Index Vault"';
      this.statusEl.className = 'index-status not-indexed';
    }
  }
  
  async indexVault() {
    const statusMsg = this.addMessage('system', '🔄 Indexing vault...');
    this.updateIndexStatus();
    
    try {
      let lastUpdate = Date.now();
      
      await this.plugin.ragSystem.indexVault((path, current, total) => {
        // Throttle updates to every 500ms
        const now = Date.now();
        if (now - lastUpdate > 500 || current === total) {
          statusMsg.textContent = `🔄 Indexing: ${current}/${total} files`;
          this.updateIndexStatus();
          lastUpdate = now;
        }
      });
      
      const stats = this.plugin.ragSystem.getIndexStats();
      statusMsg.textContent = `✓ Indexing complete! ${stats.totalChunks} chunks from ${stats.totalFiles} files`;
      this.updateIndexStatus();
      new Notice('Vault indexed successfully!');
      
    } catch (error) {
      statusMsg.textContent = `❌ Indexing failed: ${error.message}`;
      new Notice('Indexing failed: ' + error.message);
      console.error('[ChatView] Indexing error:', error);
    }
  }
  
  async handleSend() {
    const message = this.inputEl.value.trim();
    if (!message) return;
    
    this.inputEl.value = '';
    this.inputEl.disabled = true;
    this.sendBtn.disabled = true;
    
    this.addMessage('user', message);
    
    const thinkingEl = this.chatEl.createDiv({ cls: 'chat-message thinking' });
    thinkingEl.textContent = '🤔 Thinking...';
    
    try {
      const agentLoop = new AgentLoop(this.plugin, message);
      
      const result = await agentLoop.run({
        onUpdate: (msg) => {
          thinkingEl.textContent = `🤔 ${msg}`;
          this.scrollToBottom();
        },
        
        onToolCall: (name, args) => {
          const toolEl = this.chatEl.createDiv({ cls: 'chat-message tool-call' });
          toolEl.textContent = `🔧 ${name}(${JSON.stringify(args).slice(0, 100)}...)`;
          this.scrollToBottom();
        },
        
        onToolResult: (name, result) => {
          const resultEl = this.chatEl.createDiv({ cls: 'chat-message tool-result' });
          const preview = JSON.stringify(result).slice(0, 150);
          resultEl.textContent = `✓ ${name} → ${preview}...`;
          this.scrollToBottom();
        },
        
        onApprovalNeeded: async (details) => {
          thinkingEl.remove();
          return await this.requestUserApproval(details);
        }
      });
      
      thinkingEl.remove();
      
      if (result.success) {
        this.addMessage('assistant', result.finalOutput);
        
        if (result.usage) {
          this.addUsageStats(result.usage, result.iterations);
        }
      } else {
        this.addMessage('error', result.error || 'Agent failed');
      }
      
    } catch (error) {
      thinkingEl.remove();
      this.addMessage('error', error.message);
    }
    
    this.inputEl.disabled = false;
    this.sendBtn.disabled = false;
    this.inputEl.focus();
  }
  
  async requestUserApproval(details) {
    return new Promise((resolve) => {
      const approvalEl = this.chatEl.createDiv({ cls: 'chat-message approval-request' });
      approvalEl.createEl('p', { text: '⚠️ Approval Required' });
      approvalEl.createEl('p', { text: details });
      
      const btnContainer = approvalEl.createDiv({ cls: 'approval-buttons' });
      
      const approveBtn = btnContainer.createEl('button', {
        cls: 'approval-btn approve',
        text: 'Approve'
      });
      
      const denyBtn = btnContainer.createEl('button', {
        cls: 'approval-btn deny',
        text: 'Deny'
      });
      
      approveBtn.onclick = () => {
        approvalEl.remove();
        this.addMessage('system', '✓ Operation approved');
        resolve(true);
      };
      
      denyBtn.onclick = () => {
        approvalEl.remove();
        this.addMessage('system', '✗ Operation denied');
        resolve(false);
      };
      
      this.scrollToBottom();
    });
  }
  
  addMessage(role, text) {
    const msgEl = this.chatEl.createDiv({ cls: `chat-message ${role}` });
    msgEl.textContent = text;
    this.scrollToBottom();
    return msgEl;
  }
  
  addUsageStats(usage, iterations) {
    const cached = usage.input_tokens_details?.cached_tokens || 0;
    const input = usage.input_tokens || 0;
    const output = usage.output_tokens || 0;
    
    const pricing = PRICING['gpt-5-nano'];
    
    const costCached = (cached / 1_000_000) * pricing.cache_in;
    const costInput = (input / 1_000_000) * pricing.input;
    const costOutput = (output / 1_000_000) * pricing.output;
    const costTotal = costCached + costInput + costOutput;
    
    const statsText = `--- Stats ---
Iterations: ${iterations}
Cached: ${cached.toLocaleString()} ($${costCached.toFixed(6)})
Input:  ${input.toLocaleString()} ($${costInput.toFixed(6)})
Output: ${output.toLocaleString()} ($${costOutput.toFixed(6)})
Total:  $${costTotal.toFixed(6)}`;
    
    const statsEl = this.chatEl.createDiv({ cls: 'chat-message stats' });
    statsEl.textContent = statsText;
    this.scrollToBottom();
  }
  
  scrollToBottom() {
    this.chatEl.scrollTop = this.chatEl.scrollHeight;
  }
  
  async onClose() {
    // Cleanup
  }
}

///// PART 7 END ////

///// PART 8 START (Settings with embedding options) ////

class AIAgentSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  
  display() {
    const { containerEl } = this;
    containerEl.empty();
    
    containerEl.createEl('h2', { text: 'AI Agent Settings' });
    
    containerEl.createEl('h3', { text: 'API Configuration' });
    
    new Setting(containerEl)
      .setName('OpenAI API Key')
      .setDesc('Your OpenAI API key (used for both LLM and embeddings)')
      .addText(text => {
        text.setPlaceholder('sk-proj-...')
          .setValue(this.plugin.settings.apiKey)
          .onChange(async (value) => {
            this.plugin.settings.apiKey = value;
            await this.plugin.saveSettings();
          });
        text.inputEl.type = 'password';
      });
    
    new Setting(containerEl)
      .setName('Embedding Model')
      .setDesc('OpenAI embedding model for semantic search')
      .addDropdown(dropdown => dropdown
        .addOption('text-embedding-3-small', 'text-embedding-3-small (Recommended)')
        .addOption('text-embedding-3-large', 'text-embedding-3-large (Higher quality)')
        .setValue(this.plugin.settings.embeddingModel)
        .onChange(async (value) => {
          this.plugin.settings.embeddingModel = value;
          await this.plugin.saveSettings();
        }));
    
    new Setting(containerEl)
      .setName('Reasoning Effort')
      .setDesc('How much the model thinks')
      .addDropdown(dropdown => dropdown
        .addOption('minimal', 'Minimal')
        .addOption('low', 'Low')
        .addOption('medium', 'Medium (Recommended)')
        .addOption('high', 'High')
        .setValue(this.plugin.settings.reasoningEffort)
        .onChange(async (value) => {
          this.plugin.settings.reasoningEffort = value;
          await this.plugin.saveSettings();
        }));
    
    new Setting(containerEl)
      .setName('Text Verbosity')
      .setDesc('How detailed responses should be')
      .addDropdown(dropdown => dropdown
        .addOption('low', 'Low')
        .addOption('medium', 'Medium (Recommended)')
        .addOption('high', 'High')
        .setValue(this.plugin.settings.textVerbosity)
        .onChange(async (value) => {
          this.plugin.settings.textVerbosity = value;
          await this.plugin.saveSettings();
        }));
    
    containerEl.createEl('h3', { text: 'RAG Configuration' });
    
    new Setting(containerEl)
      .setName('Chunk Size')
      .setDesc('Size of text chunks for embedding (characters)')
      .addText(text => text
        .setPlaceholder('800')
        .setValue(String(this.plugin.settings.chunkSize))
        .onChange(async (value) => {
          const num = parseInt(value);
          if (!isNaN(num) && num > 0) {
            this.plugin.settings.chunkSize = num;
            await this.plugin.saveSettings();
          }
        }));
    
    new Setting(containerEl)
      .setName('Chunk Overlap')
      .setDesc('Overlap between chunks (characters)')
      .addText(text => text
        .setPlaceholder('150')
        .setValue(String(this.plugin.settings.chunkOverlap))
        .onChange(async (value) => {
          const num = parseInt(value);
          if (!isNaN(num) && num >= 0) {
            this.plugin.settings.chunkOverlap = num;
            await this.plugin.saveSettings();
          }
        }));
    
    containerEl.createEl('h3', { text: 'About' });
    
    const infoDiv = containerEl.createDiv();
    infoDiv.createEl('p', { 
      text: 'This plugin uses OpenAI embeddings for true semantic search. Finds conceptually similar content, not just keyword matches.' 
    });
    infoDiv.createEl('p', {
      text: 'Cost: ~$0.02 per 1M tokens for embeddings. A typical vault with 1000 notes costs ~$0.10 to index.'
    });
  }
}

///// PART 8 END ////

///// PART 9 START (Main plugin) ////

class AIAgentPlugin extends Plugin {
  async onload() {
    console.log('Loading AI Agent Plugin');
    
    await this.loadSettings();
    
    this.previousResponseId = null;
    
    await this.loadStaticPrompts();
    
    this.ragSystem = new RAGSystem(this);
    this.contextBuilder = new ContextBuilder(this);
    this.toolManager = new ToolManager(this);
    this.apiHandler = new APIHandler(this);
    
    this.registerView(VIEW_TYPE, (leaf) => new ChatView(leaf, this));
    
    this.addRibbonIcon('bot', 'Open AI Agent', () => {
      this.activateView();
    });
    
    this.addCommand({
      id: 'open-ai-agent',
      name: 'Open AI Agent',
      callback: () => {
        this.activateView();
      }
    });
    
    this.addCommand({
      id: 'index-vault',
      name: 'Index Vault for Semantic Search',
      callback: async () => {
        new Notice('Starting vault indexing...');
        try {
          await this.ragSystem.indexVault((path, current, total) => {
            if (current % 10 === 0) {
              new Notice(`Indexing: ${current}/${total} files`);
            }
          });
          new Notice('Vault indexed successfully!');
        } catch (error) {
          new Notice('Indexing failed: ' + error.message);
        }
      }
    });
    
    this.addSettingTab(new AIAgentSettingTab(this.app, this));
    
    console.log('AI Agent Plugin loaded');
  }
  
  async loadStaticPrompts() {
    try {
      const adapter = this.app.vault.adapter;
      const basePath = this.manifest.dir;
      
      try {
        const pillar1Path = `${basePath}/pillar1-static.txt`;
        this.pillar1Content = await adapter.read(pillar1Path);
        console.log('[Prompts] Loaded pillar1-static.txt');
      } catch (error) {
        this.pillar1Content = null;
      }
      
      try {
        const pillar5Path = `${basePath}/pillar5-static.txt`;
        this.pillar5Content = await adapter.read(pillar5Path);
        console.log('[Prompts] Loaded pillar5-static.txt');
      } catch (error) {
        this.pillar5Content = null;
      }
      
    } catch (error) {
      console.error('[Prompts] Error loading prompt files:', error);
      this.pillar1Content = null;
      this.pillar5Content = null;
    }
  }
  
  async activateView() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE)[0];
    
    if (!leaf) {
      leaf = workspace.getRightLeaf(false);
      await leaf.setViewState({ type: VIEW_TYPE, active: true });
    }
    
    workspace.revealLeaf(leaf);
  }
  
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  
  async saveSettings() {
    await this.saveData(this.settings);
  }
  
  resetConversation() {
    this.previousResponseId = null;
    this.ragSystem.clearCache();
    this.toolManager.clearHistory();
    new Notice('Conversation reset');
    console.log('=== CONVERSATION RESET ===');
  }
  
  onunload() {
    console.log('Unloading AI Agent Plugin');
  }
}

module.exports = AIAgentPlugin;

///// PART 9 END ////