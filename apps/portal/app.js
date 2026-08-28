// Powerteam Passport Portal — Member Access & Service Credit Pilot Preview
const speakersList = [
  {
    name: "Bill Walsh",
    role: "Founder & CEO, Powerteam International",
    image: "assets/bill_walsh.jpg",
    bio: "Bestselling author of 'The Obvious', venture architect behind 500+ scalable enterprise programs.",
    web3Role: "Rainmaker Host Passports & Automated 50/50 Stage Splits",
    tokenBadge: "Rainmaker Credit Host"
  },
  {
    name: "Kevin Harrington",
    role: "Original Shark on Shark Tank & Pioneer of As Seen On TV",
    image: "assets/kevin_harrington.jpg",
    bio: "Launched 500+ products totaling $6B+ in sales. Bestselling author of 'Act Now' and 'Key to the Vault'.",
    web3Role: "Venture Routing Smart Contract & Deal Syndication Rail",
    tokenBadge: "Deal Syndication Rail"
  },
  {
    name: "Les Brown",
    role: "Legendary Motivational Speaker & Speaker Coach",
    image: "assets/les_brown.jpg",
    bio: "World-renowned keynote master, coach to top platform speakers, and icon of personal achievement.",
    web3Role: "Proof-of-Mentorship Soulbound Credential (SBT)",
    tokenBadge: "Mentorship Badging SBT"
  },
  {
    name: "Brian Tracy",
    role: "Chairman & CEO, Brian Tracy International",
    image: "assets/brian_tracy.jpg",
    bio: "Consulted for 1,000+ companies, author of 80+ bestsellers including 'Eat That Frog!' and 'Psychology of Selling'.",
    web3Role: "Executive Sales Mastery On-Chain Certification",
    tokenBadge: "Sales Certification SBT"
  },
  {
    name: "Mark Victor Hansen",
    role: "Co-Creator of 'Chicken Soup for the Soul'",
    image: "assets/mark_victor_hansen.jpg",
    bio: "500M+ books sold globally, Guinness World Record holder, co-author of 'Ask!' and publishing titan.",
    web3Role: "Smart Royalty Splits (70% Author / 20% Host / 10% Tech)",
    tokenBadge: "Publishing & Media Vault"
  },
  {
    name: "Sharon Lechter",
    role: "Co-Author of 'Rich Dad Poor Dad' & Financial Authority",
    image: "assets/sharon_lechter.jpg",
    bio: "Presidential Advisor on Financial Literacy, CPA, and co-author of 'Think and Grow Rich for Women'.",
    web3Role: "Cashflow Mastermind Smart Escrow & Asset Education SBT",
    tokenBadge: "Cashflow Mastermind SBT"
  },
  {
    name: "Forbes Riley",
    role: "Infomercial Queen & Pitch Communication Master",
    image: "assets/forbes_riley.jpg",
    bio: "National Fitness Hall of Fame inductee, $2.5B+ in TV product sales, and creator of the Pitch Perfection method.",
    web3Role: "Token-Gated Pitch Studio & Stage Revenue Sweeps",
    tokenBadge: "Pitch Perfection Masterclass"
  },
  {
    name: "Austin Walsh",
    role: "Digital Marketing Expert & Funnel Architect",
    image: "assets/austin_walsh.jpg",
    bio: "Direct-response conversion strategist and architect of multimillion-dollar automated traffic funnels.",
    web3Role: "Tokenized Marketing Toolkits & Automated Attribution",
    tokenBadge: "Digital Funnel Modules"
  }
];

