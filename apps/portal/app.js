// Powerteam Passport Portal — Private Interactive Sandbox Demonstration
const speakersList = [
  {
    name: "Bill Walsh",
    role: "Founder & CEO, Powerteam International",
    image: "assets/bill_walsh.jpg",
    bio: "Bestselling author of 'The Obvious', venture educator behind scalable enterprise training frameworks.",
    web3Role: "Simulated Mastermind Access & Host Credential Profile",
    tokenBadge: "Illustrative Faculty Profile"
  },
  {
    name: "Kevin Harrington",
    role: "Original Shark on Shark Tank & Pioneer of As Seen On TV",
    image: "assets/kevin_harrington.jpg",
    bio: "Launched 500+ products totaling $6B+ in sales. Bestselling author of 'Act Now' and 'Key to the Vault'.",
    web3Role: "Simulated Deal Intake & Advisory Intake Workflow",
    tokenBadge: "Illustrative Faculty Profile"
  },
  {
    name: "Les Brown",
    role: "Legendary Motivational Speaker & Speaker Coach",
    image: "assets/les_brown.jpg",
    bio: "World-renowned keynote master, coach to top platform speakers, and icon of personal achievement.",
    web3Role: "Simulated Speaker Mentorship Proof Credential",
    tokenBadge: "Illustrative Faculty Profile"
  },
  {
    name: "Brian Tracy",
    role: "Chairman & CEO, Brian Tracy International",
    image: "assets/brian_tracy.jpg",
    bio: "Consulted for 1,000+ companies, author of 80+ bestsellers including 'Eat That Frog!' and 'Psychology of Selling'.",
    web3Role: "Simulated Sales Mastery Curriculum Completion Record",
    tokenBadge: "Illustrative Faculty Profile"
  },
  {
    name: "Mark Victor Hansen",
    role: "Co-Creator of 'Chicken Soup for the Soul'",
    image: "assets/mark_victor_hansen.jpg",
    bio: "500M+ books sold globally, Guinness World Record holder, co-author of 'Ask!' and publishing titan.",
    web3Role: "Simulated Publishing Royalty & Media Vault Entitlement",
    tokenBadge: "Illustrative Faculty Profile"
  },
  {
    name: "Sharon Lechter",
    role: "Co-Author of 'Rich Dad Poor Dad' & Financial Authority",
    image: "assets/sharon_lechter.jpg",
    bio: "Presidential Advisor on Financial Literacy, CPA, and co-author of 'Think and Grow Rich for Women'.",
    web3Role: "Simulated Cashflow Cohort & Education Credential",
    tokenBadge: "Illustrative Faculty Profile"
  },
  {
    name: "Forbes Riley",
    role: "Infomercial Queen & Pitch Communication Master",
    image: "assets/forbes_riley.jpg",
    bio: "National Fitness Hall of Fame inductee, $2.5B+ in TV product sales, and creator of the Pitch Perfection method.",
    web3Role: "Simulated Pitch Studio Credential & Workshop Entitlement",
    tokenBadge: "Illustrative Faculty Profile"
  },
  {
    name: "Austin Walsh",
    role: "Digital Marketing Expert & Funnel Architect",
    image: "assets/austin_walsh.jpg",
    bio: "Direct-response conversion strategist and architect of multimillion-dollar automated traffic funnels.",
    web3Role: "Simulated Digital Funnel Toolkit Entitlement",
    tokenBadge: "Illustrative Faculty Profile"
  }
];

