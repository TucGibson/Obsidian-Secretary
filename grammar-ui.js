// ============================================================================
// GRAMMAR UI SYSTEM - Vanilla JS Implementation
// Converts grammar strings to rich UI components
// ============================================================================

// Design tokens - matches Obsidian theme variables
const tokens = {
  colors: {
    bgBase: 'var(--background-primary, #000)',
    bgSurface: 'var(--background-secondary, #0a0a0a)',
    bgHover: 'var(--background-modifier-hover, #0f0f0f)',
    border: 'var(--background-modifier-border, #1a1a1a)',
    textBright: 'var(--text-normal, #ccc)',
    textMid: 'var(--text-muted, #999)',
    textDim: 'var(--text-faint, #666)',
    textMuted: 'var(--text-faint, #555)',
    iconPrimary: 'var(--icon-color, #666)',
    iconDim: 'var(--icon-color-focused, #555)',
    iconBright: 'var(--icon-color-hover, #888)',
  },
  spacing: {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    '3xl': '32px',
  },
  fontSize: {
    xs: '12px',
    sm: '13px',
    base: '14px',
    lg: '16px',
    xl: '18px',
  },
  radius: {
    sm: '3px',
    md: '4px',
  },
  transition: '150ms ease',
};

// ============================================================================
// COMPONENT BUILDERS - Create DOM elements with styling
// ============================================================================

/**
 * Create a Text element
 */
function buildText(props, content) {
  const {
    size = 'base',
    color = 'mid',
    weight = 'normal',
    mono = false,
  } = props;

  const colorMap = {
    bright: tokens.colors.textBright,
    mid: tokens.colors.textMid,
    dim: tokens.colors.textDim,
    muted: tokens.colors.textMuted,
  };

  const el = document.createElement('div');
  el.className = 'grammar-text';
  el.textContent = content;

  el.style.fontSize = tokens.fontSize[size] || tokens.fontSize.base;
  el.style.color = colorMap[color] || colorMap.mid;
  el.style.fontWeight = weight === 'medium' ? '500' : '400';
  el.style.fontFamily = mono ? 'var(--font-monospace)' : 'inherit';
  el.style.lineHeight = '1.5';

  return el;
}

/**
 * Create an Icon element using SVG
 */
