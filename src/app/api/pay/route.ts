import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { amount, email, phone, currency, tx_ref, payment_method } = body;

  const secretKey = process.env.FLW_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json(
      { error: "Flutterwave non configuré. Ajoutez FLW_SECRET_KEY dans .env.local" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref,
        amount,
        currency: currency || "USD",
        redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pos?payment=success&tx_ref=${tx_ref}`,
        customer: {
          email: email || "client@shopcongo.cd",
          phone_number: phone || undefined,
        },
        customizations: {
          title: "ShopCongo",
          description: "Paiement pour vos achats",
        },
        meta: [
          {
            metaname: "payment_method",
            metavalue: payment_method,
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.status === "success") {
      return NextResponse.json({
        status: "success",
        checkout_url: data.data.link,
        transaction_id: data.data.id,
      });
    }

    return NextResponse.json(
      { error: data.message || "Erreur de paiement" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur de connexion au serveur" },
      { status: 500 }
    );
  }
}
