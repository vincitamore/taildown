# Plain English Resolution Order

Test style resolution order per SYNTAX.md §2.7.6

## Basic Resolution

Text {large}

Text {bold}

Text {primary}

## Multiple Classes - Later Wins

Text {large small}

Text {bold thin}

Text {primary secondary}

## Component Variants First

[Button](url){button primary}

[Badge](url){badge success}

## Plain English Shorthands

Text {large-bold}

Text {huge-bold}

## Direct CSS Classes

Text {.text-4xl}

Text {.font-bold}

## Mixed Resolution

Text {large .text-gray-500 bold}

# Heading {huge-bold .custom-class primary}

[Link](url){button primary .custom-button-class large}
