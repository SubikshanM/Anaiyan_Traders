/**
 * ANAIYAN TRADERS - FARM-MADE TURMERIC POWDER
 * Interactive Client Script & WhatsApp Order Generator
 */

// Configure your business WhatsApp phone number here (with country code, without '+' or spaces)
// e.g., '919876543210' for an Indian phone number.
const BUSINESS_WHATSAPP_NUMBER = "919095076843";

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
function selectPack(weight, price, packName) {
  const packSelect = document.getElementById("packSelect");
  if (packSelect) {
    // Find matching option or set value
    for (let i = 0; i < packSelect.options.length; i++) {
      if (packSelect.options[i].value.includes(weight) || packSelect.options[i].text.includes(weight)) {
        packSelect.selectedIndex = i;
        break;
      }
    }
    updateOrderPreview();
  }

  // Smooth scroll to order section
  const orderSection = document.getElementById("order");
  if (orderSection) {
    orderSection.scrollIntoView({ behavior: "smooth" });
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
  const pack = document.getElementById("packSelect") ? document.getElementById("packSelect").value : "500g Regular Family Pack";
  const qty = document.getElementById("quantityInput") ? document.getElementById("quantityInput").value : "1";
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

  let emailLine = email ? `\n✉️ Email: ${email}` : "";

  return `Hello Anaiyan Traders,

I would like to order fresh farm-made turmeric powder:
🌿 Pack Size: ${pack}
📦 Quantity: ${qty} packet(s)
👤 Customer Name: ${name}
📞 Customer Phone: ${phone}
📍 Delivery Address: ${location}${emailLine}

Please confirm order availability, total cost, and delivery payment details. Thank you!`;
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
