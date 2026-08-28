// Powerteam Passport Portal Client Logic
const API_BASE = "http://localhost:3001";
const DEMO_CUSTOMER_ID = "CUST-DEMO-001";

const catalogMock = [
  {
    sku: "CEO-SUMMIT-2026-FTL",
    title: "CEO Success Summit — Fort Lauderdale",
    creditPrice: 250,
    cashPrice: 250,
    inventory: 100,
    redeemableUntil: "2026-08-30T23:59:59-04:00",
    refundPolicyId: "EVENT_STANDARD_V1",
    pilotNotice: "Pilot redemption subject to confirmed event fulfillment."
  }
];

let activityLogs = [
  {
    timestamp: "2026-08-28 16:00:00",
    type: "CREDIT_PURCHASE",
    ref: "STRIPE-PI-88990",
    delta: "+2,500 Credits",
    hash: "0x4a9b...71c2"
  },
  {
    timestamp: "2026-08-28 16:05:00",
    type: "PASSPORT_MINT",
    ref: "PTI-2026-000001",
    delta: "Founder Tier",
    hash: "0x91df...08aa"
  }
];

function switchTab(tabId) {
  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tabId);
  });
  document.querySelectorAll(".tab-pane").forEach(pane => {
    pane.classList.toggle("active", pane.id === `tab-${tabId}`);
  });

  const titles = {
    home: "Member Dashboard",
    explore: "Explore Service Catalog",
    passport: "My Digital Passport",
    activity: "Activity & Receipts",
    support: "Support & Compliance Policy"
  };
  document.getElementById("page-title").innerText = titles[tabId] || "Member Dashboard";
}

document.querySelectorAll(".nav-item").forEach(btn => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});

function renderCatalog() {
  const container = document.getElementById("catalog-list");
  if (!container) return;
  container.innerHTML = "";

  catalogMock.forEach(item => {
    const card = document.createElement("div");
    card.className = "catalog-card";
    card.innerHTML = `
      <h3>${item.title}</h3>
      <p style="font-size: 0.85rem; color: #94a3b8;">${item.pilotNotice}</p>
      <div class="catalog-meta">
        <div>
          <span style="font-size: 0.75rem; color: #94a3b8; display: block;">REDEMPTION PRICE</span>
          <span class="price-tag">${item.creditPrice} Credits</span>
        </div>
        <div>
          <span style="font-size: 0.75rem; color: #94a3b8; display: block;">INVENTORY</span>
          <span style="font-weight: 600;">${item.inventory} Seats</span>
        </div>
      </div>
      <button class="btn btn-primary" style="width: 100%;" onclick="redeemCatalogItem('${item.sku}', ${item.creditPrice})">
        Redeem with PTI Credits
      </button>
    `;
    container.appendChild(card);
  });
}

function renderActivity() {
  const tbody = document.getElementById("activity-table-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  activityLogs.forEach(log => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${log.timestamp}</td>
      <td><strong>${log.type}</strong></td>
      <td>${log.ref}</td>
      <td style="color: #10b981;">${log.delta}</td>
      <td><code>${log.hash}</code></td>
    `;
    tbody.appendChild(tr);
  });
}

async function redeemCatalogItem(sku, cost) {
  const conf = confirm(`Redeem ${cost} PTI Credits for ${sku}?`);
  if (!conf) return;

  const currentBalEl = document.getElementById("home-credit-bal");
  const current = parseInt(currentBalEl.innerText.replace(/[^0-9]/g, "")) || 2500;

  if (current < cost) {
    alert("Insufficient credit balance!");
    return;
  }

  const newBal = current - cost;
  currentBalEl.innerHTML = `${newBal.toLocaleString()} <span class="unit">Credits</span>`;

  activityLogs.unshift({
    timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
    type: "CREDIT_REDEMPTION",
    ref: sku,
    delta: `-${cost} Credits`,
    hash: "0x" + Math.random().toString(16).substring(2, 10) + "...proof"
  });

  renderActivity();
  alert(`✅ Successfully redeemed! Ticket entitlement created for ${sku}.`);
  switchTab("activity");
}

function triggerRecoveryModal() {
  alert("Initiating Account Recovery Workflow:\n\n1. Identity verification challenge sent to primary email.\n2. Upon confirmation, the 2-of-3 Safe multisig will revoke the compromised credential and reissue a replacement.\n\nSupport Ticket #REC-8840 opened.");
}

// Initial render
document.addEventListener("DOMContentLoaded", () => {
  renderCatalog();
  renderActivity();
});
