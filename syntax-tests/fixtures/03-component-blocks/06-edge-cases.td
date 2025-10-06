# Component Block Edge Cases

Test edge cases per SYNTAX.md §3.5

## Incomplete Fences

::card

::::card

::: card

## Component Name in Content

:::card
The word :::card inside content is treated as plain text, not a fence.
:::

## Fence in Code Block

:::card
```
Code block can contain ::: without closing component
```
:::

## Empty Components

:::card
:::

## Unclosed Components

:::card
Content without closing fence

## Multiple Consecutive Fences

:::card
First card
:::
:::card
Second card
:::
:::card
Third card
:::
