import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime, l as require_react } from "../_libs/@react-three/drei+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as LiquidGlass } from "./liquid-glass-CjiIC2Em.mjs";
import { a as SiteFooter, i as SiteChrome, o as StartCta, r as ORBIT_NODES, t as MODELS } from "./site-footer-CD4n_h6o.mjs";
import { n as gsapWithCSS, t as ScrollTrigger } from "../_libs/gsap.mjs";
import { r as scene } from "./router-B7hXQFLm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-KPxJEyrU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartCta, { className: "btn-ink" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/models",
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
			children: MODELS.filter((model) => model.category !== "IMAGE" && model.category !== "AUDIO").map((model) => {
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
function OrbitSection() {
	const [paused, setPaused] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "orbit",
		className: "orbit",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "orbit-copy",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "section-kicker",
					children: "Section 04"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "section-title",
					children: [
						"One core.",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"Every origin."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "orbit-lede",
					children: "FYT sits at the center of the intelligence layer — routing to OpenAI, Anthropic, Google, DeepSeek, xAI, Qwen, and Kimi through a single endpoint."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("orbit-stage", paused && "is-paused"),
			onMouseEnter: () => setPaused(true),
			onMouseLeave: () => setPaused(false),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "orbit-ring ring-a" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "orbit-ring ring-b" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "orbit-ring ring-c" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "orbit-core",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "FYT" })
				}),
				ORBIT_NODES.map((node) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "orbit-rotor",
					style: { ["--angle"]: `${node.angle}deg` },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "orbit-node",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "orbit-chip",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), node.name]
						})
					})
				}, node.name))
			]
		})]
	});
}
var SAMPLES = [
	{
		model: "gpt-5",
		label: "GPT-5",
		reply: "One endpoint. Every intelligence."
	},
	{
		model: "claude-4",
		label: "Claude 4",
		reply: "A single route. Every origin."
	},
	{
		model: "grok-3",
		label: "Grok 3",
		reply: "The moon, on demand."
	}
];
function PlaygroundSection() {
	const [active, setActive] = (0, import_react.useState)(SAMPLES[0]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "playground",
		className: "playground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "playground-copy",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "section-kicker",
					children: "Section 05"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "section-title",
					children: [
						"Speak once.",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"Route everywhere."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "play-switch",
					role: "tablist",
					"aria-label": "Playground model",
					children: SAMPLES.map((sample) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						role: "tab",
						"aria-selected": active.model === sample.model,
						"data-cursor": "hover",
						className: cn("filter-chip", active.model === sample.model && "is-on"),
						onClick: () => setActive(sample),
						children: sample.label
					}, sample.model))
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LiquidGlass, {
			className: "terminal",
			interactive: false,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "terminal-pane",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "terminal-label",
						children: "Request"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tok-ice",
							children: "curl"
						}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tok-ink",
							children: "https://api.fytapi.com/v1/chat/completions"
						}),
						" \\\n  ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tok-mute",
							children: "-H"
						}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tok-ink",
							children: "\"Authorization: Bearer $FYT_API_KEY\""
						}),
						" \\\n  ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tok-mute",
							children: "-H"
						}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tok-ink",
							children: "\"Content-Type: application/json\""
						}),
						" \\\n  ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tok-mute",
							children: "-d"
						}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tok-ink",
							children: `'{\n    "model": "${active.model}",\n    "messages": [\n      { "role": "user", "content": "Orbit the moon." }\n    ]\n  }'`
						})
					] }) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "terminal-rule",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "terminal-pane",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "terminal-label",
						children: ["Response", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "api-ok",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), "200"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tok-mute",
							children: "{\n  "
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tok-ice",
							children: "\"id\""
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tok-mute",
							children: ": "
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tok-ink",
							children: "\"chatcmpl-fyt-04k2\""
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tok-mute",
							children: ",\n  "
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tok-ice",
							children: "\"model\""
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tok-mute",
							children: ": "
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tok-ink",
							children: `"${active.model}"`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tok-mute",
							children: ",\n  "
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tok-ice",
							children: "\"choices\""
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tok-mute",
							children: ": [{\n    "
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tok-ice",
							children: "\"message\""
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tok-mute",
							children: ": {\n      "
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tok-ice",
							children: "\"role\""
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tok-mute",
							children: ": "
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tok-ink",
							children: "\"assistant\""
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tok-mute",
							children: ",\n      "
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tok-ice",
							children: "\"content\""
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tok-mute",
							children: ": "
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tok-ink",
							children: `"${active.reply}"`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tok-mute",
							children: "\n    }\n  }]\n}"
						})
					] }) })]
				})
			]
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteChrome, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "site",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModelsSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfraSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaygroundSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	}) });
}
//#endregion
export { Home as component };
