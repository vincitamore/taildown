import type { CompileOptions, EditorView } from '../packages/compiler/src/editor-bundle';
import type { getAuthoringReference } from '../packages/compiler/src/authoring-reference';
export interface InsertCommand {
  name: string;
  icon: string;
  insert: string;
  description: string;
  cursorOffset?: number;
  wrapSelection?: boolean;
  customComponent?: string;
}
type PaletteCommand =
  | InsertCommand
  | { name: string; icon: string; description: string; action(): void };
export interface SlashState {
  active: boolean;
  start: number | null;
  filtered: InsertCommand[];
}
interface CommandElements {
  palette: HTMLDialogElement;
  search: HTMLInputElement;
  results: HTMLElement;
  empty: HTMLElement;
  close: HTMLElement;
  open: HTMLElement;
}
interface Options {
  document: Document;
  elements: CommandElements;
  slashMenu: HTMLElement;
  state: SlashState;
  getEditor(): Pick<EditorView, 'state' | 'focus' | 'coordsAtPos'> & {
    dispatch(edit: ReturnType<typeof commandEdit>): void;
  };
  authoringReference: Awaited<ReturnType<typeof getAuthoringReference>>;
  getDesignOptions(): CompileOptions;
  lucideIcon(name: string): string;
  openDesignSettings(): void;
}
export function createCuratedCommands(): InsertCommand[] {
  return [
    { name: 'Heading 1', icon: 'heading-1', insert: '# ', description: 'Large heading' },
    { name: 'Heading 2', icon: 'heading-2', insert: '## ', description: 'Medium heading' },
    { name: 'Heading 3', icon: 'heading-3', insert: '### ', description: 'Small heading' },
    {
      name: 'Bold',
      icon: 'bold',
      insert: '****',
      description: 'Bold text',
      cursorOffset: -2,
      wrapSelection: true,
    },
    {
      name: 'Italic',
      icon: 'italic',
      insert: '**',
      description: 'Italic text',
      cursorOffset: -1,
      wrapSelection: true,
    },
    {
      name: 'Sans-serif text',
      icon: 'type',
      insert: 'Your text {sans}\n',
      description: 'Paragraph using the sans-serif font',
      cursorOffset: -8,
    },
    {
      name: 'Serif text',
      icon: 'type',
      insert: 'Your text {serif}\n',
      description: 'Paragraph using the serif font',
      cursorOffset: -9,
    },
    {
      name: 'Dark mode colors',
      icon: 'moon',
      insert: 'Your text {text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 padded}\n',
      description: 'Choose separate text and background colors for each theme',
    },
    {
      name: 'Translucent card',
      icon: 'layers',
      insert:
        ':::card {bg-primary/10 dark:bg-primary/20 border-primary/30 padded}\nYour content\n:::\n',
      description: 'Color transparency without fading the text',
    },
    {
      name: 'Slate surface',
      icon: 'square',
      insert:
        ':::card {bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 padded}\nYour content\n:::\n',
      description: 'A cool neutral surface for light and dark themes',
    },
    {
      name: 'Monospace text',
      icon: 'code',
      insert: 'Your text {mono}\n',
      description: 'Paragraph using the monospace font',
      cursorOffset: -8,
    },
    {
      name: 'Code Block',
      icon: 'code-2',
      insert: '```\n\n```',
      description: 'Code with syntax highlighting',
      cursorOffset: -4,
    },
    {
      name: 'Inline Code',
      icon: 'code',
      insert: '``',
      description: 'Inline code',
      cursorOffset: -1,
      wrapSelection: true,
    },
    { name: 'Quote', icon: 'quote', insert: '> ', description: 'Blockquote' },
    { name: 'List', icon: 'list', insert: '- ', description: 'Bullet list' },
    { name: 'Numbered List', icon: 'list-ordered', insert: '1. ', description: 'Numbered list' },
    {
      name: 'Link',
      icon: 'link',
      insert: '[](url)',
      description: 'Hyperlink',
      cursorOffset: -6,
      wrapSelection: true,
    },
    {
      name: 'Image',
      icon: 'image',
      insert: '![](url)',
      description: 'Insert image',
      cursorOffset: -6,
      wrapSelection: true,
    },
    {
      name: 'Divider',
      icon: 'minus',
      insert: ':::divider\n\n:::',
      description: 'Decorative divider',
      cursorOffset: -4,
    },
    {
      name: 'Table',
      icon: 'table',
      insert: '| Header 1 | Header 2 |\n|----------|----------|\n|  |  |',
      description: '2-column table',
      cursorOffset: -6,
    },
    {
      name: 'Card',
      icon: 'box',
      insert: ':::card\n\n:::',
      description: 'Card component',
      cursorOffset: -4,
    },
    {
      name: 'Grid',
      icon: 'columns-2',
      insert:
        ':::grid {cols-2 loose}\n:::card\nFirst column\n:::\n:::card\nSecond column\n:::\n:::',
      description: 'Responsive two-column cards',
    },
    {
      name: 'Alert',
      icon: 'alert-circle',
      insert: ':::alert\n\n:::',
      description: 'Alert box',
      cursorOffset: -4,
    },
    {
      name: 'Callout',
      icon: 'lightbulb',
      insert: ':::callout\n\n:::',
      description: 'Callout box',
      cursorOffset: -4,
    },
    {
      name: 'Button',
      icon: 'box',
      insert: '[Button Text](#){button}',
      description: 'Inline button',
      cursorOffset: -17,
    },
    {
      name: 'Tabs',
      icon: 'layout',
      insert: ':::tabs\n## Tab 1\n\n## Tab 2\n\n:::',
      description: 'Tabbed interface',
      cursorOffset: -17,
    },
    {
      name: 'Mermaid',
      icon: 'wand-2',
      insert: ':::mermaid\n\n:::',
      description: 'Empty diagram',
      cursorOffset: -4,
    },
    {
      name: 'Mermaid: Flowchart',
      icon: 'git-branch',
      insert:
        ':::mermaid\ngraph TD\n  A[Start] --> B{Decision}\n  B -->|Yes| C[Action 1]\n  B -->|No| D[Action 2]\n  C --> E[End]\n  D --> E\n:::',
      description: 'Process flow diagram',
      cursorOffset: -4,
    },
    {
      name: 'Mermaid: Sequence',
      icon: 'arrow-right-left',
      insert:
        ':::mermaid\nsequenceDiagram\n  participant A as Alice\n  participant B as Bob\n  A->>B: Hello Bob!\n  B-->>A: Hi Alice!\n:::',
      description: 'UML sequence diagram',
      cursorOffset: -4,
    },
    {
      name: 'Mermaid: Gantt',
      icon: 'calendar',
      insert:
        ':::mermaid\ngantt\n  title Project Timeline\n  dateFormat YYYY-MM-DD\n  section Phase 1\n  Task 1 :a1, 2024-01-01, 30d\n  Task 2 :after a1, 20d\n  section Phase 2\n  Task 3 :2024-03-01, 45d\n:::',
      description: 'Project timeline',
      cursorOffset: -4,
    },
    {
      name: 'Mermaid: Class',
      icon: 'box',
      insert:
        ':::mermaid\nclassDiagram\n  class Animal {\n    +String name\n    +int age\n    +makeSound()\n  }\n  class Dog {\n    +bark()\n  }\n  Animal <|-- Dog\n:::',
      description: 'UML class diagram',
      cursorOffset: -4,
    },
    {
      name: 'Mermaid: State',
      icon: 'git-commit',
      insert:
        ':::mermaid\nstateDiagram-v2\n  [*] --> Idle\n  Idle --> Active : Start\n  Active --> Idle : Stop\n  Active --> Error : Failure\n  Error --> Idle : Reset\n  Error --> [*]\n:::',
      description: 'State machine',
      cursorOffset: -4,
    },
    {
      name: 'Mermaid: ER Diagram',
      icon: 'database',
      insert:
        ':::mermaid\nerDiagram\n  CUSTOMER ||--o{ ORDER : places\n  ORDER ||--|{ LINE-ITEM : contains\n  CUSTOMER {\n    string name\n    string email\n  }\n  ORDER {\n    int orderNumber\n    date orderDate\n  }\n:::',
      description: 'Database schema',
      cursorOffset: -4,
    },
    {
      name: 'Mermaid: Pie Chart',
      icon: 'pie-chart',
      insert:
        ':::mermaid\npie title Distribution\n  "Category A" : 45\n  "Category B" : 30\n  "Category C" : 15\n  "Category D" : 10\n:::',
      description: 'Pie chart',
      cursorOffset: -4,
    },
  ];
}
export function commandEdit(
  command: Pick<InsertCommand, 'insert' | 'cursorOffset' | 'wrapSelection'>,
  from: number,
  to: number,
  doc: { sliceString(from: number, to?: number): string },
  preserveSelection = false
) {
  let insert = command.insert;
  let cursor = insert.length + (command.cursorOffset || 0);
  if (preserveSelection && command.wrapSelection && to > from) {
    const selected = doc.sliceString(from, to);
    insert = insert.slice(0, cursor) + selected + insert.slice(cursor);
    cursor += selected.length;
  }
  const block =
    (insert.includes('\n') && !command.wrapSelection) ||
    /^(?:#{1,6} |>[ ]|-[ ]|\d+\. )/.test(insert);
  let prefix = '',
    suffix = '';
  if (block) {
    const before = doc.sliceString(0, from);
    const after = doc.sliceString(to);
    if (before) prefix = '\n'.repeat(Math.max(0, 2 - (before.match(/\n*$/)?.[0].length ?? 0)));
    if (after) suffix = '\n'.repeat(Math.max(0, 2 - (after.match(/^\n*/)?.[0].length ?? 0)));
  }
  return {
    changes: { from, to, insert: prefix + insert + suffix },
    selection: { anchor: from + prefix.length + cursor },
  };
}

export function createCommands({
  document,
  elements,
  slashMenu,
  state,
  getEditor,
  authoringReference,
  getDesignOptions,
  lucideIcon,
  openDesignSettings,
}: Options) {
  let slashMenuIndex = 0;
  const slashCommands = createCuratedCommands();
  // Every registered component is discoverable; keep richer curated templates.
  for (const component of authoringReference.components) {
    if (getDesignOptions().components?.[component.name]) continue;
    const name = component.name.replace(/-/g, ' ');
    const existing = slashCommands.find((command) => command.name.toLowerCase() === name);
    if (existing && component.example) {
      existing.insert = component.example;
      existing.cursorOffset = -4;
    } else if (!existing) {
      slashCommands.push({
        name: name.replace(/\b\w/g, (letter) => letter.toUpperCase()),
        icon: 'box',
        insert: component.example || `:::${component.name}\n\n:::`,
        cursorOffset: -4,
        description: component.description || `${name} component`,
      });
    }
  }

  const commandPalette = elements.palette;
  const commandSearch = elements.search;
  const commandResults = elements.results;
  let paletteCommands: PaletteCommand[] = [];
  let paletteIndex = 0;
  let paletteSelection: { from: number; to: number } | null = null;

  function searchCommands(searchText: string) {
    const query = searchText.trim().toLowerCase();
    const custom = getDesignOptions().components || {};
    const commands = slashCommands.filter(
      (command) => !command.customComponent || custom[command.customComponent]
    );
    for (const [name, component] of Object.entries(custom)) {
      if (!commands.some((command) => command.customComponent === name))
        commands.push({
          name: name.replace(/-/g, ' '),
          icon: 'box',
          description:
            'description' in component &&
            typeof component.description === 'string' &&
            component.description
              ? component.description
              : `Custom ${name} component`,
          insert: `:::${name}\nYour content\n:::`,
          cursorOffset: -4,
          customComponent: name,
        });
    }
    if (!query) return commands;
    const rank = (command: InsertCommand) => {
      const name = command.name.toLowerCase();
      if (name === query) return 0;
      if (name.startsWith(query)) return 1;
      if (name.includes(query)) return 2;
      return command.description.toLowerCase().includes(query) ? 3 : 4;
    };
    return commands.filter((command) => rank(command) < 4).sort((a, b) => rank(a) - rank(b));
  }

  function renderCommandPalette() {
    const settingsCommand = {
      name: 'Design settings',
      icon: 'settings',
      description: 'Configure custom palette, fonts, style aliases and components',
      action: openDesignSettings,
    };
    paletteCommands = searchCommands(commandSearch.value);
    if (
      `${settingsCommand.name} ${settingsCommand.description}`
        .toLowerCase()
        .includes(commandSearch.value.trim().toLowerCase())
    )
      paletteCommands.unshift(settingsCommand);
    paletteIndex = 0;
    commandResults.replaceChildren();
    paletteCommands.forEach((command, index) => {
      const option = document.createElement('div');
      option.className = 'slash-menu-item';
      option.id = `palette-option-${index}`;
      option.setAttribute('role', 'option');
      const icon = document.createElement('span');
      icon.className = 'slash-menu-icon';
      icon.innerHTML = lucideIcon(command.icon);
      const text = document.createElement('div');
      const title = document.createElement('div');
      title.className = 'slash-menu-title';
      title.textContent = command.name;
      const description = document.createElement('div');
      description.className = 'slash-menu-desc';
      description.textContent = command.description;
      text.append(title, description);
      option.append(icon, text);
      option.addEventListener('click', () => insertPaletteCommand(index));
      commandResults.append(option);
    });
    elements.empty.hidden = paletteCommands.length !== 0;
    selectPaletteOption();
  }

  function selectPaletteOption() {
    [...commandResults.children].forEach((option, index) => {
      option.classList.toggle('selected', index === paletteIndex);
      option.setAttribute('aria-selected', String(index === paletteIndex));
    });
    const option = commandResults.children[paletteIndex];
    if (option) {
      commandSearch.setAttribute('aria-activedescendant', option.id);
      option.scrollIntoView({ block: 'nearest' });
    } else commandSearch.removeAttribute('aria-activedescendant');
  }

  function openCommandPalette() {
    if (commandPalette.open) return true;
    hideSlashMenu();
    const { from, to } = getEditor().state.selection.main;
    paletteSelection = { from, to };
    commandSearch.value = '';
    commandPalette.showModal();
    renderCommandPalette();
    commandSearch.focus();
    return true;
  }

  function insertPaletteCommand(index: number) {
    const command = paletteCommands[index];
    if (!command || !paletteSelection) return;
    if ('action' in command) {
      commandPalette.addEventListener('close', () => command.action(), { once: true });
      commandPalette.close();
      return;
    }
    const { from, to } = paletteSelection;
    getEditor().dispatch(commandEdit(command, from, to, getEditor().state.doc, true));
    commandPalette.close();
  }

  commandPalette.addEventListener('close', () => {
    paletteSelection = null;
    getEditor().focus();
  });
  commandSearch.addEventListener('input', renderCommandPalette);
  commandSearch.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (paletteCommands.length)
        paletteIndex =
          (paletteIndex + (event.key === 'ArrowDown' ? 1 : -1) + paletteCommands.length) %
          paletteCommands.length;
      selectPaletteOption();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      insertPaletteCommand(paletteIndex);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      commandPalette.close();
    }
  });
  elements.close.addEventListener('click', () => commandPalette.close());
  elements.open.addEventListener('click', openCommandPalette);

  // Slash command functions
  function showSlashMenu(searchText = '') {
    // Update filtered commands in outer scope
    state.filtered = searchCommands(searchText);

    slashMenuIndex = 0;
    slashMenu.replaceChildren();
    state.filtered.forEach((command, index) => {
      const item = document.createElement('div');
      item.className = `slash-menu-item ${index === 0 ? 'selected' : ''}`;
      item.dataset.index = String(index);
      const icon = document.createElement('div');
      icon.className = 'slash-menu-icon';
      icon.innerHTML = lucideIcon(command.icon);
      const content = document.createElement('div');
      content.className = 'slash-menu-content';
      const title = document.createElement('div');
      title.className = 'slash-menu-title';
      title.textContent = command.name;
      const description = document.createElement('div');
      description.className = 'slash-menu-desc';
      description.textContent = command.description;
      content.append(title, description);
      item.append(icon, content);
      slashMenu.append(item);
    });
    if (state.filtered.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'slash-menu-item';
      empty.setAttribute('role', 'status');
      empty.textContent = 'No matching commands. Keep typing or press Escape.';
      slashMenu.append(empty);
    }

    slashMenu.classList.add('active');
    state.active = true;
    positionSlashMenu();

    // Add click handlers
    slashMenu.querySelectorAll('[data-index]').forEach((item, index) => {
      item.addEventListener('click', () => {
        insertSlashCommand(state.filtered[index]);
      });
    });
  }

  function positionSlashMenu() {
    if (!state.active) return;
    const coords = getEditor().coordsAtPos(getEditor().state.selection.main.head);
    if (!coords) return;
    const viewport = document.defaultView;
    if (!viewport) return;
    const rect = slashMenu.getBoundingClientRect();
    const left = Math.max(8, Math.min(coords.left, viewport.innerWidth - rect.width - 8));
    const below = coords.bottom + 5;
    const preferredTop =
      below + rect.height <= viewport.innerHeight - 8 ? below : coords.top - rect.height - 5;
    const top = Math.max(8, Math.min(preferredTop, viewport.innerHeight - rect.height - 8));
    slashMenu.style.left = `${left}px`;
    slashMenu.style.top = `${top}px`;
  }

  document.defaultView?.addEventListener('resize', positionSlashMenu);
  document.addEventListener('scroll', positionSlashMenu, true);

  function hideSlashMenu() {
    slashMenu.classList.remove('active');
    state.active = false;
    state.start = null;
    slashMenuIndex = 0;
    state.filtered = [];
  }

  function navigateSlashMenu(direction: 'down' | 'up') {
    const items = slashMenu.querySelectorAll('[data-index]');
    if (items.length === 0) return;

    items[slashMenuIndex]?.classList.remove('selected');

    if (direction === 'down') {
      slashMenuIndex = (slashMenuIndex + 1) % items.length;
    } else {
      slashMenuIndex = (slashMenuIndex - 1 + items.length) % items.length;
    }

    items[slashMenuIndex]?.classList.add('selected');
    items[slashMenuIndex]?.scrollIntoView({ block: 'nearest' });
  }

  function insertSlashCommand(command: InsertCommand | undefined) {
    if (!command || state.start === null) return;

    const { from, to } = { from: state.start, to: getEditor().state.selection.main.head };
    getEditor().dispatch(commandEdit(command, from, to, getEditor().state.doc));

    hideSlashMenu();
  }

  function executeSelectedCommand() {
    if (state.filtered.length === 0) return;

    // Use the currently selected index from the stored filtered commands
    const command = state.filtered[slashMenuIndex];
    if (command) {
      insertSlashCommand(command);
    }
  }

  return {
    openCommandPalette,
    showSlashMenu,
    hideSlashMenu,
    navigateSlashMenu,
    executeSelectedCommand,
    searchCommands,
  };
}
