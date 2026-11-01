import Tracker from "./components/Tracker";

// Handles the home page and links like /?tracking=9334...&lang=en
export default async function HomePage({ searchParams }) {
  const params = (await searchParams) || {};
  const tracking = typeof params.tracking === "string" ? params.tracking : "";
  const lang = params.lang === "en" ? "en" : "es";

  return <Tracker initialTracking={tracking} initialLang={lang} />;
}
