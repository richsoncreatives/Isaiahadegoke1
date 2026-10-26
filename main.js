/**
 * Isaiah Adegoke - Official Website Interaction Suite
 * Pure Vanilla JavaScript: High performance, accessible, zero external runtime dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollIndicator();
  initRevealAnimations();
  initMobileMenu();
  initActiveNav();
  initTriFoldTabs();
  initHeroAccordion();
  initHonorsAccordion();
  initSpeakingTabs();
  initPodcastPlayer();
  initInsightsFilter();
  initCheckoutModal();
  initSpeakingModal();
  initSearchModal();
  initFormsAndToasts();
});

/* -------------------------------------------------------------------------
   1. Scroll Indicator Line
   ------------------------------------------------------------------------- */
function initScrollIndicator() {
  const indicator = document.getElementById('scroll-indicator');
  if (!indicator) return;

  const updateScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    indicator.style.height = `${Math.min(100, Math.max(0, progress))}%`;
  };

  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();
}

/* -------------------------------------------------------------------------
   2. Scroll Reveal Animations (Intersection Observer)
   ------------------------------------------------------------------------- */
function initRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* -------------------------------------------------------------------------
   3. Responsive Mobile Menu Drawer
   ------------------------------------------------------------------------- */
function initMobileMenu() {
  const menuButtons = document.querySelectorAll('[data-menu-toggle]');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('mobile-drawer-backdrop');
  const closeBtn = document.getElementById('mobile-drawer-close');

  if (!drawer) return;

  const openDrawer = () => {
    drawer.classList.remove('translate-x-full');
    drawer.classList.add('translate-x-0');
    if (backdrop) {
      backdrop.classList.remove('hidden', 'opacity-0');
      backdrop.classList.add('opacity-100');
    }
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('translate-x-0');
    drawer.classList.add('translate-x-full');
    if (backdrop) {
      backdrop.classList.remove('opacity-100');
      backdrop.classList.add('opacity-0');
      setTimeout(() => backdrop.classList.add('hidden'), 300);
    }
    document.body.style.overflow = '';
  };

  menuButtons.forEach(btn => btn.addEventListener('click', openDrawer));
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !drawer.classList.contains('translate-x-full')) {
      closeDrawer();
    }
  });
}

/* -------------------------------------------------------------------------
   4. Active Navigation Links
   ------------------------------------------------------------------------- */
function initActiveNav() {
  const currentPath = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
  const navLinks = document.querySelectorAll('nav a[href]');

  navLinks.forEach(link => {
    const rawHref = link.getAttribute('href');
    if (!rawHref) return;

    const href = rawHref.toLowerCase();
    const isHome = (href === '/' || href === 'index.html' || href === '/index.html') && (currentPath === '' || currentPath === '/' || currentPath.endsWith('index.html'));
    const isMatch = href.includes(currentPath.split('/').pop() || 'index') && !isHome;

    if (isHome || (currentPath !== '/' && href.endsWith(currentPath.split('/').pop()))) {
      link.classList.add('text-burgundy', 'font-semibold');
      link.classList.remove('text-navy', 'text-white/75');
    }
  });
}

/* -------------------------------------------------------------------------
   5. Home Page Hero Accordion (Quality, Sustainability, Faith, Authorship)
   ------------------------------------------------------------------------- */
function initHeroAccordion() {
  const items = document.querySelectorAll('.hero-accordion-item');
  if (!items.length) return;

  items.forEach(item => {
    const trigger = item.querySelector('.hero-accordion-trigger');
    const content = item.querySelector('.hero-accordion-content');
    const title = item.querySelector('.hero-accordion-title');

    item.addEventListener('click', () => {
      const isOpen = content.classList.contains('max-h-24');

      // Close all
      items.forEach(other => {
        const otherContent = other.querySelector('.hero-accordion-content');
        const otherTitle = other.querySelector('.hero-accordion-title');
        if (otherContent) {
          otherContent.classList.remove('max-h-24', 'opacity-100', 'mt-1');
          otherContent.classList.add('max-h-0', 'opacity-0');
        }
        if (otherTitle) {
          otherTitle.classList.remove('text-burgundy');
          otherTitle.classList.add('text-navy/50');
        }
      });

      // If wasn't open, open this one
      if (!isOpen && content) {
        content.classList.remove('max-h-0', 'opacity-0');
        content.classList.add('max-h-24', 'opacity-100', 'mt-1');
        if (title) {
          title.classList.remove('text-navy/50');
          title.classList.add('text-burgundy');
        }
      }
    });
  });
}