function buildIcon(props) {
  const { name, size = 14, color = 'primary' } = props;

  const colorMap = {
    primary: tokens.colors.iconPrimary,
    dim: tokens.colors.iconDim,
    bright: tokens.colors.iconBright,
  };

  const el = document.createElement('span');
  el.className = 'grammar-icon';
  el.style.display = 'inline-flex';
  el.style.alignItems = 'center';
  el.style.flexShrink = '0';
  el.style.marginTop = '2px';

  // Simple icon mapping - you can expand this
  const iconSVGs = {
    'file': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline>',
    'file-text': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>',
    'tag': '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line>',
    'hash': '<line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line>',
    'link': '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>',
    'clock': '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>',
    'external-link': '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>',
    'search': '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>',
    'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>',
    'x-circle': '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>',
    'alert-circle': '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>',
  };

  const svgPath = iconSVGs[name] || iconSVGs['file'];
  const iconColor = colorMap[color] || colorMap.primary;

  el.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${svgPath}</svg>`;

  return el;
}

/**
 * Create a Grid container
 */
function buildGrid(props, children) {
  const {
    cols = '1',
    gap = 'md',
    min,
    align = 'center',
    justify = 'start',
    border = false,
    background = false,
    padding,
    hover = false,
  } = props;

  const el = document.createElement('div');
  el.className = 'grammar-grid';

  // Calculate grid columns
  let gridCols;
  if (cols === 'auto') {
    gridCols = 'auto';
  } else if (cols === 'auto-fit') {
    const minWidth = min || '120px';
    gridCols = `repeat(auto-fit, minmax(${minWidth}, 1fr))`;
  } else {
    gridCols = cols === '1' ? '1fr' : `repeat(${cols}, 1fr)`;
  }

  el.style.display = 'grid';
  el.style.gridTemplateColumns = gridCols;
  el.style.gridAutoFlow = cols === 'auto' ? 'column' : 'row';
  el.style.gap = tokens.spacing[gap] || tokens.spacing.md;
  el.style.alignItems = align;
  el.style.justifyContent = justify;

  if (border) {
    el.style.border = `1px solid ${tokens.colors.border}`;
    el.style.borderRadius = tokens.radius.md;
  }

  if (background) {
    el.style.background = tokens.colors.bgSurface;
  }

  if (padding) {
    el.style.padding = tokens.spacing[padding] || padding;
  }

  if (hover) {
    el.style.cursor = 'pointer';
    el.style.transition = `all ${tokens.transition}`;
    el.addEventListener('mouseenter', () => {
      el.style.background = tokens.colors.bgHover;
    });
    el.addEventListener('mouseleave', () => {
      el.style.background = background ? tokens.colors.bgSurface : '';
    });
  }

  // Append children
  if (children && children.length > 0) {
    children.forEach(child => {
      if (child) el.appendChild(child);
    });
  }

  return el;
}

/**
 * Create a Button
 */
function buildButton(props, content) {
  const { icon, primary = false, action } = props;

  const el = document.createElement('button');
  el.className = 'grammar-button';
  el.textContent = content;

  el.style.background = 'none';
  el.style.border = 'none';
  el.style.color = primary ? tokens.colors.textMid : tokens.colors.textDim;
  el.style.fontSize = tokens.fontSize.sm;
  el.style.cursor = 'pointer';
  el.style.padding = `${tokens.spacing.sm} ${tokens.spacing.md}`;
  el.style.borderRadius = tokens.radius.sm;
  el.style.display = 'flex';
  el.style.alignItems = 'center';
  el.style.gap = tokens.spacing.sm;
  el.style.transition = `all ${tokens.transition}`;

  if (icon) {
    const iconEl = buildIcon({ name: icon, size: 12 });
    el.insertBefore(iconEl, el.firstChild);
  }

  el.addEventListener('mouseenter', () => {
    el.style.background = tokens.colors.bgHover;
    el.style.color = primary ? tokens.colors.textBright : tokens.colors.textMid;
  });

  el.addEventListener('mouseleave', () => {
    el.style.background = 'none';
    el.style.color = primary ? tokens.colors.textMid : tokens.colors.textDim;
  });

  if (action) {
    el.dataset.action = action;
  }

  return el;
}

/**
 * Create a Divider
 */
function buildDivider(props) {
  const { direction = 'h', space = 'lg' } = props;

  const el = document.createElement('div');
  el.className = 'grammar-divider';

  const isHorizontal = direction === 'h';

  if (isHorizontal) {
    el.style.height = '1px';
    el.style.width = '100%';
    el.style.margin = `${tokens.spacing[space]} 0`;
    el.style.gridColumn = '1 / -1';
  } else {
    el.style.width = '1px';
    el.style.height = '100%';
    el.style.margin = `0 ${tokens.spacing[space]}`;
  }

  el.style.background = tokens.colors.border;

  return el;
}

/**
 * Create a ListItem
 */
function buildListItem(props, children) {
  const { icon, hover = true } = props;

  const el = document.createElement('div');
  el.className = 'grammar-list-item';

  el.style.display = 'grid';
  el.style.gridTemplateColumns = icon ? 'auto 1fr' : '1fr';
  el.style.alignItems = 'start';
  el.style.gap = tokens.spacing.md;
  el.style.padding = `${tokens.spacing.md} 0`;
  el.style.transition = `all ${tokens.transition}`;

  if (hover) {
    el.style.cursor = 'pointer';

    el.addEventListener('mouseenter', () => {
      el.style.background = tokens.colors.bgHover;
      el.style.paddingLeft = tokens.spacing.md;
      el.style.paddingRight = tokens.spacing.md;
      el.style.marginLeft = `-${tokens.spacing.md}`;
      el.style.marginRight = `-${tokens.spacing.md}`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.background = 'transparent';
      el.style.paddingLeft = '0';
      el.style.paddingRight = '0';
      el.style.marginLeft = '0';
      el.style.marginRight = '0';
    });
  }

  if (icon) {
    const iconEl = buildIcon({ name: icon, size: 12, color: 'dim' });
    el.appendChild(iconEl);
  }

  const contentWrapper = document.createElement('div');
  contentWrapper.style.minWidth = '0';

  if (children && children.length > 0) {
    children.forEach(child => {
      if (child) contentWrapper.appendChild(child);
    });
  }

  el.appendChild(contentWrapper);

  return el;
}

/**
 * Create a Status badge
 */
function buildStatus(props, content) {
  const { type = 'info' } = props;

  const config = {
    success: { icon: 'check-circle', bg: '#3a4a3a', iconColor: '#5a7a5a' },
    error: { icon: 'x-circle', bg: '#4a3a3a', iconColor: '#7a5a5a' },
    pending: { icon: 'clock', bg: '#4a4a3a', iconColor: '#7a7a5a' },
    info: { icon: 'alert-circle', bg: '#3a3a4a', iconColor: '#5a5a7a' },
  };

  const { icon, bg, iconColor } = config[type] || config.info;

  const el = document.createElement('div');
  el.className = 'grammar-status';

  el.style.display = 'flex';
  el.style.alignItems = 'center';
  el.style.gap = tokens.spacing.md;
  el.style.padding = `${tokens.spacing.md} ${tokens.spacing.lg}`;
  el.style.background = bg;
  el.style.border = '1px solid rgba(255,255,255,0.05)';
  el.style.borderRadius = tokens.radius.sm;

  const iconEl = buildIcon({ name: icon, size: 14 });
  iconEl.querySelector('svg').setAttribute('stroke', iconColor);

  const textEl = buildText({ size: 'sm', color: 'mid' }, content);

  el.appendChild(iconEl);
  el.appendChild(textEl);

  return el;
}

/**
 * Create a Spinner
 */
function buildSpinner() {
  const el = document.createElement('div');
  el.className = 'grammar-spinner';

  el.style.width = '14px';
  el.style.height = '14px';
  el.style.border = '1px solid #222';
  el.style.borderTopColor = tokens.colors.iconPrimary;
  el.style.borderRadius = '50%';
  el.style.animation = 'grammar-spin 1s linear infinite';

  // Add keyframes if not already present
  if (!document.querySelector('#grammar-spinner-keyframes')) {
    const style = document.createElement('style');
    style.id = 'grammar-spinner-keyframes';
    style.textContent = '@keyframes grammar-spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);
  }

  return el;
}

// ============================================================================
// GRAMMAR PARSER - Parse grammar strings into element structure
// ============================================================================

/**
 * Parse grammar string into element tree
 */
function parseGrammar(grammar) {
  const normalized = grammar
    .replace(/\]\s*\[/g, ']\n[')
    .trim();

  const lines = normalized.split('\n');
  const elements = [];
  const stack = [];

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check for closing tag
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

    // Parse opening tag
    const tagMatch = trimmed.match(/^\[(\w+)(?::([^\]]+))?\]\s*(.*)/);
    if (tagMatch) {
      const [, type, propsStr, contentAfterTag] = tagMatch;
      const props = {};

      // Parse properties
      if (propsStr) {
        propsStr.split(',').forEach(prop => {
          const parts = prop.trim().split('-');
          const key = parts[0];
          const val = parts.slice(1).join('-') || true;

          // Convert string booleans to actual booleans
          if (val === 'true') {
            props[key] = true;
          } else if (val === 'false') {
            props[key] = false;
          } else {
            props[key] = val;
          }
        });
      }

      const element = {
        type,
        props,
        children: [],
        content: contentAfterTag.trim() || ''
      };

      // Container types that expect children
      const containerTypes = ['grid', 'container', 'listitem'];

      if (!contentAfterTag && containerTypes.includes(type)) {
        stack.push(element);
      } else if (stack.length > 0) {
        stack[stack.length - 1].children.push(element);
      } else {
        elements.push(element);
      }
    }
  }

  // Close any remaining open elements
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

// ============================================================================
// GRAMMAR RENDERER - Convert parsed elements to DOM
// ============================================================================

/**
 * Render a single element to DOM
 */
function renderElement(element, onAction) {
  const { type, props, content, children } = element;

  switch (type) {
    case 'text':
      return buildText(props, content);

    case 'icon':
      return buildIcon(props);

    case 'grid':
    case 'container':
      const childElements = children.map(child => renderElement(child, onAction));
      const grid = buildGrid(props, childElements);

      // Add content if present
      if (content) {
        const textEl = buildText({}, content);
        grid.insertBefore(textEl, grid.firstChild);
      }

      return grid;

    case 'button':
      const button = buildButton(props, content);

      if (onAction && props.action) {
        button.addEventListener('click', () => {
          onAction(props.action, props);
        });
      }

      return button;

    case 'divider':
      return buildDivider(props);

    case 'listitem':
      const listChildren = children.map(child => renderElement(child, onAction));
      const listItem = buildListItem(props, listChildren);

      // Add content if present
      if (content) {
        const textEl = buildText({ size: 'sm', color: 'mid' }, content);
        listItem.querySelector('div').insertBefore(textEl, listItem.querySelector('div').firstChild);
      }

      return listItem;

    case 'status':
      return buildStatus(props, content);

    case 'spinner':
      return buildSpinner();

    default:
      return null;
  }
}

/**
 * Render grammar string to DOM container
 */
function renderGrammar(grammar, onAction) {
  const container = document.createElement('div');
  container.className = 'grammar-renderer';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = tokens.spacing.md;

  const elements = parseGrammar(grammar);

  elements.forEach(element => {
    const rendered = renderElement(element, onAction);
    if (rendered) {
      container.appendChild(rendered);
    }
  });

  return container;
}

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    tokens,
    parseGrammar,
    renderGrammar,
    renderElement,
    // Individual component builders
    buildText,
    buildIcon,
    buildGrid,
    buildButton,
    buildDivider,
    buildListItem,
    buildStatus,
    buildSpinner,
  };
}
