import { Editor, Notice, Plugin } from "obsidian";
import { URL } from "url";

export default class MyPlugin extends Plugin {
	pasteHandler = (event: ClipboardEvent, editor: Editor) => {
		let clipboard_text: string;

		if (!event.clipboardData) {
			console.error("Empty `clipboardData`");
			return;
		} else {
			clipboard_text = event.clipboardData.getData("text");
		}

		if (!clipboard_text) return;

		let url: URL;
		try {
			url = new URL(clipboard_text);
		} catch {
			console.log("Clipboard pasted; it was not a PT link.");
			return;
		}

		if (url.host != "www.pivotaltracker.com") {
			console.log("URL is not PT");
			return;
		}
		const story_regex = /(?<=\/story\/show\/)[0-9]+(?=\/||$)/g;
		const story_ids = clipboard_text.match(story_regex);
		if (!story_ids || story_ids.length > 1) {
			console.error("Multiple matches or none found for story id");
			return;
		}
		const story_id_tag = `#${story_ids[0]}`;

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
		console.log(`Loading ${this.manifest.id}`);
		this.app.workspace.on("editor-paste", this.pasteHandler);
	}

	onunload() {
		console.log(`Un-loading ${this.manifest.id}`);
		this.app.workspace.off("editor-paste", this.pasteHandler);
	}
}
