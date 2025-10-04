# Edge Cases: Precedence and Ambiguity

## Code blocks take precedence

```
:::card {.class}
This looks like a component but it's inside a code block.
:::
```

## Inline code protects attribute syntax

This is `{.not-an-attribute}` in inline code.

## Escaped syntax

\# Not a heading

\:::card
Not a component fence
\:::

\{.not-a-class}

## Literal braces in text

Use JSON like this: {"key": "value"}

Objects can have braces: {foo: bar}

But this is an attribute: {.actual-class}

## Ambiguous positioning

{.at-start} This paragraph starts with braces - treated as text

This paragraph has {.in-middle} braces - treated as text

This paragraph has valid braces at end {.valid}
