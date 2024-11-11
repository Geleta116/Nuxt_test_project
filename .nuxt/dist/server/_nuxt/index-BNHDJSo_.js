import { computed, defineComponent, useAttrs, ref, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import { u as useHead } from "./index-DMqtYQSF.js";
import { defu } from "defu";
import { hasProtocol, withLeadingSlash, joinURL, parseURL, encodePath, encodeParam } from "ufo";
import { appendHeader } from "h3";
import { d as useRequestEvent, b as useNuxtApp, c as useRuntimeConfig, _ as _export_sfc } from "../server.mjs";
import "destr";
import "klona";
import "#internal/nuxt/paths";
import __nuxt_component_2 from "./index-PxGfuHmk.js";
import { Icon } from "@iconify/vue";
import "@unhead/shared";
import "ofetch";
import "hookable";
import "unctx";
import "unhead";
import "vue-router";
import "radix3";
import "@iconify/utils/lib/css/icon";
import "consola";
async function imageMeta(_ctx, url) {
  const meta = await _imageMeta(url).catch((err) => {
    console.error("Failed to get image meta for " + url, err + "");
    return {
      width: 0,
      height: 0,
      ratio: 0
    };
  });
  return meta;
}
async function _imageMeta(url) {
  {
    const imageMeta2 = await import("image-meta").then((r) => r.imageMeta);
    const data = await fetch(url).then((res) => res.buffer());
    const metadata = imageMeta2(data);
    if (!metadata) {
      throw new Error(`No metadata could be extracted from the image \`${url}\`.`);
    }
    const { width, height } = metadata;
    const meta = {
      width,
      height,
      ratio: width && height ? width / height : void 0
    };
    return meta;
  }
}
function createMapper(map) {
  return (key) => {
    return key ? map[key] || key : map.missingValue;
  };
}
function createOperationsGenerator({ formatter, keyMap, joinWith = "/", valueMap } = {}) {
  if (!formatter) {
    formatter = (key, value) => `${key}=${value}`;
  }
  if (keyMap && typeof keyMap !== "function") {
    keyMap = createMapper(keyMap);
  }
  const map = valueMap || {};
  Object.keys(map).forEach((valueKey) => {
    if (typeof map[valueKey] !== "function") {
      map[valueKey] = createMapper(map[valueKey]);
    }
  });
  return (modifiers = {}) => {
    const operations = Object.entries(modifiers).filter(([_, value]) => typeof value !== "undefined").map(([key, value]) => {
      const mapper = map[key];
      if (typeof mapper === "function") {
        value = mapper(modifiers[key]);
      }
      key = typeof keyMap === "function" ? keyMap(key) : key;
      return formatter(key, value);
    });
    return operations.join(joinWith);
  };
}
function parseSize(input = "") {
  if (typeof input === "number") {
    return input;
  }
  if (typeof input === "string") {
    if (input.replace("px", "").match(/^\d+$/g)) {
      return Number.parseInt(input, 10);
    }
  }
}
function parseDensities(input = "") {
  if (input === void 0 || !input.length) {
    return [];
  }
  const densities = /* @__PURE__ */ new Set();
  for (const density of input.split(" ")) {
    const d = Number.parseInt(density.replace("x", ""));
    if (d) {
      densities.add(d);
    }
  }
  return Array.from(densities);
}
function checkDensities(densities) {
  if (densities.length === 0) {
    throw new Error("`densities` must not be empty, configure to `1` to render regular size only (DPR 1.0)");
  }
}
function parseSizes(input) {
  const sizes = {};
  if (typeof input === "string") {
    for (const entry of input.split(/[\s,]+/).filter((e) => e)) {
      const s = entry.split(":");
      if (s.length !== 2) {
        sizes["1px"] = s[0].trim();
      } else {
        sizes[s[0].trim()] = s[1].trim();
      }
    }
  } else {
    Object.assign(sizes, input);
  }
  return sizes;
}
function prerenderStaticImages(src = "", srcset = "") {
  if (!import.meta.prerender) {
    return;
  }
  const paths = [
    src,
    ...srcset.split(", ").map((s) => s.trim().split(" ")[0].trim())
  ].filter((s) => s && s.includes("/_ipx/"));
  if (!paths.length) {
    return;
  }
  appendHeader(useRequestEvent(), "x-nitro-prerender", paths.map((p) => encodeURIComponent(p)).join(", "));
}
function createImage(globalOptions) {
  const ctx = {
    options: globalOptions
  };
  const getImage2 = (input, options = {}) => {
    const image = resolveImage(ctx, input, options);
    if (import.meta.prerender) {
      prerenderStaticImages(image.url);
    }
    return image;
  };
  const $img = (input, modifiers = {}, options = {}) => {
    return getImage2(input, {
      ...options,
      modifiers: defu(modifiers, options.modifiers || {})
    }).url;
  };
  for (const presetName in globalOptions.presets) {
    $img[presetName] = (source, modifiers, options) => $img(source, modifiers, { ...globalOptions.presets[presetName], ...options });
  }
  $img.options = globalOptions;
  $img.getImage = getImage2;
  $img.getMeta = (input, options) => getMeta(ctx, input, options);
  $img.getSizes = (input, options) => getSizes(ctx, input, options);
  ctx.$img = $img;
  return $img;
}
async function getMeta(ctx, input, options) {
  const image = resolveImage(ctx, input, { ...options });
  if (typeof image.getMeta === "function") {
    return await image.getMeta();
  } else {
    return await imageMeta(ctx, image.url);
  }
}
function resolveImage(ctx, input, options) {
  var _a, _b;
  if (input && typeof input !== "string") {
    throw new TypeError(`input must be a string (received ${typeof input}: ${JSON.stringify(input)})`);
  }
  if (!input || input.startsWith("data:")) {
    return {
      url: input
    };
  }
  const { provider, defaults } = getProvider(ctx, options.provider || ctx.options.provider);
  const preset = getPreset(ctx, options.preset);
  input = hasProtocol(input) ? input : withLeadingSlash(input);
  if (!provider.supportsAlias) {
    for (const base in ctx.options.alias) {
      if (input.startsWith(base)) {
        const alias = ctx.options.alias[base];
        if (alias) {
          input = joinURL(alias, input.slice(base.length));
        }
      }
    }
  }
  if (provider.validateDomains && hasProtocol(input)) {
    const inputHost = parseURL(input).host;
    if (!ctx.options.domains.find((d) => d === inputHost)) {
      return {
        url: input
      };
    }
  }
  const _options = defu(options, preset, defaults);
  _options.modifiers = { ..._options.modifiers };
  const expectedFormat = _options.modifiers.format;
  if ((_a = _options.modifiers) == null ? void 0 : _a.width) {
    _options.modifiers.width = parseSize(_options.modifiers.width);
  }
  if ((_b = _options.modifiers) == null ? void 0 : _b.height) {
    _options.modifiers.height = parseSize(_options.modifiers.height);
  }
  const image = provider.getImage(input, _options, ctx);
  image.format = image.format || expectedFormat || "";
  return image;
}
function getProvider(ctx, name) {
  const provider = ctx.options.providers[name];
  if (!provider) {
    throw new Error("Unknown provider: " + name);
  }
  return provider;
}
function getPreset(ctx, name) {
  if (!name) {
    return {};
  }
  if (!ctx.options.presets[name]) {
    throw new Error("Unknown preset: " + name);
  }
  return ctx.options.presets[name];
}
function getSizes(ctx, input, opts) {
  var _a, _b, _c, _d, _e;
  const width = parseSize((_a = opts.modifiers) == null ? void 0 : _a.width);
  const height = parseSize((_b = opts.modifiers) == null ? void 0 : _b.height);
  const sizes = parseSizes(opts.sizes);
  const densities = ((_c = opts.densities) == null ? void 0 : _c.trim()) ? parseDensities(opts.densities.trim()) : ctx.options.densities;
  checkDensities(densities);
  const hwRatio = width && height ? height / width : 0;
  const sizeVariants = [];
  const srcsetVariants = [];
  if (Object.keys(sizes).length >= 1) {
    for (const key in sizes) {
      const variant = getSizesVariant(key, String(sizes[key]), height, hwRatio, ctx);
      if (variant === void 0) {
        continue;
      }
      sizeVariants.push({
        size: variant.size,
        screenMaxWidth: variant.screenMaxWidth,
        media: `(max-width: ${variant.screenMaxWidth}px)`
      });
      for (const density of densities) {
        srcsetVariants.push({
          width: variant._cWidth * density,
          src: getVariantSrc(ctx, input, opts, variant, density)
        });
      }
    }
    finaliseSizeVariants(sizeVariants);
  } else {
    for (const density of densities) {
      const key = Object.keys(sizes)[0];
      let variant = key ? getSizesVariant(key, String(sizes[key]), height, hwRatio, ctx) : void 0;
      if (variant === void 0) {
        variant = {
          size: "",
          screenMaxWidth: 0,
          _cWidth: (_d = opts.modifiers) == null ? void 0 : _d.width,
          _cHeight: (_e = opts.modifiers) == null ? void 0 : _e.height
        };
      }
      srcsetVariants.push({
        width: density,
        src: getVariantSrc(ctx, input, opts, variant, density)
      });
    }
  }
  finaliseSrcsetVariants(srcsetVariants);
  const defaultVariant = srcsetVariants[srcsetVariants.length - 1];
  const sizesVal = sizeVariants.length ? sizeVariants.map((v) => `${v.media ? v.media + " " : ""}${v.size}`).join(", ") : void 0;
  const suffix = sizesVal ? "w" : "x";
  const srcsetVal = srcsetVariants.map((v) => `${v.src} ${v.width}${suffix}`).join(", ");
  return {
    sizes: sizesVal,
    srcset: srcsetVal,
    src: defaultVariant == null ? void 0 : defaultVariant.src
  };
}
function getSizesVariant(key, size, height, hwRatio, ctx) {
  const screenMaxWidth = ctx.options.screens && ctx.options.screens[key] || Number.parseInt(key);
  const isFluid = size.endsWith("vw");
  if (!isFluid && /^\d+$/.test(size)) {
    size = size + "px";
  }
  if (!isFluid && !size.endsWith("px")) {
    return void 0;
  }
  let _cWidth = Number.parseInt(size);
  if (!screenMaxWidth || !_cWidth) {
    return void 0;
  }
  if (isFluid) {
    _cWidth = Math.round(_cWidth / 100 * screenMaxWidth);
  }
  const _cHeight = hwRatio ? Math.round(_cWidth * hwRatio) : height;
  return {
    size,
    screenMaxWidth,
    _cWidth,
    _cHeight
  };
}
function getVariantSrc(ctx, input, opts, variant, density) {
  return ctx.$img(
    input,
    {
      ...opts.modifiers,
      width: variant._cWidth ? variant._cWidth * density : void 0,
      height: variant._cHeight ? variant._cHeight * density : void 0
    },
    opts
  );
}
function finaliseSizeVariants(sizeVariants) {
  var _a;
  sizeVariants.sort((v1, v2) => v1.screenMaxWidth - v2.screenMaxWidth);
  let previousMedia = null;
  for (let i = sizeVariants.length - 1; i >= 0; i--) {
    const sizeVariant = sizeVariants[i];
    if (sizeVariant.media === previousMedia) {
      sizeVariants.splice(i, 1);
    }
    previousMedia = sizeVariant.media;
  }
  for (let i = 0; i < sizeVariants.length; i++) {
    sizeVariants[i].media = ((_a = sizeVariants[i + 1]) == null ? void 0 : _a.media) || "";
  }
}
function finaliseSrcsetVariants(srcsetVariants) {
  srcsetVariants.sort((v1, v2) => v1.width - v2.width);
  let previousWidth = null;
  for (let i = srcsetVariants.length - 1; i >= 0; i--) {
    const sizeVariant = srcsetVariants[i];
    if (sizeVariant.width === previousWidth) {
      srcsetVariants.splice(i, 1);
    }
    previousWidth = sizeVariant.width;
  }
}
const operationsGenerator = createOperationsGenerator({
  keyMap: {
    format: "f",
    fit: "fit",
    width: "w",
    height: "h",
    resize: "s",
    quality: "q",
    background: "b"
  },
  joinWith: "&",
  formatter: (key, val) => encodeParam(key) + "_" + encodeParam(val)
});
const getImage = (src, { modifiers = {}, baseURL } = {}, ctx) => {
  if (modifiers.width && modifiers.height) {
    modifiers.resize = `${modifiers.width}x${modifiers.height}`;
    delete modifiers.width;
    delete modifiers.height;
  }
  const params = operationsGenerator(modifiers) || "_";
  if (!baseURL) {
    baseURL = joinURL(ctx.options.nuxt.baseURL, "/_ipx");
  }
  return {
    url: joinURL(baseURL, params, encodePath(src))
  };
};
const validateDomains = true;
const supportsAlias = true;
const ipxStaticRuntime$Lr0neHOOIA = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getImage,
  supportsAlias,
  validateDomains
}, Symbol.toStringTag, { value: "Module" }));
const imageOptions = {
  "screens": {
    "xs": 320,
    "sm": 640,
    "md": 768,
    "lg": 1024,
    "xl": 1280,
    "xxl": 1536,
    "2xl": 1536
  },
  "presets": {},
  "provider": "ipxStatic",
  "domains": [],
  "alias": {},
  "densities": [
    1,
    2
  ],
  "format": [
    "webp"
  ]
};
imageOptions.providers = {
  ["ipxStatic"]: { provider: ipxStaticRuntime$Lr0neHOOIA, defaults: {} }
};
const useImage = () => {
  const config = useRuntimeConfig();
  const nuxtApp = useNuxtApp();
  return nuxtApp.$img || nuxtApp._img || (nuxtApp._img = createImage({
    ...imageOptions,
    nuxt: {
      baseURL: config.app.baseURL
    },
    runtimeConfig: config
  }));
};
const baseImageProps = {
  // input source
  src: { type: String, required: false },
  // modifiers
  format: { type: String, required: false },
  quality: { type: [Number, String], required: false },
  background: { type: String, required: false },
  fit: { type: String, required: false },
  modifiers: { type: Object, required: false },
  // options
  preset: { type: String, required: false },
  provider: { type: String, required: false },
  sizes: { type: [Object, String], required: false },
  densities: { type: String, required: false },
  preload: {
    type: [Boolean, Object],
    required: false
  },
  // <img> attributes
  width: { type: [String, Number], required: false },
  height: { type: [String, Number], required: false },
  alt: { type: String, required: false },
  referrerpolicy: { type: String, required: false },
  usemap: { type: String, required: false },
  longdesc: { type: String, required: false },
  ismap: { type: Boolean, required: false },
  loading: {
    type: String,
    required: false,
    validator: (val) => ["lazy", "eager"].includes(val)
  },
  crossorigin: {
    type: [Boolean, String],
    required: false,
    validator: (val) => ["anonymous", "use-credentials", "", true, false].includes(val)
  },
  decoding: {
    type: String,
    required: false,
    validator: (val) => ["async", "auto", "sync"].includes(val)
  },
  // csp
  nonce: { type: [String], required: false }
};
const useBaseImage = (props) => {
  const options = computed(() => {
    return {
      provider: props.provider,
      preset: props.preset
    };
  });
  const attrs = computed(() => {
    return {
      width: parseSize(props.width),
      height: parseSize(props.height),
      alt: props.alt,
      referrerpolicy: props.referrerpolicy,
      usemap: props.usemap,
      longdesc: props.longdesc,
      ismap: props.ismap,
      crossorigin: props.crossorigin === true ? "anonymous" : props.crossorigin || void 0,
      loading: props.loading,
      decoding: props.decoding,
      nonce: props.nonce
    };
  });
  const $img = useImage();
  const modifiers = computed(() => {
    return {
      ...props.modifiers,
      width: parseSize(props.width),
      height: parseSize(props.height),
      format: props.format,
      quality: props.quality || $img.options.quality,
      background: props.background,
      fit: props.fit
    };
  });
  return {
    options,
    attrs,
    modifiers
  };
};
const imgProps = {
  ...baseImageProps,
  placeholder: { type: [Boolean, String, Number, Array], required: false },
  placeholderClass: { type: String, required: false }
};
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "NuxtImg",
  __ssrInlineRender: true,
  props: imgProps,
  emits: ["load", "error"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const attrs = useAttrs();
    const isServer = true;
    const $img = useImage();
    const _base = useBaseImage(props);
    const placeholderLoaded = ref(false);
    const imgEl = ref();
    const sizes = computed(() => $img.getSizes(props.src, {
      ..._base.options.value,
      sizes: props.sizes,
      densities: props.densities,
      modifiers: {
        ..._base.modifiers.value,
        width: parseSize(props.width),
        height: parseSize(props.height)
      }
    }));
    const imgAttrs = computed(() => {
      const attrs2 = { ..._base.attrs.value, "data-nuxt-img": "" };
      if (!props.placeholder || placeholderLoaded.value) {
        attrs2.sizes = sizes.value.sizes;
        attrs2.srcset = sizes.value.srcset;
      }
      return attrs2;
    });
    const placeholder = computed(() => {
      let placeholder2 = props.placeholder;
      if (placeholder2 === "") {
        placeholder2 = true;
      }
      if (!placeholder2 || placeholderLoaded.value) {
        return false;
      }
      if (typeof placeholder2 === "string") {
        return placeholder2;
      }
      const size = Array.isArray(placeholder2) ? placeholder2 : typeof placeholder2 === "number" ? [placeholder2, placeholder2] : [10, 10];
      return $img(props.src, {
        ..._base.modifiers.value,
        width: size[0],
        height: size[1],
        quality: size[2] || 50,
        blur: size[3] || 3
      }, _base.options.value);
    });
    const mainSrc = computed(
      () => props.sizes ? sizes.value.src : $img(props.src, _base.modifiers.value, _base.options.value)
    );
    const src = computed(() => placeholder.value ? placeholder.value : mainSrc.value);
    if (props.preload) {
      const isResponsive = Object.values(sizes.value).every((v) => v);
      useHead({
        link: [{
          rel: "preload",
          as: "image",
          nonce: props.nonce,
          ...!isResponsive ? { href: src.value } : {
            href: sizes.value.src,
            imagesizes: sizes.value.sizes,
            imagesrcset: sizes.value.srcset
          },
          ...typeof props.preload !== "boolean" && props.preload.fetchPriority ? { fetchpriority: props.preload.fetchPriority } : {}
        }]
      });
    }
    if (import.meta.prerender) {
      prerenderStaticImages(src.value, sizes.value.srcset);
    }
    const nuxtApp = useNuxtApp();
    nuxtApp.isHydrating;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<img${ssrRenderAttrs(mergeProps({
        ref_key: "imgEl",
        ref: imgEl,
        class: props.placeholder && !placeholderLoaded.value ? props.placeholderClass : void 0
      }, {
        ...unref(isServer) ? { onerror: "this.setAttribute('data-error', 1)" } : {},
        ...imgAttrs.value,
        ...unref(attrs)
      }, { src: src.value }, _attrs))}>`);
    };
  }
});
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const _sfc_main$a = {};
function _sfc_ssrRender$8(_ctx, _push, _parent, _attrs) {
  const _component_NuxtImg = _sfc_main$b;
  const _component_Icon = __nuxt_component_2;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex text-center items-center m-2 gap-6" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_NuxtImg, {
    src: "https://www.udemy.com/staticx/udemy/images/v7/logo-udemy.svg",
    alt: "A local image",
    width: "100",
    height: "400",
    quality: "80"
  }, null, _parent));
  _push(`<div class="text-gray-700 text-sm"> Categories </div><div class="flex items-center border rounded-3xl w-7/12 border-black">`);
  _push(ssrRenderComponent(_component_Icon, {
    name: "material-symbols:search-rounded",
    class: "ml-2 text-2xl text-gray-500"
  }, null, _parent));
  _push(`<input placeholder="Search for anything" class="p-1 m-2 outline-none"></div><div class="text-gray-800 text-sm"> Udemy Business </div><div class="text-gray-800 text-sm"> Tech on Udemy </div><div class="py2">`);
  _push(ssrRenderComponent(_component_Icon, {
    name: "material-symbols:shopping-cart-outline-sharp",
    class: "text-2xl"
  }, null, _parent));
  _push(`</div><div class="flex justify-between gap-4"><button class="border border-black hover:bg-gray-300 px-4 py-2 font-bold"> Login </button><button class="border text-white bg-gray-800 hover:bg-gray-700 border-black px-4 py-2 font-bold"> Sign up </button><button class="border border-black hover:bg-gray-300 text-2xl px-2 font-bold">`);
  _push(ssrRenderComponent(_component_Icon, { name: "tabler:world" }, null, _parent));
  _push(`</button></div></div>`);
}
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/NavBar.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const __nuxt_component_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["ssrRender", _sfc_ssrRender$8]]);
const _sfc_main$9 = {};
function _sfc_ssrRender$7(_ctx, _push, _parent, _attrs) {
  const _component_Icon = __nuxt_component_2;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "sticky top-20 z-40 p-2 bg-zinc-900 text-white font-bold shadow-lg" }, _attrs))}><p>NUXT 3 Bootcamp: Full-Stack Guide with Real-World Projects</p><p><span class="font-bold text-orange-400 align-middle">4.6</span>`);
  _push(ssrRenderComponent(_component_Icon, {
    name: "ic:outline-star",
    class: "ml-1 text-lg text-orange-500 align-middle"
  }, null, _parent));
  _push(`<span class="text-sm font-thin"><a href="#" class="text-purple-200 mr-2">(73 ratings)</a> 572 Students </span></p></div>`);
}
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/StickyInfo.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["ssrRender", _sfc_ssrRender$7]]);
const _sfc_main$8 = {
  props: {
    text: {
      type: String,
      required: true
    }
  }
};
function _sfc_ssrRender$6(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Icon = __nuxt_component_2;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-2 flex items-start max-w-96 text-wrap" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_Icon, {
    name: "material-symbols-light:check-rounded",
    class: "mr-3 mt-1"
  }, null, _parent));
  _push(`<p class="w-full items-start text-sm">${ssrInterpolate($props.text)}</p></div>`);
}
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LearnFeatures.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["ssrRender", _sfc_ssrRender$6]]);
const _sfc_main$7 = {
  props: {
    title: {
      type: String,
      required: true
    }
  }
};
function _sfc_ssrRender$5(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "border rounded-full border-black hover:bg-gray-300 text-center align-center px-3 mr-4" }, _attrs))}><h2 class="font-bold p-3 flex justify-center">${ssrInterpolate($props.title)}</h2></div>`);
}
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Topics.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["ssrRender", _sfc_ssrRender$5]]);
const _sfc_main$6 = {
  __name: "AddToCart",
  __ssrInlineRender: true,
  props: {
    isScrolledBeyondFirstPart: Boolean,
    isScrolledBeyondSecondPart: Boolean
  },
  setup(__props) {
    const features = [
      { iconName: "material-symbols:live-tv-outline", text: "15 hours on-demand video" },
      { iconName: "ic:round-code", text: "6 coding exercises" },
      { iconName: "ic:round-help-outline", text: "2 practice tests" },
      { iconName: "ic:baseline-insert-drive-file", text: "8 articles" },
      { iconName: "mdi:folder-download-outline", text: "17 downloadable resources" },
      { iconName: "material-symbols:smartphone", text: "Access on mobile and TV" },
      { iconName: "mdi:infinity", text: "Full lifetime access" },
      { iconName: "material-symbols:trophy-outline", text: "Certificate of completion" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = _sfc_main$b;
      if (!__props.isScrolledBeyondSecondPart) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: ["px-8 py-2 max-w-sm mx-auto border rounded-lg", { hidden: __props.isScrolledBeyondSecondPart }]
        }, _attrs))} data-v-7769b7d0>`);
        if (!__props.isScrolledBeyondFirstPart) {
          _push(ssrRenderComponent(_component_NuxtImg, {
            src: "/preview_img.jpg",
            alt: "A preview image",
            class: ["w-[400px] h-auto max-w-full max-h-64 rounded-lg shadow-lg", { hidden: __props.isScrolledBeyondFirstPart }],
            quality: "80"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<p class="font-bold text-4xl my-4" data-v-7769b7d0>$64.99</p><div class="flex justify-center" data-v-7769b7d0><button class="bg-[#8710D8] px-4 py-4 text-white font-bold w-full my-2 max-w-96" data-v-7769b7d0>Add To Cart</button></div><div class="flex justify-center" data-v-7769b7d0><button class="bg-gray-200 px-4 py-4 font-bold w-full my-2 max-w-96" data-v-7769b7d0>Buy Now</button></div><p class="text-sm text-center mt-4" data-v-7769b7d0>30-Day Money-Back Guarantee</p><p class="mt-4 font-bold" data-v-7769b7d0>This course includes:</p><!--[-->`);
        ssrRenderList(features, (feature, index2) => {
          _push(`<div class="flex items-center space-x-2 my-2" data-v-7769b7d0>`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: feature.iconName,
            class: "text-gray-500",
            width: "20",
            height: "20"
          }, null, _parent));
          _push(`<span data-v-7769b7d0>${ssrInterpolate(feature.text)}</span></div>`);
        });
        _push(`<!--]--><div class="flex text-sm font-bold justify-between p-2" data-v-7769b7d0><p class="underline" data-v-7769b7d0>Share</p><p data-v-7769b7d0>Gift this course</p><p data-v-7769b7d0>Apply Coupon</p></div><div class="border border-dashed p-1 m-2 flex justify-between text-gray-500" data-v-7769b7d0><div data-v-7769b7d0><p data-v-7769b7d0><span class="font-bold" data-v-7769b7d0>LETSLEARNNOW</span> is applied</p><p data-v-7769b7d0>Udemy coupon</p></div><div class="flex items-center" data-v-7769b7d0>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "emojione-monotone:cross-mark",
          class: "text-gray-500 hover:cursor-pointer",
          width: "20",
          height: "20"
        }, null, _parent));
        _push(`</div></div><div class="border border-solid border-black m-2 flex justify-between text-gray-500" data-v-7769b7d0><input placeholder="Enter Coupon" class="p-2" data-v-7769b7d0><button class="flex items-center bg-black text-white p-2 px-4 font-bold" data-v-7769b7d0> Apply </button></div><div class="border-t border-black w-full my-8" data-v-7769b7d0></div><div data-v-7769b7d0><p class="font-bold text-xl" data-v-7769b7d0>Training 5 or more people?</p><p class="text-sm" data-v-7769b7d0>Get your team access to 27,000+ top Udemy courses anytime, anywhere.</p><button class="border border-black text-center font-bold w-full px-4 py-2" data-v-7769b7d0> Try Udemy Business </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddToCart.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_6 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-7769b7d0"]]);
const _sfc_main$5 = {};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs) {
  const _component_NuxtImg = _sfc_main$b;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-zinc-900 text-white p-4 font-bold flex justify-between items-center" }, _attrs))}><p class="items-center"> Top companies choose <a href="#" class="text-purple-300 items-center">Udemy Business</a> to build in-demand career skills. </p><div class="flex gap-4 items-center">`);
  _push(ssrRenderComponent(_component_NuxtImg, {
    src: "https://s.udemycdn.com/partner-logos/v4/nasdaq-light.svg",
    alt: "A local image",
    width: "100",
    height: "200",
    quality: "80",
    class: "items-center"
  }, null, _parent));
  _push(ssrRenderComponent(_component_NuxtImg, {
    src: "https://s.udemycdn.com/partner-logos/v4/volkswagen-light.svg",
    alt: "A local image",
    width: "50",
    height: "25",
    quality: "80",
    class: "items-center"
  }, null, _parent));
  _push(ssrRenderComponent(_component_NuxtImg, {
    src: "https://s.udemycdn.com/partner-logos/v4/box-light.svg",
    alt: "A local image",
    width: "80",
    height: "100",
    quality: "80",
    class: "items-center"
  }, null, _parent));
  _push(ssrRenderComponent(_component_NuxtImg, {
    src: "https://s.udemycdn.com/partner-logos/v4/netapp-light.svg",
    alt: "A local image",
    width: "130",
    height: "100",
    quality: "80",
    class: "items-center"
  }, null, _parent));
  _push(ssrRenderComponent(_component_NuxtImg, {
    src: "https://s.udemycdn.com/partner-logos/v4/eventbrite-light.svg",
    alt: "A local image",
    width: "130",
    height: "100",
    quality: "80",
    class: "items-center"
  }, null, _parent));
  _push(`</div></div>`);
}
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CompaniesFooter.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_7 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["ssrRender", _sfc_ssrRender$4]]);
const _sfc_main$4 = {
  props: {
    title: {
      type: String,
      required: true
    },
    skills: {
      type: Array,
      required: true
    }
  }
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h2 class="font-bold text-lg mb-4">${ssrInterpolate($props.title)}</h2><ul><!--[-->`);
  ssrRenderList($props.skills, (skill, index2) => {
    _push(`<li class="font-thin p-1"><a href="#">${ssrInterpolate(skill)}</a></li>`);
  });
  _push(`<!--]--></ul></div>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TopSkillsCategory.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$3]]);
