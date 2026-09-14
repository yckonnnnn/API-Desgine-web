import { c as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/liquid-glass-CjiIC2Em.js
var import_jsx_runtime = require_jsx_runtime();
function setMouseVars(el, event) {
	const r = el.getBoundingClientRect();
	const x = (event.clientX - r.left) / Math.max(r.width, 1) * 100;
	const y = (event.clientY - r.top) / Math.max(r.height, 1) * 100;
	el.style.setProperty("--mouse-x", `${x}%`);
	el.style.setProperty("--mouse-y", `${y}%`);
}
function LiquidGlass({ className, children, interactive = true, onPointerMove, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("glass", interactive && "is-interactive", className),
		onPointerMove: (event) => {
			setMouseVars(event.currentTarget, event);
			onPointerMove?.(event);
		},
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "glass-specular",
			"aria-hidden": "true"
		}), children]
	});
}
//#endregion
export { LiquidGlass as t };
