import { i as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime, l as require_react } from "../_libs/@react-three/drei+[...].mjs";
import { n as gsapWithCSS, t as ScrollTrigger } from "../_libs/gsap.mjs";
import { r as scene } from "./router-Cson6qb-.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DYwWGc23.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
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
function ApiPanel() {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		let raf = 0;
		const loop = () => {
			if (!scene.reduced && !scene.mobile) {
				const x = scene.mouseX * 2;
				const y = scene.mouseY * -2;
				el.style.transform = `perspective(1400px) rotateY(${-8 + x}deg) rotateX(${4 + y}deg)`;
			}
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: "api-panel-rig",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LiquidGlass, {
			className: "api-panel",
			"data-cursor": "hover",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "api-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "api-method",
					children: "POST"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "api-path",
					children: "/v1/chat/completions"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "api-grid",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "model" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "gpt-5" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "status" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
						className: "api-ok",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), "200 OK"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "latency" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "128 ms" })
				]
			})]
		})
	});
}
function Hero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "top",
		className: "hero",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hero-copy",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "hero-kicker reveal delay-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "FYT API" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kicker-dot",
								"aria-hidden": "true"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AI Infrastructure" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "display-title",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "line-mask",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "line-inner delay-2",
								children: "ONE API."
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "line-mask",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "line-inner delay-3",
								children: "EVERY INTELLIGENCE."
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "hero-lede reveal delay-4",
						children: [
							"Connect to the world’s leading AI models",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"through one unified API."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hero-cta reveal delay-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#models",
							className: "btn-ink",
							"data-cursor": "hover",
							children: "Start building"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#models",
							className: "btn-ghost",
							"data-cursor": "hover",
							children: "Explore models"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApiPanel, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "scroll-hint reveal delay-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Scroll" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {})]
			})
		]
	});
}
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
var LINKS = [{
	href: "#models",
	label: "Models"
}, {
	href: "#infrastructure",
	label: "Infrastructure"
}];
function Navbar() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "site-nav",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LiquidGlass, {
			className: "nav-bar",
			interactive: false,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "#top",
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
					children: LINKS.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: link.href,
						"data-cursor": "hover",
						children: link.label
					}, link.href))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "nav-actions",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "nav-ghost",
						"data-cursor": "hover",
						children: "Sign in"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "#models",
						className: "nav-cta",
						"data-cursor": "hover",
						children: "Start building"
					})]
				})
			]
		})
	});
}
function OrbCanvas() {
	const [Scene, setScene] = (0, import_react.useState)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		import("./orb-scene-ChSrCaOM.mjs").then((mod) => {
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
var STATS = [
	{
		value: "99.99%",
		label: "Uptime"
	},
	{
		value: "120ms",
		label: "Routing"
	},
	{
		value: "24/7",
		label: "Infrastructure"
	}
];
function InfraSection() {
	const root = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = root.current;
		if (!el) return;
		const nums = el.querySelectorAll(".stat-value");
		gsapWithCSS.fromTo(nums, {
			y: 28,
			opacity: 0,
			filter: "blur(8px)"
		}, {
			y: 0,
			opacity: 1,
			filter: "blur(0px)",
			duration: 1.15,
			stagger: .12,
			ease: "power3.out",
			scrollTrigger: {
				trigger: el,
				start: "top 72%"
			}
		});
		return () => {
			ScrollTrigger.getAll().filter((t) => t.trigger === el).forEach((t) => t.kill());
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "infrastructure",
		className: "infra",
		ref: root,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "section-kicker",
				children: "Section 03"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "section-title infra-title",
				children: [
					"Built for",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					"production."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "stat-list",
				children: STATS.map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "stat-value",
					children: stat.value
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "stat-label",
					children: stat.label
				})] }, stat.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "infra-foot",
				children: "FYT routes, balances, and observes every call."
			})
		]
	});
}
var MODELS = [
	{
		name: "GPT",
		full: "GPT-5",
		latency: "128 ms",
		price: "$2.50 / 1M",
		context: "1M",
		status: "Operational"
	},
	{
		name: "Claude",
		full: "Claude 4",
		latency: "142 ms",
		price: "$3.00 / 1M",
		context: "1M",
		status: "Operational"
	},
	{
		name: "Gemini",
		full: "Gemini 2.5",
		latency: "156 ms",
		price: "$1.25 / 1M",
		context: "2M",
		status: "Operational"
	},
	{
		name: "DeepSeek",
		full: "DeepSeek V3",
		latency: "118 ms",
		price: "$0.27 / 1M",
		context: "128K",
		status: "Operational"
	},
	{
		name: "Grok",
		full: "Grok 3",
		latency: "121 ms",
		price: "$2.00 / 1M",
		context: "1M",
		status: "Operational"
	},
	{
		name: "Qwen",
		full: "Qwen 3",
		latency: "134 ms",
		price: "$0.40 / 1M",
		context: "1M",
		status: "Operational"
	},
	{
		name: "Kimi",
		full: "Kimi K2",
		latency: "148 ms",
		price: "$0.60 / 1M",
		context: "2M",
		status: "Operational"
	}
];
function ModelsSection() {
	const [active, setActive] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "models",
		className: "models",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "models-copy",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "section-kicker",
				children: "Section 02"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "section-title",
				children: [
					"The world’s best models.",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					"One endpoint."
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "model-list",
			children: MODELS.map((model) => {
				const open = active === model.name;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: cn("model-row", open && "is-open"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"data-cursor": "hover",
						onMouseEnter: () => setActive(model.name),
						onMouseLeave: () => setActive(null),
						onFocus: () => setActive(model.name),
						onBlur: () => setActive(null),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "model-name",
							children: model.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cn("model-meta", open && "is-visible"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: model.full }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: model.latency }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: model.price }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: model.context }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "model-status",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), model.status]
								})
							]
						})]
					})
				}, model.name);
			})
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grain, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbCanvas, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomCursor, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "site",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModelsSection, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfraSection, {})
			]
		})
	] });
}
//#endregion
export { Home as component };
