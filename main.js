// ============================================================================
// VERSION: 3.0.1 - Semantic Grammar UI System
// LAST UPDATED: 2025-10-21
// CHANGES: Enhanced semantic patterns with link functionality
// ============================================================================

///// PART 0 START - GRAMMAR UI SYSTEM ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// EXACT COPY from grammar-ui-demo.html
// Lucide icons as SVG strings
const icons = {
    'file-text': '<svg xmlns="http://www.w3.org/2000/svg" width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
    'file': '<svg xmlns="http://www.w3.org/2000/svg" width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>',
    'tag': '<svg xmlns="http://www.w3.org/2000/svg" width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>',
    'link': '<svg xmlns="http://www.w3.org/2000/svg" width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>',
    'clock': '<svg xmlns="http://www.w3.org/2000/svg" width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
    'external-link': '<svg xmlns="http://www.w3.org/2000/svg" width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>',
    'move': '<svg xmlns="http://www.w3.org/2000/svg" width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>',
    'hash': '<svg xmlns="http://www.w3.org/2000/svg" width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>',
    'alert-circle': '<svg xmlns="http://www.w3.org/2000/svg" width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
    'check-circle': '<svg xmlns="http://www.w3.org/2000/svg" width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
    'x-circle': '<svg xmlns="http://www.w3.org/2000/svg" width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
    'search': '<svg xmlns="http://www.w3.org/2000/svg" width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>',
    'copy': '<svg xmlns="http://www.w3.org/2000/svg" width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>'
};

// Format file path as wikilink: "Projects/File.md" -> "File" (no brackets, clean display)
// Supports alias syntax: "File|Display Name" -> "Display Name"
function formatFilePath(path) {
    if (!path) return '';

    // Check if there's an alias (pipe syntax)
    if (path.includes('|')) {
        const parts = path.split('|');
        return parts[1].trim(); // Return the alias part
    }

    // Extract filename from path
    const filename = path.split('/').pop();
    // Remove .md extension if present
    const displayName = filename.replace(/\.md$/, '');
    return displayName; // Return without brackets
}

// SEMANTIC LAYER: Expand high-level patterns into low-level grammar
function expandSemanticPattern(pattern) {
    // Match semantic pattern: [semantic-type:key-val,key-val]
    const match = pattern.match(/^\[(file-result|search-result|tag-group|stat-card|file-list-item):(.*?)\]/);
    if (!match) return null;

    const [, type, propsStr] = match;

    // Parse props from "key-val,key-val" format
    const props = {};
    if (propsStr) {
        propsStr.split(',').forEach(prop => {
            const parts = prop.trim().split('-');
            const key = parts[0];
            const val = parts.slice(1).join('-');
            props[key] = val;
        });
    }

    switch (type) {
        case 'file-result':
            const linkAttr1 = props.link === 'true' ? ',link-true' : '';
            return `[card]
  [stack:gap-sm]
    [grid:cols-auto,gap-sm]
      [icon:name-file-text,size-14,color-dim]
      [text:size-sm,color-bright${linkAttr1}] ${props.path || 'Untitled'}
    [/grid]
    ${props.tags ? `[grid:cols-auto,gap-sm]
      [icon:name-tag,size-12,color-dim]
      [text:size-sm,color-dim] ${props.tags}
    [/grid]` : ''}
    ${props.modified ? `[grid:cols-auto,gap-sm]
      [icon:name-clock,size-12,color-dim]
      [text:size-sm,color-dim] ${props.modified}
    [/grid]` : ''}
  [/stack]
[/card]`;

        case 'search-result':
            const linkAttr2 = props.link === 'true' ? ',link-true' : '';
            return `[card:hover-true]
  [stack:gap-sm]
    [grid:cols-auto,gap-sm]
      [icon:name-file-text,size-12,color-dim]
      [text:size-sm,color-mid${linkAttr2}] ${props.path || 'Untitled'}
    [/grid]
    ${props.preview ? `[text:size-sm,color-dim] ${props.preview}` : ''}
    ${props.matches ? `[badge:variant-accent] ${props.matches} matches` : ''}
  [/stack]
[/card]`;

        case 'tag-group':
            const tags = props.tags ? props.tags.split('|') : [];
            const tagCards = tags.map(tag => {
                const [name, count] = tag.split(':');
                return `[card]
    [grid:cols-auto,gap-sm]
      [icon:name-hash,size-12,color-dim]
      [text:size-sm,color-mid] ${name}
      ${count ? `[text:size-sm,color-muted] (${count})` : ''}
    [/grid]
  [/card]`;
            }).join('\n  ');
            return `[grid:cols-auto-fit,min-80px,gap-sm]
  ${tagCards}
[/grid]`;

        case 'stat-card':
            return `[card]
  [stack:gap-xs]
    [text:size-xl,color-bright] ${props.value || '0'}
    [text:size-sm,color-dim] ${props.label || 'Stat'}
  [/stack]
[/card]`;

        case 'file-list-item':
            const linkAttr3 = props.link === 'true' ? ',link-true' : '';
            return `[grid:cols-auto,gap-sm,align-center]
  [icon:name-${props.icon || 'file'},size-12,color-dim]
  [text:size-sm,color-mid${linkAttr3}] ${props.path || 'Untitled'}
  ${props.badge ? `[badge] ${props.badge}` : ''}
[/grid]`;

        default:
            return null;
    }
}

// Grammar Parser - EXACT from grammar-ui-demo.html
function parseGrammar(grammar) {
    // First pass: expand semantic patterns
    let expanded = grammar;
    const semanticPattern = /\[(file-result|search-result|tag-group|stat-card|file-list-item):[^\]]+\]/g;
    const matches = grammar.match(semanticPattern);

    if (matches) {
        matches.forEach(match => {
            const expandedPattern = expandSemanticPattern(match);
            if (expandedPattern) {
                expanded = expanded.replace(match, expandedPattern);
            }
        });
    }

    // Continue with normal parsing
    const normalized = expanded
        .replace(/\]\s*\[/g, ']\n[')
        .trim();

    const lines = normalized.split('\n');
    const elements = [];
    const stack = [];

    for (let line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        if (trimmed.startsWith('[/')) {
            if (stack.length > 0) {
                const completed = stack.pop();
                if (stack.length === 0) {
                    elements.push(completed);
                } else {
                    stack[stack.length - 1].children.push(completed);
                }
            }
            continue;
        }

        const tagMatch = trimmed.match(/^\[(\w+)(?::([^\]]+))?\]\s*(.*)/);
        if (tagMatch) {
            const [, type, propsStr, contentAfterTag] = tagMatch;
            const props = {};

            if (propsStr) {
                propsStr.split(',').forEach(prop => {
                    const parts = prop.trim().split('-');
                    const key = parts[0];
                    const val = parts.slice(1).join('-') || true;
                    props[key] = val;
                });
            }

            const element = { type, props, children: [], content: contentAfterTag.trim() || '' };

            const containerTypes = ['grid', 'container', 'stack', 'card', 'listitem'];
            if (!contentAfterTag && containerTypes.includes(type)) {
                stack.push(element);
            } else if (stack.length > 0) {
                stack[stack.length - 1].children.push(element);
            } else {
                elements.push(element);
            }
        }
    }

    while (stack.length > 0) {
        const completed = stack.pop();
        if (stack.length === 0) {
            elements.push(completed);
        } else {
            stack[stack.length - 1].children.push(completed);
        }
    }

    return elements;
}

