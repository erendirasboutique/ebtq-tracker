"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

// The shared brand logo (served by the Customer Portal; change it there).
const BRAND_LOGO =
  (process.env.NEXT_PUBLIC_BRAND_URL || "https://my.erendirasboutique.com/brand").replace(/\/+$/, "") + "/logo.png";

const LINKS = {
  home: "https://www.erendirasboutique.com",
  shop: "https://facebook.erendirasboutique.com",
  gallery: "https://www.erendirasboutique.com/gallery",
  returns: "https://returns.erendirasboutique.com",
  contact: "https://www.erendirasboutique.com/contact",
  help: "https://help.erendirasboutique.com"
};

const LANG_KEY = "ebLang";

const CARRIERS = {
  usps: {
    name: "USPS",
    logo: "/usps.png",
    url: (n) => `https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${encodeURIComponent(n)}`
  },
  ups: {
    name: "UPS",
    logo: "/ups.png",
    url: (n) => `https://www.ups.com/track?tracknum=${encodeURIComponent(n)}`
  },
  fedex: {
    name: "FedEx",
    logo: "/fedex.png",
    url: (n) => `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(n)}`
  }
};

/* ------------------------------------------------------------------ */
/* Copy (Spanish first)                                                */
/* ------------------------------------------------------------------ */

const T = {
  es: {
    locale: "es-US",
    searchTitle: ["Rastrea", "tu pedido"],
    searchSub: "Escribe el número de rastreo que te enviamos por mensaje o correo.",
    trackingNumber: "Número de rastreo",
    placeholder: "Ej. 9334 6208 4550 0054 0914 88",
    carrier: "Paquetería",
    auto: "Automático",
    track: "Rastrear",
    searching: "Buscando…",
    searchNote: "El rastreo puede tardar hasta 24 horas en aparecer después de que enviamos tu pedido.",
    shipsSaturday: "Envíos cada sábado",
    loading: "Buscando tu paquete…",
    notFoundTitle: "No encontramos ese número",
    notFoundBody:
      "Revisa que el número esté completo. Si tu pedido se envió hoy, la paquetería puede tardar hasta 24 horas en mostrarlo.",
    tryAgain: "Intentar de nuevo",
    trackAnother: "Rastrear otro paquete",
    steps: ["Enviado", "En camino", "En reparto", "Entregado"],
    now: "Ahora",
    next: "Sigue",
    pill: {
      pre: "Etiqueta creada",
      transit: "En camino",
      out: "En reparto",
      delivered: "Entregado",
      attention: "Necesita atención",
      returned: "Devuelto"
    },
    updated: (rel) => `actualizado ${rel}`,
    arrives: "Llega el",
    arrivingToday: ["Llega", "hoy"],
    onItsWay: ["Va en", "camino"],
    preTitle: ["Preparando", "tu envío"],
    preSub: (c) => `La etiqueta está lista. Verás novedades cuando ${c} escanee tu paquete.`,
    estimated: (d) => `Entrega estimada: ${d}`,
    outSub: "Tu paquete va en el vehículo de reparto.",
    deliveredTitle: "¡Ya llegó!",
    deliveredSub: (d) => `Entregado el ${d}`,
    attentionTitle: ["Necesita", "atención"],
    attentionSub: (c) => `${c} reportó un problema con la entrega. Escríbenos y lo revisamos contigo.`,
    returnedTitle: ["Devuelto al", "remitente"],
    returnedSub: "El paquete viene de regreso a la boutique. Escríbenos para ayudarte.",
    trackingLabel: "Número de rastreo",
    copy: "Copiar número de rastreo",
    copied: "¡Número copiado!",
    linkCopied: "¡Enlace copiado!",
    shipped: "Enviado",
    eta: "Entrega estimada",
    lastScan: "Último escaneo",
    updates: "Actualizaciones",
    scans: (n) => (n === 1 ? "1 escaneo" : `${n} escaneos`),
    history: "Historial completo",
    latest: "Último",
    noHistory: (c) => `${c} todavía no ha escaneado tu paquete. Vuelve a revisar más tarde.`,
    questions: "¿Preguntas?",
    viewOn: (c) => `Ver en ${c}`,
    share: "Compartir",
    help: "Ayuda",
    celebrate: "Celebrar otra vez",
    shareText: "Rastrea mi pedido de Erendira's Boutique",
    you: "Tú",
    yourDoor: "Tu puerta",
    boutique: "Boutique",
    thanksTitle: "¡Gracias por tu compra!",
    thanksBody: "Esperamos que te encante. Si algo no está bien, aquí estamos para ayudarte.",
    shopNew: "Ver novedades",
    startReturn: "Hacer una devolución",
    notAvailable: "No disponible",
    footer: { home: "Inicio", shop: "Tienda", gallery: "Galería", returns: "Devoluciones", contact: "Contacto" },
    langName: "Español"
  },
  en: {
    locale: "en-US",
    searchTitle: ["Track", "your order"],
    searchSub: "Enter the tracking number we sent you by text or email.",
    trackingNumber: "Tracking number",
    placeholder: "e.g. 9334 6208 4550 0054 0914 88",
    carrier: "Carrier",
    auto: "Auto",
    track: "Track",
    searching: "Searching…",
    searchNote: "Tracking can take up to 24 hours to show up after we ship your order.",
    shipsSaturday: "We ship every Saturday",
    loading: "Finding your package…",
    notFoundTitle: "We couldn't find that number",
    notFoundBody:
      "Check that the number is complete. If your order shipped today, the carrier can take up to 24 hours to show it.",
    tryAgain: "Try again",
    trackAnother: "Track another package",
    steps: ["Shipped", "In transit", "Out for delivery", "Delivered"],
    now: "Now",
    next: "Next",
    pill: {
      pre: "Label created",
      transit: "In transit",
      out: "Out for delivery",
      delivered: "Delivered",
      attention: "Needs attention",
      returned: "Returned"
    },
    updated: (rel) => `updated ${rel}`,
    arrives: "Arrives",
    arrivingToday: ["Arriving", "today"],
    onItsWay: ["On its", "way"],
    preTitle: ["Getting", "ready to ship"],
    preSub: (c) => `Your label is ready. You'll see updates once ${c} scans your package.`,
    estimated: (d) => `Estimated delivery: ${d}`,
    outSub: "Your package is on the delivery truck.",
    deliveredTitle: "It's here!",
    deliveredSub: (d) => `Delivered ${d}`,
    attentionTitle: ["Needs", "attention"],
    attentionSub: (c) => `${c} reported a delivery problem. Message us and we'll sort it out with you.`,
    returnedTitle: ["Returned", "to sender"],
    returnedSub: "This package is on its way back to the boutique. Message us and we'll help.",
    trackingLabel: "Tracking number",
    copy: "Copy tracking number",
    copied: "Tracking number copied!",
    linkCopied: "Link copied!",
    shipped: "Shipped",
    eta: "Est. delivery",
    lastScan: "Last scan",
    updates: "Updates",
    scans: (n) => (n === 1 ? "1 scan" : `${n} scans`),
    history: "Full tracking history",
    latest: "Latest",
    noHistory: (c) => `${c} hasn't scanned your package yet. Check back a little later.`,
    questions: "Questions?",
    viewOn: (c) => `Open in ${c}`,
    share: "Share",
    help: "Help",
    celebrate: "Celebrate again",
    shareText: "Track my Erendira's Boutique order",
    you: "You",
    yourDoor: "Your door",
    boutique: "Boutique",
    thanksTitle: "Thank you for shopping with us!",
    thanksBody: "We hope you love it. If anything's not right, we're here to help.",
    shopNew: "Shop new arrivals",
    startReturn: "Start a return",
    notAvailable: "Not available",
    footer: { home: "Home", shop: "Shop", gallery: "Gallery", returns: "Returns", contact: "Contact" },
    langName: "English"
  }
};

