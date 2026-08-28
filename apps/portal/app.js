// Powerteam Passport Portal & Sovereign Web3 Experience
const speakersList = [
  {
    name: "Bill Walsh",
    role: "Global Business Strategist & Venture Capitalist",
    initials: "BW",
    bio: "Founder of Powerteam International, bestselling author of 'The Obvious', venture architect behind 500+ scalable enterprises.",
    tokenBadge: "👑 Host Passports & Rainmaker SBT"
  },
  {
    name: "Kevin Harrington",
    role: "Original Shark on Shark Tank & Pioneer of As Seen On TV",
    initials: "KH",
    bio: "Launched 500+ products totaling $6B+ in sales. Bestselling author of 'Act Now' and 'Key to the Vault'.",
    tokenBadge: "🦈 Shark Syndication & Venture Routing SBT"
  },
  {
    name: "Les Brown",
    role: "Legendary Motivational Speaker & Speaker Coach",
    initials: "LB",
    bio: "World-renowned keynote master, coach to top platform speakers, and icon of personal achievement.",
    tokenBadge: "🎤 Proof-of-Mentorship Keynote SBT"
  },
  {
    name: "Mark Victor Hansen",
    role: "Co-Creator of 'Chicken Soup for the Soul'",
    initials: "MVH",
    bio: "500M+ books sold globally, Guinness World Record holder, co-author of 'Ask!' and publishing titan.",
    tokenBadge: "📚 Co-Authored Publishing Royalty Split"
  },
  {
    name: "Brian Tracy",
    role: "Global Sales Mastery & Peak Performance Authority",
    initials: "BT",
    bio: "Consulted for 1,000+ companies, author of 80+ bestsellers including 'Eat That Frog!' and 'Psychology of Selling'.",
    tokenBadge: "📈 Executive Sales Certification SBT"
  },
  {
    name: "Sharon Lechter",
    role: "Co-Author of 'Rich Dad Poor Dad' & Financial Literacy Leader",
    initials: "SL",
    bio: "Presidential Advisor on Financial Literacy, CPA, and co-author of 'Think and Grow Rich for Women'.",
    tokenBadge: "💼 Cashflow Mastermind Credential"
  },
  {
    name: "Forbes Riley",
    role: "Infomercial Queen & Pitch Communication Master",
    initials: "FR",
    bio: "National Fitness Hall of Fame inductee, $2.5B+ in TV product sales, and creator of the Pitch Perfection method.",
    tokenBadge: "⚡ Pitch Perfection Masterclass Gating"
  },
  {
    name: "Austin Walsh",
    role: "Digital Marketing Expert & Funnel Architect",
    initials: "AW",
    bio: "Direct-response conversion strategist and architect of multimillion-dollar automated traffic funnels.",
    tokenBadge: "🚀 Token-Gated Marketing Toolkits"
  }
];

const booksList = [
  {
    title: "The Obvious",
    author: "Bill Walsh",
    icon: "📘",
    desc: "The definitive playbook for business acceleration, venture scaling, and converting ideas into high-ticket enterprise revenue.",
    status: "● INCLUDED WITH PASSPORT"
  },
  {
    title: "Act Now: Turn Ideas into Millions",
    author: "Kevin Harrington",
    icon: "🦈",
    desc: "How the Original Shark spots billion-dollar opportunities, negotiates deal terms, and structures massive consumer distribution.",
    status: "● INCLUDED WITH PASSPORT"
  },
  {
    title: "Chicken Soup for the Soul",
    author: "Mark Victor Hansen",
    icon: "📕",
    desc: "The record-breaking global publishing phenomenon with over 500 million copies sold and timeless wisdom on human potential.",
    status: "● INCLUDED WITH PASSPORT"
  },
  {
    title: "Eat That Frog! & Sales Psychology",
    author: "Brian Tracy",
    icon: "📗",
    desc: "The world's premier systems for high-output time management, peak performance habits, and closing high-ticket transactions.",
    status: "● INCLUDED WITH PASSPORT"
  },
  {
    title: "Think and Grow Rich for Women",
    author: "Sharon Lechter",
    icon: "📙",
    desc: "Mastering financial independence, building asset portfolios, and applying Napoleonic wealth principles to modern enterprise.",
    status: "● INCLUDED WITH PASSPORT"
  },
  {
    title: "Pitch Perfection: The Art of Influence",
    author: "Forbes Riley",
    icon: "🎙️",
    desc: "The proprietary communication blueprint that generated $2.5 Billion in sales across television and live keynote stages.",
    status: "● INCLUDED WITH PASSPORT"
  }
];

