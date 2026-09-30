import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { orderId, customerName, items, total, notes, whatsappNumber } = await req.json();

    let message = `🟢 *Nouvelle commande - VetoVolaille*\n`;
    message += `Client: ${customerName}\n`;
    message += `N° commande: ${orderId?.slice(0, 8) || "N/A"}\n`;
    message += `\n*Articles:*\n`;

    if (items && Array.isArray(items)) {
      items.forEach((item: any) => {
        message += `- ${item.name} (x${item.quantity}): ${item.price * item.quantity} FCFA\n`;
      });
    }

    message += `\n*Total: ${total} FCFA*\n`;
    if (notes) message += `\nNotes: ${notes}\n`;

    const targetNumber = whatsappNumber || "22500000000";
    const whatsappUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;

    return new Response(
      JSON.stringify({ success: true, whatsappUrl, message }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
