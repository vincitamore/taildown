# Attachable Tooltips

Test tooltip attachment per SYNTAX.md §2.8.2

## Inline Content Tooltips

[Hover here](#){tooltip="Helpful tip!"}

Learn about [important concepts](#){tooltip="Additional context"}

[More info](#){tooltip="Brief explanation"}

## ID-Referenced Tooltips

[More Info](#){button tooltip="#detailed-info"}

[Help](#){badge info tooltip="#help-text"}

[Question](#){tooltip="#explanation"}

:::tooltip{id="detailed-info"}
This is a **detailed tooltip** with full markdown support including `code` and *emphasis*.
:::

:::tooltip{id="help-text"}
**Help**: This feature allows you to do X, Y, and Z.
:::

:::tooltip{id="explanation"}
A comprehensive explanation with:
- Point 1
- Point 2
- Point 3
:::

## Multiple Triggers for Same Tooltip

Technical term 1[?](#){tooltip="#glossary-term"}

Technical term 2[?](#){tooltip="#glossary-term"}

Technical term 3[?](#){tooltip="#glossary-term"}

:::tooltip{id="glossary-term"}
**Definition**: Detailed explanation of the technical term.
:::

## Combined with Other Attributes

[Submit](#){button primary tooltip="Click to submit the form"}

[Help :icon[help-circle]](#){tooltip="Get assistance"}

[Info](#){badge secondary tooltip="#more-info"}

:::tooltip{id="more-info"}
Additional information about this feature.
:::

## Tooltips with Icons

[Help :icon[help-circle]{sm}](#){tooltip="Click for help"}

[:icon[info]{primary}](#){tooltip="Information"}
