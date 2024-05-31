import { Editor, Notice, Plugin } from "obsidian";
import { URL } from "url";

export default class PtUrlHelperPlugin extends Plugin {
	pasteHandler = (event: ClipboardEvent, editor: Editor) => {
		// This prevents clashing w/ [Paste URL into selection](https://github.com/denolehov/obsidian-url-into-selection).
		//TODO: Future work may be to add ability to override existing text manipulation scripts w/ a setting toggle
		if (editor.somethingSelected()) {
			console.debug("Selected text detected, default behavior is used.");
			return;
		}

		let clipboard_text: string;
		if (!event.clipboardData) {
			console.error("Empty `clipboardData`");
			return;
		} else {
			clipboard_text = event.clipboardData.getData("text");
		}
		if (!clipboard_text) return;

		let url: URL;
		// Check if the URL is valid
		try {
			url = new URL(clipboard_text);
		} catch {
			console.debug("Clipboard pasted; it was not a PT link.");
			return;
		}
		if (url.host != "www.pivotaltracker.com") {
			console.debug("URL is not PT");
			return;
		}

		// Wanted to use /(?<=\/story\/show\/)[0-9]+(?=\/||$)/g but iOS doesn't support lookbehinds (https://github.com/obsidianmd/obsidian-releases/pull/3609#issuecomment-2141184314)
		// Regex is the bane of my existence and a source of shame
		// Apologies for the code below...
		const story_regex = /\/story\/show\/(\d+)/g;
		const story_ids = clipboard_text.match(story_regex);
		if (!story_ids || story_ids.length > 1) {
			console.error("Multiple matches or none found for story id");
			return;
		}
		const story_id_tag = `#${story_ids[0].replace("/story/show/", "")}`;

		// Prevent pasting since this script will write the string
		event.preventDefault();

		const formatted_text = `[${story_id_tag}](${clipboard_text})`;
		const curr_cursor = editor.getCursor();

		editor.replaceRange(formatted_text, curr_cursor);
		editor.setCursor({
			line: curr_cursor.line,
			ch: curr_cursor.ch + formatted_text.length,
		});

		new Notice(`Formatted PT link for: ${story_id_tag}`);
	};

	onload() {
		console.debug(`Loading ${this.manifest.id}`);
		this.app.workspace.on("editor-paste", this.pasteHandler);
	}

	onunload() {
		console.debug(`Un-loading ${this.manifest.id}`);
		this.app.workspace.off("editor-paste", this.pasteHandler);
	}
}