const _sfc_main$3 = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {
  const _component_TopSkillsCategory = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-zinc-900 text-white p-10" }, _attrs))}><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">`);
  _push(ssrRenderComponent(_component_TopSkillsCategory, {
    title: "Certifications by Issuer",
    skills: [
      "Amazon Web Services (AWS) Certifications",
      "Six Sigma Certifications",
      "Microsoft Certifications",
      "Cisco Certifications",
      "Tableau Certifications",
      "See all Certifications"
    ]
  }, null, _parent));
  _push(ssrRenderComponent(_component_TopSkillsCategory, {
    title: "Web Development",
    skills: ["Web Development", "JavaScript", "React JS", "Angular", "Java"]
  }, null, _parent));
  _push(ssrRenderComponent(_component_TopSkillsCategory, {
    title: "IT Certifications",
    skills: [
      "Amazon AWS",
      "AWS Certified Cloud Practitioner",
      "AZ-900: Microsoft Azure Fundamentals",
      "AWS Certified Solutions Architect - Associate",
      "Kubernetes"
    ]
  }, null, _parent));
  _push(ssrRenderComponent(_component_TopSkillsCategory, {
    title: "Leadership",
    skills: ["Leadership", "Management Skills", "Project Management", "Personal Productivity", "Emotional Intelligence"]
  }, null, _parent));
  _push(ssrRenderComponent(_component_TopSkillsCategory, {
    title: "Certifications by Skill",
    skills: [
      "Cybersecurity Certification",
      "Project Management Certification",
      "Cloud Certification",
      "Data Analytics Certification",
      "HR Management Certification",
      "See all Certification"
    ]
  }, null, _parent));
  _push(ssrRenderComponent(_component_TopSkillsCategory, {
    title: "Data Science",
    skills: ["Data Science", "Python", "Machine Learning", "ChatGPT", "Deep Learning"]
  }, null, _parent));
  _push(ssrRenderComponent(_component_TopSkillsCategory, {
    title: "Communication",
    skills: ["Communication Skills", "Presentation Skills", "Public Speaking", "Writing", "PowerPoint"]
  }, null, _parent));
  _push(ssrRenderComponent(_component_TopSkillsCategory, {
    title: "Business Analytics & Intelligence",
    skills: ["Microsoft Excel", "SQL", "Microsoft Power BI", "Data Analysis", "Business Analysis"]
  }, null, _parent));
  _push(`</div></div>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TopSkillsMenu.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_8 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$2]]);
