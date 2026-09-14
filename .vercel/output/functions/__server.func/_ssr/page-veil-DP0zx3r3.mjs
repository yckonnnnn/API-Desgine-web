import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime, l as require_react } from "../_libs/@react-three/drei+[...].mjs";
import { d as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/page-veil-DP0zx3r3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Grain() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		className: "grain",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("filter", {
			id: "fyt-grain",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("feTurbulence", {
				type: "fractalNoise",
				baseFrequency: "0.82",
				numOctaves: "4",
				stitchTiles: "stitch"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			width: "100%",
			height: "100%",
			filter: "url(#fyt-grain)"
		})]
	});
}
function PageVeil() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const first = (0, import_react.useRef)(true);
	const [on, setOn] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (first.current) {
			first.current = false;
			return;
		}
		setOn(true);
		const id = window.setTimeout(() => setOn(false), 480);
		return () => window.clearTimeout(id);
	}, [pathname]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("page-veil", on && "is-on"),
		"aria-hidden": "true"
	});
}
//#endregion
export { PageVeil as n, Grain as t };
