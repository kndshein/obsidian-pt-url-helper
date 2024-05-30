# Pivotal Tracker URL Helper

When pasting pivotal tracker story links, a formatted hyperlink will be created w/ the story number as the text.

Pasting `https://www.pivotaltracker.com/story/show/123456789` will become `[#123456789](https://www.pivotaltracker.com/story/show/123456789)`, which would render as `[#123456789]`.

## Quirks

If there is existing text selected, this plugin will favor default behavior. This means that if no other plugins that mutate selected-text-behavior are installed, the selected text will simply be replaced w/ the "raw" link as if this plugin didn't exist at all. However, if there is an another URL-mutating plugin installed, such as [obsidian-url-into-selection](https://github.com/denolehov/obsidian-url-into-selection), the other plugin will not clash w/ pt-url-helper.

## Potential Future Work

-   Adding a setting toggle to disable `#` prefix.
-   Allow pasting into selected text, simply replacing the selection with the formatted hyperlink.
    -   The main issue for this work is that I'm currently unsure how to override the behavior of other plugins that mutate selected texts.
