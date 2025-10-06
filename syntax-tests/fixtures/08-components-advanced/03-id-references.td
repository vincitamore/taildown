# ID-Referenced Components

Test ID references per SYNTAX.md §3.8

## Modal ID References

[Open Modal 1](#){button modal="#modal-1"}
[Open Modal 2](#){button modal="#modal-2"}
[Open Modal 3](#){button modal="#modal-3"}

:::modal{id="modal-1"}
# Modal 1
Content for first modal
:::

:::modal{id="modal-2"}
# Modal 2
Content for second modal
:::

:::modal{id="modal-3"}
# Modal 3
Content for third modal
:::

## Tooltip ID References

[Tooltip 1](#){tooltip="#tip-1"}
[Tooltip 2](#){tooltip="#tip-2"}
[Tooltip 3](#){tooltip="#tip-3"}

:::tooltip{id="tip-1"}
First tooltip content
:::

:::tooltip{id="tip-2"}
Second tooltip content
:::

:::tooltip{id="tip-3"}
Third tooltip content
:::

## Shared References (DRY Principle)

[Button A](#){button modal="#shared"}
[Button B](#){button secondary modal="#shared"}
[Button C](#){button error modal="#shared"}

:::modal{id="shared"}
# Shared Content

This modal is referenced by multiple buttons.
:::

## Mixed Modal and Tooltip References

[Help with Modal](#){button modal="#help-modal" tooltip="Click to open help"}

[Info with Tooltip](#){tooltip="#info-tip"}

:::modal{id="help-modal"}
# Help Documentation

Full help content here.
:::

:::tooltip{id="info-tip"}
Quick info tooltip
:::

## Complex ID References

[Feature A](#){button primary large modal="#feature-modal" .custom-class}

:::modal{id="feature-modal"}
## Feature Details

This modal demonstrates:
- **Rich content**
- Multiple sections
- `Code examples`
- [Links](https://example.com)

:::card
Nested card in modal
:::
:::

## Invalid References

[Invalid modal](#){modal="#nonexistent"}

[Invalid tooltip](#){tooltip="#also-nonexistent"}
