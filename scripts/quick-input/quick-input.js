var menuExist = false;
var quickInputListNode = null;
var factor = 1;
var refresh = false;
var cachedHeight = -1;
var cachedPreOneTop = 0;
const padding = 10; // up + bottom

// Init static style
var styleElement = document.createElement("style");
var styles = `
/* General quick input widget styles */

.quick-input-widget {
  box-shadow:
    0 5px 10px rgba(0, 0, 0, 0),
    0 0 0 100vw rgba(0, 0, 0, 0.15) !important;
  top: 80px !important;
}

/* Input box styles */
.quick-input-widget .monaco-inputbox {
  padding: 10px !important;
  border-radius: 5px !important;
  font-size: 12px !important;
  outline: none !important;
  background: transparent !important;
}

/* Action styles */
.quick-input-widget .quick-input-action {
  padding-top: 10px !important;
  font-size: 14px !important;
}

/* List row styles */
.quick-input-widget .monaco-list-rows {
  font-size: 13px !important;
}
.quick-input-widget .monaco-list-row {
  padding: 5px !important;
  height: auto !important;
}

/* Only show icon if there are results and item is not a checkbox */

.quick-input-widget
  .monaco-list-row.focused:not(
    [aria-label="No hay ningún comando coincidente."]
  ):not([aria-label="No hay ningún resultado coincidente."]):not([role='checkbox'])
  .quick-input-list-entry::before {
  content: "↪";
  font-size: 16px;
  font-weight: bold;
}

/* Input placeholder */

.monaco-inputbox input::placeholder {
  font-size: 15px !important;
  font-weight: bold !important;
}

/* List entry styles */

.quick-input-widget .quick-input-list-entry {
  position: relative;
  padding: 0 5px 0 15px;
  font-size: 14px !important;
  font-weight: bold !important;
  color: #524676 !important;
}
.quick-input-widget .quick-input-list-entry .codicon[class*="codicon-"] {
  font-size: 15px;
}
.quick-input-widget
  .quick-input-list
  .quick-input-list-entry.quick-input-list-separator-border {
  border-top-width: 0 !important;
}

/* Hide unnecessary elements */
.quick-input-widget
  .quick-input-list-rows
  .quick-input-list-row
  .monaco-icon-description-container,
.quick-input-widget .quick-input-list .quick-input-list-label-meta,
.quick-input-widget .quick-input-list .quick-input-list-entry-keybinding,
.quick-input-widget .quick-input-list .quick-input-list-separator {
  display: none !important;
}

/* Action bar styles */
.quick-input-widget
  .quick-input-list
  .quick-input-list-entry
  .monaco-action-bar.animated.quick-input-list-entry-action-bar {
  height: unset;
}

/* Header input box styles */
.quick-input-widget
  .quick-input-header
  .quick-input-and-message
  .quick-input-filter
  .quick-input-box
  .monaco-findInput
  .monaco-inputbox
  .ibwrapper
  input {
  color: #524676 !important;
}

  `;
styleElement.textContent = styles;
document.head.appendChild(styleElement);

function zoom(obj, primaryKey, cacheKey) {
  const v = parseInt(obj.style[primaryKey], 10);
  if (refresh || !obj.hasOwnProperty(cacheKey) || obj[cacheKey] != v) {
    set(obj, Math.round(v * factor), primaryKey, cacheKey);
    return true;
  }
  return v === 0;
}

function set(obj, v, primaryKey, cacheKey) {
  obj[cacheKey] = v;
  obj.style[primaryKey] = obj[cacheKey] + "px";
}

function setPaddingBottom(obj, v) {
  if (parseInt(obj.style.paddingBottom, 10) != v) {
    obj.style["paddingBottom"] = v + "px";
  }
}

function resize() {
  const monacoListRows = quickInputListNode.querySelector(".monaco-list-rows");
  const rows = quickInputListNode.querySelectorAll(
    ".monaco-list-rows .monaco-list-row",
  );

  refresh = false;
  if (rows && rows.length > 0) {
    var defaultHeight = parseInt(rows[0].style.height, 10);
    if (defaultHeight != cachedHeight) {
      factor = (defaultHeight + 10) / defaultHeight;
      cachedHeight = defaultHeight;
      refresh = true;
    }
    cachedPreOneTop = parseInt(rows[0].style.top, 10);
    setPaddingBottom(quickInputListNode, 5);
  } else {
    setPaddingBottom(quickInputListNode, 0);
    return;
  }

  zoom(quickInputListNode, "maxHeight", "cachedMaxHeight");
  zoom(monacoListRows, "height", "cachedHeight");
  zoom(monacoListRows, "top", "cachedTop");
  moving = false;
  rows.forEach((row) => {
    moving = zoom(row, "top", "cachedTop") || moving;
    // [[Patch]]
    // Fix a bug that some rows are not moving, so
    // I force-set their top based on the previous one.
    if (moving && parseInt(row.style.top, 10) < cachedPreOneTop) {
      set(
        row,
        cachedPreOneTop + Math.floor(parseInt(row.style.height, 10) * factor),
        "top",
        "cachedTop",
      );
    }
    cachedPreOneTop = parseInt(row.style.top, 10);
  });

  const scrollbar = quickInputListNode.querySelector(".scrollbar.vertical");
  if (scrollbar) {
    zoom(scrollbar, "height", "cachedHeight");
    slider = scrollbar.querySelector(".slider");
    zoom(slider, "height", "cachedHeight");
    zoom(slider, "top", "cachedTop");
  }
}

const target = document.body;
const config = { attributes: true, childList: true, subtree: true };
const observer = new MutationObserver((mutationsList) => {
  for (let mutation of mutationsList) {
    if (
      !menuExist &&
      mutation.type === "childList" &&
      mutation.addedNodes.length > 0
    ) {
      quickInputListNode = document.getElementById("quickInput_list");
      if (quickInputListNode) {
        menuExist = true;
        resize();
        const maxHeightObserver = new MutationObserver((mutationsList) =>
          resize(),
        );
        maxHeightObserver.observe(quickInputListNode, {
          attributes: true,
          childList: true,
          subtree: true,
          attributeFilter: ["style"],
        });
      }
    }
  }
});

observer.observe(target, config);
