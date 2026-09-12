# Linter architecture

The linter is an asynchronous library over the Taildown parser. Its public entry is [src/index.ts](src/index.ts); [src/types.ts](src/types.ts) defines the result, rule and configuration contracts. See [README.md](README.md) for basic use.

## Linting

`createLinter()` registers the built-in component-name and tab-heading rules. `new Linter()` starts an empty rule registry for callers that register their own rules. `lint(source, filePath)` awaits parsing, runs enabled rules against the AST and original source lines, orders diagnostics by location, and returns severity/fixability counts.

The component-name rule uses the compiler registry. Parsing must finish initialization before rules inspect definitions. A compiler/parser change can therefore affect linter behavior even when no rule file changes.

Rules implement `check(context)` and report through `context.report`. The linter owns the rule name, configured severity and fixability attached to each message. A rule exception becomes a diagnostic rather than terminating the remaining checks. The `rules` configuration can override a rule's severity or set it to `off`.

## Source fixes

`fix(source, filePath)` runs fixable enabled rules in registration order. A rule returns a source transformation; the linter reparses changed source before the next rule and lints the final text again. The default registry repairs component names before checking heading levels inside those components.

```ts
const linter = createLinter({rules: {'tabs-heading-level': 'warning'}});
const result = await linter.lint(source, 'page.td');
const repair = await linter.fix(source, 'page.td');
console.log(result.messages);
console.log(repair.fixed, repair.modified, repair.messages);
```

Callers decide when to apply or save `repair.fixed`. The library does not write files, attach to an editor, or watch save events. Use source edits for custom fixes: the core has no AST-to-Taildown serializer. Preserve unaffected bytes and source locations; test repeated fixing so a fix does not keep changing its own output.

The optional `autoFix` and `ignore` fields retained in the configuration types do not implement a save hook or file-pattern filter in the core. Integrations must manage file selection and invocation explicitly. Do not infer a feature from a placeholder type field.

## Verification

Use actual Taildown source with the asynchronous API. Test diagnostic locations, disabled rules, preservation of unrelated text, registry-dependent names, and repeat fixes. A successful parse is not proof that a rule diagnoses the correct source span. Linting is also separate from HTML accessibility and browser-runtime verification.

Do not document synchronous `lint`/`fix` helpers or a `fixed.source` result: the supported API is a linter instance with awaited methods and `FixResult.fixed`. Public changes follow the repository's [integration rules](../../PROJECT-RULES.md).
