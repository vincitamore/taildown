import {markdownLanguage} from '@codemirror/lang-markdown';
import {TreeFragment, type ChangedRange} from '@lezer/common';

/** Incremental Markdown structure for code-span decoration in the editor. */
export class InlineCodeIndex {
  private fragments: readonly TreeFragment[] = [];

  update(source: string, changes?: readonly ChangedRange[]): Array<{from:number; to:number}> {
    const fragments = changes ? TreeFragment.applyChanges(this.fragments, changes) : [];
    const tree = markdownLanguage.parser.parse(source, fragments);
    this.fragments = TreeFragment.addTree(tree);
    const ranges: Array<{from:number; to:number}> = [];
    tree.iterate({enter(node) {
      if (node.name === 'InlineCode') ranges.push({from:node.from, to:node.to});
    }});
    return ranges;
  }
}