const catalogItems = [
  {
    sku: "CEO-SUMMIT-2026-FTL",
    title: "CEO Success Summit — Fort Lauderdale",
    date: "Aug 31, 2026 • 12:00 PM – 3:00 PM",
    venue: "Le Méridien Dania Beach Hotel",
    creditPrice: 250,
    inventory: 18,
    tag: "LIVE IN-PERSON",
    description: "Executive scaling keynotes, VIP networking luncheon, and venture structuring masterclass with Bill Walsh."
  },
  {
    sku: "DIGITAL-SUCCESS-2026-SEP",
    title: "Digital Success Summit",
    date: "Sep 7, 2026 • Full Day Global Stream",
    venue: "Virtual Live Broadcast & AI Breakouts",
    creditPrice: 99,
    inventory: 850,
    tag: "GLOBAL LIVESTREAM",
    description: "Cutting-edge digital marketing, automated sales funnels, and AI agent automation for high-growth founders."
  },
  {
    sku: "RAINMAKER-SUMMIT-2026-ORL",
    title: "Rainmaker Business Summit — Orlando",
    date: "Sep 18–20, 2026 • 3-Day Intensive",
    venue: "Orlando Convention Center",
    creditPrice: 495,
    inventory: 45,
    tag: "3-DAY IMMERSIVE",
    description: "The flagship 3-day business transformation summit. Dealmaking, capital formation, and partnership masterminds."
  },
  {
    sku: "ICON-SPEAKER-2026-ORL",
    title: "Icon Speaker Accelerator Program",
    date: "Sep 23, 2026 • Stage Masterclass",
    venue: "Powerteam Mastery Studio & Stage",
    creditPrice: 1500,
    inventory: 8,
    tag: "STAGE CERTIFICATION",
    description: "Get booked, keynote training, stage presence mastery, and direct promoter syndication credential."
  }
];

let userState = {
  walletConnected: true,
  walletAddress: "0x4E574939D460d284B5D990646D4aeaEF2D49Fa13",
  passportId: "PTI-2026-000001",
  tier: "Founder Pass",
  creditBalance: 2500,
  isSBTValid: true,
};

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

function updateUI() {
  document.getElementById("card-credit-val").innerText = `${userState.creditBalance.toLocaleString()} PTI`;
  document.getElementById("vault-display-bal").innerHTML = `${userState.creditBalance.toLocaleString()} <span class="vault-unit">CREDITS</span>`;
  document.getElementById("card-member-id").innerText = userState.passportId;
}

