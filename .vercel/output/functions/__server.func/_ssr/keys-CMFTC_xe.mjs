import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime, l as require_react } from "../_libs/@react-three/drei+[...].mjs";
import { d as listKeys, f as maskKey, n as createKey, p as renameKey, r as disableKey } from "./format-C25qNRUT.mjs";
import { t as LiquidGlass } from "./liquid-glass-CjiIC2Em.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/keys-CMFTC_xe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function KeysPage() {
	const [rows, setRows] = (0, import_react.useState)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("Production");
	const [fresh, setFresh] = (0, import_react.useState)(null);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [copied, setCopied] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	async function refresh() {
		const next = await listKeys();
		setRows(next);
	}
	(0, import_react.useEffect)(() => {
		refresh().catch(() => setRows([]));
	}, []);
	function markCopied(id) {
		setCopied(id);
		window.setTimeout(() => setCopied((cur) => cur === id ? null : cur), 1600);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "console-page",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "console-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "console-kicker",
					children: "Access"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "console-title",
					children: "API Keys"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn-ink",
					onClick: () => setOpen(true),
					children: "Create API Key"
				})]
			}),
			rows == null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "console-muted",
				children: "Loading keys…"
			}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "console-muted",
				children: "No keys yet. Create one to start routing."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "table-scroll",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "quiet-table",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Name" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Key" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Created" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: editing === row.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "glass-input table-input",
							defaultValue: row.name,
							autoFocus: true,
							onBlur: (e) => {
								renameKey({ data: {
									id: row.id,
									name: e.target.value
								} }).then(refresh);
								setEditing(null);
							},
							onKeyDown: (e) => {
								if (e.key === "Enter") e.target.blur();
							}
						}) : row.name }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "mono",
							children: maskKey(row.last4)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: new Date(row.created_at).toLocaleDateString() }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: row.disabled ? "Disabled" : "Active" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "row-actions",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										navigator.clipboard.writeText(maskKey(row.last4));
										markCopied(row.id);
									},
									children: copied === row.id ? "Copied" : "Copy"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setEditing(row.id),
									children: "Edit"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => void disableKey({ data: row.id }).then(refresh),
									children: row.disabled ? "Enable" : "Disable"
								})
							]
						})
					] }, row.id)) })]
				})
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal-layer",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiquidGlass, {
					className: "key-modal",
					interactive: false,
					children: fresh ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "console-kicker",
							children: "Key created"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "fresh-key mono",
							children: fresh
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "console-muted",
							children: "Copy it now. It will not be shown again."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "modal-actions",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn-ghost",
								onClick: () => {
									navigator.clipboard.writeText(fresh);
									markCopied("fresh");
								},
								children: copied === "fresh" ? "Copied" : "Copy"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn-ink",
								onClick: () => {
									setOpen(false);
									setFresh(null);
									setError(null);
								},
								children: "Done"
							})]
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "console-kicker",
							children: "New key"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "console-title",
							children: "Create API Key"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "glass-input",
							value: name,
							onChange: (e) => setName(e.target.value)
						})] }),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "auth-error",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "modal-actions",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn-ghost",
								onClick: () => {
									setOpen(false);
									setError(null);
								},
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn-ink",
								onClick: () => {
									setError(null);
									createKey({ data: name }).then((res) => {
										setFresh(res.secret);
										refresh();
									}).catch((err) => {
										setError(err instanceof Error ? err.message : "Unable to create key");
									});
								},
								children: "Generate"
							})]
						})
					] })
				})
			}) : null
		]
	});
}
//#endregion
export { KeysPage as component };
