# Icon Integration

Test icons in various contexts per SYNTAX.md §2.6.2

## Icons in Components

:::card
### Title with icon :icon[bookmark]{primary}
Content with :icon[info]{sm} inline icon.
:::

:::alert{success}
:icon[check]{success} Operation completed successfully!
:::

:::alert{error}
:icon[x-circle]{error} An error occurred.
:::

## Icons in Lists

- Item with icon :icon[check]{success}
- Another item :icon[star]{primary}
- Third item :icon[heart]{error}

1. First :icon[circle]{sm}
2. Second :icon[circle]{sm}
3. Third :icon[circle]{sm}

## Icons in Button Links

[Get Started :icon[arrow-right]](url){button primary}

[:icon[download] Download](url){button secondary}

[:icon[settings] Settings](url){button}

## Icons in Badge Links

[New :icon[sparkles]](url){badge primary}

[:icon[alert-triangle] Warning](url){badge warning}

## Icons with Modals and Tooltips

[Click :icon[help-circle]](url){modal="Help information"}

[Hover :icon[info]](url){tooltip="More details"}

## Color Inheritance

Red text with icon :icon[heart] {.text-red-500}

Primary icon override: :icon[heart]{primary} {.text-red-500}

## Multiple Icons in Paragraph

Start :icon[star] middle :icon[heart] end :icon[check]
