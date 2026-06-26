function guessCarrier(trackingNumber) {
  const n = String(trackingNumber || "").trim().toUpperCase();

  if (/^1Z[A-Z0-9]{16}$/.test(n)) return "ups";
  if (/^(94|93|92|95|96)\d{18,26}$/.test(n)) return "usps";
  if (/^\d{12}$/.test(n) || /^\d{15}$/.test(n) || /^\d{20}$/.test(n) || /^\d{22}$/.test(n)) return "fedex";

  return "usps";
}

export async function POST(request) {
  try {
    const body = await request.json();
    const trackingNumber = String(body.trackingNumber || "").trim();
    const carrier = body.carrier || "auto";

    if (!trackingNumber) {
      return Response.json(
        { error: "Tracking number is required." },
        { status: 400 }
      );
    }

    const token = process.env.SHIPPO_API_TOKEN;

    if (!token) {
      return Response.json(
        {
          error: "Missing SHIPPO_API_TOKEN.",
          message: "Add SHIPPO_API_TOKEN in Vercel Environment Variables, then redeploy."
        },
        { status: 500 }
      );
    }

    const finalCarrier = carrier !== "auto" ? carrier : guessCarrier(trackingNumber);

    const response = await fetch("https://api.goshippo.com/tracks/", {
      method: "POST",
      headers: {
        Authorization: `ShippoToken ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        carrier: finalCarrier,
        tracking_number: trackingNumber
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        {
          error: "Tracking request failed.",
          carrier: finalCarrier,
          message: data?.detail || data?.message || "The carrier could not return tracking details yet.",
          shippo_response: data
        },
        { status: response.status }
      );
    }

    return Response.json(data, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: "Tracking failed.", message: error.message },
      { status: 500 }
    );
  }
}
