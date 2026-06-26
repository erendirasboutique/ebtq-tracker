"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const carriers = [
  { label: "Auto detect", esLabel: "Detectar automáticamente", value: "auto" },
  { label: "USPS", esLabel: "USPS", value: "usps" },
  { label: "UPS", esLabel: "UPS", value: "ups" },
  { label: "FedEx", esLabel: "FedEx", value: "fedex" }
];

const progressSteps = [
  { en: "Order shipped", es: "Pedido enviado" },
  { en: "In transit", es: "En tránsito" },
  { en: "Out for delivery", es: "En reparto" },
  { en: "Delivered!", es: "Entregado!" }
];

const text = {
  en: {
    navPill: "Order tracking",
    eyebrow: "Erendira's Boutique",
    heroTitle: "Track your order with ease.",
    heroText: "Enter your tracking number below to see the latest shipping updates from your carrier.",
    lookup: "Shipment lookup",
    where: "Where is my package?",
    carrier: "Carrier",
    trackingNumber: "Tracking number",
    placeholder: "Enter your tracking number",
    selectedCarrier: "Carrier selected",
    button: "Track my order",
    loading: "Checking...",
    note: "Tracking may take a little time to appear after your package has shipped.",
    directNote: "If you have any problems please contact us at help.erendirasboutique.com",
    errorTitle: "We could not find that tracking number, please double-check your info",
    errorSmall: "Please check the tracking number and carrier. If your order just shipped, try again later after the carrier updates their system.",
    currentStatus: "Current status",
    deliveryProgress: "Delivery progress",
    complete: "complete",
    deliveredMessage: "Your package has been delivered. Thank you for shopping with Erendira's Boutique!",
    summaryCarrier: "Carrier",
    summaryTracking: "Tracking number",
    eta: "Estimated delivery",
    updated: "Last updated",
    timeline: "Shipping timeline",
    timelineSub: "Latest updates from the carrier.",
    emptyTimeline: "No tracking history has been returned yet.",
    footer: "Thank you for shopping with Erendira's Boutique.",
    notAvailable: "Not available",
    locationUnavailable: "Location not available",
  },
  es: {
    navPill: "Seguimiento de pedido",
    eyebrow: "Erendira's Boutique",
    heroTitle: "Rastrea tu pedido",
    heroText: "Ingresa tu número de rastreo para ver las actualizaciones más recientes de tu envío.",
    lookup: "Buscar envío",
    where: "Dónde está mi paquete?",
    carrier: "Transportista",
    trackingNumber: "Número de rastreo",
    placeholder: "Ingresa tu número de rastreo",
    selectedCarrier: "Transportista seleccionado",
    button: "Rastrear mi pedido",
    loading: "Buscando...",
    note: "El rastreo puede tardar un poco en aparecer después de que tu paquete sea enviado.",
    directNote: "Si tiene algún problema, por favor contáctenos en help.erendirasboutique.com",
    errorTitle: "No pudimos encontrar ese rastreo todavía.",
    errorSmall: "Revisa el número de rastreo y el transportista. Si tu pedido acaba de ser enviado, intenta de nuevo más tarde.",
    currentStatus: "Estado actual",
    deliveryProgress: "Progreso de entrega",
    complete: "completo",
    deliveredMessage: "Tu paquete ha sido entregado. Gracias por comprar en Erendira's Boutique!",
    summaryCarrier: "Transportista",
    summaryTracking: "Número de rastreo",
    eta: "Entrega estimada",
    updated: "Última actualización",
    timeline: "Historial del envío",
    timelineSub: "Actualizaciones más recientes del transportista.",
    emptyTimeline: "Todavía no hay historial de rastreo disponible.",
    footer: "Gracias por comprar en Erendira's Boutique.",
    notAvailable: "No disponible",
    locationUnavailable: "Ubicación no disponible",
  }
};

function stringifyTracking(data) {
  try {
    return JSON.stringify(data || {}).toLowerCase();
  } catch {
    return "";
  }
}

function guessCarrier(trackingNumber) {
  const n = String(trackingNumber || "").trim().toUpperCase();

  if (/^1Z[A-Z0-9]{16}$/.test(n)) return "ups";
  if (/^(94|93|92|95|96)\d{18,26}$/.test(n)) return "usps";
  if (/^\d{12}$/.test(n) || /^\d{15}$/.test(n) || /^\d{20}$/.test(n) || /^\d{22}$/.test(n)) return "fedex";

  return "usps";
}