// Component creators - EXACT from grammar-ui-demo.html
function createText(props, content, app) {
    const el = document.createElement('div');
    el.className = 'text';

    const size = props.size || 'base';
    const color = props.color || 'mid';
    const weight = props.weight;
    const mono = props.mono;
    const link = props.link === 'true';

    el.classList.add(`text-${size}`);
    el.classList.add(`text-${color}`);
    if (weight === 'medium') el.classList.add('text-medium');
    if (mono) el.classList.add('text-mono');

    if (link) {
        el.setAttribute('data-link', 'true');
        el.setAttribute('data-filepath', content.trim()); // Store original path
        el.style.cursor = 'pointer';
        el.style.color = 'var(--interactive-accent)';
        el.style.textDecoration = 'none';

        // Handle file path click - open file in Obsidian
        el.addEventListener('click', async (e) => {
            e.preventDefault();
            const filePath = el.getAttribute('data-filepath');

            // Extract file path from alias syntax if present (File|Alias -> File)
            const cleanPath = filePath.includes('|') ? filePath.split('|')[0].trim() : filePath;

            if (app && app.workspace) {
                try {
                    // Use Obsidian's API to open the file
                    await app.workspace.openLinkText(cleanPath, '', false);
                } catch (error) {
                    console.error('Failed to open file:', error);
                    new Notice(`Could not open file: ${cleanPath}`);
                }
            } else {
                console.warn('App context not available for file opening');
            }
        });

        // Display as wikilink (no brackets, supports aliases)
        el.textContent = formatFilePath(content);
    } else {
        el.textContent = content;
    }

    return el;
}

function createIcon(props) {
    const name = props.name;
    const size = props.size || 14;
    const color = props.color || 'primary';

    if (!name || !icons[name]) {
        console.warn(`Icon "${name}" not found`);
        return document.createElement('span');
    }

    const el = document.createElement('span');
    el.className = `icon icon-${color}`;
    el.innerHTML = icons[name].replace(/SIZE/g, size);

    return el;
}

function createGrid(props, children) {
    const el = document.createElement('div');
    el.className = 'grid';

    const cols = props.cols || '1';
    const gap = props.gap || 'md';
    const align = props.align || 'center';
    const justify = props.justify || 'start';
    const border = props.border === 'true';
    const background = props.background === 'true';
    const padding = props.padding;
    const hover = props.hover === 'true';
    const min = props.min;

    if (cols === 'auto') {
        el.classList.add('grid-auto');
    } else if (cols === 'auto-fit' && min) {
        el.style.gridTemplateColumns = `repeat(auto-fit, minmax(${min}, 1fr))`;
    } else {
        el.classList.add(`grid-${cols}`);
    }

    el.classList.add(`gap-${gap}`);
    el.classList.add(`align-${align}`);
    el.classList.add(`justify-${justify}`);

    if (border) el.classList.add('grid-border');
    if (background) el.classList.add('grid-bg');
    if (padding) el.classList.add(`padding-${padding}`);
    if (hover) el.classList.add('grid-hover');

    children.forEach(child => el.appendChild(child));

    return el;
}

function createButton(props, content, onAction) {
    const el = document.createElement('button');
    el.className = 'btn';

    const icon = props.icon;
    const primary = props.primary === 'true';
    const action = props.action;

    if (primary) el.classList.add('btn-primary');

    if (icon) {
        const iconEl = createIcon({ name: icon, size: 12 });
        el.appendChild(iconEl);
    }

    const textEl = document.createElement('span');
    textEl.textContent = content;
    el.appendChild(textEl);

    if (action && onAction) {
        el.onclick = () => onAction(action, props);
    }

    return el;
}

function createDivider(props) {
    const el = document.createElement('div');
    const direction = props.direction || 'h';
    const space = props.space || 'lg';

    el.className = direction === 'h' ? 'divider-h' : 'divider-v';
    el.classList.add(`divider-space-${space}`);

    return el;
}

function createListItem(props, children) {
    const el = document.createElement('div');
    el.className = 'list-item';

    const icon = props.icon;
    const hover = props.hover !== 'false';

    if (icon) {
        el.classList.add('list-item-with-icon');
        const iconEl = createIcon({ name: icon, size: 12, color: 'dim' });
        el.appendChild(iconEl);
    }

    if (hover) el.classList.add('list-item-hover');

    const contentDiv = document.createElement('div');
    contentDiv.style.minWidth = '0';
    children.forEach(child => contentDiv.appendChild(child));
    el.appendChild(contentDiv);

    return el;
}

function createStatus(props, content, app) {
    const type = props.type || 'info';
    const el = document.createElement('div');
    el.className = `status status-${type}`;

    const iconNames = {
        success: 'check-circle',
        error: 'x-circle',
        pending: 'clock',
        info: 'alert-circle'
    };

    const iconEl = createIcon({ name: iconNames[type], size: 14 });
    el.appendChild(iconEl);

    const textEl = createText({ size: 'sm', color: 'mid' }, content, app);
    el.appendChild(textEl);

    return el;
}

function createSpinner() {
    const el = document.createElement('div');
    el.className = 'spinner';
    return el;
}

function createStack(props, children) {
    const el = document.createElement('div');
    el.className = 'stack';

    const direction = props.direction || 'vertical';
    const gap = props.gap || 'md';
    const align = props.align || 'stretch';

    // Apply direction via data attribute for CSS
    if (direction === 'horizontal') {
        el.setAttribute('data-direction', 'horizontal');
    }

    // Dynamic properties via inline styles
    el.style.gap = `var(--spacing-${gap})`;
    el.style.alignItems = align;

    children.forEach(child => el.appendChild(child));

    return el;
}

function createCard(props, children) {
    const el = document.createElement('div');
    el.className = 'card';

    const hover = props.hover === 'true';

    // Base card styling comes from CSS
    // Only add hover behavior if requested
    if (hover) {
        el.style.cursor = 'pointer';
    }

    children.forEach(child => el.appendChild(child));

    return el;
}

function createBadge(props, content) {
    const el = document.createElement('span');
    el.className = 'badge';

    const variant = props.variant || 'default';

    // Use data-variant attribute for CSS styling
    if (variant !== 'default') {
        el.setAttribute('data-variant', variant);
    }

    el.textContent = content;

    return el;
}

// Grammar Renderer - EXACT from grammar-ui-demo.html
function renderGrammar(grammar, onAction, app) {
    const elements = parseGrammar(grammar);
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = 'var(--spacing-md)';

    elements.forEach(element => {
        const rendered = renderElement(element, onAction, app);
        if (rendered) container.appendChild(rendered);
    });

    return container;
}