/* -------------------------------------------------------------------------
   6. Home Page Tri-Fold Mandate Tabs
   ------------------------------------------------------------------------- */
function initTriFoldTabs() {
  const tabButtons = document.querySelectorAll('[data-trifold-tab]');
  const tabPanels = document.querySelectorAll('[data-trifold-panel]');
  if (!tabButtons.length) return;

  const panelsData = {
    corporate: {
      headline: 'Quality assurance and continuous improvement leadership across beverage and food manufacturing on two continents.',
      points: [
        'Sole night-shift QA technician at Coca-Cola Southwest Beverages: 100+ samples per shift at 100% compliance and 15+ critical checkpoints audited nightly.',
        'As QA Manager at Healthy Haven Ghana, led Lean Six Sigma projects and partnerships that lifted profitability by 20%.',
        'Zero microbial contamination record sustained through strict sanitation protocols.',
        'Peer-reviewed and conference research on AI-enhanced corporate sustainability.'
      ]
    },
    leadership: {
      headline: 'A pastoral heart dedicated to character development, campus ministry, and discipleship in the marketplace.',
      points: [
        'Ordained minister and youth pastor with over a decade of continuous service across Ghana and the United States.',
        'Mentored 200+ undergraduate and graduate scholars through structured discipleship and personal accountability programs.',
        'Host of The Believer\'s Corner podcast, exploring practical questions of faith, relational integrity, and life purpose.',
        'Devoted family leadership alongside Mrs. Pearl Adegoke, exemplifying marriage as ministry and stewardship.'
      ]
    },
    authorship: {
      headline: 'Clear, rigorous publications and speaking engagements connecting divine order with marketplace execution.',
      points: [
        'Author of "The Assignment & The Tools: Kingdom Laws for Purpose, Excellence and Business" (published internationally on Amazon).',
        'Keynote speaker on Operational Excellence, Lean Thinking, and AI in Sustainable Manufacturing.',
        'Author of six peer-reviewed and conference publications in sustainability, SME innovation, and supply chain management.',
        'Guest lecturer and facilitator for university leadership and graduate research symposiums.'
      ]
    }
  };

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-trifold-tab');
      tabButtons.forEach(b => {
        b.classList.remove('bg-burgundy', 'text-white');
        b.classList.add('bg-navy', 'hover:bg-white/5');
        b.setAttribute('aria-selected', 'false');
      });

      btn.classList.add('bg-burgundy', 'text-white');
      btn.classList.remove('bg-navy', 'hover:bg-white/5');
      btn.setAttribute('aria-selected', 'true');

      const data = panelsData[key];
      const panel = document.getElementById('trifold-panel-content');
      if (panel && data) {
        panel.innerHTML = `
          <p class="font-heading text-2xl md:text-3xl leading-snug">${data.headline}</p>
          <ul class="space-y-4">
            ${data.points.map(pt => `
              <li class="flex gap-3 text-white/80">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-gold shrink-0 mt-1"><path d="M20 6 9 17l-5-5"></path></svg>
                <span>${pt}</span>
              </li>
            `).join('')}
          </ul>
        `;
      }
    });
  });
}

/* -------------------------------------------------------------------------
   7. Experience Page Honors Accordion (Technology vs. Sustainability)
   ------------------------------------------------------------------------- */
function initHonorsAccordion() {
  const cards = document.querySelectorAll('[data-honors-card]');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => {
        c.classList.remove('md:flex-[3]', 'bg-burgundy/30');
        c.classList.add('md:flex-1', 'hover:bg-white/5');
        const list = c.querySelector('.honors-list');
        const btn = c.querySelector('button');
        if (list) list.classList.add('hidden');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      card.classList.add('md:flex-[3]', 'bg-burgundy/30');
      card.classList.remove('md:flex-1', 'hover:bg-white/5');
      const list = card.querySelector('.honors-list');
      const btn = card.querySelector('button');
      if (list) list.classList.remove('hidden');
      if (btn) btn.setAttribute('aria-expanded', 'true');
    });
  });
}

