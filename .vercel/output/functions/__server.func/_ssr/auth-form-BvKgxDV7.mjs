import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime, l as require_react } from "../_libs/@react-three/drei+[...].mjs";
import { v as Link, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signIn, t as authClient } from "./client-CVqXY6bk.mjs";
import { n as useCurrentUserState } from "./use-current-user-ClOiUQ-z.mjs";
import { t as GROK_PROVIDERS } from "./server-CmjYRqKP.mjs";
import { n as PageVeil, t as Grain } from "./page-veil-DP0zx3r3.mjs";
import { n as OrbCanvas, t as CustomCursor } from "./orb-canvas-CIaG1ZHF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-form-BvKgxDV7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthForm({ mode }) {
	const { user, isPending } = useCurrentUserState();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grain, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbCanvas, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageVeil, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "auth-page",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "auth-void" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "auth-panel",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "section-kicker",
					children: "FYT"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "console-muted",
					children: "Preparing the gate…"
				})]
			})]
		})
	] });
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/console" });
	async function onSubmit(event) {
		event.preventDefault();
		setError(null);
		setBusy(true);
		try {
			if (mode === "register") {
				const { error: err } = await authClient.signUp.email({
					email,
					password,
					name: email.split("@")[0] || "Builder",
					callbackURL: "/console"
				});
				if (err) throw new Error(err.message);
			} else {
				const { error: err } = await authClient.signIn.email({
					email,
					password,
					callbackURL: "/console"
				});
				if (err) throw new Error(err.message);
			}
			window.location.href = "/console";
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unable to continue");
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grain, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbCanvas, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomCursor, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageVeil, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "auth-page",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "auth-void" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "auth-panel",
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "section-kicker",
						children: mode === "login" ? "Sign in" : "Create account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "auth-title",
						children: mode === "login" ? "Welcome back." : "Start building."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "auth-form",
						onSubmit,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								htmlFor: "email",
								children: ["Email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "email",
									className: "glass-input",
									type: "email",
									autoComplete: "email",
									required: true,
									value: email,
									onChange: (e) => setEmail(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								htmlFor: "password",
								children: ["Password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "password",
									className: "glass-input",
									type: "password",
									autoComplete: mode === "login" ? "current-password" : "new-password",
									required: true,
									minLength: 8,
									value: password,
									onChange: (e) => setPassword(e.target.value)
								})]
							}),
							error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "auth-error",
								children: error
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								className: "btn-ink auth-submit",
								disabled: busy,
								"data-cursor": "hover",
								children: busy ? "Continuing…" : mode === "login" ? "Sign in" : "Create account"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "auth-alt",
						children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "btn-ghost auth-oauth",
							"data-cursor": "hover",
							onClick: () => signIn(p.providerId, { callbackURL: "/console" }),
							children: ["Continue with ", p.label]
						}, p.providerId))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "auth-switch",
						children: mode === "login" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							"New here?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/register",
								"data-cursor": "hover",
								children: "Create an account"
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							"Already building?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								"data-cursor": "hover",
								children: "Sign in"
							})
						] })
					})
				]
			})]
		})
	] });
}
//#endregion
export { AuthForm as t };
