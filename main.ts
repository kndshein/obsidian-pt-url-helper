import { Editor, Notice, Plugin } from "obsidian";

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	pasteHandler = (event: ClipboardEvent, editor: Editor) => {
		let clipboard_text: string;

		if (!event.clipboardData) {
			console.error("Empty `clipboardData`");
			return;
		} else {
			clipboard_text = event.clipboardData.getData("text");
		}

		if (!clipboard_text) return;

		const story_regex = /(?<=\/story\/show\/)[0-9]+(?=\/||$)/g;
		const story_ids = clipboard_text.match(story_regex);
		//TODO: make sure it's a PT link
		if (!story_ids || story_ids.length > 1) {
			console.error("Multiple matches or none found for story id");
			return;
		}

		//TODO: check for if valid PT story link
		event.preventDefault();

		const formatted_text = `[#${story_ids[0]}](${clipboard_text})`;
		const curr_cursor = editor.getCursor();

		editor.replaceRange(formatted_text, curr_cursor);
		editor.setCursor({
			line: curr_cursor.line,
			ch: curr_cursor.ch + formatted_text.length,
		});

		console.log("Pasted!");
		console.log(event);
		new Notice(`${story_ids[0]}, ${clipboard_text}`);
	};

	async onload() {
		console.log("Loading pt-url-obsidian-plugin");
		this.app.workspace.on("editor-paste", this.pasteHandler);
	}

	onunload() {
		console.log("Un-loading pt-url-obsidian-plugin");
		this.app.workspace.off("editor-paste", this.pasteHandler);
	}
}