function carrierName(value, language) {
  const match = carriers.find((c) => c.value === value);
  if (!match) return value?.toUpperCase() || (language === "es" ? "Transportista" : "Carrier");
  return language === "es" ? match.esLabel : match.label;
}

function translateStatus(status, language) {
  if (language !== "es") return status;

  const s = String(status || "").toLowerCase();

  if (s.includes("delivered")) return "Entregado";
  if (s.includes("out_for_delivery") || s.includes("out for delivery")) return "En reparto";
  if (s.includes("transit") || s.includes("in_transit")) return "En tránsito";
  if (s.includes("pre_transit") || s.includes("pre-transit") || s.includes("label")) return "Etiqueta creada";
  if (s.includes("exception") || s.includes("failure") || s.includes("failed")) return "Incidencia";
  if (s.includes("accepted")) return "Aceptado por el transportista";
  if (s.includes("arrived")) return "Llegó a una instalación";
  if (s.includes("departed")) return "Salió de una instalación";
  if (s.includes("available for pickup")) return "Disponible para recoger";

  return status;
}

function getStatusText(data, language) {
  const raw =
    data?.tracking_status?.status_details ||
    data?.tracking_status?.status ||
    data?.status ||
    (language === "es" ? "Sin estado todavía" : "No status yet");

  return translateStatus(raw, language);
}

function getStatusBadge(data, language) {
  const all = stringifyTracking(data);

  if (all.includes("delivered")) return language === "es" ? "Entregado" : "Delivered";
  if (all.includes("out_for_delivery") || all.includes("out for delivery")) return language === "es" ? "En reparto" : "Out for delivery";
  if (all.includes("transit") || all.includes("in_transit")) return language === "es" ? "En tránsito" : "In transit";
  if (all.includes("exception") || all.includes("failure") || all.includes("failed")) return language === "es" ? "Incidencia" : "Needs attention";
  if (all.includes("pre_transit") || all.includes("pre-transit") || all.includes("label")) return language === "es" ? "Etiqueta creada" : "Pre-shipment";

  return language === "es" ? "Rastreando" : "Tracking";
}

function getProgressIndex(data) {
  const all = stringifyTracking(data);

  if (all.includes("delivered") || all.includes("delivery complete")) return 3;
  if (all.includes("out_for_delivery") || all.includes("out for delivery") || all.includes("available for pickup")) return 2;
  if (all.includes("transit") || all.includes("in_transit") || all.includes("departed") || all.includes("arrived") || all.includes("accepted")) return 1;
  return 0;
}

function isDelivered(data) {
  return stringifyTracking(data).includes("delivered") || getProgressIndex(data) === 3;
}