const booksList = [
  {
    title: "The Obvious",
    author: "Bill Walsh",
    image: "assets/book_the_obvious.jpg",
    desc: "The definitive playbook for business acceleration, venture scaling, and converting ideas into high-ticket enterprise revenue.",
    web3Utility: "Token-Gated Digital Edition + Smart Royalty Split Contract",
    status: "PROPOSED MEMBER ACCESS"
  },
  {
    title: "Act Now: Turn Ideas into Millions",
    author: "Kevin Harrington",
    image: "assets/book_act_now.jpg",
    desc: "How the Original Shark spots billion-dollar opportunities, negotiates deal terms, and structures massive consumer distribution.",
    web3Utility: "Venture Deal Intake Gating + Verified Reader Credential",
    status: "PROPOSED MEMBER ACCESS"
  },
  {
    title: "Chicken Soup for the Soul",
    author: "Mark Victor Hansen",
    image: "assets/book_chicken_soup.jpg",
    desc: "The record-breaking global publishing phenomenon with over 500 million copies sold and timeless wisdom on human potential.",
    web3Utility: "Immutable Publishing Rights Ledger + Global Reader Community Pass",
    status: "PROPOSED MEMBER ACCESS"
  },
  {
    title: "Eat That Frog! & Sales Psychology",
    author: "Brian Tracy",
    image: "assets/book_eat_that_frog.jpg",
    desc: "The premier systems for high-output time management, peak performance habits, and closing high-ticket transactions.",
    web3Utility: "Proof-of-Completion SBT + Executive Curriculum Vault",
    status: "PROPOSED MEMBER ACCESS"
  },
  {
    title: "Think and Grow Rich for Women",
    author: "Sharon Lechter",
    image: "assets/book_sharon_lechter.jpg",
    desc: "Mastering financial independence, building asset portfolios, and applying Napoleonic wealth principles to modern enterprise.",
    web3Utility: "Financial Literacy Mastermind Pass + Asset Guild Access",
    status: "PROPOSED MEMBER ACCESS"
  },
  {
    title: "Pitch Perfection: The Art of Influence",
    author: "Forbes Riley",
    image: "assets/book_pitch_perfection.jpg",
    desc: "The communication blueprint that generated $2.5 Billion in sales across television and live keynote stages.",
    web3Utility: "Pitch Mastery Verification Token + Studio Stage Access",
    status: "PROPOSED MEMBER ACCESS"
  }
];

const catalogItems = [
  {
    sku: "CEO-SUMMIT-2026-FTL",
    title: "CEO Success Summit — Fort Lauderdale",
    date: "Aug 31, 2026 • 12:00 PM – 3:00 PM (Proposed)",
    venue: "Le Méridien Dania Beach Hotel",
    tag: "LIVE WORKSHOP",
    statusNote: "Schedule to be confirmed with organizer",
    description: "Executive scaling keynotes, executive networking luncheon, and venture structuring masterclass with Bill Walsh."
  },
  {
    sku: "DIGITAL-SUCCESS-2026-SEP",
    title: "Digital Success Summit",
    date: "Sep 7, 2026 • Full Day Stream (Proposed)",
    venue: "Virtual Live Broadcast & Breakouts",
    tag: "GLOBAL STREAM",
    statusNote: "Schedule to be confirmed with organizer",
    description: "Cutting-edge digital marketing, automated sales funnels, and business automation strategies."
  },
  {
    sku: "RAINMAKER-SUMMIT-2026-ORL",
    title: "Rainmaker Business Summit — Orlando",
    date: "Sep 18–20, 2026 • 3-Day Intensive (Proposed)",
    venue: "Orlando Convention Center",
    tag: "3-DAY INTENSIVE",
    statusNote: "Schedule to be confirmed with organizer",
    description: "Flagship 3-day business transformation summit covering venture growth, capital formation, and partnership strategies."
  },
  {
    sku: "ICON-SPEAKER-2026-ORL",
    title: "Icon Speaker Accelerator Program",
    date: "Sep 23, 2026 • Stage Masterclass (Proposed)",
    venue: "Powerteam Mastery Studio & Stage",
    tag: "STAGE MASTERCLASS",
    statusNote: "Schedule to be confirmed with organizer",
    description: "Platform speaking training, keynote preparation, and stage communication credentialing."
  }
];

let userState = {
  passportId: "PTI-DEMO-000001",
  tier: "Pilot Preview",
  creditBalance: 2500,
};

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

