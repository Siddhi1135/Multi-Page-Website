// =========================================================
// Wanderly — shared behaviour (mobile nav, filters, forms)
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  // Mobile nav toggle
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => navLinks.classList.remove("open"));
    });
  }

  // Explore page: filter chips
  const filterRow = document.getElementById("filterRow");
  const grid = document.getElementById("destinationGrid");

  if (filterRow && grid) {
    const chips = filterRow.querySelectorAll(".filter-chip");
    const cards = grid.querySelectorAll(".destination-card");

    filterRow.addEventListener("click", (e) => {
      const chip = e.target.closest(".filter-chip");
      if (!chip) return;

      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");

      const filter = chip.dataset.filter;
      cards.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.style.display = match ? "" : "none";
      });
    });
  }

  // =======================================================
  // Form validation engine
  // Fields opt in via data-rules="required,email,min:6"
  // Error <small> elements are created dynamically (DOM manipulation)
  // =======================================================
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function getErrorEl(input) {
    let error = input.nextElementSibling;
    if (!error || !error.classList.contains("field-error")) {
      error = document.createElement("small");
      error.className = "field-error";
      input.insertAdjacentElement("afterend", error);
    }
    return error;
  }

  function validateInput(input) {
    const rules = (input.dataset.rules || "").split(",").map((r) => r.trim()).filter(Boolean);
    const value = input.value.trim();
    let message = "";

    for (const rule of rules) {
      if (rule === "required" && !value) {
        message = "This field is required.";
        break;
      }
      if (rule === "email" && value && !EMAIL_PATTERN.test(value)) {
        message = "Please enter a valid email address.";
        break;
      }
      if (rule.startsWith("min:")) {
        const min = Number(rule.split(":")[1]);
        if (value && value.length < min) {
          message = `Must be at least ${min} characters.`;
          break;
        }
      }
    }

    const errorEl = getErrorEl(input);
    if (message) {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
      errorEl.textContent = message;
      errorEl.classList.add("show");
    } else {
      input.classList.remove("is-invalid");
      if (value) input.classList.add("is-valid");
      errorEl.textContent = "";
      errorEl.classList.remove("show");
    }
    return !message;
  }

  function attachValidation(form) {
    // Newsletter forms only have one email input — apply rules automatically
    if (form.classList.contains("newsletter-form")) {
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && !emailInput.dataset.rules) {
        emailInput.dataset.rules = "required,email";
      }
    }

    const fields = form.querySelectorAll("[data-rules]");

    fields.forEach((input) => {
      input.addEventListener("blur", () => validateInput(input));
      input.addEventListener("input", () => {
        if (input.classList.contains("is-invalid")) validateInput(input);
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault(); // no backend attached — always stop real navigation

      let isValid = true;
      fields.forEach((input) => {
        if (!validateInput(input)) isValid = false;
      });

      if (!isValid) {
        const firstInvalid = form.querySelector(".is-invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const btn = form.querySelector("button[type='submit']");
      if (btn && btn.textContent.trim()) {
        const original = btn.textContent;
        btn.textContent =
          original.toLowerCase().includes("send") ? "Message Sent!" :
          original.toLowerCase().includes("login") ? "Logging in..." :
          "Subscribed!";
        setTimeout(() => (btn.textContent = original), 1800);
      }

      form.reset();
      fields.forEach((input) => input.classList.remove("is-valid", "is-invalid"));
    });
  }

  document.querySelectorAll("form").forEach(attachValidation);
});