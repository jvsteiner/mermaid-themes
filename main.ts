import { App, Plugin, PluginSettingTab, Setting } from "obsidian";

import mermaid from "mermaid";
import { v4 as uuidv4 } from "uuid";

// Remember to rename these classes and interfaces!

type Anything = {
	[key: string]: any;
};
interface MermaidThemeSettings {
	theme: string;
	tweakStyle: boolean;
	themeTweaks: Anything;
}

const DEFAULT_SETTINGS: MermaidThemeSettings = {
	theme: "default",
	tweakStyle: false,
	themeTweaks: {},
};

export default class MermaidThemePlugin extends Plugin {
	settings: MermaidThemeSettings;
	mermaid: any;
	tab: MermaidThemeSettingTab;

	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new MermaidThemeSettingTab(this.app, this));
		this.mermaid = mermaid;
		mermaid.initialize({ startOnLoad: true });
		// console.log("new", mermaid);
		this.setTheme(this.settings.theme);
		this.registerMarkdownCodeBlockProcessor("merm", this.draw_diagram());
	}

	refresh() {
		const leaf: any = this.app.workspace.activeLeaf
			? this.app.workspace.activeLeaf
			: null;
		leaf?.rebuildView();
	}

	private draw_diagram() {
		return (source: string, el: HTMLElement) => {
			const boxWidth = "100%";
			const boxHeight = "100%";

			el.setAttributeNS(null, "width", String(boxWidth));
			el.setAttributeNS(null, "height", String(boxHeight));
			el.setAttributeNS(
				null,
				"style",
				"text-align: left;display: block;"
			);

			const anID = `mermaid-${uuidv4().toString().replace(/-/gi, "")}`;
			this.mermaid
				.render(anID, source)
				.then((svg: any) => {
					// console.log("rendered", svg);
					// const uriData = `data:image/svg+xml;base64,${btoa(
					// 	svg.svg
					// )}`;
					// console.log("uriData", uriData);
					// const img = new Image();
					// img.src = uriData;
					// img.onload = () => {
					// 	el.innerHTML = "";
					// 	el.appendChild(img);
					// };

					// const link = document.createElement("a");
					el.innerHTML = svg.svg;
					// el.appendChild(link);
				})
				.catch((err: any) => {
					console.log("error", err);
					el.innerHTML = `<pre>${err}</pre>`;
				});
		};
	}

	onunload() {}

	setTheme(theme: string) {
		if (this.settings.tweakStyle) {
			this.mermaid.initialize({ theme: "base" });
			const conf = this.mermaid.mermaidAPI.getConfig();
			this.settings.themeTweaks.theme = "base";
			const newTheme = { ...conf, ...this.settings.themeTweaks };
			this.mermaid.initialize(newTheme);
		} else {
			this.mermaid.initialize({ theme: theme });
		}

		this.refresh();
		this.tab.display();
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class MermaidThemeSettingTab extends PluginSettingTab {
	plugin: MermaidThemePlugin;

	constructor(app: App, plugin: MermaidThemePlugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.plugin.tab = this;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl("h2", { text: "Settings for Mermaid Themes" });
		containerEl.createEl("br");

		const coffeeDiv = containerEl.createDiv("coffee");
		const coffeeLink = coffeeDiv.createEl("a", {
			href: "https://www.buymeacoffee.com/jvsteiner",
		});
		const coffeeImg = coffeeLink.createEl("img", {
			attr: {
				src: "https://cdn.buymeacoffee.com/buttons/v2/default-blue.png",
			},
		});
		coffeeImg.height = 45;
		containerEl.createEl("br");

		new Setting(containerEl)
			.setName("Choose a Theme")
			.setDesc("Choose a built in theme to use for Mermaid diagrams.")
			.addDropdown((dropdown: any) => {
				dropdown
					.addOptions({
						default: "Default",
						neutral: "Neutral",
						dark: "Dark",
						forest: "Forest",
						base: "Base",
					})
					.setValue(this.plugin.settings.theme)
					.onChange(async (value: any) => {
						this.plugin.settings.theme = value;
						await this.plugin.saveSettings();
						this.plugin.setTheme(value);
					});
			});

		new Setting(containerEl)
			.setName("Use custom theme")
			.setDesc(
				"Customize your own theme.  This setting will take the settings configured below, and then use them to override the base theme. Only the base theme can be customized. This setting overrides the theme setting above."
			)
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.tweakStyle)
					.onChange(async (value) => {
						this.plugin.settings.tweakStyle = value;
						await this.plugin.saveSettings();
						this.plugin.setTheme(this.plugin.settings.theme);
					});
			});

		new Setting(containerEl)
			.setName("Theme customizations")
			.setDesc(
				"Configure a mermaid conf in valid JSON. These get applied to the base theme."
			)
			.setClass("mermaid-themes-settings")
			.addTextArea((text) =>
				text
					.setPlaceholder(
						`{
	"theme": "base",
	"themeVariables":
	{
		"nodeTextColor": "#F00"
	}
}`
					)
					.setValue(
						JSON.stringify(
							this.plugin.settings.themeTweaks,
							null,
							"\t"
						)
					)
					.onChange(async (value) => {
						let theme = {};
						try {
							theme = JSON.parse(value.trim());
						} catch (e) {
							console.log("Error parsing JSON", e);
							return;
						}
						this.plugin.settings.themeTweaks = theme;
						// await this.plugin.saveSettings();
						// this.plugin.refreshMarkdownCodeBlockProcessor();
					})
			)
			.addButton((button) => {
				button.setButtonText("Save").onClick(async () => {
					await this.plugin.saveSettings();
					this.plugin.setTheme(this.plugin.settings.theme);
					this.display();
				});
			});
	}
}