const booksList = [
  {
    title: "The Obvious",
    author: "Bill Walsh",
    category: "scaling",
    image: "assets/book_the_obvious.jpg",
    desc: "The definitive playbook for business acceleration, venture scaling, and converting ideas into high-ticket enterprise revenue.",
    web3Utility: "Configurable Multi-Party Royalty Smart Contract & Digital Access",
    status: "ILLUSTRATIVE CURRICULUM PREVIEW"
  },
  {
    title: "Act Now: Turn Ideas into Millions",
    author: "Kevin Harrington",
    category: "marketing",
    image: "assets/book_act_now.jpg",
    desc: "How the Original Shark spots billion-dollar opportunities, negotiates deal terms, and structures massive consumer distribution.",
    web3Utility: "Deal-Intake Gating & Verified Reader Participation Record",
    status: "ILLUSTRATIVE CURRICULUM PREVIEW"
  },
  {
    title: "Chicken Soup for the Soul",
    author: "Mark Victor Hansen",
    category: "leadership",
    image: "assets/book_chicken_soup.jpg",
    desc: "The record-breaking global publishing phenomenon with over 500 million copies sold and timeless wisdom on human potential.",
    web3Utility: "Digital Rights Architecture & Global Reader Community Access",
    status: "ILLUSTRATIVE CURRICULUM PREVIEW"
  },
  {
    title: "Eat That Frog! & Sales Psychology",
    author: "Brian Tracy",
    category: "leadership",
    image: "assets/book_eat_that_frog.jpg",
    desc: "The premier systems for high-output time management, peak performance habits, and closing high-ticket transactions.",
    web3Utility: "Programmatic Course-Progress Tracking & Completion Credential",
    status: "ILLUSTRATIVE CURRICULUM PREVIEW"
  },
  {
    title: "Think and Grow Rich for Women",
    author: "Sharon Lechter",
    category: "wealth",
    image: "assets/book_sharon_lechter.jpg",
    desc: "Mastering financial independence, building asset portfolios, and applying Napoleonic wealth principles to modern enterprise.",
    web3Utility: "Token-Gated Financial Cohort & Mastermind Entitlement",
    status: "ILLUSTRATIVE CURRICULUM PREVIEW"
  },
  {
    title: "Pitch Perfection: The Art of Influence",
    author: "Forbes Riley",
    category: "marketing",
    image: "assets/book_pitch_perfection.jpg",
    desc: "The communication blueprint that generated $2.5 Billion in sales across television and live keynote stages.",
    web3Utility: "Studio Workshop Gating & Keynote Communication Credential",
    status: "ILLUSTRATIVE CURRICULUM PREVIEW"
  }
];

let activeBookFilter = 'all';

function filterBooks(cat) {
  activeBookFilter = cat;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById(`tab-${cat}`);
  if (btn) btn.classList.add('active');
  renderBooks();
}

const catalogItems = [
  {
    sku: "SIM-CEO-SUMMIT-FTL",
    title: "CEO Success Summit — Fort Lauderdale (Illustrative)",
    date: "Proposed Schedule Format • 12:00 PM – 3:00 PM",
    venue: "Sample Luxury Venue Concept",
    tag: "ILLUSTRATIVE WORKSHOP",
    statusNote: "Shown solely for schedule layout demonstration",
    description: "Sample session structure demonstrating executive keynotes, networking luncheon, and masterclass formats."
  },
  {
    sku: "SIM-DIGITAL-SUCCESS",
    title: "Digital Success Summit (Illustrative)",
    date: "Proposed Schedule Format • Full Day Stream",
    venue: "Virtual Live Broadcast Concept",
    tag: "GLOBAL STREAM DEMO",
    statusNote: "Shown solely for schedule layout demonstration",
    description: "Sample digital marketing, automated funnels, and enterprise automation session structure."
  },
  {
    sku: "SIM-RAINMAKER-SUMMIT",
    title: "Rainmaker Business Summit (Illustrative)",
    date: "Proposed Schedule Format • 3-Day Intensive",
    venue: "Convention Center Concept",
    tag: "3-DAY INTENSIVE DEMO",
    statusNote: "Shown solely for schedule layout demonstration",
    description: "Sample flagship 3-day transformation structure demonstrating venture growth, capital, and partnership modules."
  },
  {
    sku: "SIM-ICON-SPEAKER",
    title: "Icon Speaker Accelerator (Illustrative)",
    date: "Proposed Schedule Format • Masterclass",
    venue: "Studio & Stage Concept",
    tag: "STAGE MASTERCLASS DEMO",
    statusNote: "Shown solely for schedule layout demonstration",
    description: "Sample platform speaking training, keynote preparation, and stage communication credentialing format."
  }
];

let userState = {
  passportId: "PTI-DEMO-000001",
  tier: "Sandbox Preview",
  creditBalance: 2500,
};

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