/* -------------------------------------------------------------------------
   8. Speaking Page Tabs (Podcast, Topics, Request Form)
   ------------------------------------------------------------------------- */
function initSpeakingTabs() {
  const tabs = document.querySelectorAll('[data-speaking-tab]');
  const panels = document.querySelectorAll('[data-speaking-panel]');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-speaking-tab');

      tabs.forEach(t => {
        t.classList.remove('bg-navy', 'text-white', 'shadow');
        t.classList.add('text-muted-foreground');
        t.setAttribute('aria-selected', 'false');
      });

      tab.classList.add('bg-navy', 'text-white', 'shadow');
      tab.classList.remove('text-muted-foreground');
      tab.setAttribute('aria-selected', 'true');

      panels.forEach(p => {
        if (p.getAttribute('data-speaking-panel') === target) {
          p.classList.remove('hidden');
        } else {
          p.classList.add('hidden');
        }
      });
    });
  });
}

/* -------------------------------------------------------------------------
   9. Podcast Episode Player Simulator
   ------------------------------------------------------------------------- */
const EPISODES = [
  {
    id: 3,
    title: 'Real Faith in Real Relationships',
    subtitle: 'Episode 3 · The Believer\'s Corner',
    duration: '38:42',
    date: 'Oct 2026',
    description: 'In this candid conversation, Isaiah and guests explore the reality of Christian dating, covenant marriage, and establishing emotional boundaries anchored in biblical wisdom.',
    youtube: 'https://www.youtube.com/@pneumachannel'
  },
  {
    id: 2,
    title: 'Purpose After Graduation',
    subtitle: 'Episode 2 · The Believer\'s Corner',
    duration: '42:15',
    date: 'Sep 2026',
    description: 'Transitioning from university into the workforce is often disorienting. Isaiah breaks down why purpose is unveiled in progressive phases rather than all at once.',
    youtube: 'https://www.youtube.com/@pneumachannel'
  },
  {
    id: 1,
    title: 'Faith at Work: Can Excellence be Worship?',
    subtitle: 'Episode 1 · The Believer\'s Corner',
    duration: '35:50',
    date: 'Aug 2026',
    description: 'Can industrial engineering, plant floor audits, and Lean Six Sigma standards be acts of spiritual devotion? Isaiah shares his philosophy on excellence as stewardship.',
    youtube: 'https://www.youtube.com/@pneumachannel'
  }
];