function renderSpeakers() {
  const container = document.getElementById("speakers-grid-container");
  if (!container) return;
  container.innerHTML = "";

  speakersList.forEach(spk => {
    const card = document.createElement("div");
    card.className = "speaker-card-luxe";
    card.innerHTML = `
      <div>
        <div class="speaker-avatar-circle">${spk.initials}</div>
        <div class="speaker-name">${spk.name}</div>
        <div class="speaker-role">${spk.role}</div>
        <div class="speaker-bio">${spk.bio}</div>
      </div>
      <div>
        <div class="speaker-token-badge">${spk.tokenBadge}</div>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderBooks() {
  const container = document.getElementById("books-grid-container");
  if (!container) return;
  container.innerHTML = "";

  booksList.forEach(b => {
    const card = document.createElement("div");
    card.className = "book-card-luxe";
    card.innerHTML = `
      <div>
        <div class="book-icon">${b.icon}</div>
        <div class="book-title">${b.title}</div>
        <div class="book-author">By ${b.author}</div>
        <div class="book-desc">${b.desc}</div>
      </div>
      <div class="book-status">
        <span>🔓</span> ${b.status}
      </div>
    `;
    container.appendChild(card);
  });
}

function renderCatalog() {
  const container = document.getElementById("catalog-grid-dynamic");
  if (!container) return;
  container.innerHTML = "";

  catalogItems.forEach(item => {
    const card = document.createElement("div");
    card.className = "catalog-card-luxe";
    card.innerHTML = `
      <div>
        <div class="catalog-card-header">
          <span class="cat-tag">${item.tag}</span>
          <span style="font-size: 0.75rem; color: #94a3b8;">SKU: ${item.sku}</span>
        </div>
        <h3>${item.title}</h3>
        <div class="venue-line">📍 ${item.venue}</div>
        <div class="venue-line" style="color: #60a5fa; font-weight: 500;">📅 ${item.date}</div>
        <p style="font-size: 0.85rem; color: #94a3b8; line-height: 1.5; margin-bottom: 1.5rem;">${item.description}</p>
      </div>

      <div>
        <div class="price-strip">
          <div>
            <span style="font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; font-weight: 600; display: block;">Redemption Cost</span>
            <span class="cost-credits">${item.creditPrice} PTI Credits</span>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 0.7rem; color: #94a3b8; display: block;">SEATS REMAINING</span>
            <span class="seats-left">${item.inventory} Available</span>
          </div>
        </div>

        <button class="btn btn-gold btn-full shadow-gold" onclick="redeemSummitItem('${item.sku}', ${item.creditPrice}, '${item.title}')">
          Redeem with PTI Credits (${item.creditPrice})
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function redeemSummitItem(sku, creditCost, title) {
  if (userState.creditBalance < creditCost) {
    alert(`Insufficient Credit Balance!\n\nYou have ${userState.creditBalance} credits available. ${title} requires ${creditCost} credits.\n\nClick '+ Top Up Credits' to add credits via Stripe or Crypto.`);
    return;
  }

  const confirmMsg = `Confirm Redemption:\n\nEvent: ${title}\nSKU: ${sku}\nCost: ${creditCost} PTI Credits ($${creditCost} USD Value)\n\nUpon confirmation, 1 ticket entitlement will be created and recorded on your dual-state audit ledger.`;
  if (!confirm(confirmMsg)) return;

  userState.creditBalance -= creditCost;
  updateUI();

  alert(`🎉 SUCCESSFUL REDEMPTION!\n\nYour VIP seat for "${title}" has been confirmed.\nTicket ID: TKT-${Math.random().toString(16).substring(2, 10).toUpperCase()}\n\nPresent your Digital QR Passport at the venue registration desk for immediate check-in.`);
}

function purchaseTier(cost, tierName) {
  const method = prompt(`Select Payment Method for ${tierName} ($${cost.toLocaleString()} USD):\n1. Credit/Debit Card (Stripe USD)\n2. Apple Pay / Google Pay\n3. USDC / Crypto (Solana / EVM / XRPL / Base)\n\nEnter 1, 2, or 3:`, "1");
  if (!method) return;

  alert(`Processing settled transaction of $${cost.toLocaleString()}.00 USD for ${tierName}...\n\nPayment settled! +${cost.toLocaleString()} PTI Service Credits added and Soulbound Passport updated with permanent 10% discount.`);
  userState.creditBalance += cost;
  updateUI();
}

function purchasePassportModal() {
  purchaseTier(2500, "Founder Tier");
}

function openTopUpModal() {
  const amount = prompt("Enter amount of PTI Credits to purchase ($1.00 USD per Credit):", "500");
  const num = parseInt(amount);
  if (!num || num <= 0) return;

  alert(`Processing Stripe checkout for $${num}.00 USD...\n\nSettled! +${num} PTI Credits added to your vault balance.`);
  userState.creditBalance += num;
  updateUI();
}

function openLedgerHistoryModal() {
  alert("📜 DUAL-STATE CRYPTOGRAPHIC LEDGER AUDIT:\n\n• Order #ORD-88912: +2,500 Credits (Stripe Settled)\n• Contract Hash: 0x4E574939D460d284B5D990646D4aeaEF2D49Fa13\n• Status: RECONCILED CLEAN (0.00% Variance)\n• Safe Multisig Timelock: Active\n• BitGo Enterprise Sub-Account: Verified");
}

function showFullQRModal() {
  const randToken = "CHK-ROT-" + Math.random().toString(16).substring(2, 14);
  document.getElementById("qr-token-text").innerText = randToken;
  document.getElementById("modal-qr").classList.add("active");
}
function closeQRModal() {
  document.getElementById("modal-qr").classList.remove("active");
}

function openConciergeModal() {
  document.getElementById("modal-concierge").classList.add("active");
}
function closeConciergeModal() {
  document.getElementById("modal-concierge").classList.remove("active");
}

function sendConciergeMessage() {
  const input = document.getElementById("concierge-input");
  const text = input.value.trim();
  if (!text) return;

  const chatArea = document.getElementById("chat-messages");

  // User bubble
  const userB = document.createElement("div");
  userB.className = "chat-bubble user";
  userB.innerText = text;
  chatArea.appendChild(userB);

  input.value = "";

  // AI response simulation
  setTimeout(() => {
    const aiB = document.createElement("div");
    aiB.className = "chat-bubble ai";

    const lower = text.toLowerCase();
    if (lower.includes("ceo") || lower.includes("dania") || lower.includes("fort lauderdale")) {
      aiB.innerText = "The CEO Success Summit in Fort Lauderdale is scheduled for August 31, 2026 at Le Méridien Dania Beach (12:00 PM – 3:00 PM). It requires 250 PTI Credits. You currently have " + userState.creditBalance + " credits available. Would you like me to guide your 1-click redemption?";
    } else if (lower.includes("harrington") || lower.includes("shark")) {
      aiB.innerText = "Kevin Harrington is featured in our keynote media library and speaker faculty. As a Passport holder, you have access to his 'Act Now' digital edition and masterclass keynotes on customer acquisition and business structuring.";
    } else if (lower.includes("book") || lower.includes("library")) {
      aiB.innerText = "Your Passport includes instant token-gated access to bestsellers by Bill Walsh ('The Obvious'), Kevin Harrington ('Act Now'), Mark Victor Hansen ('Chicken Soup for the Soul'), and Brian Tracy ('Eat That Frog!').";
    } else if (lower.includes("web3") || lower.includes("diff") || lower.includes("web2")) {
      aiB.innerText = "The key difference: Legacy Web2 ticketing takes 15–25% cuts and holds funds for 90 days. Unykorn's Web3 rails eliminate all middleman fees, settle revenue instantly via smart contracts with automated 50/50 stage splits, and protect tickets with 15-minute rotating QR codes.";
    } else if (lower.includes("balance") || lower.includes("credit")) {
      aiB.innerText = "Your active credit balance is " + userState.creditBalance + " PTI Credits ($" + userState.creditBalance + ".00 USD value). All credits apply 1:1 toward eligible summits, coaching programs, and book vaults.";
    } else {
      aiB.innerText = "As your Powerteam Concierge, I can assist with registering for summits (Ft. Lauderdale, Orlando, Miami), accessing our bestselling book vault, or checking your credit balance. What would you like to explore?";
    }

    chatArea.appendChild(aiB);
    chatArea.scrollTop = chatArea.scrollHeight;
  }, 400);
}

function toggleWalletConnect() {
  alert(`Connected Web3 Passport:\n\nWallet: 0x4E574939D460d284B5D990646D4aeaEF2D49Fa13\nCredential: Founder SBT (Non-transferable)\nNetwork: Polygon / EVM Safe Multisig Anchor\nBitGo Custody: Connected`);
}

// 3D Card mouse parallax effect
document.addEventListener("DOMContentLoaded", () => {
  renderSpeakers();
  renderBooks();
  renderCatalog();
  updateUI();

  const card = document.getElementById("passport-card");
  if (card) {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      card.style.transform = `translateY(-8px) rotateX(${-y / 15}deg) rotateY(${x / 15}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) rotateX(0) rotateY(0)";
    });
  }
});
