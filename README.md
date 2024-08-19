# vscode-custom-config

A custom configuration for vscode built using APC and pure css

# Install

Just copy the content of `scripts` in any folder and replace (or append) your `settings.json` with this one and update the scripts path in `settings.json` file

```json
"apc.imports": [
    "file://${userHome}/.vscode/extensions/brandonkirbyson.vscode-animations-2.0.3/dist/updateHandler.js",
    "file://${userHome}/.vscode/scripts/quick-input/quick-input-blur.css",
    "file://${userHome}/.vscode/scripts/quick-input/quick-input-blur.js",
    "file://${userHome}/.vscode/scripts/quick-input/quick-input.js",
    "file://${userHome}/.vscode/scripts/base/base.css",
    "file://${userHome}/.vscode/scripts/base/checkbox.css",
    "file://${userHome}/.vscode/scripts/search/search.css",
    "file://${userHome}/.vscode/scripts/suggestions/suggestions.css"
]
```
