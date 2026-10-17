(function () {
  const PLANE = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';

  const box = document.createElement("div");
  box.style.cssText = "position:fixed;bottom:20px;right:20px;z-index:1000;font-family:sans-serif;display:flex;flex-direction:column;align-items:flex-end";

  const panel = document.createElement("div");
  panel.style.cssText = "display:none;width:300px;height:380px;background:#fff;color:#111;border:1px solid #ccc;border-radius:12px;flex-direction:column;margin-bottom:10px;box-shadow:0 4px 16px rgba(0,0,0,0.2)";

  const title = document.createElement("div");
  title.textContent = "Wanderly Assistant";
  title.style.cssText = "padding:10px;font-weight:bold;border-bottom:1px solid #eee";

  const log = document.createElement("div");
  log.style.cssText = "flex:1;overflow-y:auto;padding:10px";

  const row = document.createElement("div");
  row.style.cssText = "display:flex;gap:6px;padding:8px";

  const input = document.createElement("input");
  input.placeholder = "Ask about trips...";
  input.style.cssText = "flex:1;padding:6px";

  const send = document.createElement("button");
  send.innerHTML = PLANE;
  send.setAttribute("aria-label", "Send message");
  send.style.cssText = "background:#1a56db;border:none;border-radius:8px;padding:6px 12px;cursor:pointer;display:flex;align-items:center";
  row.append(input, send);

  const toggle = document.createElement("button");
  toggle.innerHTML = PLANE;
  toggle.setAttribute("aria-label", "Open chat");
  toggle.style.cssText = "width:56px;height:56px;border-radius:50%;border:none;cursor:pointer;background:#1a56db;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.3)";

  panel.append(title, log, row);
  box.append(panel, toggle);
  document.body.appendChild(box);

  function addMessage(who, text) {
    const p = document.createElement("p");
    p.style.cssText = "margin:6px 0;text-align:" + (who === "user" ? "right" : "left");
    const span = document.createElement("span");
    span.textContent = text;
    span.style.cssText = "display:inline-block;padding:6px 10px;border-radius:10px;background:" + (who === "user" ? "#d0e8ff" : "#f1f1f1");
    p.appendChild(span);
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
  }

  addMessage("bot", "Hi! I'm Wanderly's assistant. Ask me about trips.");

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMessage("user", text);
    input.value = "";
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      addMessage("bot", data.reply || "Sorry, something went wrong. Please try again.");
    } catch (e) {
      addMessage("bot", "Network error. Please try again.");
    }
  }

  send.addEventListener("click", sendMessage);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") sendMessage(); });
  toggle.addEventListener("click", () => {
    panel.style.display = panel.style.display === "none" ? "flex" : "none";
  });
})();