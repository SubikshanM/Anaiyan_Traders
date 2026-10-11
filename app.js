/**
 * ANAIYAN TRADERS - FARM-MADE TURMERIC POWDER
 * Interactive Client Script & WhatsApp Order Generator
 */

// WhatsApp number configured for order routing (assembled dynamically to protect from web scrapers)
const _c = "91";
const _p = "7598063023";
const BUSINESS_WHATSAPP_NUMBER = _c + _p;

document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  const yearSpan = document.getElementById("currentYear");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Mobile navigation hamburger toggle
  const mobileBtn = document.getElementById("mobileMenuBtn");
  const navLinks = document.getElementById("navLinks");
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      const icon = mobileBtn.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-xmark");
      }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        const icon = mobileBtn.querySelector("i");
        if (icon) {
          icon.classList.add("fa-bars");
          icon.classList.remove("fa-xmark");
        }
      });
    });
  }

  // Initialize initial WhatsApp message preview
  updateOrderPreview();
});

/**
 * Handle pack selection from the product cards
 * Smoothly scrolls to the order form and selects the pack in dropdown
 */
function selectPack(weight, packName) {
  const packSelect = document.getElementById("packSelect");
  if (packSelect) {
    const target = (packName || weight || "").toLowerCase();
    
    // Find matching option
    for (let i = 0; i < packSelect.options.length; i++) {
      const optVal = packSelect.options[i].value.toLowerCase();
      const optText = packSelect.options[i].text.toLowerCase();
      
      if (optVal.includes(target) || optText.includes(target) || 
          (weight && (optVal.includes(weight.toLowerCase()) || optText.includes(weight.toLowerCase())))) {
        packSelect.selectedIndex = i;
        break;
      }
    }
    
    // Reset quantity to 1 when a new pack is chosen
    const qtyInput = document.getElementById("quantityInput");
    if (qtyInput) {
      qtyInput.value = 1;
    }

    // Trigger update of live message preview
    updateOrderPreview();
  }

  // Smooth scroll to order section
  const orderSection = document.getElementById("order");
  if (orderSection) {
    orderSection.scrollIntoView({ behavior: "smooth" });

    // Visual highlight feedback on the order form
    const formCard = document.querySelector(".order-form-card");
    if (formCard) {
      formCard.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
      formCard.style.transform = "scale(1.02)";
      formCard.style.boxShadow = "0 0 25px rgba(217, 119, 6, 0.4)";
      setTimeout(() => {
        formCard.style.transform = "none";
        formCard.style.boxShadow = "";
      }, 700);
    }
  }
}

/**
 * Quantity stepper increment/decrement
 */
function changeQty(delta) {
  const qtyInput = document.getElementById("quantityInput");
  if (qtyInput) {
    let currentVal = parseInt(qtyInput.value, 10) || 1;
    let newVal = currentVal + delta;
    if (newVal < 1) newVal = 1;
    if (newVal > 100) newVal = 100;
    qtyInput.value = newVal;
    updateOrderPreview();
  }
}

/**
 * Builds the customized WhatsApp message text and updates the live preview
 */
function buildOrderMessage() {
  const packSelect = document.getElementById("packSelect");
  const pack = packSelect ? packSelect.value : "500g Regular Family Pack (₹200)";
  const qty = parseInt(document.getElementById("quantityInput") ? document.getElementById("quantityInput").value : "1", 10) || 1;
  const name = document.getElementById("custName") && document.getElementById("custName").value.trim() 
    ? document.getElementById("custName").value.trim() 
    : "[Your Name]";
  const phone = document.getElementById("custPhone") && document.getElementById("custPhone").value.trim() 
    ? document.getElementById("custPhone").value.trim() 
    : "[Your Phone Number]";
  const location = document.getElementById("custLocation") && document.getElementById("custLocation").value.trim() 
    ? document.getElementById("custLocation").value.trim() 
    : "[Your Delivery Address / City]";
  const email = document.getElementById("custEmail") && document.getElementById("custEmail").value.trim()
    ? document.getElementById("custEmail").value.trim()
    : "";

  // Price calculations based on Rs 400/kg
  let unitPrice = 200;
  if (pack.includes("100") || pack.includes("250g")) unitPrice = 100;
  else if (pack.includes("400") || pack.includes("1 Kg") || pack.includes("1kg")) unitPrice = 400;
  else if (pack.includes("Bulk")) unitPrice = 400;

  let totalEstimated = unitPrice * qty;
  let emailLine = email ? `\n✉️ Email: ${email}` : "";

  return `Hello Anaiyan Traders,

I would like to order fresh farm-made turmeric powder:
🌿 Pack: ${pack}
📦 Quantity: ${qty} packet(s)
💰 Product Total: ₹${totalEstimated} (Direct Farm Price)
🚚 Delivery: Courier charges extra based on delivery address
👤 Customer Name: ${name}
📞 Customer Phone: ${phone}
📍 Delivery Address: ${location}${emailLine}

Please confirm order dispatch date, courier fee, and UPI payment details. Thank you!`;
}

/**
 * Updates the message preview box on form input changes
 */
function updateOrderPreview() {
  const previewEl = document.getElementById("whatsappPreviewText");
  if (previewEl) {
    const msg = buildOrderMessage();
    // Format message with line breaks for web preview
    previewEl.innerHTML = msg.replace(/\n/g, "<br>");
  }
}

/**
 * Handles the order form submit button and opens WhatsApp with pre-filled message
 */
function handleOrderSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById("custName");
  const phoneInput = document.getElementById("custPhone");
  const locInput = document.getElementById("custLocation");

  if (!nameInput.value.trim() || !phoneInput.value.trim() || !locInput.value.trim()) {
    alert("Please fill in your Name, Phone Number, and Delivery Address.");
    return;
  }

  const message = buildOrderMessage();
  const encodedMsg = encodeURIComponent(message);
  
  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodedMsg}`;

  // Open in new window/tab
  window.open(whatsappUrl, "_blank");
}