/* ------------------------------------------------------------------ */
/* Carrier scan messages → friendly text                               */
/* ------------------------------------------------------------------ */

// Ordered: the first pattern that matches wins.
const SCAN_PHRASES = [
  [/delivered.*(mailbox|in\/at mail)/, "Entregado en el buzón", "Delivered to mailbox"],
  [/delivered.*(front door|porch)/, "Entregado en la puerta", "Delivered to front door"],
  [/delivered.*parcel locker/, "Entregado en el casillero de paquetes", "Delivered to parcel locker"],
  [/delivered.*(individual|person)/, "Entregado a una persona", "Delivered to a person"],
  [/delivered.*(garage|side door|back door)/, "Entregado en la casa", "Delivered at the home"],
  [/delivered/, "Entregado", null],
  [/out for delivery/, "En reparto", null],
  [/available for pick ?up|ready for pick ?up/, "Disponible para recoger", null],
  [/(delivery attempt|attempted|notice left|no access)/, "Intento de entrega", null],
  [/return(ed|ing)? to sender/, "Devuelto al remitente", null],
  [/(insufficient address|undeliverable|addressee unknown|no such number)/, "Problema con la dirección", null],
  [/forward/, "Reenviado a otra dirección", null],
  [/(arriv\w*).*(post office)/, "Llegó a la oficina de correos", null],
  [/(arriv\w*).*(regional|distribution|facility|hub|network|sort)/, "Llegó a una instalación", null],
  [/(depart\w*|left).*(post office)/, "Salió de la oficina de correos", null],
  [/(depart\w*|left)/, "Salió de una instalación", null],
  [/(arriv\w*)/, "Llegó a una instalación", null],
  [/(processed|processing)/, "Procesado en una instalación", null],
  [/(in transit|on its way|moving through|en route)/, "En camino a la siguiente instalación", null],
  [/(accepted|in possession|picked up|acceptance|origin)/, "La paquetería recibió tu paquete", null],
  [/(label created|pre.?shipment|awaiting item|shipping label|electronic)/, "Etiqueta de envío creada", null],
  [/(delay|exception|alert|held|hold)/, "Retraso en la entrega", null]
];

const STATE_CODES = new Set(
  "AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA PR RI SC SD TN TX UT VT VA WA WV WI WY US".split(
    " "
  )
);
const KEEP_UPPER = new Set(["USPS", "UPS", "NDC", "P&DC", "ISC", "PO"]);

