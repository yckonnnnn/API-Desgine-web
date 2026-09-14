import { o as __toESM } from "../_runtime.mjs";
import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { c as require_jsx_runtime, l as require_react } from "../_libs/@react-three/drei+[...].mjs";
import { _ as createRootRoute, b as useRouter, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { n as auth } from "./server-CmjYRqKP.mjs";
import { t as TriangleAlert } from "../_libs/lucide-react.mjs";
import { n as gsapWithCSS, t as ScrollTrigger } from "../_libs/gsap.mjs";
import { t as Lenis } from "../_libs/lenis.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-B7hXQFLm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var scene = {
	mouseX: 0,
	mouseY: 0,
	targetMouseX: 0,
	targetMouseY: 0,
	scroll: 0,
	targetScroll: 0,
	hover: 0,
	targetHover: 0,
	reduced: false,
	quality: 1,
	mobile: false,
	ready: false
};
function tickScene(delta) {
	const d = Math.min(delta, .1);
	const mouseLerp = 1 - Math.exp(-5.5 * d);
	const scrollLerp = 1 - Math.exp(-3.2 * d);
	const hoverLerp = 1 - Math.exp(-6 * d);
	scene.mouseX += (scene.targetMouseX - scene.mouseX) * mouseLerp;
	scene.mouseY += (scene.targetMouseY - scene.mouseY) * mouseLerp;
	scene.scroll += (scene.targetScroll - scene.scroll) * scrollLerp;
	scene.hover += (scene.targetHover - scene.hover) * hoverLerp;
}
function piecewise(t, keys) {
	if (t <= keys[0][0]) return keys[0][1];
	for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) {
		const [t0, v0] = keys[i - 1];
		const [t1, v1] = keys[i];
		const k = (t - t0) / Math.max(t1 - t0, 1e-6);
		const e = 1 - (1 - k) * (1 - k) * (1 - k);
		return v0 + (v1 - v0) * e;
	}
	return keys[keys.length - 1][1];
}
function sampleScrollPose(t, mobile) {
	const x = Math.min(Math.max(t, 0), 1);
	if (mobile) return {
		orbX: piecewise(x, [
			[0, .22],
			[.35, .08],
			[.7, -.12],
			[1, -.18]
		]),
		orbY: piecewise(x, [
			[0, -.42],
			[.35, -.08],
			[.7, .04],
			[1, .16]
		]),
		orbZ: 0,
		orbScale: piecewise(x, [
			[0, 1.18],
			[.35, 1.42],
			[.7, 1.16],
			[1, .98]
		]),
		orbOpacity: piecewise(x, [
			[0, 1],
			[.55, 1],
			[.72, .22],
			[1, .08]
		]),
		camX: piecewise(x, [[0, .08], [1, -.12]]),
		camY: piecewise(x, [[0, .04], [1, .08]]),
		camZ: piecewise(x, [
			[0, 4.4],
			[.35, 3.8],
			[1, 4.2]
		])
	};
	return {
		orbX: piecewise(x, [
			[0, 1.28],
			[.16, .18],
			[.32, -1.08],
			[.48, -1.15],
			[1, -1.22]
		]),
		orbY: piecewise(x, [
			[0, -.06],
			[.16, .02],
			[.32, .04],
			[1, .18]
		]),
		orbZ: 0,
		orbScale: piecewise(x, [
			[0, 1.58],
			[.16, 1.96],
			[.32, 1.42],
			[1, 1.18]
		]),
		orbOpacity: piecewise(x, [
			[0, 1],
			[.42, 1],
			[.58, .22],
			[.72, .06],
			[1, .04]
		]),
		camX: piecewise(x, [
			[0, .46],
			[.16, .02],
			[.32, -.22],
			[1, -.38]
		]),
		camY: piecewise(x, [
			[0, .08],
			[.16, .02],
			[1, .1]
		]),
		camZ: piecewise(x, [
			[0, 4.18],
			[.16, 3.28],
			[.32, 3.62],
			[1, 4.05]
		])
	};
}
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 bg-canvas px-6 text-center text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-mist",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 1.5
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-medium tracking-tight",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-mist",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function ExperienceProvider({ children }) {
	(0, import_react.useEffect)(() => {
		gsapWithCSS.registerPlugin(ScrollTrigger);
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
		const mobile = window.matchMedia("(max-width: 767px)");
		const applyFlags = () => {
			scene.reduced = reduced.matches;
			scene.mobile = mobile.matches || !window.matchMedia("(hover: hover)").matches;
		};
		applyFlags();
		reduced.addEventListener("change", applyFlags);
		mobile.addEventListener("change", applyFlags);
		const onPointer = (event) => {
			const nx = event.clientX / window.innerWidth * 2 - 1;
			const ny = event.clientY / window.innerHeight * 2 - 1;
			scene.targetMouseX = Math.min(Math.max(nx, -1), 1);
			scene.targetMouseY = Math.min(Math.max(-ny, -1), 1);
			document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
			document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
		};
		window.addEventListener("pointermove", onPointer, { passive: true });
		if (reduced.matches) {
			const onScroll = () => {
				const limit = document.documentElement.scrollHeight - window.innerHeight;
				scene.targetScroll = limit > 0 ? window.scrollY / limit : 0;
				scene.scroll = scene.targetScroll;
			};
			window.addEventListener("scroll", onScroll, { passive: true });
			return () => {
				reduced.removeEventListener("change", applyFlags);
				mobile.removeEventListener("change", applyFlags);
				window.removeEventListener("pointermove", onPointer);
				window.removeEventListener("scroll", onScroll);
			};
		}
		const lenis = new Lenis({
			lerp: .08,
			smoothWheel: true,
			autoRaf: false,
			anchors: true
		});
		lenis.on("scroll", () => {
			const limit = lenis.limit;
			scene.targetScroll = limit > 0 ? lenis.scroll / limit : 0;
			ScrollTrigger.update();
		});
		const onTick = (time) => {
			lenis.raf(time * 1e3);
		};
		gsapWithCSS.ticker.add(onTick);
		gsapWithCSS.ticker.lagSmoothing(0);
		const onResize = () => ScrollTrigger.refresh();
		window.addEventListener("resize", onResize);
		return () => {
			reduced.removeEventListener("change", applyFlags);
			mobile.removeEventListener("change", applyFlags);
			window.removeEventListener("pointermove", onPointer);
			window.removeEventListener("resize", onResize);
			gsapWithCSS.ticker.remove(onTick);
			lenis.destroy();
			ScrollTrigger.getAll().forEach((t) => t.kill());
		};
	}, []);
	return children;
}
var styles_default = "/assets/styles-CU2szmSr.css";
var APP_NAME = "FYT API";
var Route$11 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "One API. Every intelligence. Unified access to the world's leading AI models."
			},
			{
				name: "theme-color",
				content: "#F4F3EF"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExperienceProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$9 = () => import("./routes-KPxJEyrU.mjs");
var Route$10 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./console-BzJB70U_.mjs");
var Route$9 = createFileRoute("/console")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./login-CQG32WDX.mjs");
var Route$8 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./models-D6C-Sgqp.mjs");
var Route$7 = createFileRoute("/models")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./register-sOTQtPqy.mjs");
var Route$6 = createFileRoute("/register")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./console-BRdadTMk.mjs");
var Route$5 = createFileRoute("/console/")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./billing-CU0st-jW.mjs");
var Route$4 = createFileRoute("/console/billing")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./keys-CMFTC_xe.mjs");
var Route$3 = createFileRoute("/console/keys")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./usage-CV2Cj-_o.mjs");
var Route$2 = createFileRoute("/console/usage")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./wallet-CXbDcUjy.mjs");
var Route$1 = createFileRoute("/console/wallet")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var IndexRoute = Route$10.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$11
});
var ConsoleRoute = Route$9.update({
	id: "/console",
	path: "/console",
	getParentRoute: () => Route$11
});
var LoginRoute = Route$8.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$11
});
var ModelsRoute = Route$7.update({
	id: "/models",
	path: "/models",
	getParentRoute: () => Route$11
});
var RegisterRoute = Route$6.update({
	id: "/register",
	path: "/register",
	getParentRoute: () => Route$11
});
var ConsoleIndexRoute = Route$5.update({
	id: "/",
	path: "/",
	getParentRoute: () => ConsoleRoute
});
var ConsoleBillingRoute = Route$4.update({
	id: "/billing",
	path: "/billing",
	getParentRoute: () => ConsoleRoute
});
var ConsoleKeysRoute = Route$3.update({
	id: "/keys",
	path: "/keys",
	getParentRoute: () => ConsoleRoute
});
var ConsoleUsageRoute = Route$2.update({
	id: "/usage",
	path: "/usage",
	getParentRoute: () => ConsoleRoute
});
var ConsoleWalletRoute = Route$1.update({
	id: "/wallet",
	path: "/wallet",
	getParentRoute: () => ConsoleRoute
});
var ApiAuthSplatRoute = Route.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$11
});
var ConsoleRouteChildren = {
	ConsoleBillingRoute,
	ConsoleKeysRoute,
	ConsoleUsageRoute,
	ConsoleWalletRoute,
	ConsoleIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	ConsoleRoute: ConsoleRoute._addFileChildren(ConsoleRouteChildren),
	LoginRoute,
	ModelsRoute,
	RegisterRoute,
	ApiAuthSplatRoute
};
var routeTree = Route$11._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { tickScene as i, sampleScrollPose as n, scene as r, router_exports as t };
