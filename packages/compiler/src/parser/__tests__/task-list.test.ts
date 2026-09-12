import { expect, it } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import type { ListItem } from 'mdast';
import { parseEnhancedTaskList } from '../task-list-parser';

it('keeps nested task priority and assignee on the child task', async () => {
  const processor = unified().use(remarkParse).use(remarkGfm).use(parseEnhancedTaskList);
  const tree = await processor.run(processor.parse('- [ ] Parent\n  - [x] Child {high} @alice'));
  const items: ListItem[] = [];
  visit(tree, 'listItem', item => { items.push(item); });
  expect(items[0]?.data?.hProperties?.['data-task-priority']).toBeUndefined();
  expect(items[0]?.data?.hProperties?.['data-task-assignee']).toBeUndefined();
  expect(items[1]?.data?.hProperties).toMatchObject({
    'data-task-priority': 'high', 'data-task-assignee': 'alice', 'data-task-state': 'done',
  });
});
