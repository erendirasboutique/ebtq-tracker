import Tracker from "../components/Tracker";

export default function TrackingNumberPage({ params }) {
  return <Tracker initialTracking={params.tracking} />;
}