function renderElement(element, onAction, app) {
    const { type, props, content, children } = element;

    switch (type) {
        case 'text':
            return createText(props, content, app);

        case 'icon':
            return createIcon(props);

        case 'grid':
        case 'container':
            const childElements = [];
            if (content) {
                childElements.push(createText({}, content, app));
            }
            children.forEach(child => {
                const rendered = renderElement(child, onAction, app);
                if (rendered) childElements.push(rendered);
            });
            return createGrid(props, childElements);

        case 'button':
            return createButton(props, content, onAction);

        case 'divider':
            return createDivider(props);

        case 'listitem':
            const listChildren = [];
            if (content) {
                listChildren.push(createText({ size: 'sm', color: 'mid' }, content, app));
            }
            children.forEach(child => {
                const rendered = renderElement(child, onAction, app);
                if (rendered) listChildren.push(rendered);
            });
            return createListItem(props, listChildren);

        case 'status':
            return createStatus(props, content, app);

        case 'spinner':
            return createSpinner();

        case 'stack':
            const stackChildren = [];
            if (content) {
                stackChildren.push(createText({}, content, app));
            }
            children.forEach(child => {
                const rendered = renderElement(child, onAction, app);
                if (rendered) stackChildren.push(rendered);
            });
            return createStack(props, stackChildren);

        case 'card':
            const cardChildren = [];
            if (content) {
                cardChildren.push(createText({}, content, app));
            }
            children.forEach(child => {
                const rendered = renderElement(child, onAction, app);
                if (rendered) cardChildren.push(rendered);
            });
            return createCard(props, cardChildren);

        case 'badge':
            return createBadge(props, content);

        default:
            return null;
    }
}