function updateUI() {
  const creditEl = document.getElementById("card-credit-val");
  if (creditEl) creditEl.innerText = `${userState.creditBalance.toLocaleString()} Credits (Demo)`;
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

  const filtered = activeBookFilter === 'all'
    ? booksList
    : booksList.filter(b => b.category === activeBookFilter);

  filtered.forEach(b => {
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
        <button class="btn btn-gold btn-full shadow-gold" style="margin-top: 1rem;" onclick="openWaitlistModal('${b.title}')">
          Explore Curriculum Preview
        </button>
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
          <span style="font-size: 0.75rem; color: #94a3b8;">SAMPLE SKU: ${item.sku}</span>
        </div>
        <h3>${item.title}</h3>
        <div class="venue-line">Venue Concept: ${item.venue}</div>
        <div class="venue-line" style="color: #60a5fa; font-weight: 500;">Format: ${item.date}</div>
        <p style="font-size: 0.85rem; color: #94a3b8; line-height: 1.5; margin-bottom: 1.5rem;">${item.description}</p>
      </div>

      <div>
        <div class="price-strip">
          <div>
            <span style="font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; font-weight: 600; display: block;">Status</span>
            <span class="cost-credits">Illustrative Program</span>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 0.7rem; color: #94a3b8; display: block;">PURCHASE / ENTRY</span>
            <span class="seats-left">Not Active</span>
          </div>
        </div>

        <button class="btn btn-gold btn-full shadow-gold" onclick="openWaitlistModal('Schedule Configuration')">
          Discuss a Pilot Configuration
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function openWaitlistModal(tierName) {
  const titleEl = document.getElementById("waitlist-title");
  if (titleEl) titleEl.innerText = tierName ? `Discuss Pilot Configuration — ${tierName}` : "Discuss a Pilot Configuration";
  document.getElementById("modal-waitlist").classList.add("active");
}
function closeWaitlistModal() {
  document.getElementById("modal-waitlist").classList.remove("active");
}

function submitWaitlistForm(e) {
  e.preventDefault();
  const name = document.getElementById("waitlist-name").value;
  const email = document.getElementById("waitlist-email").value;
  alert(`Thank you, ${name}. Your consultation request has been received.\n\nOur team will contact ${email} to discuss configuring an approved pilot around your program requirements.`);
  closeWaitlistModal();
}

function openActivityModal() {
  alert("PILOT ACTIVITY RECORDS (SANDBOX SIMULATION):\n\n• Record #REC-SIM-001: Sample 2,500 Credits Initialized\n• Status: Controlled Demonstration State\n• Ledger Model: Idempotent Ledger Architecture Ready for Integration");
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

  // AI response simulation with high-EQ Executive Chief of Staff reasoning
  setTimeout(() => {
    const aiB = document.createElement("div");
    aiB.className = "chat-bubble ai";

    const lower = text.toLowerCase();
    if (lower.includes("hotel") || lower.includes("float") || lower.includes("black card") || lower.includes("deposit") || lower.includes("venue")) {
      aiB.innerText = "The platform eliminates upfront personal float by restructuring attendee cash-flow timing: (1) Early VIP attendees and sponsors purchase credit packages 60–90 days in advance, (2) Funds flow directly into a dedicated venue escrow sub-account, and (3) As hotel room block attrition deadlines and catering BEO invoices mature, the escrow settles the vendor directly from incoming receipts—eliminating six-figure personal credit debt.";
    } else if (lower.includes("deal") || lower.includes("pitch") || lower.includes("syndicat") || lower.includes("submit") || lower.includes("harrington")) {
      aiB.innerText = "Enterprise deal submissions and product evaluations route directly through our institutional intake hub at bd.unykorn.ai. The workflow executes a standardized digital NDA, ingests your unit economics and distribution footprint using Kevin Harrington's 'Tease, Please, Seize' evaluation model, and routes the dossier directly to the deal team for syndication review.";
    } else if (lower.includes("coaching") || lower.includes("bill walsh") || lower.includes("session") || lower.includes("1-on-1")) {
      aiB.innerText = "An Executive Tier package provisions 5,000 prepaid service credits to the member Passport. A private 1-on-1 venture scaling session with Bill Walsh utilizes 2,500 credits and includes an operational growth audit based on 'The Obvious' framework. In production, sessions can be scheduled across live summits or virtual executive breakout rooms.";
    } else if (lower.includes("book") || lower.includes("vault") || lower.includes("curriculum") || lower.includes("playbook")) {
      aiB.innerText = "The resource vault houses our 5-pillar master curriculum: (1) Scaling & Venture ('The Obvious', 'Scaling Up'), (2) Sales & Marketing ('Act Now', 'Pitch Perfection', '$100M Offers'), (3) Wealth & Assets ('Think and Grow Rich for Women', 'Principles'), (4) Peak Performance ('Eat That Frog!', 'Chicken Soup for the Soul'), and (5) Web3/RWA standards.";
    } else if (lower.includes("capability") || lower.includes("built") || lower.includes("modules") || lower.includes("what is built")) {
      aiB.innerText = "This sandbox demonstrates four modular capabilities: (1) Member Experience portals & Passport credentials, (2) Event Operations with dynamic QR check-in patterns, (3) Program Operations for service credits and course entitlements, and (4) Operational Intelligence for daily reconciliation and AI concierge assistance.";
    } else if (lower.includes("credit") || lower.includes("balance") || lower.includes("ledger")) {
      aiB.innerText = "The service credit model demonstrates a centralized entitlement and prepaid service ledger. In production, credits operate under client-approved refund rules, inventory limits, and daily finance reconciliation.";
    } else {
      aiB.innerText = "I am the Powerteam Executive Concierge prototype. I can guide you through our demonstrated platform capabilities, event schedules, the 5-pillar playbook vault, hotel float escrow mechanics, or deal syndication workflows at bd.unykorn.ai. How may I assist your exploration?";
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