const _sfc_main$2 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  const _component_TopSkillsCategory = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-black text-white p-10" }, _attrs))}><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">`);
  _push(ssrRenderComponent(_component_TopSkillsCategory, {
    title: "About",
    skills: [
      "About us",
      "Careers",
      "Contact us",
      "Blog",
      "Investors"
    ]
  }, null, _parent));
  _push(ssrRenderComponent(_component_TopSkillsCategory, {
    title: "Discovery Udemy",
    skills: [
      "Get the app",
      "Teach on Udemy",
      "Plans and Pricing",
      "Affiliate",
      "Help and Support"
    ]
  }, null, _parent));
  _push(ssrRenderComponent(_component_TopSkillsCategory, {
    title: "Udemy for Business",
    skills: ["Udemy Business"]
  }, null, _parent));
  _push(ssrRenderComponent(_component_TopSkillsCategory, {
    title: "Legal & Accessibility",
    skills: [
      "Accessibility statement",
      "Privacy policy",
      "Sitemap",
      "Terms"
    ]
  }, null, _parent));
  _push(`</div></div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BottomNavBar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_9 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtImg = _sfc_main$b;
  const _component_Icon = __nuxt_component_2;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center justify-between px-3 border-t border-t-white bg-zinc-900 text-white" }, _attrs))}><div class="flex text-center items-center m-4 gap-6 align-middle">`);
  _push(ssrRenderComponent(_component_NuxtImg, {
    src: "	https://www.udemy.com/staticx/udemy/images/v7/logo-udemy-inverted.svg",
    alt: "A local image",
    width: "100",
    height: "400",
    quality: "80"
  }, null, _parent));
  _push(`<p class="align-middle text-sm">`);
  _push(ssrRenderComponent(_component_Icon, {
    name: "si:copyright-alt-line align-middle",
    class: "text-sm text-gray-500"
  }, null, _parent));
  _push(` 2024 Udemy, Inc. </p></div><div>Cookie Settings</div><div><button class="text-small px-2 align-middle">`);
  _push(ssrRenderComponent(_component_Icon, { name: "tabler:world text-2xl align-middle" }, null, _parent));
  _push(` English </button></div></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Footer.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_10 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const showMore = ref(true);
    const isNavBarScrolled = ref(false);
    const isStickyVisible = ref(false);
    const isScrolledBeyondFirstPart = ref(false);
    const isScrolledBeyondSecondPart = ref(false);
    const features = [
      "Learn NuxtJS from Scratch: ",
      "Start with the basics and gradually progress to advanced topics, ensuring a solid understanding of NuxtJS fundamentals.",
      "An Introduction to this masterclass: ",
      "We'll guide you through success tips, course outline, tools needed, coding exercises, file downloads, and online classroom access",
      "Introduction to Nuxt JS: ",
      "Dive into NuxtJS concepts like rendering (server-side, client-side, universal), pros/cons, universal rendering, and Nuxt vs Vue comparison.",
      "Nuxt JS Basics: ",
      "Dive into Nuxt JS basics like setup, components, navigation, styling, middleware, lazy loading, assets, SEO, metadata, transitions & beyond!",
      "Data Fetching: ",
      "Mastering Data Fetching! Learn useFetch, useAsyncData & $fetch for dynamic apps.",
      "State Management: ",
      "Learn best practices for handling state management in Nuxt JS. {useState, Internal State, Shared State, and shallowRef State}",
      "Error Handling: ",
      "Master the art of Error Handling in Nuxt JS with optimal strategies for seamless development.",
      "Server-Side (Backend) in Nuxt JS: ",
      "Become a Nuxt JS backend master with Nuxt 3's Nitro server-side. {Server routes, middleware, data fetching, and more }",
      "Testing in Nuxt JS: ",
      "You will learn why testing is very important and discover optimal test writing techniques for your Nuxt apps using Nuxt and Vue test utilities.",
      "Authentication in Nuxt 3 using Supabase: ",
      "You will learn user authentication in Nuxt 3, grasp its significance, and effortlessly implement it with Supabase.",
      "Authentication using Google and Github in Nuxt 3 using Supabase: ",
      "Additionally, you'll gain expertise in implementing login with Google and GitHub, enhancing your application's accessibility and user experience.",
      "Deployment: ",
      "Master deployment by deploying your Nuxt 3 application to a platform like Vercel, ensuring your app is live and accessible to users.",
      "Real-World Example Projects: ",
      "By the end of the course, you’ll have built fully functioning apps, capable of handling backend API calls, authentication, and user interfaces with a modern stack.",
      "Comprehensive Curriculum: ",
      "By the end of this course, you will have a portfolio-worthy app to show off to employers, demonstrating your full-stack experience."
    ];
    const pairs = computed(() => {
      return features.reduce((result, _, index2, arr) => {
        if (index2 % 2 === 0) result.push(arr.slice(index2, index2 + 2));
        return result;
      }, []);
    });
    const displayedPairs = computed(() => {
      return showMore.value ? pairs.value : pairs.value.slice(0, 3);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NavBar = __nuxt_component_0$1;
      const _component_StickyInfo = __nuxt_component_1;
      const _component_Icon = __nuxt_component_2;
      const _component_LearnFeatures = __nuxt_component_3;
      const _component_Topics = __nuxt_component_4;
      const _component_NuxtImg = _sfc_main$b;
      const _component_AddToCart = __nuxt_component_6;
      const _component_CompaniesFooter = __nuxt_component_7;
      const _component_TopSkillsMenu = __nuxt_component_8;
      const _component_BottomNavBar = __nuxt_component_9;
      const _component_Footer = __nuxt_component_10;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative" }, _attrs))} data-v-5c3e9839><div class="${ssrRenderClass([{ "translate-y-negative-100": isNavBarScrolled.value }, "fixed top-0 left-0 w-full z-50 bg-white transition-all duration-300"])}" data-v-5c3e9839>`);
      _push(ssrRenderComponent(_component_NavBar, null, null, _parent));
      _push(`</div><div class="${ssrRenderClass([{ "fixed top-0 left-0 w-full z-40": isStickyVisible.value, "hidden": !isStickyVisible.value }, "transition-all duration-300 ease-in-out"])}" data-v-5c3e9839>`);
      _push(ssrRenderComponent(_component_StickyInfo, null, null, _parent));
      _push(`</div><div class="flex relative" data-v-5c3e9839><div class="flex-1 relative" data-v-5c3e9839><div class="bg-zinc-900 text-white p-20 pl-80 flex flex-col gap-4 w-screen" data-v-5c3e9839><div class="text-purple-300" data-v-5c3e9839>Development <span class="text-white" data-v-5c3e9839>&gt;</span> Web Development <span class="text-white" data-v-5c3e9839>&gt;</span> Nuxt.js</div><div class="font-bold text-3xl max-w-[800px]" data-v-5c3e9839>NUXT 3 Bootcamp: Full-Stack Guide with Real-World Projects</div><div class="text-xl max-w-[800px]" data-v-5c3e9839>Become a NuxtJS Expert with just ONE COURSE, and build Powerful Full-Stack Web Applications. {From zero to PRO in Nuxt}</div><div data-v-5c3e9839><span class="font-bold text-orange-400 align-middle" data-v-5c3e9839>4.6</span>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "ic:outline-star",
        class: "ml-1 text-lg text-orange-500 align-middle"
      }, null, _parent));
      _push(ssrRenderComponent(_component_Icon, {
        name: "ic:outline-star",
        class: "ml-1 text-lg text-orange-500 align-middle"
      }, null, _parent));
      _push(ssrRenderComponent(_component_Icon, {
        name: "ic:outline-star",
        class: "ml-1 text-lg text-orange-500 align-middle"
      }, null, _parent));
      _push(ssrRenderComponent(_component_Icon, {
        name: "ic:outline-star",
        class: "ml-1 text-lg text-orange-500 align-middle"
      }, null, _parent));
      _push(ssrRenderComponent(_component_Icon, {
        name: "material-symbols-light:star-half-outline",
        class: "ml-1 text-lg text-orange-500 align-middle"
      }, null, _parent));
      _push(`<span class="text-sm font-thin ml-1" data-v-5c3e9839><a href="#" class="text-purple-300 mr-2" data-v-5c3e9839>(73 ratings)</a> 572 Students </span></div><div data-v-5c3e9839>Created by <span class="text-purple" data-v-5c3e9839>Noor Fakhry<span class="text-white" data-v-5c3e9839>,</span> Programming Fluency</span></div><div class="flex items-center space-x-2" data-v-5c3e9839>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "bi:patch-exclamation-fll",
        class: "ml-1 text-lg"
      }, null, _parent));
      _push(`<p data-v-5c3e9839>Last updated 11/2024</p>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "tabler:world align-middle",
        class: "ml-1 text-lg"
      }, null, _parent));
      _push(`<p data-v-5c3e9839>English</p>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "ic:baseline-subtitles",
        class: "ml-1 text-lg"
      }, null, _parent));
      _push(`<p data-v-5c3e9839>English [Auto]</p></div></div><div class="border p-6 max-w-3xl ml-80 my-10" data-v-5c3e9839><p class="font-bold text-2xl mb-4" data-v-5c3e9839>What you&#39;ll Learn</p><div class="space-y-4" data-v-5c3e9839><!--[-->`);
      ssrRenderList(displayedPairs.value, (pair, index2) => {
        _push(`<div class="flex flex-col md:flex-row justify-between" data-v-5c3e9839>`);
        _push(ssrRenderComponent(_component_LearnFeatures, {
          text: pair[0]
        }, null, _parent));
        if (pair[1]) {
          _push(ssrRenderComponent(_component_LearnFeatures, {
            text: pair[1]
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div><button class="px-4 text-purple-800 font-bold text-sm flex items-center justify-start w-full" data-v-5c3e9839>${ssrInterpolate(showMore.value ? "Show Less" : "Show More")} `);
      if (showMore.value) {
        _push(`<span class="flex items-center justify-center bg-white shadow-xl" data-v-5c3e9839>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "material-symbols:keyboard-arrow-up",
          class: "ml-1"
        }, null, _parent));
        _push(`</span>`);
      } else {
        _push(`<span class="flex items-center justify-center" data-v-5c3e9839>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "material-symbols:keyboard-arrow-down",
          class: "ml-1"
        }, null, _parent));
        _push(`</span>`);
      }
      _push(`</button></div><div class="ml-80 mb-8" data-v-5c3e9839><p class="font-bold text-2xl mb-4" data-v-5c3e9839>Explore related topics</p><div class="flex" data-v-5c3e9839>`);
      _push(ssrRenderComponent(_component_Topics, { title: "Nuxt.js" }, null, _parent));
      _push(ssrRenderComponent(_component_Topics, { title: "Web development" }, null, _parent));
      _push(ssrRenderComponent(_component_Topics, { title: "Development" }, null, _parent));
      _push(`</div></div><div class="ml-8 md:ml-80 p-10 bg-[#F7F9FA] max-w-3xl mb-10 flex gap-4 items-center" data-v-5c3e9839><div data-v-5c3e9839><p class="text-2xl font-bold mb-4" data-v-5c3e9839>Coding Exercises</p><p class="max-w-xs text-sm mb-10" data-v-5c3e9839>This course includes our updated coding exercises so you can practice your skills as you learn.</p><a href="#" class="text-purple-800 text-sm font-bold underline" data-v-5c3e9839>See a demo</a></div>`);
      if (!isScrolledBeyondFirstPart.value) {
        _push(`<div class="flex-shrink-0" data-v-5c3e9839>`);
        _push(ssrRenderComponent(_component_NuxtImg, {
          src: "/screen_img.jpg",
          alt: "A screen image",
          class: "w-auto h-auto max-w-full max-h-64 rounded-lg shadow-lg",
          quality: "80"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="${ssrRenderClass([
        "absolute right-80 max-w-xs z-10 ml-8 md:ml-16 flex-shrink-0",
        { "fixed right-80 w-full z-50": isScrolledBeyondFirstPart.value, "absolute right-80 max-w-xs z-10 ml-8 md:ml-16 flex-shrink-0": _ctx.isScrolledToBottom }
      ])}" data-v-5c3e9839>`);
      if (!isScrolledBeyondFirstPart.value) {
        _push(`<div data-v-5c3e9839>`);
        _push(ssrRenderComponent(_component_AddToCart, {
          isScrolledBeyondFirstPart: isScrolledBeyondFirstPart.value,
          isScrolledBeyondSecondPart: isScrolledBeyondSecondPart.value,
          class: "bg-white top-24 absolute right-20"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="z-50 top-10 bg-white" data-v-5c3e9839>`);
        _push(ssrRenderComponent(_component_AddToCart, {
          isScrolledBeyondFirstPart: isScrolledBeyondFirstPart.value,
          isScrolledBeyondSecondPart: isScrolledBeyondSecondPart.value,
          class: "z-50 bg-white top-[70px] absolute right-20"
        }, null, _parent));
        _push(`</div>`);
      }
      _push(`</div></div>`);
      _push(ssrRenderComponent(_component_CompaniesFooter, null, null, _parent));
      _push(ssrRenderComponent(_component_TopSkillsMenu, null, null, _parent));
      _push(ssrRenderComponent(_component_BottomNavBar, null, null, _parent));
      _push(ssrRenderComponent(_component_Footer, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5c3e9839"]]);
export {
  index as default
};
//# sourceMappingURL=index-BNHDJSo_.js.map
