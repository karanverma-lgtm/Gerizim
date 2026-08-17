import confetti from 'canvas-confetti';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // GSAP Master Animation Engine Initializer
  initGSAPAnimations();

  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Theme Toggle Switcher
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const htmlEl = document.documentElement;

  const savedTheme = localStorage.getItem('gerizim_theme') || 'light';
  htmlEl.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('gerizim_theme', newTheme);
    updateThemeIcon(newTheme);
    showToast(`Switched to ${newTheme} theme mode!`, 'info');
  });

  function updateThemeIcon(theme) {
    if (themeIcon) {
      themeIcon.setAttribute('data-lucide', theme === 'light' ? 'moon' : 'sun');
      if (window.lucide) window.lucide.createIcons();
    }
  }

  // 3. Navbar Sticky Effect on Scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Hero Section 3D Parallax Tilt Effect
  const heroVisual = document.querySelector('.hero-visual');
  const heroCard = document.querySelector('.hero-main-card');
  if (heroVisual && heroCard) {
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / rect.height) * 14;
      const rotateY = (x / rect.width) * 14;
      heroCard.style.animation = 'none';
      heroCard.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    heroVisual.addEventListener('mouseleave', () => {
      heroCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      setTimeout(() => {
        if (heroCard) {
          heroCard.style.animation = 'heroFloatLevitate 6s ease-in-out infinite';
        }
      }, 300);
    });
  }

  // Mobile Drawer Toggle (Modern Web Guidance Mobile Pattern)
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileDrawerOverlay = document.getElementById('mobile-drawer-overlay');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileDrawer() {
    if (mobileDrawer && mobileDrawerOverlay) {
      mobileDrawer.classList.add('active');
      mobileDrawerOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileDrawer() {
    if (mobileDrawer && mobileDrawerOverlay) {
      mobileDrawer.classList.remove('active');
      mobileDrawerOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', openMobileDrawer);
  if (mobileDrawerClose) mobileDrawerClose.addEventListener('click', closeMobileDrawer);
  if (mobileDrawerOverlay) mobileDrawerOverlay.addEventListener('click', closeMobileDrawer);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('active')) {
      closeMobileDrawer();
    }
  });

  // 4. Data for 16 Legal Acts
  const actsData = [
    {
      id: 1,
      name: 'Shops & Commercial Establishments Act',
      year: '1961',
      category: 'factory',
      badge: 'Mandatory License',
      desc: 'Regulates working hours, opening/closing hours, leave policy, and payment of wages for commercial offices & shops.'
    },
    {
      id: 2,
      name: 'Factories Act',
      year: '1948',
      category: 'factory',
      badge: 'Safety & Health',
      desc: 'Ensures safety, health, environment, and welfare of workers in manufacturing units and industrial plants.'
    },
    {
      id: 3,
      name: 'Minimum Wages Act',
      year: '1948',
      category: 'wages',
      badge: 'Wage Revision',
      desc: 'Fixes minimum rates of wages in scheduled employments and protects workers against wage exploitation.'
    },
    {
      id: 4,
      name: 'Payment of Wages Act',
      year: '1936',
      category: 'wages',
      badge: 'Timely Salary',
      desc: 'Regulates timely payment of monthly wages without unauthorized deductions.'
    },
    {
      id: 5,
      name: 'Labour Welfare Fund Act',
      year: '1965',
      category: 'wages',
      badge: 'State Fund',
      desc: 'Mandates periodic contributions towards worker welfare funds for health, recreation, and education.'
    },
    {
      id: 6,
      name: 'Industrial Establishments (National & Festival Holidays) Act',
      year: '1963',
      category: 'wages',
      badge: 'Holiday Leave',
      desc: 'Mandates paid national and festival holidays for employees across commercial establishments.'
    },
    {
      id: 7,
      name: 'Contract Labour (Regulation & Abolition) Act',
      year: '1970',
      category: 'factory',
      badge: 'Contractor Audit',
      desc: 'Regulates employment of contract labor and licensing for principal employers and manpower contractors.'
    },
    {
      id: 8,
      name: 'Payment of Gratuity Act',
      year: '1972',
      category: 'social',
      badge: 'Retirement Benefit',
      desc: 'Provides statutory gratuity payout to employees rendering continuous service for 5+ years.'
    },
    {
      id: 9,
      name: 'Employment Exchanges (Compulsory Notification of Vacancies) Act',
      year: '1959',
      category: 'factory',
      badge: 'Job Notification',
      desc: 'Mandates reporting of hiring vacancies and quarterly returns to designated local employment exchanges.'
    },
    {
      id: 10,
      name: 'Equal Remuneration Act',
      year: '1976',
      category: 'wages',
      badge: 'Gender Equality',
      desc: 'Prevents discrimination in wage payment and recruitment on the grounds of gender.'
    },
    {
      id: 11,
      name: 'Maternity Benefit Act',
      year: '1961',
      category: 'social',
      badge: 'Paid Maternity',
      desc: 'Protects women’s employment during pregnancy and provides 26 weeks paid maternity leave.'
    },
    {
      id: 12,
      name: 'Payment of Bonus Act',
      year: '1965',
      category: 'wages',
      badge: 'Annual Bonus',
      desc: 'Provides annual statutory bonus payout to eligible employees based on enterprise profits.'
    },
    {
      id: 13,
      name: 'Employees’ State Insurance (ESI) Act',
      year: '1948',
      category: 'social',
      badge: 'Medical Cover',
      desc: 'Integrated social security scheme offering medical care, sickness benefit, and disability cover.'
    },
    {
      id: 14,
      name: 'Employees’ Provident Funds & Misc. Provisions Act',
      year: '1952',
      category: 'social',
      badge: 'EPF & Pension',
      desc: 'Retirement savings scheme comprising Provident Fund, Pension Scheme (EPS), and Insurance (EDLI).'
    },
    {
      id: 15,
      name: 'Professional Tax Act',
      year: 'State Specific',
      category: 'wages',
      badge: 'State Tax',
      desc: 'State-level statutory tax on professions, trades, and employments deducted at source.'
    },
    {
      id: 16,
      name: 'Human Capital Legal & Governance Statutes',
      year: 'Comprehensive',
      category: 'factory',
      badge: 'Enterprise Legal',
      desc: 'Customized statutory oversight covering all federal & state statutes applicable to human resource operations.'
    }
  ];

  // Render Acts Grid
  const actsContainer = document.getElementById('acts-container');
  const searchInput = document.getElementById('acts-search-input');
  const filterPills = document.querySelectorAll('.filter-pill');

  let currentCategoryFilter = 'all';

  function renderActs() {
    if (!actsContainer) return;
    const query = searchInput ? searchInput.value.toLowerCase() : '';

    const filtered = actsData.filter(act => {
      const matchCat = currentCategoryFilter === 'all' || act.category === currentCategoryFilter;
      const matchQuery = act.name.toLowerCase().includes(query) || act.desc.toLowerCase().includes(query) || act.year.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });

    actsContainer.innerHTML = filtered.map(act => `
      <div class="glass-card act-card" onclick="openActModal(${act.id})">
        <div>
          <span class="act-year">Act ${act.year}</span>
          <h4 class="act-name">${act.name}</h4>
          <p style="font-size: 0.875rem; color: var(--text-muted); line-height: 1.4;">${act.desc.substring(0, 85)}...</p>
        </div>
        <span class="act-badge">${act.badge}</span>
      </div>
    `).join('');
  }

  renderActs();

  if (searchInput) {
    searchInput.addEventListener('input', renderActs);
  }

  filterPills.forEach(btn => {
    btn.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      currentCategoryFilter = btn.getAttribute('data-filter');
      renderActs();
    });
  });

  // Modal Handler for Acts
  const actModal = document.getElementById('act-modal');
  const modalTitle = document.getElementById('modal-act-title');
  const modalBody = document.getElementById('modal-act-body');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  window.openActModal = function(actId) {
    const act = actsData.find(a => a.id === actId);
    if (!act || !actModal) return;

    modalTitle.textContent = `${act.name} (${act.year})`;
    modalBody.innerHTML = `
      <p style="margin-bottom: 16px; font-size: 1rem; color: var(--text-main); font-weight: 500;">
        ${act.desc}
      </p>
      <div style="background: rgba(0, 102, 51, 0.05); padding: 16px; border-radius: var(--radius-sm); margin-bottom: 16px;">
        <strong style="color: var(--color-primary); display: block; margin-bottom: 6px;">Gerizim Compliance Scope:</strong>
        <ul style="padding-left: 20px; font-size: 0.9rem;">
          <li>Monthly register maintenance & audit preparation.</li>
          <li>Filing of annual/half-yearly statutory returns.</li>
          <li>Handling labor inspector notices & legal hearings.</li>
          <li>Initial license registration & timely renewals.</li>
        </ul>
      </div>
    `;

    if (typeof actModal.showModal === 'function') {
      actModal.showModal();
    } else {
      actModal.setAttribute('open', '');
    }
  };

  if (modalCloseBtn && actModal) {
    modalCloseBtn.addEventListener('click', () => actModal.close());
  }

  // 5. Interactive Compliance Risk Estimator
  const calcBtn = document.getElementById('btn-run-calc');
  const riskBadge = document.getElementById('risk-level-badge');
  const statuteCountDisplay = document.getElementById('statute-count-display');

  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      const ind = document.getElementById('industry-type').value;
      const emp = document.getElementById('emp-count').value;

      let count = 12;
      let level = 'Moderate Risk';
      let isHigh = false;

      if (emp === 'enterprise' || ind === 'factory' || ind === 'construction') {
        count = 16;
        level = 'High Statutory Risk';
        isHigh = true;
      } else if (emp === 'small') {
        count = 8;
        level = 'Low Compliance Risk';
      }

      if (riskBadge) {
        riskBadge.className = `risk-badge ${isHigh ? 'high' : 'low'}`;
        riskBadge.innerHTML = `<i data-lucide="${isHigh ? 'alert-triangle' : 'shield-check'}" style="width: 14px;"></i> ${level}`;
      }

      if (statuteCountDisplay) {
        statuteCountDisplay.textContent = `${count} Acts Active`;
      }

      if (window.lucide) window.lucide.createIcons();

      showToast('Compliance Risk & Audit Requirements Evaluated!', 'success');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    });
  }

  // 6. Clientele Showcase with 20 Official Corporate Clients
  const complianceClients = [
    { name: 'M/s BRAHMA CENTER DEVELOPMENT PVT. LTD.', logo: '/logos/brahma_center.svg', cat: 'Real Estate & Infra' },
    { name: 'M/s BRAHMA CITY PRIVATE LIMITED', logo: '/logos/brahma_city.svg', cat: 'Township & Infra' },
    { name: 'M/s COLOSSUSTEX PRIVATE LIMITED', logo: '/logos/colossustex.svg', cat: 'Yarn & Textiles' },
    { name: 'M/s CROPCOIN TECHNOLOGIES PVT. LTD.', logo: '/logos/cropcoin.svg', cat: 'AgriTech & Fintech' },
    { name: 'M/S FABLE STREET LIFESTYLE SOLUTIONS', logo: '/logos/fablestreet.svg', cat: "Women's Apparel" },
    { name: 'M/s. FROG SERVICES PVT LTD.', logo: '/logos/frog_services.svg', cat: 'Telecom Operations' },
    { name: 'M/s. FROG INNOVATIONS LTD.', logo: '/logos/frog_innovations.svg', cat: 'R&D Telecom Tech' },
    { name: 'M/s IDBI BANK LTD.', logo: '/logos/idbi_bank.svg', cat: 'Commercial Banking' },
    { name: 'M/s MAAR TELECOM PVT LTD.', logo: '/logos/maar_telecom.svg', cat: 'Network Infrastructure' },
    { name: 'M/s ML OUTSOURCING SERVICES PVT LTD.', logo: '/logos/ml_outsourcing.svg', cat: 'Business Outsourcing' }
  ];

  const corporateClients = [
    { name: 'M/s MINDLANCE INDIA PRIVATE LIMITED', logo: '/logos/mindlance.svg', cat: 'Global IT Staffing' },
    { name: 'M/s MODERN SAVITRI PUBLIC SCHOOL', logo: '/logos/savitri_school.svg', cat: 'Educational Institution' },
    { name: 'M/s NAMAM INFRA ENGINEERING PVT. LTD.', logo: '/logos/namam_infra.svg', cat: 'EPC Civil Engineering' },
    { name: 'M/s THE NEW GENERATION TRUST', logo: '/logos/new_gen_trust.svg', cat: 'Social Enterprise' },
    { name: 'M/s PGM VENTURES LLP', logo: '/logos/pgm_ventures.svg', cat: 'Venture Investments' },
    { name: 'M/S SHINY MEDICAL CENTRE', logo: '/logos/shiny_medical.svg', cat: 'Healthcare & Medical' },
    { name: 'M/S DR. K.R.S KANWAR', logo: '/logos/dr_krs_kanwar.svg', cat: 'Specialist Clinic' },
    { name: 'M/s DR. KANWAR MARITIME CLINIC', logo: '/logos/dr_kanwar_maritime.svg', cat: 'Maritime Medicals' },
    { name: 'M/s SHINY MEDICAL CENTRE (OPC) PVT LTD', logo: '/logos/shiny_medical_opc.svg', cat: 'Corporate Medical' },
    { name: 'M/s SHAMBHU TECHNOLOGY SERVICES PVT LTD', logo: '/logos/shambhu_tech.svg', cat: 'Cloud & Enterprise IT' }
  ];

  const clientContainer = document.getElementById('client-grid-container');
  const tabCompliance = document.getElementById('tab-compliance');
  const tabRecruitment = document.getElementById('tab-recruitment');

  function renderClients(list) {
    if (!clientContainer) return;
    clientContainer.innerHTML = list.map(client => `
      <div class="glass-card client-logo-card-wrap" title="${client.name} - ${client.cat}">
        <img src="${client.logo}" alt="${client.name}" class="client-brand-logo-img">
      </div>
    `).join('');
  }

  renderClients(complianceClients);

  if (tabCompliance && tabRecruitment) {
    tabCompliance.addEventListener('click', () => {
      tabCompliance.classList.add('active');
      tabRecruitment.classList.remove('active');
      renderClients(complianceClients);
    });

    tabRecruitment.addEventListener('click', () => {
      tabRecruitment.classList.add('active');
      tabCompliance.classList.remove('active');
      renderClients(corporateClients);
    });
  }

  // 7. Pan-India Running Infinite Carousel Generator
  const statesList = [
    'Delhi', 'Haryana', 'Uttar Pradesh', 'Punjab',
    'Tamil Nadu', 'Karnataka', 'Rajasthan', 'Andhra Pradesh',
    'Madhya Pradesh', 'Gujarat', 'Kerala', 'Maharashtra'
  ];

  const statesCarouselTrack = document.getElementById('states-carousel-track');
  if (statesCarouselTrack) {
    const renderCard = (state) => `
      <div class="carousel-state-card" data-state="${state}">
        <div class="state-badge-icon">
          <i data-lucide="map-pin" style="width: 18px; height: 18px;"></i>
        </div>
        <span class="state-title-text">${state}</span>
        <span class="state-active-pill">Active Hub</span>
      </div>
    `;

    // Duplicate list 2x to create smooth -50% infinite seamless scroll
    const duplicatedList = [...statesList, ...statesList];
    statesCarouselTrack.innerHTML = duplicatedList.map(renderCard).join('');
    if (window.lucide) window.lucide.createIcons();

    // Attach click event handlers
    const cardEls = statesCarouselTrack.querySelectorAll('.carousel-state-card');
    cardEls.forEach(card => {
      card.addEventListener('click', () => {
        const stName = card.getAttribute('data-state');
        showToast(`Gerizim Compliance Support Active in ${stName}!`, 'info');
      });
    });
  }

  // 8. Contact Form Handling
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      showToast(`Thank you, ${name}! Your consultation request has been submitted successfully.`, 'success');
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      contactForm.reset();
    });
  }

  // Toast Helper Function
  function showToast(msg, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i data-lucide="${type === 'success' ? 'check-circle' : 'info'}" style="color: var(--color-accent);"></i>
      <span>${msg}</span>
    `;

    toastContainer.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.remove();
    }, 4000);
  }

  window.showToast = showToast;
});

// GSAP Master Animation Engine
function initGSAPAnimations() {
  // 1. Custom Spring Cursor Engine
  const cursor = document.getElementById('custom-cursor');
  const follower = document.getElementById('custom-cursor-follower');
  if (cursor && follower && window.matchMedia('(pointer: fine)').matches) {
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.1, ease: 'power3' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.1, ease: 'power3' });
    const xFollowerTo = gsap.quickTo(follower, 'x', { duration: 0.25, ease: 'power3' });
    const yFollowerTo = gsap.quickTo(follower, 'y', { duration: 0.25, ease: 'power3' });

    window.addEventListener('mousemove', (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      xFollowerTo(e.clientX);
      yFollowerTo(e.clientY);
    });

    const hoverables = document.querySelectorAll('a, button, .glass-card, .tab-btn, .filter-pill, input, select, textarea');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        follower.classList.add('active');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        follower.classList.remove('active');
      });
    });
  }

  // 2. Glass Card 3D Metallic Spotlight positioning
  const glassCards = document.querySelectorAll('.glass-card');
  glassCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 3. Hero Section Entrance Animation Timeline
  const heroTL = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });
  heroTL.from('.hero-title', { y: 40, opacity: 0, delay: 0.2 })
        .from('.hero-description', { y: 30, opacity: 0 }, '-=0.6')
        .from('.hero-actions', { y: 25, opacity: 0 }, '-=0.6')
        .from('.metrics-grid .metric-card', { y: 30, opacity: 0, stagger: 0.1 }, '-=0.5');

  // 4. ScrollTrigger Reveals for Section Headers
  const sectionHeadings = document.querySelectorAll('.section-title, .section-tag, .section-subtitle');
  sectionHeadings.forEach(el => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      },
      y: 35,
      opacity: 0,
      duration: 0.85,
      ease: 'power3.out'
    });
  });

  // 5. ScrollTrigger Reveals for Core Service Cards
  const serviceCards = document.querySelectorAll('.service-card');
  if (serviceCards.length) {
    gsap.from(serviceCards, {
      scrollTrigger: {
        trigger: '#services',
        start: 'top 75%'
      },
      y: 50,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: 'back.out(1.2)'
    });
  }

  // 6. ScrollTrigger Reveals for Value Cards
  const valueCards = document.querySelectorAll('.value-card');
  if (valueCards.length) {
    gsap.from(valueCards, {
      scrollTrigger: {
        trigger: '#about',
        start: 'top 75%'
      },
      scale: 0.9,
      y: 40,
      opacity: 0,
      duration: 0.85,
      stagger: 0.1,
      ease: 'power3.out'
    });
  }

  // 7. ScrollTrigger Reveals for Legal Acts Cards
  const actCards = document.querySelectorAll('.act-card');
  if (actCards.length) {
    gsap.from(actCards, {
      scrollTrigger: {
        trigger: '#acts',
        start: 'top 75%'
      },
      y: 45,
      opacity: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power3.out'
    });
  }

  // 8. ScrollTrigger Reveals for Contact & Office Cards
  const officeCards = document.querySelectorAll('.office-card, .contact-form-card');
  if (officeCards.length) {
    gsap.from(officeCards, {
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 75%'
      },
      y: 45,
      opacity: 0,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power3.out'
    });
  }
}
