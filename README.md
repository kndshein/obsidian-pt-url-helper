# Pivotal Tracker URL Helper

When pasting pivotal tracker story links, a formatted hyperlink will be created w/ the story number as the text.

Pasting `https://www.pivotaltracker.com/story/show/123456789` will become `[#123456789](https://www.pivotaltracker.com/story/show/123456789)`, which would render as `#123456789`.

## Quirks

-   If there is existing text selected when pasted, this plugin will favor default behavior (as if this plugin doesn't exist at all).
    -   If no other plugins that mutate selected-text behavior is installed, the selected text will simply be replaced w/ the "raw" link.
    -   If there is another URL-mutating plugin installed, such as [obsidian-url-into-selection](https://github.com/denolehov/obsidian-url-into-selection), pt-url-helper will not cause any conflicts.

## Potential Future Work

-   Adding a setting toggle to disable `#` prefix.
-   Allow pasting into selected text, simply replacing the selection with the formatted hyperlink.
    -   The main issue for this work is that I'm currently unsure how to override the behavior of other plugins that mutate selected texts.