function initPodcastPlayer() {
  const playerContainer = document.getElementById('podcast-player-container');
  const episodeBtns = document.querySelectorAll('[data-episode-id]');
  if (!playerContainer || !episodeBtns.length) return;

  let currentEp = EPISODES[0];
  let isPlaying = false;
  let timerInterval = null;
  let currentSeconds = 0;

  const playBtn = document.getElementById('podcast-play-btn');
  const titleEl = document.getElementById('player-title');
  const tagEl = document.getElementById('player-tag');
  const descEl = document.getElementById('player-description');
  const durationEl = document.getElementById('player-duration');
  const timeCurrentEl = document.getElementById('player-time-current');
  const progressBar = document.getElementById('player-progress-bar');
  const audioVisualizer = document.getElementById('audio-visualizer');

  function renderEpisode(ep) {
    currentEp = ep;
    if (titleEl) titleEl.textContent = ep.title;
    if (tagEl) tagEl.textContent = `Episode ${ep.id}`;
    if (descEl) descEl.textContent = ep.description;
    if (durationEl) durationEl.textContent = ep.duration;

    // Reset progress
    currentSeconds = 0;
    if (timeCurrentEl) timeCurrentEl.textContent = '00:00';
    if (progressBar) progressBar.style.width = '0%';

    episodeBtns.forEach(btn => {
      const btnId = parseInt(btn.getAttribute('data-episode-id'), 10);
      if (btnId === ep.id) {
        btn.classList.add('border-gold', 'bg-white', 'shadow-sm');
        btn.classList.remove('border-navy/10');
      } else {
        btn.classList.remove('border-gold', 'bg-white', 'shadow-sm');
        btn.classList.add('border-navy/10');
      }
    });
  }

  function togglePlay() {
    isPlaying = !isPlaying;
    const icon = playBtn ? playBtn.querySelector('.play-icon') : null;
    const pauseIcon = playBtn ? playBtn.querySelector('.pause-icon') : null;

    if (isPlaying) {
      if (icon) icon.classList.add('hidden');
      if (pauseIcon) pauseIcon.classList.remove('hidden');
      if (audioVisualizer) audioVisualizer.classList.remove('hidden');

      timerInterval = setInterval(() => {
        currentSeconds++;
        const mins = String(Math.floor(currentSeconds / 60)).padStart(2, '0');
        const secs = String(currentSeconds % 60).padStart(2, '0');
        if (timeCurrentEl) timeCurrentEl.textContent = `${mins}:${secs}`;
        // mock total 2400 seconds
        const pct = Math.min(100, (currentSeconds / 2320) * 100);
        if (progressBar) progressBar.style.width = `${pct}%`;
      }, 1000);

      showToast(`Playing: ${currentEp.title}`);
    } else {
      if (icon) icon.classList.remove('hidden');
      if (pauseIcon) pauseIcon.classList.add('hidden');
      if (audioVisualizer) audioVisualizer.classList.add('hidden');
      clearInterval(timerInterval);
    }
  }

  if (playBtn) playBtn.addEventListener('click', togglePlay);

  episodeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const epId = parseInt(btn.getAttribute('data-episode-id'), 10);
      const found = EPISODES.find(e => e.id === epId);
      if (found) {
        if (isPlaying) togglePlay(); // pause first
        renderEpisode(found);
      }
    });
  });
}

/* -------------------------------------------------------------------------
   10. Insights Blog Filter & Live Search
   ------------------------------------------------------------------------- */
function initInsightsFilter() {
  const filterBtns = document.querySelectorAll('[data-insight-category]');
  const searchInput = document.getElementById('insight-search');
  const cards = document.querySelectorAll('[data-article-card]');
  const emptyState = document.getElementById('no-articles-found');
  if (!cards.length) return;

  let activeCategory = 'All';
  let searchTerm = '';

  function applyFilter() {
    let visibleCount = 0;

    cards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || '';
      const cardTitle = (card.querySelector('h3')?.textContent || '').toLowerCase();
      const cardExcerpt = (card.querySelector('p')?.textContent || '').toLowerCase();

      const matchesCat = activeCategory === 'All' || cardCategory.includes(activeCategory);
      const matchesSearch = !searchTerm || cardTitle.includes(searchTerm) || cardExcerpt.includes(searchTerm);

      if (matchesCat && matchesSearch) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.classList.remove('hidden');
      } else {
        emptyState.classList.add('hidden');
      }
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-navy', 'text-white', 'border-navy');
        b.classList.add('border-navy/20', 'text-navy', 'hover:border-gold');
      });

      btn.classList.add('bg-navy', 'text-white', 'border-navy');
      btn.classList.remove('border-navy/20', 'text-navy');

      activeCategory = btn.getAttribute('data-insight-category') || 'All';
      applyFilter();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      applyFilter();
    });
  }
}

/* -------------------------------------------------------------------------
   11. Active E-Commerce Checkout Flow Modal
   ------------------------------------------------------------------------- */
function initCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (!modal) return;

  const openBtns = document.querySelectorAll('[data-open-checkout]');
  const closeBtns = modal.querySelectorAll('[data-close-checkout]');
  const railBtns = modal.querySelectorAll('[data-rail-toggle]');
  const intlFields = document.getElementById('rail-international');
  const africaFields = document.getElementById('rail-africa');
  const checkoutForm = document.getElementById('checkout-form');
  const successState = document.getElementById('checkout-success');
  const productSelect = document.getElementById('checkout-product');
  const totalAmountEl = document.getElementById('checkout-total-price');

  const prices = {
    paperback: { usd: 24.99, ghs: 340 },
    ebook: { usd: 9.99, ghs: 140 },
    signed: { usd: 39.99, ghs: 550 }
  };

  let currentRail = 'international';

  function updateTotal() {
    const prod = productSelect ? productSelect.value : 'paperback';
    const priceObj = prices[prod] || prices.paperback;
    if (totalAmountEl) {
      if (currentRail === 'africa') {
        totalAmountEl.textContent = `GHS ${priceObj.ghs.toFixed(2)}`;
      } else {
        totalAmountEl.textContent = `$${priceObj.usd.toFixed(2)} USD`;
      }
    }
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const format = btn.getAttribute('data-book-format') || 'paperback';
      if (productSelect) productSelect.value = format;
      updateTotal();

      modal.classList.remove('hidden');
      if (successState) successState.classList.add('hidden');
      if (checkoutForm) checkoutForm.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  closeBtns.forEach(b => b.addEventListener('click', closeModal));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  railBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentRail = btn.getAttribute('data-rail-toggle');
      railBtns.forEach(b => {
        b.classList.remove('bg-burgundy', 'text-white');
        b.classList.add('bg-white', 'text-navy', 'border-navy/20');
      });
      btn.classList.add('bg-burgundy', 'text-white');
      btn.classList.remove('bg-white', 'text-navy', 'border-navy/20');

      if (currentRail === 'africa') {
        if (intlFields) intlFields.classList.add('hidden');
        if (africaFields) africaFields.classList.remove('hidden');
      } else {
        if (africaFields) africaFields.classList.add('hidden');
        if (intlFields) intlFields.classList.remove('hidden');
      }
      updateTotal();
    });
  });

  if (productSelect) {
    productSelect.addEventListener('change', updateTotal);
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = checkoutForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg> Processing Order...
        `;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Complete Order';
        }
        if (checkoutForm) checkoutForm.classList.add('hidden');
        if (successState) {
          successState.classList.remove('hidden');
          const refEl = document.getElementById('order-ref-code');
          if (refEl) {
            refEl.textContent = `IA-${Math.floor(100000 + Math.random() * 900000)}`;
          }
        }
        showToast('Payment confirmed! Your order receipt has been generated.');
      }, 1200);
    });
  }
}

/* -------------------------------------------------------------------------
   12. "Request to Speak" Modal
   ------------------------------------------------------------------------- */
function initSpeakingModal() {
  const modal = document.getElementById('speaking-modal');
  if (!modal) return;

  const openBtns = document.querySelectorAll('[data-open-speaking-modal]');
  const closeBtns = modal.querySelectorAll('[data-close-speaking-modal]');
  const form = document.getElementById('speaking-modal-form');
  const successState = document.getElementById('speaking-modal-success');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const topic = btn.getAttribute('data-speaking-topic') || '';
      const topicSelect = document.getElementById('modal-speaking-topic');
      if (topicSelect && topic) {
        topicSelect.value = topic;
      }
      modal.classList.remove('hidden');
      if (form) form.classList.remove('hidden');
      if (successState) successState.classList.add('hidden');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  closeBtns.forEach(b => b.addEventListener('click', closeModal));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting Proposal Request...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Invitation Request';
        }
        form.classList.add('hidden');
        if (successState) successState.classList.remove('hidden');
        showToast('Speaking inquiry submitted. Isaiah will review within 48 hours.');
      }, 1000);
    });
  }
}

/* -------------------------------------------------------------------------
   13. Search Modal Overlay (Cmd+K / Click)
   ------------------------------------------------------------------------- */
const SEARCH_INDEX = [
  { title: 'The Assignment & The Tools (Book)', category: 'Bookstore', url: 'library.html', desc: 'Kingdom Laws for Purpose, Excellence and Business.' },
  { title: 'Episode 3: Real Faith in Real Relationships', category: 'Podcast', url: 'speaking.html', desc: 'The Believer\'s Corner discussion on covenant marriage and purpose.' },
  { title: 'Episode 2: Purpose After Graduation', category: 'Podcast', url: 'speaking.html', desc: 'Guidance for graduates aligning career with spiritual calling.' },
  { title: 'Episode 1: Faith at Work: Can Excellence be Worship?', category: 'Podcast', url: 'speaking.html', desc: 'Integrating engineering precision with spiritual devotion.' },
  { title: 'Optimizing Healthy Haven Juice Production with Lean Six Sigma', category: 'Publications', url: 'experience.html', desc: 'Continuous improvement in food manufacturing.' },
  { title: 'AI-Enhanced Corporate Sustainability at Belvedere Trading', category: 'Research', url: 'experience.html', desc: 'Peer-reviewed research on environmental systems and AI.' },
  { title: 'Quality Assurance Technician at Coca-Cola Southwest', category: 'Experience', url: 'experience.html', desc: '100+ tests per shift across 24/7 continuous operations.' },
  { title: 'Two Master\'s Degrees: Technology & Sustainability', category: 'Academic Credentials', url: 'about.html', desc: 'Distinguished graduate scholar at Eastern Illinois University.' },
  { title: 'Speaking: Faith, Purpose & The Assignment', category: 'Speaking Topic', url: 'speaking.html', desc: 'Keynote on purpose, stewardship, and professional rigor.' },
  { title: 'Direct Order for Signed & Bulk Books', category: 'Bookstore', url: 'library.html', desc: 'Available for international shipment and African local delivery.' }
];

function initSearchModal() {
  const modal = document.getElementById('search-modal');
  const openBtns = document.querySelectorAll('[aria-label="Search"], [data-open-search]');
  const closeBtns = modal ? modal.querySelectorAll('[data-close-search]') : [];
  const searchInput = document.getElementById('site-search-input');
  const resultsContainer = document.getElementById('site-search-results');

  if (!modal || !searchInput || !resultsContainer) return;

  const openSearch = (e) => {
    if (e) e.preventDefault();
    modal.classList.remove('hidden');
    searchInput.value = '';
    renderResults(SEARCH_INDEX.slice(0, 5));
    setTimeout(() => searchInput.focus(), 50);
    document.body.style.overflow = 'hidden';
  };

  const closeSearch = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  openBtns.forEach(b => b.addEventListener('click', openSearch));
  closeBtns.forEach(b => b.addEventListener('click', closeSearch));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeSearch();
  });

  // Hotkey Cmd+K or Ctrl+K
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (modal.classList.contains('hidden')) {
        openSearch();
      } else {
        closeSearch();
      }
    } else if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeSearch();
    }
  });

  function renderResults(items) {
    if (!items.length) {
      resultsContainer.innerHTML = `
        <div class="p-8 text-center text-navy/60">
          <p class="font-heading text-lg">No matching records found.</p>
          <p class="text-sm mt-1">Try searching for "Quality", "Book", "Podcast", or "Sustainability".</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = items.map(item => `
      <a href="${item.url}" class="block p-4 hover:bg-parchment border-b border-navy/10 transition-colors group">
        <div class="flex items-center justify-between gap-3">
          <h4 class="font-heading text-navy font-semibold group-hover:text-burgundy transition-colors">${item.title}</h4>
          <span class="text-xs uppercase tracking-widest text-gold bg-navy px-2.5 py-0.5 rounded">${item.category}</span>
        </div>
        <p class="text-xs text-navy/70 mt-1">${item.desc}</p>
      </a>
    `).join('');
  }

  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (!q) {
      renderResults(SEARCH_INDEX.slice(0, 5));
      return;
    }
    const matched = SEARCH_INDEX.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.desc.toLowerCase().includes(q) || 
      item.category.toLowerCase().includes(q)
    );
    renderResults(matched);
  });
}

/* -------------------------------------------------------------------------
   14. Form Submissions & Universal Toast Notifications
   ------------------------------------------------------------------------- */
function initFormsAndToasts() {
  // Newsletter forms
  const newsForms = document.querySelectorAll('form[data-newsletter-form]');
  newsForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        showToast('Thank you for subscribing to community dispatches.');
        input.value = '';
      }
    });
  });

  // General contact form
  const contactForm = document.getElementById('main-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending Message...';
      }
      setTimeout(() => {
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Send inquiry';
        }
        contactForm.reset();
        showToast('Your message has been sent to Isaiah. We review all notes within 48h.');
      }, 1000);
    });
  }
}

function showToast(message) {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed bottom-5 left-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'pointer-events-auto bg-navy border border-gold/70 text-white p-4 shadow-xl rounded-md flex items-center gap-3 transition-all transform translate-y-4 opacity-0 text-sm';
  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gold shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-4', 'opacity-0');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}
