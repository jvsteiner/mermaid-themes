# Mermaid Themes

This is a plugin for [Obsidian](https://obsidian.md). It was generated based on the [standard plugin template](https://github.com/obsidianmd/obsidian-sample-plugin).

This project allows the user to apply custom themes to mermaid.js diagrams in obsidian.

This plugin is supported by advertisements.

Note: this plugin is still in development, and there may be some bugs. Please report any issues you find.

It was inspired by the awesome new plugin for publishing your note content to Confluence.  This project introduced me to Mermaid, and prompted me to make this. 

-   [Markdown Confluence](https://github.com/markdown-confluence/markdown-confluence)

## Usage

Install it, and it will allow you to apply other themes to your mermaid diagrams in your notes.  There are two main options, which are mutually exclusive.  Either you supply an entire mermaid theme object, or you provide the parts of that object that you want to change.  The plugin will then merge your changes with the default theme, and apply the result to your diagrams. 

### Installation

Until this plugin is available in the community plugins list, you can install it as a beta tester using the [BRAT plugin](https://github.com/TfTHacker/obsidian42-brat).  

Details on how to use it are available in their documentation. The short version is that you can install this plugin by adding the following custom plugin repository to your list of repositories in the BRAT plugin settings.

## Development

PR's are welcome. You can build the plugin with `npm run build` and the plugin will be built to the root folder, so using the built artifacts is easy.  You can also run `npm run dev` to have it automatically rebuild when you make changes.


### Releasing new releases
This section is here to remind me how to release this. 

Update your manifest.json with your new version number, such as 1.0.1, and the minimum Obsidian version required for your latest release.

Update your versions.json file with "new-plugin-version": "minimum-obsidian-version" so older versions of Obsidian can download an older version of your plugin that's compatible.

Create new GitHub release using your new version number as the "Tag version". Use the exact version number, don't include a prefix v. See here for an example: https://github.com/obsidianmd/obsidian-sample-plugin/releases

Upload the files manifest.json, main.js, styles.css as binary attachments. Note: The manifest.json file must be in two places, first the root path of your repository and also in the release.

Publish the release.

> You can simplify the version bump process by running npm version patch, npm version minor or npm version major after updating minAppVersion manually in manifest.json. The command will bump version in manifest.json and package.json, and add the entry for the new version to versions.json