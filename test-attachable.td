# Attachable Modal & Tooltip Test

## Simple Inline Attachments

Here is a [button with a tooltip](#){button primary tooltip="This is a helpful tooltip!"}.

And here is a [link that opens a modal](#){button modal="This is a simple alert message!"}.

You can also [hover over this text](#){tooltip="More information here"} for more details.

## Complex Content with ID References

[Open Welcome Dialog](#){button primary modal="#welcome-modal"}

[More Info](#){button secondary tooltip="#detailed-info"}

:::modal{id="welcome-modal"}
# Welcome to Taildown!

This is a **complex modal** with:
- Rich formatting
- Multiple paragraphs
- Lists and more!

Learn more about Taildown's powerful syntax and beautiful components.
:::

:::tooltip{id="detailed-info"}
This is a **detailed tooltip** with full markdown support including `code` and *emphasis*.
:::

## Multiple Attachments

Create beautiful [interactive elements](#){button primary fade-in modal="#info"} with ease.

[Hover for tips](#){tooltip="Quick tip!"} or [click for details](#){button modal="Extended information about this feature"}.

:::modal{id="info"}
# More Information

Taildown makes it easy to create **beautiful**, **accessible**, and **interactive** components with plain English syntax.
:::

## Real-World Examples

Visit our [documentation](#){badge primary tooltip="Click to learn more"} to get started.

Need help? [Contact Support](#){button success modal="#contact"} anytime.

:::modal{id="contact"}
# Contact Support

Email: support@taildown.dev
Phone: 1-800-TAILDOWN

We're here to help 24/7!
:::

