import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime, l as require_react } from "../_libs/@react-three/drei+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orb-canvas-CIaG1ZHF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CustomCursor() {
	const dot = (0, import_react.useRef)(null);
	const [enabled, setEnabled] = (0, import_react.useState)(false);
	const [hover, setHover] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
		const sync = () => setEnabled(fine.matches && !reduced.matches);
		sync();
		fine.addEventListener("change", sync);
		reduced.addEventListener("change", sync);
		return () => {
			fine.removeEventListener("change", sync);
			reduced.removeEventListener("change", sync);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!enabled) return;
		document.documentElement.classList.add("has-cursor");
		const el = dot.current;
		if (!el) return;
		let x = window.innerWidth * .5;
		let y = window.innerHeight * .5;
		let tx = x;
		let ty = y;
		let raf = 0;
		const onMove = (event) => {
			tx = event.clientX;
			ty = event.clientY;
			const target = event.target;
			if (target instanceof Element) setHover(Boolean(target.closest("[data-cursor='hover']")));
		};
		const loop = () => {
			x += (tx - x) * .28;
			y += (ty - y) * .28;
			el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
			raf = requestAnimationFrame(loop);
		};
		window.addEventListener("pointermove", onMove, { passive: true });
		raf = requestAnimationFrame(loop);
		return () => {
			document.documentElement.classList.remove("has-cursor");
			window.removeEventListener("pointermove", onMove);
			cancelAnimationFrame(raf);
		};
	}, [enabled]);
	if (!enabled) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: dot,
		className: cn("cursor-dot", hover && "is-hover"),
		"aria-hidden": "true"
	});
}
var scenePromise = typeof window === "undefined" ? null : import("./orb-scene-Bpxzg_Kf.mjs");
function OrbCanvas() {
	const [Scene, setScene] = (0, import_react.useState)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(scenePromise ?? import("./orb-scene-Bpxzg_Kf.mjs")).then((mod) => {
			if (!cancelled) setScene(() => mod.OrbScene);
		});
		return () => {
			cancelled = true;
		};
	}, []);
	const onReady = (0, import_react.useCallback)(() => setReady(true), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "orb-stage",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("orb-fallback", ready && "is-hidden") }), Scene ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scene, { onReady }) : null]
	});
}
//#endregion
export { OrbCanvas as n, CustomCursor as t };