function smartCase(value) {
  const s = String(value || "").trim();
  if (!s) return "";
  // Only reshape text the carrier sent in ALL CAPS.
  if (s !== s.toUpperCase()) return s;
  return s
    .toLowerCase()
    .split(/(\s+|,|\/|-)/)
    .map((w) => {
      const up = w.toUpperCase();
      if (KEEP_UPPER.has(up) || STATE_CODES.has(up)) return up;
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join("");
}

function eventText(event, lang) {
  const raw = event?.status_details || event?.status || "";
  const key = String(raw).toLowerCase();
  for (const [re, es, en] of SCAN_PHRASES) {
    if (re.test(key)) {
      if (lang === "es") return es;
      return en || smartCase(raw);
    }
  }
  if (!raw) return lang === "es" ? "Actualización del envío" : "Shipment update";
  return smartCase(raw);
}

function placeOf(location) {
  if (!location) return "";
  const city = smartCase(location.city || "");
  const state = String(location.state || "").toUpperCase();
  const cityHasState = state && new RegExp(`\\b${state}\\b`).test(city);
  return [city, cityHasState ? "" : state].filter(Boolean).join(", ");
}

function shortPlace(location) {
  if (!location) return "";
  let city = smartCase(location.city || "");
  city = city
    .replace(
      /\s+(network distribution center|distribution center|processing (and|&) distribution (center|facility)|p&dc|ndc|regional facility|post office|facility|hub)\b.*$/i,
      ""
    )
    .replace(/\s+[A-Z]{2}$/, "")
    .trim();
  const state = String(location.state || "").toUpperCase();
  return [city, state].filter(Boolean).join(", ");
}

/* ------------------------------------------------------------------ */
/* Shipment state                                                      */
/* ------------------------------------------------------------------ */

function guessCarrier(trackingNumber) {
  const n = String(trackingNumber || "").trim().toUpperCase();
  if (/^1Z[A-Z0-9]{16}$/.test(n)) return "ups";
  if (/^(94|93|92|95|96)\d{18,26}$/.test(n)) return "usps";
  if (/^\d{12}$/.test(n) || /^\d{15}$/.test(n) || /^\d{20}$/.test(n) || /^\d{22}$/.test(n)) return "fedex";
  return "usps";
}

function cleanTracking(value) {
  return String(value || "").replace(/[\s-]+/g, "").trim();
}

function prettyTracking(value) {
  const n = cleanTracking(value);
  if (/^\d{20,}$/.test(n)) return n.replace(/(\d{4})(?=\d)/g, "$1 ");
  return n;
}

function eventStep(event) {
  const status = String(event?.status || "").toUpperCase();
  const details = String(event?.status_details || "").toLowerCase();
  const sub = String(event?.substatus?.code || "").toLowerCase();
  if (status === "DELIVERED") return 3;
  if (sub === "out_for_delivery" || /out for delivery/.test(details)) return 2;
  if (status === "TRANSIT" || status === "RETURNED" || status === "FAILURE") return 1;
  return 0;
}

function shipmentState(data) {
  const ts = data?.tracking_status || {};
  const status = String(ts.status || "").toUpperCase();
  const details = String(ts.status_details || "").toLowerCase();
  const sub = String(ts.substatus?.code || "").toLowerCase();
  const history = data?.tracking_history || [];

  if (!status || (status === "UNKNOWN" && history.length === 0)) return "notfound";
  if (status === "DELIVERED") return "delivered";
  if (status === "RETURNED" || sub.startsWith("return")) return "returned";
  if (status === "FAILURE") return "attention";
  if (sub === "out_for_delivery" || /out for delivery/.test(details)) return "out";
  if (status === "TRANSIT") return "transit";
  if (status === "PRE_TRANSIT") return "pre";
  return history.length > 1 ? "transit" : "pre";
}

const STEP_OF_STATE = { pre: 0, transit: 1, out: 2, delivered: 3, attention: 1, returned: 1 };
const ROUTE_PROGRESS = { pre: 0, transit: 0.5, out: 0.8, delivered: 1, attention: 0.5, returned: 0.5 };

/* ------------------------------------------------------------------ */
/* Dates                                                               */
/* ------------------------------------------------------------------ */

function toDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function fmtDay(value, t) {
  const d = toDate(value);
  if (!d) return "";
  return d.toLocaleDateString(t.locale, { weekday: "short", month: "short", day: "numeric" });
}

function fmtShortDay(value, t) {
  const d = toDate(value);
  if (!d) return "";
  return d.toLocaleDateString(t.locale, { month: "short", day: "numeric" });
}

function fmtTime(value, t) {
  const d = toDate(value);
  if (!d) return "";
  return d.toLocaleTimeString(t.locale, { hour: "numeric", minute: "2-digit" });
}

function fmtDayTime(value, t) {
  const day = fmtDay(value, t);
  const time = fmtTime(value, t);
  return [day, time].filter(Boolean).join(" · ");
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function isToday(value) {
  const d = toDate(value);
  if (!d) return false;
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

function relativeTime(value, t) {
  const d = toDate(value);
  if (!d) return "";
  const seconds = Math.round((d.getTime() - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(t.locale, { numeric: "auto", style: "short" });
  const abs = Math.abs(seconds);
  if (abs < 3600) return rtf.format(Math.round(seconds / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(seconds / 3600), "hour");
  return rtf.format(Math.round(seconds / 86400), "day");
}

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    try {
      const el = document.createElement("textarea");
      el.value = value;
      el.setAttribute("readonly", "");
      el.style.position = "absolute";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(el);
      return ok;
    } catch {
      return false;
    }
  }
}

function Icon({ name, size = 20 }) {
  const paths = {
    copy: (
      <>
        <rect x="9" y="9" width="12" height="12" rx="2" />
        <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
      </>
    ),
    truck: (
      <>
        <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
        <circle cx="7" cy="17.5" r="1.5" />
        <circle cx="17" cy="17.5" r="1.5" />
      </>
    ),
    check: <path d="m5 12 5 5L20 7" />,
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
    alert: (
      <>
        <path d="M12 9v4M12 17h.01" />
        <path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      </>
    ),
    back: <path d="M15 18l-6-6 6-6" />,
    arrow: <path d="M7 17 17 7M8 7h9v9" />
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

const CONFETTI_COLORS = ["#4A3F33", "#957F67", "#CFBDA9", "#E3D8C9", "#FFFFFF", "#C9A66B"];

function Confetti({ burst }) {
  const pieces = useMemo(() => {
    let seed = 11;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    return Array.from({ length: 90 }, (_, i) => {
      const strip = rnd() > 0.55;
      return {
        id: i,
        left: `${Math.round(rnd() * 100)}%`,
        width: strip ? 6 : Math.round(8 + rnd() * 6),
        height: strip ? Math.round(14 + rnd() * 8) : Math.round(8 + rnd() * 6),
        radius: rnd() > 0.6 ? "50%" : "2px",
        color: CONFETTI_COLORS[Math.floor(rnd() * CONFETTI_COLORS.length)],
        drift: `${Math.round((rnd() - 0.5) * 200)}px`,
        spin: `${Math.round(360 + rnd() * 720)}deg`,
        duration: `${(2.8 + rnd() * 2.2).toFixed(2)}s`,
        delay: `${(rnd() * 1).toFixed(2)}s`
      };
    });
  }, []);

  if (!burst) return null;

  return (
    <div className="eb-confetti" aria-hidden="true" key={burst}>
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            left: p.left,
            width: p.width,
            height: p.height,
            borderRadius: p.radius,
            background: p.color,
            "--drift": p.drift,
            "--spin": p.spin,
            animationDuration: p.duration,
            animationDelay: p.delay
          }}
        />
      ))}
    </div>
  );
}

const ROUTE_PATH = "M58 250 C 110 220, 140 150, 196 140 S 300 130, 332 80";
const VIEW_W = 390;
const VIEW_H = 300;

function RouteMap({ progress, currentLabel, endLabel, t, showMarker, delivered }) {
  const pathRef = useRef(null);
  const [point, setPoint] = useState(null);

  const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
  useIsoLayoutEffect(() => {
    const path = pathRef.current;
    if (!path || typeof path.getTotalLength !== "function") return;
    const len = path.getTotalLength();
    const p = path.getPointAtLength(len * Math.min(Math.max(progress, 0), 1));
    setPoint({ x: p.x, y: p.y });
  }, [progress]);

  const pct = (x, y) => ({ left: `${(x / VIEW_W) * 100}%`, top: `${(y / VIEW_H) * 100}%` });
  const atStart = progress <= 0.001;

  return (
    <div className="eb-map" aria-hidden="true">
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet">
        <path d="M-20 220 Q120 170 200 200 T420 160" className="eb-map-road eb-map-road--wide" />
        <path d="M60 300 L140 60" className="eb-map-road" />
        <path d="M270 320 L330 40" className="eb-map-road eb-map-road--thin" />
        <path d="M-20 90 Q90 110 180 70 T420 40" className="eb-map-road eb-map-road--thin" />
        <path ref={pathRef} d={ROUTE_PATH} className="eb-map-route-todo" />
        <path
          d={ROUTE_PATH}
          className="eb-map-route-done"
          pathLength="100"
          strokeDasharray={`${Math.max(progress, 0) * 100} 100`}
        />
        <circle cx="58" cy="250" r="9" className="eb-map-start" />
        {delivered ? (
          <>
            <circle cx="332" cy="80" r="34" className="eb-map-halo" />
            <circle cx="332" cy="80" r="24" className="eb-map-end-done" />
            <path d="m322 80 7 7 13-14" className="eb-map-check" />
          </>
        ) : (
          <circle cx="332" cy="80" r="10" className="eb-map-end" />
        )}
        {showMarker && point && !delivered && !atStart && (
          <>
            <circle cx={point.x} cy={point.y} r="30" className="eb-map-halo" />
            <circle cx={point.x} cy={point.y} r="22" className="eb-map-marker" />
          </>
        )}
      </svg>

      {showMarker && point && !delivered && !atStart && (
        <span className="eb-map-truck" style={pct(point.x, point.y)}>
          <Icon name="truck" size={18} />
        </span>
      )}
      {showMarker && point && !delivered && !atStart && currentLabel && (
        <span className="eb-map-tag eb-map-tag--dark" style={pct(point.x, point.y + 40)}>
          {currentLabel}
        </span>
      )}

      <span className="eb-map-tag" style={{ ...pct(74, 250), transform: "translate(0, -50%)" }}>
        {t.boutique}
      </span>
      <span
        className={`eb-map-tag ${delivered ? "eb-map-tag--dark" : ""}`}
        style={{ ...pct(332, delivered ? 122 : 108), transform: "translate(-60%, 0)" }}
      >
        {endLabel}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export default function Tracker({ initialTracking = "", initialLang = "es" }) {
  const [lang, setLang] = useState(initialLang === "en" ? "en" : "es");
  const [input, setInput] = useState(prettyTracking(initialTracking));
  const [carrier, setCarrier] = useState("auto");
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(Boolean(cleanTracking(initialTracking)));
  const [toast, setToast] = useState("");
  const [burst, setBurst] = useState(0);
  const autoTracked = useRef(false);
  const toastTimer = useRef(null);

  const t = T[lang];

  /* Language: ?lang= wins, then the visitor's own choice, then Spanish. */
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (fromUrl === "en" || fromUrl === "es") {
      setLang(fromUrl);
      return;
    }
    try {
      const saved = window.localStorage.getItem(LANG_KEY);
      if (saved === "en" || saved === "es") setLang(saved);
    } catch {
      /* storage blocked: stay in Spanish */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function chooseLang(next) {
    setLang(next);
    try {
      window.localStorage.setItem(LANG_KEY, next);
    } catch {
      /* ignore */
    }
  }

  /* Auto-search from /<tracking> or ?tracking= */
  useEffect(() => {
    if (autoTracked.current) return;
    let fromUrl = cleanTracking(initialTracking);
    if (!fromUrl) fromUrl = cleanTracking(new URLSearchParams(window.location.search).get("tracking"));
    if (!fromUrl) return;
    autoTracked.current = true;
    setInput(prettyTracking(fromUrl));
    trackPackage(fromUrl, "auto", { updateUrl: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTracking]);

  const state = result ? shipmentState(result) : null;

  /* Confetti once each time a delivered package is opened. */
  useEffect(() => {
    if (state !== "delivered") return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) setBurst((b) => b + 1);
  }, [state, result?.tracking_number]);

  useEffect(() => {
    if (!burst) return;
    const timer = setTimeout(() => setBurst(0), 6500);
    return () => clearTimeout(timer);
  }, [burst]);

  function showToast(message) {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2400);
  }

  async function trackPackage(number = input, carrierToUse = carrier, { updateUrl = true } = {}) {
    const clean = cleanTracking(number);
    if (!clean) return;

    setLoading(true);
    setResult(null);
    setNotFound(false);
    setBurst(0);

    try {
      const response = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carrier: carrierToUse, trackingNumber: clean })
      });
      const data = await response.json().catch(() => null);

      if (!response.ok || !data || shipmentState(data) === "notfound") {
        setNotFound(true);
      } else {
        setResult(data);
        if (updateUrl && window.location.pathname !== `/${clean}`) {
          window.history.replaceState(null, "", `/${encodeURIComponent(clean)}${window.location.search}`);
        }
      }
    } catch {
      setNotFound(true);
    }

    setLoading(false);
  }

  function resetSearch() {
    setResult(null);
    setNotFound(false);
    setInput("");
    setBurst(0);
    window.history.replaceState(null, "", `/${window.location.search}`);
  }

  /* Derived values for the result screen */
  const trackingNumber = cleanTracking(result?.tracking_number || input);
  const carrierKey = String(result?.carrier || (carrier === "auto" ? guessCarrier(trackingNumber) : carrier)).toLowerCase();
  const carrierInfo = CARRIERS[carrierKey] || { name: carrierKey.toUpperCase() || "—", logo: null, url: () => null };
  const carrierUrl = carrierInfo.url(trackingNumber);
  const history = result?.tracking_history || [];
  const newestFirst = [...history].reverse();
  const ts = result?.tracking_status || {};
  const lastScanDate = ts.status_date || history[history.length - 1]?.status_date;
  const service = result?.servicelevel?.name || "";
  const eta = result?.eta || result?.original_eta || null;
  const stepIndex = state ? STEP_OF_STATE[state] ?? 0 : 0;

  const stepDates = useMemo(() => {
    const dates = [null, null, null, null];
    for (const ev of history) {
      const s = eventStep(ev);
      const d = ev.status_date || ev.object_created;
      if (s === 0 && !dates[0]) dates[0] = d;
      if (s >= 1 && !dates[1]) dates[1] = d;
      if (s >= 2 && !dates[2]) dates[2] = d;
      if (s === 3) dates[3] = d;
    }
    if (!dates[0]) dates[0] = dates[1];
    return dates;
  }, [history]);

  const shippedDate = stepDates[1] || stepDates[0];

  async function handleCopy() {
    if (await copyText(trackingNumber)) showToast(t.copied);
  }

  async function handleShare() {
    const url = `${window.location.origin}/${encodeURIComponent(trackingNumber)}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Erendira's Boutique", text: t.shareText, url });
        return;
      } catch (err) {
        if (err?.name === "AbortError") return;
      }
    }
    if (await copyText(url)) showToast(t.linkCopied);
  }

  /* ---------------------------------------------------------------- */

  const view = loading ? "loading" : result ? "result" : notFound ? "notfound" : "search";

  let headline = null;
  let subline = "";
  if (view === "result") {
    if (state === "delivered") {
      headline = [t.deliveredTitle];
      const detail = eventText(ts, lang);
      const where = placeOf(ts.location);
      subline = [
        detail && detail !== t.pill.delivered ? detail : t.pill.delivered,
        fmtDayTime(ts.status_date, t),
        where
      ]
        .filter(Boolean)
        .join(" · ");
    } else if (state === "out") {
      headline = t.arrivingToday;
      subline = t.outSub;
    } else if (state === "attention") {
      headline = t.attentionTitle;
      subline = t.attentionSub(carrierInfo.name);
    } else if (state === "returned") {
      headline = t.returnedTitle;
      subline = t.returnedSub;
    } else if (state === "pre") {
      headline = t.preTitle;
      subline = t.preSub(carrierInfo.name);
    } else if (eta) {
      headline = isToday(eta) ? t.arrivingToday : [t.arrives, capitalize(fmtDay(eta, t))];
      subline = t.estimated(fmtDayTime(eta, t));
    } else {
      headline = t.onItsWay;
      subline = eventText(ts, lang);
    }
  }

  const mapProgress = view === "result" ? ROUTE_PROGRESS[state] ?? 0 : 0;
  const currentLabel = view === "result" ? shortPlace(ts.location) : "";
  const endLabel = view === "result" && state === "delivered" ? t.yourDoor : t.you;

  const actions = (variant) => (
    <>
      {state === "delivered" ? (
        <button type="button" className={`${variant}-main`} onClick={() => setBurst((b) => b + 1)}>
          {t.celebrate}
        </button>
      ) : carrierUrl ? (
        <a className={`${variant}-main`} href={carrierUrl} target="_blank" rel="noopener noreferrer">
          {t.viewOn(carrierInfo.name)} →
        </a>
      ) : (
        <button type="button" className={`${variant}-main`} onClick={handleCopy}>
          {t.copy}
        </button>
      )}
      <button type="button" onClick={handleShare}>
        {t.share}
      </button>
      <a href={LINKS.help} target="_blank" rel="noopener noreferrer">
        {t.help}
      </a>
    </>
  );

  return (
    <div className={`eb-page eb-view-${view}`}>
      <Confetti burst={burst} />

      <div className="eb-app">
        <header className="eb-header">
          <a
            href="/"
            className="eb-logo"
            onClick={(e) => {
              if (view !== "search") {
                e.preventDefault();
                resetSearch();
              }
            }}
          >
            <img src={BRAND_LOGO} alt="Erendira's Boutique" width="900" height="420" />
          </a>
          <div className="eb-header-right">
            <nav className="eb-header-nav" aria-label="Erendira's Boutique">
              <a href={LINKS.shop} target="_blank" rel="noopener noreferrer">{t.footer.shop}</a>
              <a href={LINKS.returns} target="_blank" rel="noopener noreferrer">{t.footer.returns}</a>
              <a href={LINKS.contact} target="_blank" rel="noopener noreferrer">{t.footer.contact}</a>
            </nav>
            <div className="eb-lang" role="group" aria-label="Idioma / Language">
              <button type="button" aria-pressed={lang === "es"} onClick={() => chooseLang("es")} lang="es">
                ES
              </button>
              <button type="button" aria-pressed={lang === "en"} onClick={() => chooseLang("en")} lang="en">
                EN
              </button>
            </div>
          </div>
        </header>

        <div className="eb-layout">
          {/* Left on desktop: map + the headline. On phones: map, then the top of the sheet. */}
          <section className="eb-hero">
            <div className="eb-map-frame">
              <RouteMap
                progress={mapProgress}
                currentLabel={currentLabel}
                endLabel={endLabel}
                t={t}
                showMarker={view === "result"}
                delivered={view === "result" && state === "delivered"}
              />
            </div>

            <div className="eb-summary">
              <span className="eb-handle" aria-hidden="true" />

              {view === "search" && (
                <div>
                  <h1 className="eb-h1">
                    {t.searchTitle.map((line, i) => (
                      <span key={i} className="eb-h1-line">
                        {line}
                      </span>
                    ))}
                  </h1>
                  <p className="eb-muted eb-subline">{t.searchSub}</p>
                </div>
              )}

              {view === "loading" && (
                <div className="eb-loading" role="status" aria-live="polite">
                  <p className="eb-kicker">{t.loading}</p>
                  <div className="eb-skel eb-skel--title" />
                  <div className="eb-skel eb-skel--line" />
                  <div className="eb-skel-row">
                    <div className="eb-skel eb-skel--tile" />
                    <div className="eb-skel eb-skel--tile" />
                    <div className="eb-skel eb-skel--tile" />
                    <div className="eb-skel eb-skel--tile" />
                  </div>
                </div>
              )}

              {view === "notfound" && (
                <div className="eb-notfound" role="alert">
                  <span className="eb-notfound-icon">
                    <Icon name="search" size={22} />
                  </span>
                  <h1 className="eb-h1 eb-h1--sm">{t.notFoundTitle}</h1>
                  <p className="eb-muted">{t.notFoundBody}</p>
                </div>
              )}

              {view === "result" && (
                <>
                  <div className="eb-status" aria-live="polite">
                    <p className="eb-kicker">
                      <span className={`eb-dot ${state === "attention" ? "eb-dot--alert" : ""}`} />
                      {t.pill[state]}
                      {lastScanDate && state !== "delivered" ? ` · ${t.updated(relativeTime(lastScanDate, t))}` : ""}
                    </p>
                    <h1 className={`eb-h1 ${state === "delivered" ? "eb-pop" : ""}`}>
                      {headline.map((line, i) => (
                        <span key={i} className="eb-h1-line">
                          {line}
                        </span>
                      ))}
                    </h1>
                    {subline && <p className="eb-muted eb-subline">{subline}</p>}
                  </div>

                  <ol className="eb-steps" aria-label={t.history}>
                    {t.steps.map((label, i) => {
                      const done = i < stepIndex || (i === 3 && state === "delivered");
                      const current = i === stepIndex && state !== "delivered";
                      let small = "";
                      if (done)
                        small =
                          i === 3
                            ? fmtTime(stepDates[3], t)
                            : fmtShortDay(i === 0 ? shippedDate : stepDates[i] || shippedDate, t);
                      else if (current) small = t.now;
                      else if (i === 3 && eta) small = fmtShortDay(eta, t);
                      else small = t.next;
                      return (
                        <li
                          key={label}
                          className={`eb-step ${done ? "is-done" : ""} ${current ? "is-current" : ""}`}
                          aria-current={current ? "step" : undefined}
                        >
                          <span className="eb-step-small">{small || "—"}</span>
                          <span className="eb-step-label">{i === 0 && state === "pre" ? t.pill.pre : label}</span>
                        </li>
                      );
                    })}
                  </ol>

                  {(state === "attention" || state === "returned") && (
                    <a className="eb-alert" href={LINKS.help} target="_blank" rel="noopener noreferrer">
                      <Icon name="alert" />
                      <span>
                        <strong>{eventText(ts, lang)}</strong>
                        <span>help.erendirasboutique.com</span>
                      </span>
                    </a>
                  )}

                  <div className="eb-actions">{actions("eb-actions")}</div>
                </>
              )}
            </div>
          </section>

          {/* Right on desktop: details. On phones: the rest of the sheet. */}
          <main className="eb-sheet">
            {view === "search" && (
              <SearchForm
                t={t}
                input={input}
                setInput={setInput}
                carrier={carrier}
                setCarrier={setCarrier}
                onSubmit={() => trackPackage()}
                loading={loading}
              />
            )}

            {view === "loading" && (
              <div className="eb-loading" aria-hidden="true">
                <div className="eb-skel eb-skel--card" />
                <div className="eb-skel eb-skel--line" />
                <div className="eb-skel eb-skel--card eb-skel--short" />
              </div>
            )}

            {view === "notfound" && (
              <SearchForm
                t={t}
                input={input}
                setInput={setInput}
                carrier={carrier}
                setCarrier={setCarrier}
                onSubmit={() => trackPackage()}
                loading={loading}
                buttonLabel={t.tryAgain}
                compact
              />
            )}

            {view === "result" && (
              <>
                {state === "delivered" && (
                  <section className="eb-thanks">
                    <h2>{t.thanksTitle}</h2>
                    <p>{t.thanksBody}</p>
                    <div className="eb-thanks-actions">
                      <a className="eb-btn eb-btn--dark" href={LINKS.shop} target="_blank" rel="noopener noreferrer">
                        {t.shopNew}
                      </a>
                      <a className="eb-btn eb-btn--outline" href={LINKS.returns} target="_blank" rel="noopener noreferrer">
                        {t.startReturn}
                      </a>
                    </div>
                  </section>
                )}

                <section className="eb-card">
                  <div className="eb-card-head">
                    <div className="eb-carrier-logo">
                      {carrierInfo.logo ? <img src={carrierInfo.logo} alt="" /> : <span>{carrierInfo.name}</span>}
                    </div>
                    <div className="eb-carrier-text">
                      <strong>{carrierInfo.name}</strong>
                      {service && <span>{service}</span>}
                    </div>
                    {carrierUrl && (
                      <a className="eb-carrier-link" href={carrierUrl} target="_blank" rel="noopener noreferrer">
                        {t.viewOn(carrierInfo.name)}
                        <Icon name="arrow" size={16} />
                      </a>
                    )}
                  </div>
                  <div className="eb-card-tracking">
                    <span className="eb-label">{t.trackingLabel}</span>
                    <div className="eb-tracking-row">
                      <span className="eb-tracking-number">{prettyTracking(trackingNumber)}</span>
                      <button type="button" className="eb-icon-btn" onClick={handleCopy} aria-label={t.copy} title={t.copy}>
                        <Icon name="copy" size={18} />
                      </button>
                    </div>
                  </div>
                  <dl className="eb-facts">
                    <div>
                      <dt>{t.shipped}</dt>
                      <dd>{fmtDay(shippedDate, t) || t.notAvailable}</dd>
                    </div>
                    <div>
                      <dt>{state === "delivered" ? t.pill.delivered : t.eta}</dt>
                      <dd>
                        {state === "delivered"
                          ? fmtDay(ts.status_date, t) || t.notAvailable
                          : eta
                            ? fmtDayTime(eta, t)
                            : t.notAvailable}
                      </dd>
                    </div>
                    <div>
                      <dt>{t.lastScan}</dt>
                      <dd>{lastScanDate ? `${fmtShortDay(lastScanDate, t)}, ${fmtTime(lastScanDate, t)}` : t.notAvailable}</dd>
                    </div>
                    <div>
                      <dt>{t.updates}</dt>
                      <dd>{t.scans(history.length)}</dd>
                    </div>
                  </dl>
                </section>

                <section className="eb-history">
                  <h2>{t.history}</h2>
                  {newestFirst.length === 0 ? (
                    <p className="eb-muted">{t.noHistory(carrierInfo.name)}</p>
                  ) : (
                    <ol>
                      {newestFirst.map((ev, i) => {
                        const where = placeOf(ev.location);
                        const when = ev.status_date || ev.object_created;
                        return (
                          <li key={ev.object_id || `${when}-${i}`} className={i === 0 ? "is-latest" : ""}>
                            <span className="eb-history-dot" aria-hidden="true" />
                            <div className="eb-history-text">
                              <strong>{eventText(ev, lang)}</strong>
                              {where && <span>{where}</span>}
                            </div>
                            <time className="eb-history-time" dateTime={when || undefined}>
                              {fmtShortDay(when, t)}
                              <br />
                              {fmtTime(when, t)}
                            </time>
                          </li>
                        );
                      })}
                    </ol>
                  )}
                </section>

                <button type="button" className="eb-link-btn" onClick={resetSearch}>
                  <Icon name="back" size={18} />
                  {t.trackAnother}
                </button>
              </>
            )}
          </main>
        </div>

        <footer className="eb-footer">
          <p>
            <strong>{t.shipsSaturday}</strong> · {t.questions}{" "}
            <a href={LINKS.help} target="_blank" rel="noopener noreferrer">
              help.erendirasboutique.com
            </a>
          </p>
          <nav>
            <a href={LINKS.home} target="_blank" rel="noopener noreferrer">{t.footer.home}</a>
            <a href={LINKS.shop} target="_blank" rel="noopener noreferrer">{t.footer.shop}</a>
            <a href={LINKS.gallery} target="_blank" rel="noopener noreferrer">{t.footer.gallery}</a>
            <a href={LINKS.returns} target="_blank" rel="noopener noreferrer">{t.footer.returns}</a>
            <a href={LINKS.contact} target="_blank" rel="noopener noreferrer">{t.footer.contact}</a>
          </nav>
          <small>© {new Date().getFullYear()} Erendira&apos;s Boutique</small>
        </footer>
      </div>

      {view === "result" && <div className="eb-bar">{actions("eb-bar")}</div>}

      <div className={`eb-toast ${toast ? "is-on" : ""}`} role="status" aria-live="polite">
        {toast}
      </div>
    </div>
  );
}


function SearchForm({ t, input, setInput, carrier, setCarrier, onSubmit, loading, title, sub, buttonLabel, compact }) {
  const options = [
    { value: "auto", label: t.auto },
    { value: "usps", label: "USPS" },
    { value: "ups", label: "UPS" },
    { value: "fedex", label: "FedEx" }
  ];
  return (
    <form
      className={`eb-search ${compact ? "eb-search--compact" : ""}`}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      {title && (
        <div>
          <h1 className="eb-h1">
            {title.map((line, i) => (
              <span key={i} className="eb-h1-line">
                {line}
              </span>
            ))}
          </h1>
          {sub && <p className="eb-muted eb-subline">{sub}</p>}
        </div>
      )}

      <label className="eb-field">
        <span className="eb-label">{t.trackingNumber}</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.placeholder}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          enterKeyHint="search"
          inputMode="text"
        />
      </label>

      <fieldset className="eb-chips">
        <legend className="eb-label">{t.carrier}</legend>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={carrier === o.value}
            onClick={() => setCarrier(o.value)}
          >
            {o.label}
          </button>
        ))}
      </fieldset>

      <button type="submit" className="eb-btn eb-btn--dark eb-btn--big" disabled={!cleanTracking(input) || loading}>
        <Icon name="search" size={20} />
        {loading ? t.searching : buttonLabel || t.track}
      </button>

      {!compact && <p className="eb-note">{t.searchNote}</p>}
    </form>
  );
}
