import { c as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useCurrentUserState } from "./use-current-user-ClOiUQ-z.mjs";
import { i as UserButton, n as SignedIn, r as SignedOut } from "./gates-BezVb2cC.mjs";
import { n as PageVeil, t as Grain } from "./page-veil-DP0zx3r3.mjs";
import { t as LiquidGlass } from "./liquid-glass-CjiIC2Em.mjs";
import { n as OrbCanvas, t as CustomCursor } from "./orb-canvas-CIaG1ZHF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-footer-CD4n_h6o.js
var import_jsx_runtime = require_jsx_runtime();
function AuthSlot() {
	const { isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "auth-skel",
		"aria-hidden": "true"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/login",
		className: "nav-ghost",
		"data-cursor": "hover",
		children: "Sign in"
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SignedIn, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/console",
		className: "nav-ghost",
		"data-cursor": "hover",
		children: "Console"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "user-chip",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
	})] })] });
}
function StartCta({ className }) {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className,
		children: "Start building"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: user ? "/console" : "/login",
		className,
		"data-cursor": "hover",
		children: "Start building"
	});
}
var LINKS = [
	{
		href: "/models",
		label: "Models"
	},
	{
		href: "/#infrastructure",
		label: "Infrastructure"
	},
	{
		href: "/#playground",
		label: "Playground"
	}
];
function Navbar() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "site-nav",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LiquidGlass, {
			className: "nav-bar",
			interactive: false,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "wordmark",
					"data-cursor": "hover",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "wordmark-mark",
						"aria-hidden": "true"
					}), "FYT"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "nav-links",
					"aria-label": "Primary",
					children: LINKS.map((link) => link.href === "/models" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/models",
						"data-cursor": "hover",
						children: link.label
					}, link.label) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: link.href,
						"data-cursor": "hover",
						children: link.label
					}, link.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "nav-actions",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthSlot, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartCta, { className: "nav-cta" })]
				})
			]
		})
	});
}
function SiteChrome({ children, orb = true }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grain, {}),
		orb ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbCanvas, {}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomCursor, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageVeil, {}),
		children
	] });
}
var MODEL_FILTERS = [
	"ALL",
	"CHAT",
	"REASONING",
	"CODE",
	"VISION",
	"IMAGE",
	"AUDIO"
];
var MODELS = [
	{
		name: "GPT",
		full: "GPT-5",
		provider: "OpenAI",
		category: "CHAT",
		latency: "128 ms",
		price: "$2.50 / 1M",
		input: "$1.25",
		output: "$10.00",
		context: "1M",
		status: "Operational",
		featured: true
	},
	{
		name: "Claude",
		full: "Claude 4",
		provider: "Anthropic",
		category: "REASONING",
		latency: "142 ms",
		price: "$3.00 / 1M",
		input: "$3.00",
		output: "$15.00",
		context: "1M",
		status: "Operational"
	},
	{
		name: "Gemini",
		full: "Gemini 2.5",
		provider: "Google",
		category: "VISION",
		latency: "156 ms",
		price: "$1.25 / 1M",
		input: "$0.30",
		output: "$2.50",
		context: "2M",
		status: "Operational"
	},
	{
		name: "DeepSeek",
		full: "DeepSeek V3",
		provider: "DeepSeek",
		category: "CODE",
		latency: "118 ms",
		price: "$0.27 / 1M",
		input: "$0.27",
		output: "$1.10",
		context: "128K",
		status: "Operational"
	},
	{
		name: "Grok",
		full: "Grok 3",
		provider: "xAI",
		category: "REASONING",
		latency: "121 ms",
		price: "$2.00 / 1M",
		input: "$2.00",
		output: "$10.00",
		context: "1M",
		status: "Operational",
		featured: true
	},
	{
		name: "Qwen",
		full: "Qwen 3",
		provider: "Alibaba",
		category: "CHAT",
		latency: "134 ms",
		price: "$0.40 / 1M",
		input: "$0.40",
		output: "$1.60",
		context: "1M",
		status: "Operational"
	},
	{
		name: "Kimi",
		full: "Kimi K2",
		provider: "Moonshot",
		category: "CHAT",
		latency: "148 ms",
		price: "$0.60 / 1M",
		input: "$0.60",
		output: "$2.50",
		context: "2M",
		status: "Operational"
	},
	{
		name: "Flux",
		full: "Flux 1.1",
		provider: "Black Forest",
		category: "IMAGE",
		latency: "2.4 s",
		price: "$0.04 / img",
		input: "—",
		output: "$0.04",
		context: "—",
		status: "Operational"
	},
	{
		name: "Whisper",
		full: "Whisper Large",
		provider: "OpenAI",
		category: "AUDIO",
		latency: "890 ms",
		price: "$0.006 / min",
		input: "$0.006",
		output: "—",
		context: "25 min",
		status: "Operational"
	}
];
var ORBIT_NODES = [
	{
		name: "OpenAI",
		angle: 8
	},
	{
		name: "Anthropic",
		angle: 58
	},
	{
		name: "Google",
		angle: 110
	},
	{
		name: "DeepSeek",
		angle: 162
	},
	{
		name: "xAI",
		angle: 214
	},
	{
		name: "Qwen",
		angle: 266
	},
	{
		name: "Kimi",
		angle: 318
	}
];
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "site-foot",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "wordmark",
				"data-cursor": "hover",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "wordmark-mark",
					"aria-hidden": "true"
				}), "FYT"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "AI infrastructure for production systems." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/models",
				"data-cursor": "hover",
				children: "Models"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/login",
				"data-cursor": "hover",
				children: "Console"
			})] })
		]
	});
}
//#endregion
export { SiteFooter as a, SiteChrome as i, MODEL_FILTERS as n, StartCta as o, ORBIT_NODES as r, MODELS as t };
