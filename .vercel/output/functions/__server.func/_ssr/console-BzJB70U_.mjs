import { c as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { d as useRouterState, m as Outlet, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useCurrentUserState } from "./use-current-user-ClOiUQ-z.mjs";
import { i as UserButton, t as RedirectToSignIn } from "./gates-BezVb2cC.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as PageVeil, t as Grain } from "./page-veil-DP0zx3r3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/console-BzJB70U_.js
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		to: "/console",
		label: "Overview"
	},
	{
		to: "/console/keys",
		label: "API Keys"
	},
	{
		to: "/console/wallet",
		label: "Wallet"
	},
	{
		to: "/console/usage",
		label: "Usage"
	},
	{
		to: "/console/billing",
		label: "Billing"
	}
];
function ConsoleFrame({ children, ready = false }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "console-root",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grain, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageVeil, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "console-orb",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "console-side",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "wordmark",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "wordmark-mark",
							"aria-hidden": "true"
						}), "FYT"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", { children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						className: cn("console-link", ready && (item.to === "/console" ? pathname === "/console" : pathname.startsWith(item.to)) && "is-on"),
						children: item.label
					}, item.to)) }),
					ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "user-chip",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "auth-skel",
						"aria-hidden": "true"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "console-main",
				children
			})
		]
	});
}
function ConsoleShell() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConsoleFrame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "console-muted",
		children: "Opening workspace…"
	}) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConsoleFrame, {
		ready: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
var SplitComponent = ConsoleShell;
//#endregion
export { SplitComponent as component };
