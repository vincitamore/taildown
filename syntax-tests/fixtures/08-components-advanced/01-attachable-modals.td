# Attachable Modals

Test modal attachment per SYNTAX.md §2.8.1

## Inline Content Modals

[Click me](#){button modal="This is a simple alert!"}

[Learn more](#){modal="Extended information about this feature"}

Regular text can also have a [modal link](#){modal="Inline content"}

## ID-Referenced Modals

[Open Welcome Dialog](#){button modal="#welcome-modal"}

[Open Info](#){button secondary modal="#info-modal"}

[Open Alert](#){button error modal="#alert-modal"}

:::modal{id="welcome-modal"}
# Welcome to Taildown!

This modal has **rich markdown** content:
- Multiple paragraphs
- Lists and formatting
- Even `code blocks`
:::

:::modal{id="info-modal"}
## Information

This is detailed information with:
1. Numbered lists
2. **Bold text**
3. *Italic text*
:::

:::modal{id="alert-modal"}
:icon[alert-triangle]{warning} **Warning!**

This action cannot be undone.
:::

## Multiple Triggers for Same Modal

[Button 1](#){button modal="#shared-modal"}

[Button 2](#){button modal="#shared-modal"}

[Button 3](#){button modal="#shared-modal"}

:::modal{id="shared-modal"}
# Shared Modal

This content is shown when any of the three buttons is clicked.
:::

## Combined with Other Attributes

[Submit](#){button primary large modal="Form submitted successfully!"}

[Help](#){badge info modal="Click for assistance"}

[Settings](#){button secondary modal="#settings-modal" .custom-class}

:::modal{id="settings-modal"}
## Settings

Configure your preferences here.
:::