function updateUI() {
  const creditEl = document.getElementById("card-credit-val");
  if (creditEl) creditEl.innerText = `${userState.creditBalance.toLocaleString()} PTI (Demo)`;
  const vaultEl = document.getElementById("vault-display-bal");
  if (vaultEl) vaultEl.innerHTML = `${userState.creditBalance.toLocaleString()} <span class="vault-unit">CREDITS</span>`;
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
        <div class="speaker-avatar-frame">
          <img src="${spk.image}" alt="${spk.name}" class="speaker-avatar-img" onerror="this.src='assets/hero_bg.jpg'">
        </div>
        <div class="speaker-name">${spk.name}</div>
        <div class="speaker-role">${spk.role}</div>
        <div class="speaker-bio">${spk.bio}</div>
      </div>
      <div>
        <div class="speaker-web3-utility">${spk.web3Role}</div>
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
        <div class="book-cover-frame">
          <img src="${b.image}" alt="${b.title}" class="book-cover-img" onerror="this.src='assets/hero_bg.jpg'">
        </div>
        <div class="book-title">${b.title}</div>
        <div class="book-author">By ${b.author}</div>
        <div class="book-desc">${b.desc}</div>
      </div>
      <div>
        <div class="book-web3-utility">${b.web3Utility}</div>
        <div class="book-status">
          ${b.status}
        </div>
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
        <div class="venue-line">Venue: ${item.venue}</div>
        <div class="venue-line" style="color: #60a5fa; font-weight: 500;">Date: ${item.date}</div>
        <p style="font-size: 0.85rem; color: #94a3b8; line-height: 1.5; margin-bottom: 1.5rem;">${item.description}</p>
      </div>

      <div>
        <div class="price-strip">
          <div>
            <span style="font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; font-weight: 600; display: block;">Pilot Status</span>
            <span class="cost-credits">Schedule To Be Confirmed</span>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 0.7rem; color: #94a3b8; display: block;">AVAILABILITY</span>
            <span class="seats-left">By Invitation</span>
          </div>
        </div>

        <button class="btn btn-gold btn-full shadow-gold" onclick="openWaitlistModal('${item.title}')">
          Request Event Information
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function openWaitlistModal(tierName) {
  const titleEl = document.getElementById("waitlist-title");
  if (titleEl) titleEl.innerText = tierName ? `Join Pilot Waitlist — ${tierName}` : "Join the Pilot Waitlist";
  document.getElementById("modal-waitlist").classList.add("active");
}
function closeWaitlistModal() {
  document.getElementById("modal-waitlist").classList.remove("active");
}

function submitWaitlistForm(e) {
  e.preventDefault();
  const name = document.getElementById("waitlist-name").value;
  const email = document.getElementById("waitlist-email").value;
  alert(`Thank you, ${name}. Your interest has been recorded.\n\nWe will notify ${email} with confirmed program dates, terms, and pilot invitation details.`);
  closeWaitlistModal();
}

function openActivityModal() {
  alert("PILOT ACTIVITY RECORDS (DEMO):\n\n• Demo Record #REC-001: Sample 2,500 Credits Initialized\n• Status: Controlled Demonstration State\n• Cryptographic Verification: In Staging Development");
}

function showFullQRModal() {
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
    if (lower.includes("convergence") || lower.includes("bitgo") || lower.includes("atomic") || lower.includes("wallet") || lower.includes("blockchain")) {
      aiB.innerText = "Our system converges four pillars: (1) MCP AI Agents for 24/7 routing, (2) Atomic Wallets with 15-minute rotating QR badges, (3) Blockchain smart rails for automated 50/50 stage splits, and (4) BitGo Qualified Custody for institutional MPC multi-signature cold storage.";
    } else if (lower.includes("ceo") || lower.includes("dania") || lower.includes("fort lauderdale")) {
      aiB.innerText = "The Fort Lauderdale CEO Success Summit is listed as a proposed pilot event. Final dates, venue capacity, and participation terms will be published upon approved pilot launch.";
    } else if (lower.includes("harrington") || lower.includes("shark")) {
      aiB.innerText = "Kevin Harrington is featured across our keynote educational materials and strategic advisory framework. Check the media section to view his recorded discussions on customer acquisition and business structuring.";
    } else if (lower.includes("book") || lower.includes("library")) {
      aiB.innerText = "Our educational playbook library features references to bestsellers by Bill Walsh ('The Obvious'), Kevin Harrington ('Act Now'), Mark Victor Hansen ('Chicken Soup for the Soul'), and Brian Tracy ('Eat That Frog!'). All editions integrate smart royalty splits and token-gated digital access.";
    } else if (lower.includes("credit") || lower.includes("balance")) {
      aiB.innerText = "PTI Credits, if offered, are prepaid service credits for approved Powerteam events and coaching programs. They are not cash, deposits, stablecoins, or investment products.";
    } else {
      aiB.innerText = "As your Powerteam Concierge prototype, I can assist with reviewing proposed summit schedules, faculty biographies, technological convergence details, and pilot program waitlist details. How may I help you?";
    }

    chatArea.appendChild(aiB);
    chatArea.scrollTop = chatArea.scrollHeight;
  }, 400);
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
