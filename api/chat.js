const DESTINATIONS = [
  { name: "Bali, Indonesia", price: 499, category: "Beach" },
  { name: "Santorini, Greece", price: 689, category: "City" },
  { name: "Switzerland", price: 689, category: "Mountains" },
  { name: "Tokyo, Japan", price: 799, category: "City" },
  { name: "Maldives", price: 899, category: "Beach" },
  { name: "Paris, France", price: 689, category: "City" },
  { name: "New York, USA", price: 999, category: "City" },
  { name: "Dubai, UAE", price: 899, category: "Adventure" },
];

const destinationText = DESTINATIONS.map(
  (d) => `${d.name} (${d.category}, price ${d.price})`
).join("\n");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  const userMessage = req.body?.message;
  if (!userMessage || !userMessage.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gemini-3.5-flash-lite",
      messages: [
        {
          role: "system",
         content: `You are Wanderly's friendly travel assistant. Only recommend destinations from this list:\n${destinationText}\nIf asked about a place not in the list, say Wanderly doesn't offer it yet. Only state facts from the list. Never mention sales, discounts, or details that are not in the data. Keep answers under 3 sentences.`,
        },
        { role: "user", content: userMessage },
      ],
    }),
  };

  const url =
    "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

  let response;
  for (let i = 0; i < 3; i++) {
    response = await fetch(url, options);
    if (response.status !== 503) break;
    await new Promise((r) => setTimeout(r, 1500));
  }

  const data = await response.json();
  if (!response.ok) {
    return res.status(500).json({ error: data });
  }
  res.json({ reply: data.choices[0].message.content });
}