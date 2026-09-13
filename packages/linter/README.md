# Taildown linter

Linting and fixing are asynchronous because they use the Taildown compiler's parser and component registry.

```ts
import { createLinter } from '@taildown/linter';

const linter = createLinter();
const result = await linter.lint(source, 'document.td');
const fixed = await linter.fix(source, 'document.td');
```

The built-in rules check tab heading levels and unknown component names. Component names come from the compiler registry, including registered custom components. Fixes preserve surrounding text and can be run repeatedly.