function formatDate(value, language) {
  if (!value) return text[language].notAvailable;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString(language === "es" ? "es-US" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function Confetti({ show }) {
  if (!show) return null;

  return (
    <div className="confettiLayer" aria-hidden="true">
      {Array.from({ length: 100 }, (_, index) => (
        <span
          key={index}
          className="confettiPiece"
          style={{
            left: `${(index * 31) % 100}%`,
            animationDelay: `${(index % 12) * 0.09}s`,
            animationDuration: `${2.4 + (index % 8) * 0.16}s`
          }}
        />
      ))}
    </div>
  );
}

export default function Tracker({ initialTracking = "" }) {
  const [language, setLanguage] = useState("en");
  const [trackingNumber, setTrackingNumber] = useState(initialTracking || "");
  const [carrier, setCarrier] = useState("auto");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const hasAutoTracked = useRef(false);

  const t = text[language];

  const selectedCarrier = useMemo(() => {
    if (carrier !== "auto") return carrier;
    if (!trackingNumber.trim()) return "auto";
    return guessCarrier(trackingNumber);
  }, [carrier, trackingNumber]);

  useEffect(() => {
    const saved = window.localStorage.getItem("erendirasLanguage");

    if (saved === "en" || saved === "es") {
      setLanguage(saved);
      document.documentElement.lang = saved;
      return;
    }

    const browserLanguage = navigator.language?.toLowerCase() || "";
    if (browserLanguage.startsWith("es")) {
      setLanguage("es");
      document.documentElement.lang = "es";
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem("erendirasLanguage", language);
  }, [language]);

  useEffect(() => {
    if (hasAutoTracked.current) return;

    let trackingFromUrl = String(initialTracking || "").trim();

    if (!trackingFromUrl && typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      trackingFromUrl = String(searchParams.get("tracking") || "").trim();
    }

    if (!trackingFromUrl) return;

    hasAutoTracked.current = true;
    setTrackingNumber(trackingFromUrl);
    setCarrier("auto");
    trackPackage(trackingFromUrl, "auto");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTracking]);

  useEffect(() => {
    if (!result) return;

    if (isDelivered(result)) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  async function trackPackage(numberToTrack = trackingNumber, carrierToUse = carrier) {
    const cleanNumber = String(numberToTrack || "").trim();

    if (!cleanNumber) return;

    setLoading(true);
    setResult(null);
    setError("");
    setShowConfetti(false);

    try {
      const response = await fetch("/api/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          carrier: carrierToUse,
          trackingNumber: cleanNumber
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || data?.detail || data?.error || "Tracking failed.");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(err.message || "Request failed.");
    }

    setLoading(false);
  }

  const history = result?.tracking_history || [];
  const progressIndex = result ? getProgressIndex(result) : 0;
  const progressPercent = result ? Math.round((progressIndex / 3) * 100) : 0;

  return (
    <main className="page">
      <Confetti show={showConfetti} />

      <div className="decorFlower flowerOne">✿</div>
      <div className="decorFlower flowerTwo">✿</div>
      <div className="decorFlower flowerThree">✿</div>
      <div className="decorFlower flowerFour">✿</div>
      <div className="decorFlower flowerFive">✿</div>
      <div className="decorFlower flowerSix">✿</div>
      <div className="decorFlower flowerSeven">✿</div>

      <header className="nav">
        <a className="brand" href="/">
          <img src="/logo.png" alt="Erendira's Boutique" />
        </a>

        <div className="navActions">
          <label className="languageToggle">
            <span>🌐</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </label>

          <span className="navPill">{t.navPill}</span>
        </div>
      </header>

      <section className="hero">
        <div className="heroText">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.heroTitle}</h1>
          <p className="subtext">{t.heroText}</p>

          <div className="trustRow">
            <span>USPS</span>
            <span>UPS</span>
            <span>FedEx</span>
          </div>
        </div>

        <div className="trackerCard">
          <div className="cardHeader">
            <div>
              <p className="eyebrow smallEye">{t.lookup}</p>
              <h2>{t.where}</h2>
            </div>
            <span className="flower">✿</span>
          </div>

          <label>{t.carrier}</label>
          <select value={carrier} onChange={(event) => setCarrier(event.target.value)}>
            {carriers.map((item) => (
              <option key={item.value} value={item.value}>
                {language === "es" ? item.esLabel : item.label}
              </option>
            ))}
          </select>

          <label>{t.trackingNumber}</label>
          <input
            value={trackingNumber}
            onChange={(event) => setTrackingNumber(event.target.value)}
            placeholder={t.placeholder}
          />

          <p className="helper">
            {t.selectedCarrier}: <strong>{carrierName(selectedCarrier, language)}</strong>
          </p>

          <button onClick={() => trackPackage()} disabled={!trackingNumber.trim() || loading}>
            {loading ? t.loading : t.button}
          </button>

          <p className="note">{t.note}</p>
          <p className="note directNote">{t.directNote}</p>
        </div>
      </section>

      <section className="results">
        {error && (
          <div className="messageCard errorBox">
            <span className="flower">✿</span>
            <div>
              <h2>{t.errorTitle}</h2>
              <p>{language === "es" ? "No se pudo obtener la información de rastreo." : error}</p>
              <p className="small">{t.errorSmall}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="resultCard">
            <div className="resultTop">
              <div>
                <p className="eyebrow smallEye">{t.currentStatus}</p>
                <h2>{getStatusText(result, language)}</h2>
              </div>
              <span className="badge">{getStatusBadge(result, language)}</span>
            </div>

            <div className="deliveryProgress">
              <div className="progressHeader">
                <h3>{t.deliveryProgress}</h3>
                <p>{progressPercent}% {t.complete}</p>
              </div>

              <div className="progressTrack">
                <div className="progressFill" style={{ width: `${progressPercent}%` }} />
                {progressSteps.map((step, index) => (
                  <div
                    key={step.en}
                    className={`progressPoint ${index <= progressIndex ? "active" : ""}`}
                    style={{ left: `${(index / 3) * 100}%` }}
                  >
                    <span>{index <= progressIndex ? "✓" : ""}</span>
                  </div>
                ))}
              </div>

              <div className="progressLabels">
                {progressSteps.map((step, index) => (
                  <span key={step.en} className={index <= progressIndex ? "activeLabel" : ""}>
                    {language === "es" ? step.es : step.en}
                  </span>
                ))}
              </div>

              {isDelivered(result) && (
                <div className="deliveredMessage">
                  <span>✿</span>
                  {t.deliveredMessage}
                </div>
              )}
            </div>

            <div className="summaryGrid">
              <div>
                <span>{t.summaryCarrier}</span>
                <strong>{carrierName(result.carrier || selectedCarrier, language)}</strong>
              </div>
              <div>
                <span>{t.summaryTracking}</span>
                <strong>{result.tracking_number || trackingNumber}</strong>
              </div>
              <div>
                <span>{t.eta}</span>
                <strong>{formatDate(result.eta, language)}</strong>
              </div>
              <div>
                <span>{t.updated}</span>
                <strong>{formatDate(result.object_updated, language)}</strong>
              </div>
            </div>

            <div className="sectionTitle">
              <h3>{t.timeline}</h3>
              <p>{t.timelineSub}</p>
            </div>

            {history.length === 0 ? (
              <div className="emptyTimeline">
                <span className="flower">✿</span>
                <p>{t.emptyTimeline}</p>
              </div>
            ) : (
              <div className="timeline">
                {[...history].reverse().map((event, index) => (
                 <div className={`timelineItem ${index === 0 ? "latestEvent" : ""}`} key={event.object_id || index}>
                    <div className="dot" />
                    <div className="timelineContent">
                      <strong>{translateStatus(event.status_details || event.status || "Shipment update", language)}</strong>
                      <p>{formatDate(event.status_date || event.object_created, language)}</p>
                      <p>
                        {[event.location?.city, event.location?.state, event.location?.country]
                          .filter(Boolean)
                          .join(", ") || t.locationUnavailable}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      <footer>
        <img src="/logo.png" alt="Erendira's Boutique" />
        <p>{t.footer}</p>
      </footer>

      <style jsx>{`
        .page {
          min-height: 100vh;
          padding: 24px;
          font-family: var(--font-body), Arial, sans-serif;
          position: relative;
          overflow-x: hidden;
        }
.latestEvent .timelineContent {
  border: 2px solid var(--green);
  box-shadow: 0 12px 28px rgba(111, 153, 64, 0.16);
}

.latestEvent .timelineContent::before {
  content: "Latest update";
  display: inline-block;
  margin-bottom: 8px;
  background: rgba(111, 153, 64, 0.14);
  color: var(--green-dark);
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 900;
}
        .nav {
          max-width: 1120px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
        }

        .brand img {
          width: min(310px, 62vw);
          height: auto;
          display: block;
        }

        .navActions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .languageToggle {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid var(--border);
          border-radius: 999px;
          padding: 6px 12px;
          box-shadow: 0 8px 20px rgba(111, 153, 64, 0.08);
          margin: 0;
        }

        .languageToggle select {
          width: auto;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--green-dark);
          font-size: 14px;
          font-weight: 900;
          padding: 4px 2px;
          cursor: pointer;
        }

        .confettiTestButton {
          width: auto;
          margin: 0;
          padding: 10px 14px;
          border-radius: 999px;
          font-size: 13px;
          box-shadow: 0 8px 18px rgba(111, 153, 64, 0.16);
        }

        .navPill {
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.55);
          color: var(--green-dark);
          padding: 10px 16px;
          border-radius: 999px;
          font-weight: 800;
          box-shadow: 0 8px 20px rgba(111, 153, 64, 0.08);
        }

        .hero {
          max-width: 1120px;
          margin: 54px auto 28px;
          display: grid;
          grid-template-columns: 1.08fr 0.92fr;
          gap: 44px;
          align-items: center;
        }

        .eyebrow {
          margin: 0;
          color: var(--green);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-size: 12px;
          font-weight: 900;
        }

        h1,
        h2,
        h3 {
          font-family: var(--font-heading), Georgia, serif;
          font-weight: 400;
        }

        h1 {
          font-size: clamp(46px, 7vw, 78px);
          line-height: 1.02;
          margin: 12px 0 18px;
          color: var(--text);
        }

        .subtext {
          font-size: 19px;
          line-height: 1.7;
          color: var(--brown);
          max-width: 610px;
        }

        .trustRow {
          margin-top: 30px;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .trustRow span {
          background: rgba(255, 255, 255, 0.65);
          border: 1px solid var(--border);
          color: var(--green-dark);
          border-radius: 999px;
          padding: 10px 14px;
          font-weight: 800;
        }

        .trackerCard,
        .resultCard,
        .messageCard {
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(16px);
          border: 1px solid var(--border);
          border-radius: 30px;
          padding: 28px;
          box-shadow: 0 26px 70px rgba(111, 153, 64, 0.16);
        }

        .cardHeader,
        .resultTop,
        .messageCard {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 18px;
        }

        .trackerCard h2,
        .resultCard h2,
        .messageCard h2 {
          font-size: 34px;
          margin: 6px 0 0;
          line-height: 1.08;
        }

        .flower {
          color: var(--purple);
          font-size: 30px;
          line-height: 1;
        }

        label {
          display: block;
          margin: 18px 0 8px;
          font-weight: 900;
          color: var(--text);
        }

        input,
        select {
          width: 100%;
          padding: 15px 16px;
          border: 1px solid #e6d4c8;
          border-radius: 16px;
          font-size: 16px;
          background: #fffdfb;
          color: var(--text);
        }

        input:focus,
        select:focus {
          outline: 3px solid rgba(111, 153, 64, 0.22);
          border-color: var(--green);
        }

        .helper,
        .note,
        .small {
          color: #7d6a5e;
          font-size: 13px;
          line-height: 1.5;
        }

        .directNote {
          opacity: 0.75;
          margin-top: 4px;
        }

        button {
          width: 100%;
          margin-top: 16px;
          border: 0;
          border-radius: 18px;
          background: var(--green);
          color: white;
          padding: 16px;
          font-size: 16px;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 14px 28px rgba(111, 153, 64, 0.28);
          transition: transform 0.15s ease, filter 0.15s ease;
        }

        button:hover {
          transform: translateY(-1px);
          filter: brightness(0.96);
        }

        button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          transform: none;
        }

        .results {
          max-width: 1120px;
          margin: 0 auto;
        }

        .errorBox {
          border-left: 7px solid #b91c1c;
        }

        .badge {
          background: rgba(111, 153, 64, 0.14);
          color: var(--green-dark);
          padding: 11px 15px;
          border-radius: 999px;
          font-weight: 900;
          white-space: nowrap;
        }

        .deliveryProgress {
          margin: 28px 0;
          background: var(--cream);
          border: 1px solid rgba(111, 153, 64, 0.12);
          border-radius: 24px;
          padding: 22px;
        }

        .progressHeader {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: baseline;
          margin-bottom: 22px;
        }

        .progressHeader h3 {
          font-size: 30px;
          margin: 0;
        }

        .progressHeader p {
          margin: 0;
          color: var(--green-dark);
          font-weight: 900;
        }

        .progressTrack {
          position: relative;
          height: 10px;
          background: rgba(111, 153, 64, 0.18);
          border-radius: 999px;
          margin: 26px 10px 20px;
        }

        .progressFill {
          position: absolute;
          inset: 0 auto 0 0;
          background: linear-gradient(90deg, var(--green), #9b4fd8);
          border-radius: 999px;
          transition: width 0.9s ease;
        }

        .progressPoint {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 30px;
          height: 30px;
          border-radius: 999px;
          background: white;
          border: 3px solid rgba(111, 153, 64, 0.35);
          display: grid;
          place-items: center;
          color: white;
          font-size: 14px;
          transition: all 0.35s ease;
        }

        .progressPoint.active {
          background: var(--green);
          border-color: var(--green);
          box-shadow: 0 0 0 7px rgba(111, 153, 64, 0.14);
        }

        .progressLabels {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          font-size: 12px;
          color: #8a7466;
          font-weight: 900;
          text-align: center;
        }

        .progressLabels span:first-child {
          text-align: left;
        }

        .progressLabels span:last-child {
          text-align: right;
        }

        .activeLabel {
          color: var(--green-dark);
        }

        .deliveredMessage {
          margin-top: 22px;
          background: rgba(155, 79, 216, 0.11);
          border: 1px solid rgba(155, 79, 216, 0.16);
          color: #5f2e88;
          padding: 14px 16px;
          border-radius: 18px;
          font-weight: 900;
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .summaryGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin: 26px 0;
        }

        .summaryGrid div {
          background: var(--cream);
          border: 1px solid rgba(111, 153, 64, 0.1);
          border-radius: 18px;
          padding: 15px;
        }

        .summaryGrid span {
          display: block;
          color: #7d6a5e;
          font-size: 12px;
          margin-bottom: 6px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .summaryGrid strong {
          overflow-wrap: anywhere;
        }

        .sectionTitle h3 {
          font-size: 32px;
          margin: 0;
        }

        .sectionTitle p {
          color: var(--brown);
          margin-top: 4px;
        }

        .timeline {
          border-left: 2px solid rgba(111, 153, 64, 0.28);
          margin-left: 8px;
          padding-top: 8px;
        }

        .timelineItem {
          position: relative;
          padding: 0 0 24px 26px;
        }

        .dot {
          position: absolute;
          left: -8px;
          top: 3px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--green);
          border: 3px solid white;
        }

        .timelineContent {
          background: #fffaf6;
          border: 1px solid rgba(111, 153, 64, 0.12);
          border-radius: 18px;
          padding: 14px;
        }

        .timelineContent p {
          margin: 6px 0 0;
          color: #7d6a5e;
        }

        .emptyTimeline {
          display: flex;
          align-items: center;
          gap: 14px;
          background: var(--cream);
          border-radius: 18px;
          padding: 18px;
          color: var(--brown);
        }

        footer {
          max-width: 1120px;
          margin: 50px auto 12px;
          padding: 20px 0;
          text-align: center;
          color: var(--brown);
        }

        footer img {
          width: 190px;
          max-width: 70vw;
          display: block;
          margin: 0 auto 8px;
        }

        .decorFlower {
          position: fixed;
          z-index: 0;
          color: var(--purple);
          opacity: 0.22;
          pointer-events: none;
          user-select: none;
          filter: drop-shadow(0 8px 12px rgba(155, 79, 216, 0.14));
        }

        .flowerOne {
          top: 138px;
          left: 5vw;
          font-size: 34px;
          transform: rotate(-18deg);
        }

        .flowerTwo {
          top: 220px;
          right: 8vw;
          font-size: 28px;
          color: var(--lavender);
          transform: rotate(16deg);
        }

        .flowerThree {
          bottom: 125px;
          left: 9vw;
          font-size: 26px;
          transform: rotate(14deg);
        }

        .flowerFour {
          bottom: 175px;
          right: 12vw;
          font-size: 38px;
          transform: rotate(-10deg);
        }

        .flowerFive {
          top: 48%;
          left: 48%;
          font-size: 22px;
          color: var(--lavender);
          opacity: 0.16;
          transform: rotate(24deg);
        }

        .flowerSix {
          top: 72%;
          right: 34vw;
          font-size: 20px;
          opacity: 0.18;
          transform: rotate(-28deg);
        }

        .flowerSeven {
          top: 34%;
          left: 22vw;
          font-size: 18px;
          color: var(--lavender);
          opacity: 0.18;
          transform: rotate(18deg);
        }

        .nav,
        .hero,
        .results,
        footer {
          position: relative;
          z-index: 1;
        }

        .confettiLayer {
          position: fixed;
          inset: 0;
          z-index: 9999;
          pointer-events: none;
          overflow: hidden;
        }

        .confettiPiece {
          position: absolute;
          top: -20px;
          width: 10px;
          height: 14px;
          border-radius: 3px;
          background: var(--purple);
          animation-name: confettiFall;
          animation-timing-function: ease-in;
          animation-fill-mode: forwards;
        }

        .confettiPiece:nth-child(3n) {
          background: var(--green);
          width: 8px;
          height: 8px;
          border-radius: 999px;
        }

        .confettiPiece:nth-child(4n) {
          background: #f6b7d2;
        }

        .confettiPiece:nth-child(5n) {
          background: var(--lavender);
          width: 12px;
          height: 12px;
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 56%, 79% 91%, 50% 70%, 21% 91%, 32% 56%, 2% 35%, 39% 35%);
        }

        @keyframes confettiFall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }

        @media (max-width: 820px) {
          .page {
            padding: 18px;
          }

          .nav {
            align-items: flex-start;
            gap: 12px;
            flex-direction: column;
          }

          .navActions {
            width: 100%;
            justify-content: space-between;
          }

          .hero {
            grid-template-columns: 1fr;
            margin-top: 36px;
          }

          .summaryGrid,
          .progressLabels {
            grid-template-columns: 1fr;
            text-align: left;
          }

          .progressLabels span,
          .progressLabels span:first-child,
          .progressLabels span:last-child {
            text-align: left;
          }

          .resultTop,
          .cardHeader,
          .progressHeader {
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}