///// PART 0 END - GRAMMAR UI SYSTEM ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
  chunkOverlap: 150,
  autoIndexing: true,
  autoIndexDelay: 30000 // 30 seconds
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

    const folderStructure = this.getVaultFolderStructure();

    return `# WHAT YOU KNOW

## Vault Index Status
- Total Files: ${vaultStats.totalFiles}
- Total Chunks: ${vaultStats.totalChunks}
- Search Method: ${vaultStats.embeddingMethod}
- Index Ready: ${vaultStats.indexed ? 'YES' : 'NO'}

## Vault Folder Structure
${folderStructure}

## Memory System
(Long-term memory not yet implemented)

## Available Context
You have semantic search via embeddings. Use retrieve_relevant_chunks for meaning-based queries after narrowing with list_files or search_lexical.`;
  }

  getVaultFolderStructure() {
    // Get all folders in the vault
    const allFiles = this.plugin.app.vault.getAllLoadedFiles();
    const folders = allFiles.filter(f => f.children); // Folders have children property

    if (folders.length === 0) {
      return 'No folders found in vault.';
    }

    // Build a tree structure
    const tree = {};

    for (const folder of folders) {
      const path = folder.path;
      if (!path) continue; // Skip root

      const parts = path.split('/');
      let current = tree;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
    }

    // Format as compact list
    const formatTree = (obj, prefix = '', isRoot = true) => {
      const entries = Object.entries(obj);
      if (entries.length === 0) return '';

      let result = '';
      entries.forEach(([key, children], index) => {
        const isLast = index === entries.length - 1;
        const fullPath = prefix ? `${prefix}/${key}` : key;

        result += `${fullPath}/\n`;

        // Recursively add children (limit depth to 2 levels for compactness)
        if (Object.keys(children).length > 0 && prefix.split('/').length < 2) {
          result += formatTree(children, fullPath, false);
        }
      });

      return result;
    };

    return formatTree(tree);
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
    this.pendingUpdates = new Set(); // Files waiting to be indexed
    this.debounceTimer = null;
    this.fileEventHandlers = [];
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

      // Save embeddings to disk after successful indexing
      if (this.indexed) {
        await this.saveEmbeddings();
      }

    } finally {
      this.isIndexing = false;
    }
  }

  /**
   * Save embeddings to disk
   */
  async saveEmbeddings() {
    try {
      const embeddingsPath = `${this.plugin.manifest.dir}/embeddings.json`;
      const data = {
        version: 1,
        indexed_at: Date.now(),
        embeddings: Array.from(this.embeddings.entries()).map(([path, data]) => ({
          path,
          chunks: data.chunks,
          indexed_at: data.indexed_at
        }))
      };

      await this.plugin.app.vault.adapter.write(embeddingsPath, JSON.stringify(data));
      console.log(`[RAG] Saved ${this.embeddings.size} file embeddings to disk`);
    } catch (error) {
      console.error('[RAG] Error saving embeddings:', error);
    }
  }

  /**
   * Load embeddings from disk
   */
  async loadEmbeddings() {
    try {
      const embeddingsPath = `${this.plugin.manifest.dir}/embeddings.json`;

      // Check if file exists
      const exists = await this.plugin.app.vault.adapter.exists(embeddingsPath);
      if (!exists) {
        console.log('[RAG] No saved embeddings found');
        return false;
      }

      const json = await this.plugin.app.vault.adapter.read(embeddingsPath);
      const data = JSON.parse(json);

      // Restore embeddings
      this.embeddings.clear();
      for (const item of data.embeddings) {
        this.embeddings.set(item.path, {
          chunks: item.chunks,
          indexed_at: item.indexed_at
        });
      }

      this.indexed = true;
      console.log(`[RAG] Loaded ${this.embeddings.size} embeddings from disk`);
      return true;
    } catch (error) {
      console.error('[RAG] Error loading embeddings:', error);
      return false;
    }
  }

  /**
   * Check for files modified since last index and re-index them
   */
  async checkModifiedFiles() {
    if (!this.indexed) {
      return;
    }

    const files = this.plugin.app.vault.getMarkdownFiles();
    const toUpdate = [];

    for (const file of files) {
      const indexed = this.embeddings.get(file.path);

      if (!indexed) {
        toUpdate.push(file);
      } else if (file.stat.mtime > indexed.indexed_at) {
        toUpdate.push(file);
      }
    }

    // Check for deleted files
    const existingPaths = new Set(files.map(f => f.path));
    const toDelete = [];
    for (const path of this.embeddings.keys()) {
      if (!existingPaths.has(path)) {
        toDelete.push(path);
      }
    }

    if (toUpdate.length > 0 || toDelete.length > 0) {
      console.log(`[RAG] Syncing: ${toUpdate.length} new/modified, ${toDelete.length} deleted`);

      // Delete removed files
      for (const path of toDelete) {
        this.embeddings.delete(path);
      }

      // Index new/modified files
      if (toUpdate.length > 0) {
        await this.indexFiles(toUpdate);
      }

      await this.saveEmbeddings();
    }
  }

  /**
   * Index specific files (incremental)
   */
  async indexFiles(files) {
    for (const file of files) {
      try {
        await this.indexFile(file);
      } catch (error) {
        console.error(`[RAG] Error indexing ${file.path}:`, error);
      }
    }
  }

  /**
   * Start watching for file changes
   */
  startFileWatcher() {
    if (!this.plugin.settings.autoIndexing) {
      console.log('[RAG] Auto-indexing disabled');
      return;
    }

    console.log(`[RAG] Starting file watcher (${this.embeddings.size} files already indexed)`);

    // Handle file creation
    const onCreate = this.plugin.app.vault.on('create', (file) => {
      if (file.extension === 'md') {
        const indexed = this.embeddings.get(file.path);
        if (!indexed) {
          console.log(`[RAG] New file: ${file.path}`);
          this.queueFileUpdate(file.path);
        }
        // Skip logging if already indexed - reduces console spam
      }
    });

    // Handle file modification
    const onModify = this.plugin.app.vault.on('modify', (file) => {
      if (file.extension === 'md') {
        const indexed = this.embeddings.get(file.path);
        if (!indexed) {
          console.log(`[RAG] Modified file (not indexed): ${file.path}`);
          this.queueFileUpdate(file.path);
        } else if (file.stat.mtime > indexed.indexed_at) {
          console.log(`[RAG] Modified file: ${file.path}`);
          this.queueFileUpdate(file.path);
        }
        // Skip logging if up to date - reduces console spam
      }
    });

    // Handle file deletion
    const onDelete = this.plugin.app.vault.on('delete', (file) => {
      if (file.extension === 'md') {
        console.log(`[RAG] File deleted: ${file.path}`);
        this.embeddings.delete(file.path);
        this.saveEmbeddings();
      }
    });

    // Handle file rename
    const onRename = this.plugin.app.vault.on('rename', (file, oldPath) => {
      if (file.extension === 'md') {
        console.log(`[RAG] File renamed: ${oldPath} -> ${file.path}`);
        const data = this.embeddings.get(oldPath);
        if (data) {
          this.embeddings.delete(oldPath);
          this.embeddings.set(file.path, data);
          this.saveEmbeddings();
        }
      }
    });

    this.fileEventHandlers = [onCreate, onModify, onDelete, onRename];
  }

  /**
   * Stop watching for file changes
   */
  stopFileWatcher() {
    console.log('[RAG] Stopping file watcher');
    for (const handler of this.fileEventHandlers) {
      this.plugin.app.vault.offref(handler);
    }
    this.fileEventHandlers = [];

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }

  /**
   * Queue a file for indexing (with debouncing)
   */
  queueFileUpdate(path) {
    this.pendingUpdates.add(path);

    // Clear existing timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // Set new timer
    this.debounceTimer = setTimeout(async () => {
      await this.processQueuedUpdates();
    }, this.plugin.settings.autoIndexDelay);
  }

  /**
   * Process all queued file updates
   */
  async processQueuedUpdates() {
    if (this.pendingUpdates.size === 0) return;

    // Don't process queue if vault hasn't been indexed yet
    if (!this.indexed) {
      console.log(`[RAG] Ignoring ${this.pendingUpdates.size} queued updates - vault not indexed yet`);
      this.pendingUpdates.clear();
      return;
    }

    const paths = Array.from(this.pendingUpdates);
    this.pendingUpdates.clear();

    console.log(`[RAG] Processing ${paths.length} queued updates`);

    const files = paths
      .map(path => this.plugin.app.vault.getAbstractFileByPath(path))
      .filter(f => f && f.extension === 'md');

    if (files.length > 0) {
      await this.indexFiles(files);
      await this.saveEmbeddings();
      console.log(`[RAG] Auto-indexed ${files.length} files`);
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
  constructor(plugin, userMessage, reasoningEffort = null) {
    this.plugin = plugin;
    this.userMessage = userMessage;
    this.reasoningEffort = reasoningEffort; // Per-query reasoning effort
    this.maxIterations = 20;
    this.iteration = 0;
    this.callbacks = {};
  }
  
  async run(callbacks = {}) {
    this.callbacks = callbacks;
    const startTime = Date.now();

    // Accumulate total usage across all API calls
    const totalUsage = {
      total_input_tokens: 0,
      total_cached_tokens: 0,
      total_output_tokens: 0,
      total_reasoning_tokens: 0
    };

    const accumulateUsage = (usage) => {
      if (!usage) return;
      totalUsage.total_input_tokens += usage.input_tokens || 0;
      totalUsage.total_cached_tokens += usage.input_tokens_details?.cached_tokens || 0;
      totalUsage.total_output_tokens += usage.output_tokens || 0;
      totalUsage.total_reasoning_tokens += usage.output_tokens_details?.reasoning_tokens || 0;
    };

    try {
      const systemMessages = this.plugin.contextBuilder.buildSystemMessages();

      // Log message order and sizes for cache debugging
      console.log('[Cache Debug] Message order:');
      systemMessages.forEach((msg, i) => {
        const preview = msg.content.substring(0, 50).replace(/\n/g, ' ');
        console.log(`  ${i}: ${msg.role} (${msg.content.length} chars) - "${preview}..."`);
      });

      const firstTurnInput = [
        ...systemMessages,
        { role: 'user', content: this.userMessage }
      ];

      let response = await this.step(firstTurnInput, this.reasoningEffort);
      accumulateUsage(response.usage);

      if (this.isDone) {
        return {
          success: true,
          finalOutput: this.finalOutput,
          iterations: this.iteration,
          usage: totalUsage,
          elapsedMs: Date.now() - startTime
        };
      }

      while (this.iteration < this.maxIterations && !this.isDone) {
        this.iteration++;
        console.log(`\n=== AGENT LOOP ITERATION ${this.iteration} ===`);

        const parsed = this.plugin.apiHandler.parseResponse(response);

        if (parsed.toolCalls && parsed.toolCalls.length > 0) {
          const outputs = await this.executeToolCalls(parsed.toolCalls);
          response = await this.plugin.apiHandler.flushToolOutputs(outputs, this.reasoningEffort);
          accumulateUsage(response.usage);

          if (this.isDone) {
            return {
              success: true,
              finalOutput: this.finalOutput,
              iterations: this.iteration,
              usage: totalUsage,
              elapsedMs: Date.now() - startTime
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
            usage: totalUsage,
            elapsedMs: Date.now() - startTime
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
        iterations: this.iteration,
        usage: totalUsage,
        elapsedMs: Date.now() - startTime
      };
    }
  }
  
  async step(firstTurnInput, reasoningEffort = null) {
    this.iteration++;
    console.log(`\n=== AGENT LOOP ITERATION ${this.iteration} ===`);

    const firstResponse = await this.plugin.apiHandler.sendMessageWithTools(firstTurnInput, reasoningEffort);

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
    const followupResponse = await this.plugin.apiHandler.flushToolOutputs(outputs, reasoningEffort);

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
        this.sendUpdate('Final output ready');
        
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

  async sendMessageWithTools(inputItems, reasoningEffort = null) {
    const tools = this.plugin.toolManager.getToolSchemas();

    console.log('[API] Sending request');
    console.log('[API] Input items:', inputItems.length);

    // Use per-query reasoning effort if provided, otherwise fall back to global setting
    const effectiveReasoningEffort = reasoningEffort || this.plugin.settings.reasoningEffort;

    const requestBody = {
      model: this.plugin.settings.model,
      input: inputItems,
      tools: tools,
      parallel_tool_calls: true,
      reasoning: { effort: effectiveReasoningEffort },
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
    console.log('[API] Usage stats:', JSON.stringify(data.usage, null, 2));

    return data;
  }
  
  async flushToolOutputs(outputs, reasoningEffort = null) {
    if (!outputs || outputs.length === 0) {
      return null;
    }

    console.log('[API] Flushing', outputs.length, 'function_call_output items');

    for (const output of outputs) {
      if (!output.call_id) {
        throw new Error('Cannot flush output without call_id');
      }
    }

    const response = await this.sendMessageWithTools(outputs, reasoningEffort);
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

    // Left side - title and version
    const headerLeft = header.createDiv({ cls: 'chat-header-left' });
    headerLeft.createEl('strong', { text: 'AI Agent - Semantic RAG' });
    headerLeft.createEl('span', {
      cls: 'version-tag',
      text: 'v3.0.1'
    });

    // Right side - buttons
    const headerButtons = header.createDiv({ cls: 'chat-header-buttons' });

    const indexBtn = headerButtons.createEl('button', {
      cls: 'chat-btn',
      text: 'Index Vault'
    });
    indexBtn.onclick = () => this.indexVault();

    const resetBtn = headerButtons.createEl('button', {
      cls: 'chat-btn',
      text: 'New Chat'
    });
    resetBtn.onclick = () => {
      this.chatEl.empty();
      this.plugin.resetConversation();
      this.addMessage('system', '=== New conversation started ===');
      this.updateIndexStatus();
    };

    // Debug mode toggle
    this.debugMode = false;
    this.debugBtn = headerButtons.createEl('button', {
      cls: 'chat-btn',
      text: 'Debug: OFF'
    });
    this.debugBtn.onclick = () => {
      this.debugMode = !this.debugMode;
      this.debugBtn.textContent = this.debugMode ? 'Debug: ON' : 'Debug: OFF';
      this.debugBtn.style.background = this.debugMode ? 'var(--interactive-accent)' : '';
    };
    
    // Index status
    this.statusEl = container.createDiv({ cls: 'index-status' });
    this.updateIndexStatus();
    
    this.chatEl = container.createDiv({ cls: 'chat-messages' });

    const stats = this.plugin.ragSystem.getIndexStats();
    let welcomeMsg = 'AI Agent with Semantic RAG - v3.0.2 - Semantic Grammar UI\n\n';

    if (stats.indexed) {
      welcomeMsg += `Vault indexed: ${stats.totalFiles} files, ${stats.totalChunks} chunks\nReady to answer questions with semantic understanding!`;
    } else {
      welcomeMsg += 'Vault not indexed yet. Click "Index Vault" to enable semantic search.';
    }

    this.addMessage('system', welcomeMsg);

    // EXACT COPY from Chat UI Template - Input container
    const inputContainer = container.createDiv({ cls: 'chat-input-container' });

    // Input wrapper
    const inputWrapper = inputContainer.createDiv({ cls: 'input-wrapper' });

    this.inputEl = inputWrapper.createEl('input', {
      cls: 'message-input',
      attr: { type: 'text', placeholder: 'Send a message' }
    });

    this.sendBtn = inputWrapper.createEl('button', { cls: 'send-btn' });
    this.sendBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
    </svg>`;

    // Toolbar
    const toolbar = inputContainer.createDiv({ cls: 'toolbar' });

    // Reasoning dropdown
    const reasoningDropdown = toolbar.createDiv({ cls: 'custom-dropdown' });
    const reasoningBtn = reasoningDropdown.createEl('button', { cls: 'toolbar-btn' });
    reasoningBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>`;
    this.reasoningLabel = reasoningBtn.createEl('span');
    this.reasoningLabel.textContent = 'Low';

    this.reasoningMenu = reasoningDropdown.createDiv({ cls: 'dropdown-menu' });
    const reasoningOptions = [
      { value: 'minimal', label: 'Minimal' },
      { value: 'low', label: 'Low', selected: true },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' }
    ];
    reasoningOptions.forEach(opt => {
      const item = this.reasoningMenu.createDiv({ cls: 'dropdown-item' });
      if (opt.selected) item.classList.add('selected');
      item.textContent = opt.label;
      item.dataset.value = opt.value;
    });

    // Toolbar divider
    toolbar.createDiv({ cls: 'toolbar-divider' });

    // Verbosity dropdown
    const verbosityDropdown = toolbar.createDiv({ cls: 'custom-dropdown' });
    const verbosityBtn = verbosityDropdown.createEl('button', { cls: 'toolbar-btn' });
    verbosityBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
      <line x1="16" y1="8" x2="2" y2="22"></line>
      <line x1="17.5" y1="15" x2="9" y2="15"></line>
    </svg>`;
    this.verbosityLabel = verbosityBtn.createEl('span');
    this.verbosityLabel.textContent = 'Medium';

    this.verbosityMenu = verbosityDropdown.createDiv({ cls: 'dropdown-menu' });
    const verbosityOptions = [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium', selected: true },
      { value: 'high', label: 'High' }
    ];
    verbosityOptions.forEach(opt => {
      const item = this.verbosityMenu.createDiv({ cls: 'dropdown-item' });
      if (opt.selected) item.classList.add('selected');
      item.textContent = opt.label;
      item.dataset.value = opt.value;
    });

    // Character count
    this.charCount = toolbar.createEl('span', { cls: 'char-count' });
    this.charCount.textContent = '0';

    // EXACT dropdown handlers from template
    reasoningBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.reasoningMenu.classList.toggle('show');
      this.verbosityMenu.classList.remove('show');
    });

    verbosityBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.verbosityMenu.classList.toggle('show');
      this.reasoningMenu.classList.remove('show');
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
      this.reasoningMenu.classList.remove('show');
      this.verbosityMenu.classList.remove('show');
    });

    // Handle reasoning dropdown item selection
    this.reasoningMenu.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        this.reasoningMenu.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        this.plugin.settings.reasoningEffort = item.dataset.value;
        this.reasoningLabel.textContent = item.textContent;
        this.reasoningMenu.classList.remove('show');
      });
    });

    // Handle verbosity dropdown item selection
    this.verbosityMenu.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        this.verbosityMenu.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        this.plugin.settings.textVerbosity = item.dataset.value;
        this.verbosityLabel.textContent = item.textContent;
        this.verbosityMenu.classList.remove('show');
      });
    });

    // Update character count
    this.inputEl.addEventListener('input', () => {
      this.charCount.textContent = this.inputEl.value.length;
    });

    // Send handlers
    this.sendBtn.onclick = () => this.handleSend();
    this.inputEl.onkeypress = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.handleSend();
      }
    };
  }
  
  updateIndexStatus(currentFile = null, current = 0, total = 0) {
    if (!this.statusEl) return;

    const stats = this.plugin.ragSystem.getIndexStats();

    if (stats.indexing) {
      if (current > 0 && total > 0) {
        const percentage = Math.round((current / total) * 100);
        this.statusEl.textContent = `Indexing: ${current}/${total} (${percentage}%)`;
      } else {
        this.statusEl.textContent = 'Indexing in progress...';
      }
      this.statusEl.className = 'index-status indexing';
    } else if (stats.indexed) {
      this.statusEl.textContent = `Indexed: ${stats.totalFiles} files, ${stats.totalChunks} chunks`;
      this.statusEl.className = 'index-status indexed';
    } else {
      this.statusEl.textContent = 'Not indexed - click "Index Vault"';
      this.statusEl.className = 'index-status not-indexed';
    }
  }
  
  async indexVault() {
    const messageItem = this.chatEl.createDiv({ cls: 'message-item' });
    const statusContainer = messageItem.createDiv({ cls: 'system-message' });

    // Initial status
    const initialGrammar = `[grid:cols-auto,gap-md,border-true,background-true,padding-lg]
  [spinner]
  [text:size-sm,color-dim] Starting indexing...
[/grid]`;
    let statusEl = renderGrammar(initialGrammar, null, this.app);
    statusContainer.appendChild(statusEl);
    this.updateIndexStatus();

    try {
      let lastUpdate = Date.now();
      let lastFile = '';

      await this.plugin.ragSystem.indexVault((path, current, total) => {
        // Always update on file change or throttle to every 200ms
        const now = Date.now();
        const fileChanged = path !== lastFile;

        if (fileChanged || now - lastUpdate > 200 || current === total) {
          const percentage = Math.round((current / total) * 100);
          const fileName = path.split('/').pop(); // Get just the filename

          // Update status with Grammar UI
          statusContainer.empty();
          const grammar = `[grid:cols-1,gap-sm,border-true,background-true,padding-lg]
  [grid:cols-auto,gap-md]
    [spinner]
    [text:size-sm,color-dim] Indexing: ${current}/${total} files (${percentage}%)
  [/grid]
  [text:size-xs,color-dim] Current: ${fileName}
[/grid]`;
          statusEl = renderGrammar(grammar, null, this.app);
          statusContainer.appendChild(statusEl);

          this.updateIndexStatus(fileName, current, total);
          lastUpdate = now;
          lastFile = path;
        }
      });

      const stats = this.plugin.ragSystem.getIndexStats();

      // Final success status
      statusContainer.empty();
      const successGrammar = `[grid:cols-auto,gap-md,border-true,background-true,padding-lg]
  [icon:check]
  [text:size-sm,color-dim] Indexing complete! ${stats.totalChunks} chunks from ${stats.totalFiles} files
[/grid]`;
      statusEl = renderGrammar(successGrammar, null, this.app);
      statusContainer.appendChild(statusEl);

      this.updateIndexStatus();
      new Notice('Vault indexed successfully!');

    } catch (error) {
      // Error status
      statusContainer.empty();
      const errorGrammar = `[grid:cols-auto,gap-md,border-true,background-true,padding-lg]
  [icon:alert-circle]
  [text:size-sm,color-dim] Indexing failed: ${error.message}
[/grid]`;
      statusEl = renderGrammar(errorGrammar, null, this.app);
      statusContainer.appendChild(statusEl);

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

    // Create thinking status with Grammar UI
    const thinkingItem = this.chatEl.createDiv({ cls: 'message-item' });
    const thinkingEl = thinkingItem.createDiv({ cls: 'system-message' });

    // Render initial thinking status
    const thinkingGrammar = `[grid:cols-auto,gap-md,border-true,background-true,padding-lg]
  [spinner]
  [text:size-sm,color-dim] Thinking...
[/grid]`;
    const thinkingStatus = renderGrammar(thinkingGrammar, null, this.app);
    thinkingEl.appendChild(thinkingStatus);

    // Get selected reasoning effort (default to 'low')
    const reasoningEffort = this.reasoningSelect?.value || 'low';

    try {
      const agentLoop = new AgentLoop(this.plugin, message, reasoningEffort);

      const result = await agentLoop.run({
        onUpdate: (msg) => {
          // Update thinking status with current operation
          thinkingEl.empty();
          const updatedGrammar = `[grid:cols-auto,gap-md,border-true,background-true,padding-lg]
  [spinner]
  [text:size-sm,color-dim] ${msg}
[/grid]`;
          const updatedStatus = renderGrammar(updatedGrammar, null, this.app);
          thinkingEl.appendChild(updatedStatus);
          this.scrollToBottom();
        },
        
        onToolCall: (name, args) => {
          if (this.debugMode) {
            // Debug ON: Show full technical details
            const messageItem = this.chatEl.createDiv({ cls: 'message-item' });
            const systemMsg = messageItem.createDiv({ cls: 'system-message' });
            const argsPreview = JSON.stringify(args).slice(0, 100);
            const grammar = `[grid:cols-auto,gap-md,border-true,background-true,padding-lg]
  [icon:wrench]
  [text:size-sm,color-dim] ${name}(${argsPreview}...)
[/grid]`;
            const statusEl = renderGrammar(grammar, null, this.app);
            systemMsg.appendChild(statusEl);
            this.scrollToBottom();
          } else {
            // Debug OFF: Show brief user-friendly summary
            const summary = this.getToolCallSummary(name, args);
            if (summary) {  // Only show if not empty
              const messageItem = this.chatEl.createDiv({ cls: 'message-item' });
              const systemMsg = messageItem.createDiv({ cls: 'system-message' });
              const grammar = `[grid:cols-auto,gap-md,border-true,background-true,padding-lg]
  [spinner]
  [text:size-sm,color-dim] ${summary}
[/grid]`;
              const statusEl = renderGrammar(grammar, null, this.app);
              systemMsg.appendChild(statusEl);
              this.scrollToBottom();
            }
          }
        },

        onToolResult: (name, result) => {
          if (this.debugMode) {
            // Debug ON: Show full result with success status
            const messageItem = this.chatEl.createDiv({ cls: 'message-item' });
            const systemMsg = messageItem.createDiv({ cls: 'system-message' });
            const preview = JSON.stringify(result).slice(0, 150);
            const grammar = `[grid:cols-auto,gap-md,border-true,background-true,padding-lg]
  [icon:check]
  [text:size-sm,color-dim] ${name} completed
[/grid]`;
            const statusEl = renderGrammar(grammar, null, this.app);
            systemMsg.appendChild(statusEl);
            this.scrollToBottom();
          }
          // Debug OFF: Don't show tool results to keep UI clean
        },
        
        onApprovalNeeded: async (details) => {
          thinkingItem.remove();
          return await this.requestUserApproval(details);
        }
      });

      thinkingItem.remove();
      
      if (result.success) {
        this.addMessage('assistant', result.finalOutput);

        if (result.usage) {
          this.addUsageStats(result.usage, result.iterations, result.elapsedMs);
        }
      } else {
        this.addMessage('error', result.error || 'Agent failed');
      }

    } catch (error) {
      thinkingItem.remove();
      this.addMessage('error', error.message);
    }
    
    this.inputEl.disabled = false;
    this.sendBtn.disabled = false;
    this.inputEl.focus();
  }
  
  async requestUserApproval(details) {
    return new Promise((resolve) => {
      const messageItem = this.chatEl.createDiv({ cls: 'message-item' });
      const approvalEl = messageItem.createDiv({ cls: 'system-message' });

      // Create Grammar UI for approval request
      const grammar = `[grid:cols-1,gap-md,border-true,background-true,padding-lg]
  [grid:cols-auto,gap-sm,align-center]
    [icon:alert-triangle]
    [text:size-base,weight-medium] Approval Required
  [/grid]
  [text:size-sm,color-dim] ${details}
  [grid:cols-2,gap-sm]
    [button:primary,approve] Approve
    [button:primary,deny] Deny
  [/grid]
[/grid]`;

      const approvalComponent = renderGrammar(grammar, (action, props) => {
        messageItem.remove();
        if (action === 'approve') {
          const statusMsg = this.chatEl.createDiv({ cls: 'message-item' });
          const statusEl = statusMsg.createDiv({ cls: 'system-message' });
          const status = renderGrammar(`[grid:cols-auto,gap-md,border-true,background-true,padding-lg]
  [icon:check]
  [text:size-sm,color-dim] Operation approved
[/grid]`, null, this.app);
          statusEl.appendChild(status);
          resolve(true);
        } else if (action === 'deny') {
          const statusMsg = this.chatEl.createDiv({ cls: 'message-item' });
          const statusEl = statusMsg.createDiv({ cls: 'system-message' });
          const status = renderGrammar(`[grid:cols-auto,gap-md,border-true,background-true,padding-lg]
  [icon:x]
  [text:size-sm,color-dim] Operation denied
[/grid]`, null, this.app);
          statusEl.appendChild(status);
          resolve(false);
        }
      }, this.app);

      approvalEl.appendChild(approvalComponent);
      this.scrollToBottom();
    });
  }
  
  addMessage(role, text) {
    // Create message wrapper with template classes
    const messageItem = this.chatEl.createDiv({ cls: 'message-item' });

    // Create role-specific content element
    let contentEl;

    if (role === 'user') {
      // User messages: right-aligned bubble with accent background
      contentEl = messageItem.createDiv({ cls: 'user-message' });
      contentEl.textContent = text;
    } else if (role === 'assistant') {
      // Agent responses: no bubble, grammar-rendered or plain text
      contentEl = messageItem.createDiv({ cls: 'agent-response' });

      // Check if this is grammar syntax
      if (this.isGrammarSyntax(text)) {
        try {
          // Check if text has "✦" intro before grammar
          const grammarPattern = /\[(?:text|icon|grid|container|button|divider|listitem|status|spinner)[:|\]]/;
          const grammarMatch = text.match(grammarPattern);

          if (grammarMatch && grammarMatch.index > 0) {
            // Mixed content: "✦ intro" + grammar
            const introText = text.substring(0, grammarMatch.index).trim();
            const grammarText = text.substring(grammarMatch.index).trim();

            // Render intro text
            if (introText) {
              const introEl = contentEl.createDiv({ cls: 'message-intro' });
              introEl.textContent = introText;
              introEl.style.marginBottom = '12px';
            }

            // Render grammar
            const grammarEl = renderGrammar(grammarText, (action, props) => {
              console.log('Grammar action:', action, props);
              new Notice(`Action: ${action}`);
            }, this.app);
            contentEl.appendChild(grammarEl);
          } else {
            // Pure grammar: render as-is
            const grammarEl = renderGrammar(text, (action, props) => {
              console.log('Grammar action:', action, props);
              new Notice(`Action: ${action}`);
            }, this.app);
            contentEl.appendChild(grammarEl);
          }
        } catch (error) {
          console.error('[ChatView] Grammar rendering error:', error);
          // Fallback to plain text if grammar rendering fails
          contentEl.textContent = text.startsWith('✦') ? text : '✦ ' + text;
        }
      } else {
        // Plain text: auto-prepend "✦" marker if not already there
        contentEl.textContent = text.startsWith('✦') ? text : '✦ ' + text;
      }
    } else if (role === 'system') {
      // System messages: left-aligned, dimmed text
      contentEl = messageItem.createDiv({ cls: 'system-message' });
      contentEl.textContent = text;
    } else if (role === 'error') {
      // Error messages: use Grammar UI with error icon
      contentEl = messageItem.createDiv({ cls: 'system-message' });
      const errorGrammar = `[grid:cols-auto,gap-md,border-true,background-true,padding-lg]
  [icon:alert-circle]
  [text:size-sm,color-dim] ${text}
[/grid]`;
      const errorStatus = renderGrammar(errorGrammar, null, this.app);
      contentEl.appendChild(errorStatus);
      return messageItem;
    } else {
      // Fallback for any other role
      contentEl = messageItem.createDiv({ cls: 'system-message' });
      contentEl.textContent = text;
    }

    this.scrollToBottom();
    return messageItem;
  }

  /**
   * Check if text contains grammar syntax
   */
  isGrammarSyntax(text) {
    if (typeof text !== 'string') return false;

    // Check for grammar patterns anywhere in the text (semantic + raw components)
    const grammarPattern = /\[(?:file-result|search-result|file-list-item|tag-group|stat-card|stack|card|badge|text|icon|grid|container|button|divider|listitem|status|spinner)[:|\]]/;
    return grammarPattern.test(text);
  }

  /**
   * Get user-friendly summary for tool calls
   */
  getToolCallSummary(name, args) {
    const summaries = {
      'list_files': () => {
        const folder = args.folder || 'vault';
        const mode = args.mode || 'list';
        if (mode === 'count') {
          return `Counting files in ${folder}...`;
        }
        return `Searching files in ${folder}...`;
      },
      'read_file': () => `Reading ${args.path || 'file'}...`,
      'search_lexical': () => `Searching for "${args.query || 'content'}"...`,
      'retrieve_relevant_chunks': () => `Finding relevant content about "${args.query || 'topic'}"...`,
      'output_to_user': () => null, // Don't show this in non-debug mode
    };

    const summaryFn = summaries[name];
    if (summaryFn) {
      const summary = summaryFn();
      return summary || ''; // Return empty string if null
    }

    // Default summary for unknown tools
    return `Running ${name}...`;
  }

  addUsageStats(usage, iterations, elapsedMs = 0) {
    // Token breakdown (now showing totals across all API calls)
    const cachedTokens = usage.total_cached_tokens || 0;
    const totalInput = usage.total_input_tokens || 0;
    const freshTokens = totalInput - cachedTokens;
    const outputTokens = usage.total_output_tokens || 0;
    const reasoningTokens = usage.total_reasoning_tokens || 0;

    // Cache efficiency metrics
    const cacheHitRate = totalInput > 0 ? ((cachedTokens / totalInput) * 100).toFixed(1) : '0.0';

    // Pricing (cached tokens get 90% discount)
    const pricing = PRICING['gpt-5-nano'];
    const costCached = (cachedTokens / 1_000_000) * pricing.input * 0.1;
    const costFresh = (freshTokens / 1_000_000) * pricing.input;
    const costOutput = (outputTokens / 1_000_000) * pricing.output;
    const costTotal = costCached + costFresh + costOutput;

    // Calculate savings from caching
    const costWithoutCache = ((totalInput / 1_000_000) * pricing.input) + costOutput;
    const savings = costWithoutCache - costTotal;
    const savingsPercent = costWithoutCache > 0 ? ((savings / costWithoutCache) * 100).toFixed(1) : '0.0';

    // Timing
    const elapsedSec = (elapsedMs / 1000).toFixed(2);

    // Format as list
    const statsLines = [
      '--- Stats (Total Across All API Calls) ---',
      `• Iterations: ${iterations}`,
      `• Time: ${elapsedSec}s`,
      `• Cache Efficiency: ${cacheHitRate}% hit rate (saved $${savings.toFixed(6)} / ${savingsPercent}%)`,
      `• Tokens:`,
      `  - Cached input: ${cachedTokens.toLocaleString()} ($${costCached.toFixed(6)})`,
      `  - Fresh input: ${freshTokens.toLocaleString()} ($${costFresh.toFixed(6)})`,
      `  - Output: ${outputTokens.toLocaleString()} (${reasoningTokens.toLocaleString()} reasoning) ($${costOutput.toFixed(6)})`,
      `• Total Cost: $${costTotal.toFixed(6)}`
    ];

    // Create stats message using template classes (system message style)
    const messageItem = this.chatEl.createDiv({ cls: 'message-item' });
    const statsEl = messageItem.createDiv({ cls: 'system-message' });
    statsEl.textContent = statsLines.join('\n');
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

    new Setting(containerEl)
      .setName('Auto-Indexing')
      .setDesc('Automatically index new and modified files')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.autoIndexing)
        .onChange(async (value) => {
          this.plugin.settings.autoIndexing = value;
          await this.plugin.saveSettings();

          // Restart or stop file watcher
          if (value) {
            this.plugin.ragSystem.startFileWatcher();
          } else {
            this.plugin.ragSystem.stopFileWatcher();
          }
        }));

    new Setting(containerEl)
      .setName('Auto-Index Delay')
      .setDesc('Wait time (seconds) after file modification before indexing')
      .addText(text => text
        .setPlaceholder('30')
        .setValue(String(this.plugin.settings.autoIndexDelay / 1000))
        .onChange(async (value) => {
          const num = parseInt(value);
          if (!isNaN(num) && num > 0) {
            this.plugin.settings.autoIndexDelay = num * 1000;
            await this.plugin.saveSettings();
          }
        }));

    // Grammar UI Demo Section
    containerEl.createEl('h3', { text: 'Grammar UI Demo' });

    const demoDesc = containerEl.createDiv();
    demoDesc.createEl('p', {
      text: 'Test grammar syntax rendering. Enter grammar syntax below to see live preview.'
    });

    // Grammar input textarea
    const grammarInput = containerEl.createEl('textarea', {
      placeholder: 'Enter grammar syntax here...\n\nExample:\n[text:size-base,color-mid] ✦ Found 3 files\n[grid:cols-1,gap-md,border-true,background-true,padding-lg]\n  [grid:cols-auto,gap-sm]\n    [icon:name-file,size-12,color-dim]\n    [text:size-sm,color-mid] /Projects/Website.md\n  [/grid]\n[/grid]'
    });
    grammarInput.style.width = '100%';
    grammarInput.style.minHeight = '200px';
    grammarInput.style.marginBottom = '16px';
    grammarInput.style.fontFamily = 'monospace';
    grammarInput.style.fontSize = '13px';
    grammarInput.style.padding = '12px';
    grammarInput.style.background = 'var(--background-primary)';
    grammarInput.style.border = '1px solid var(--background-modifier-border)';
    grammarInput.style.borderRadius = '4px';
    grammarInput.style.color = 'var(--text-normal)';
    grammarInput.style.resize = 'vertical';

    // Set default example
    grammarInput.value = `[text:size-base,color-mid] ✦ Found 3 files in /Projects
[grid:cols-1,gap-md,border-true,background-true,padding-lg]
  [grid:cols-auto,gap-sm]
    [icon:name-file,size-12,color-dim]
    [text:size-sm,color-mid] /Projects/Website.md
  [/grid]
  [grid:cols-auto,gap-sm]
    [icon:name-file,size-12,color-dim]
    [text:size-sm,color-mid] /Projects/Mobile App.md
  [/grid]
  [grid:cols-auto,gap-sm]
    [icon:name-file,size-12,color-dim]
    [text:size-sm,color-mid] /Projects/Brand Guidelines.md
  [/grid]
  [divider:space-md]
  [text:size-xs,color-muted] View all files
[/grid]`;

    // Preview label
    containerEl.createEl('p', {
      text: 'Preview:',
      attr: { style: 'margin-bottom: 8px; font-weight: 500;' }
    });

    // Preview container
    const previewContainer = containerEl.createDiv();
    previewContainer.style.padding = '20px';
    previewContainer.style.background = 'var(--background-primary)';
    previewContainer.style.border = '1px solid var(--background-modifier-border)';
    previewContainer.style.borderRadius = '4px';
    previewContainer.style.minHeight = '100px';
    previewContainer.style.marginBottom = '24px';

    // Render function
    const updatePreview = () => {
      previewContainer.empty();
      const grammar = grammarInput.value.trim();

      if (!grammar) {
        previewContainer.createEl('p', {
          text: 'Enter grammar syntax above to see preview...',
          attr: { style: 'color: var(--text-muted);' }
        });
        return;
      }

      try {
        const rendered = renderGrammar(grammar, (action, props) => {
          console.log('Grammar action:', action, props);
          new Notice(`Action: ${action}`);
        }, this.app);
        previewContainer.appendChild(rendered);
      } catch (error) {
        previewContainer.createEl('p', {
          text: `Error: ${error.message}`,
          attr: { style: 'color: var(--text-error);' }
        });
      }
    };

    // Initial render
    updatePreview();

    // Update on input
    grammarInput.addEventListener('input', updatePreview);

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

    // Load saved embeddings from disk
    await this.ragSystem.loadEmbeddings();

    // Start file watcher for live indexing
    // Note: File watcher will catch any changes via modify events - no need to check on startup
    this.ragSystem.startFileWatcher();

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
    this.ragSystem.stopFileWatcher();
  }
}

module.exports = AIAgentPlugin;

///// PART 9 END ////