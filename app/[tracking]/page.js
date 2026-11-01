import Tracker from "../components/Tracker";

// Handles links like /9334620845500054091488 (optionally ?lang=en)
export default async function TrackingNumberPage({ params, searchParams }) {
  const { tracking = "" } = (await params) || {};
  const query = (await searchParams) || {};
  const lang = query.lang === "en" ? "en" : "es";

  let decoded = tracking;
  try {
    decoded = decodeURIComponent(tracking);
  } catch {
    /* keep raw value */
  }

  return <Tracker initialTracking={decoded} initialLang={lang} />;
}
