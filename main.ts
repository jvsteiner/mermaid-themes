import {
	App,
	loadMermaid,
	Plugin,
	PluginSettingTab,
	Setting
} from "obsidian";

// Remember to rename these classes and interfaces!

interface MermaidThemeSettings {
	useNewStyle: boolean;
	tweakStyle: boolean;
	customTheme: object;
}

const DEFAULT_SETTINGS: MermaidThemeSettings = {
	useNewStyle: true,
	tweakStyle: true,
	customTheme: {},
};

export default class MermaidThemePlugin extends Plugin {
	settings: MermaidThemeSettings;
	mermaid: any;

	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new MermaidThemeSettingTab(this.app, this));

		const mermaid = await loadMermaid();

		this.mermaid = mermaid;

		// console.log(mermaid);

		this.setTheme();
	}

	onunload() {}

	setTheme() {
		const conf = this.mermaid.mermaidAPI.getSiteConfig();
		console.log(conf);

		const newConf = {
			'theme': 'base',
			'themeVariables':
			{
				'nodeTextColor': '#F00'
			}
		};
		// conf.theme = 'base'; // 
		// conf.themeVariables.nodeTextColor = '#F0F';

		let merged = {...conf, ...newConf};
		this.mermaid.mermaidAPI.updateSiteConfig(merged);
		// mermaid.initialize(conf);
		// // mermaid.render();



		// // mermaid.mermaidAPI.initialize({
		// // 	securityLevel: 'loose',
		// // 	theme: 'base',
		// // });

		

		console.log("codddnf", conf);
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

		// new Setting(containerEl)
		// 	.setName("AWS Access Key ID")
		// 	.setDesc("AWS access key ID for a user with S3 access.")
		// 	.addText((text) => {
		// 		wrapTextWithPasswordHide(text);
		// 		text.setPlaceholder("access key")
		// 			.setValue(this.plugin.settings.accessKey)
		// 			.onChange(async (value) => {
		// 				this.plugin.settings.accessKey = value.trim();
		// 				await this.plugin.saveSettings();
		// 			});
		// 	});

		// new Setting(containerEl)
		// 	.setName("AWS Secret Key")
		// 	.setDesc("AWS secret key for that user.")
		// 	.addText((text) => {
		// 		wrapTextWithPasswordHide(text);
		// 		text.setPlaceholder("secret key")
		// 			.setValue(this.plugin.settings.secretKey)
		// 			.onChange(async (value) => {
		// 				this.plugin.settings.secretKey = value.trim();
		// 				await this.plugin.saveSettings();
		// 			});
		// 	});

		new Setting(containerEl)
			.setName("Use new style")
			.setDesc(
				"Use a new, fully defined style.  This setting will use the settings configured below, and nothing else."
			)
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.useNewStyle)
					.onChange(async (value) => {
						if (value) {
							this.plugin.settings.tweakStyle = false;
							console.log(this.plugin.settings);
						}
						this.plugin.settings.useNewStyle = value;
						await this.plugin.saveSettings();
						this.plugin.setTheme();
					});
			});

		new Setting(containerEl)
			.setName("Tweak existing Obsidian style")
			.setDesc(
				"Tweak the existing Obsidian style.  This setting will take the settings configured below, and then use them to override the existing Obsidian style."
			)
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.tweakStyle)
					.onChange(async (value) => {
						if (value) {
							this.plugin.settings.useNewStyle = false;
							console.log(this.plugin);
						}

						this.plugin.settings.tweakStyle = value;
						await this.plugin.saveSettings();
						this.plugin.setTheme();
					});
			});


		new Setting(containerEl)
			.setName("Custom Mermaid Theme")
			.setDesc("Optionally set a custom mermaid theme configuration in valid JSON.")
			.setClass("mermaid-themes-settings")
			.addTextArea((text) =>
				text
					.setPlaceholder('{ "init": { "theme": "base"}}')
					.setValue(this.plugin.settings.customTheme)
					.onChange(async (value) => {
						let theme = {};
						try {
							theme = JSON.parse(value.trim());
						} catch (e) {
							console.log("Error parsing JSON", e);
							return;
						}
						this.plugin.settings.customTheme = theme;
						await this.plugin.saveSettings();
						this.plugin.setTheme();
					})
			);
	}
}
