/**
 * ==========================================================================
 * PORTFOLIO MAIN JAVASCRIPT
 * Owner: Phatcharin Issarawong (Ploy)
 * Features:
 * 1. Mobile Navigation Hamburger Menu
 * 2. Portfolio Category Filtering
 * 3. Lightbox Modal for Project Details & Preview
 * 4. Copy-to-Clipboard Functionality (Line ID, Email) with Toast Notification
 * 5. Scroll Reveal Fade-in Animations (IntersectionObserver)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initMobileNavigation();
  initPortfolioFilter();
  initPortfolioModal();
  initCopyButtons();
  initScrollAnimation();
});

/* --------------------------------------------------------------------------
 * 1. Mobile Hamburger Navigation
 * -------------------------------------------------------------------------- */
function initMobileNavigation() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const navMenu = document.querySelector('.nav-menu');

  if (!hamburgerBtn || !navMenu) return;

  // Toggle mobile navigation on button click
  hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
    hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('is-open', !isExpanded);
  });

  // Close mobile navigation when clicking on any navigation link
  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-open');
    });
  });

  // Close mobile navigation when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-open');
    }
  });

  // Close mobile navigation on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-open');
    }
  });
}

/* --------------------------------------------------------------------------
 * 2. Portfolio Category Filtering
 * -------------------------------------------------------------------------- */
function initPortfolioFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  if (!filterButtons.length || !portfolioCards.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Toggle active class on filter buttons
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');

        if (filterValue === 'all' || cardCategory === filterValue) {
          card.classList.remove('is-hidden');
          card.style.animation = 'none';
          // trigger reflow
          void card.offsetHeight;
          card.style.animation = 'cardFadeIn 0.4s ease forwards';
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });
}

// Keyframe style for portfolio filtering animation
if (!document.getElementById('portfolio-animation-style')) {
  const style = document.createElement('style');
  style.id = 'portfolio-animation-style';
  style.textContent = `
    @keyframes cardFadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `;
  document.head.appendChild(style);
}

/* --------------------------------------------------------------------------
 * 3. Portfolio Modal / Lightbox Preview
 * -------------------------------------------------------------------------- */
function initPortfolioModal() {
  const modal = document.getElementById('portfolioModal');
  if (!modal) return;

  const modalImg = modal.querySelector('.modal-image');
  const modalTitle = modal.querySelector('.modal-title');
  const modalCategory = modal.querySelector('.modal-badge');
  const modalDesc = modal.querySelector('.modal-desc');
  const closeBtn = modal.querySelector('.modal-close-btn');

  // Bind click event to each portfolio card
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  portfolioCards.forEach((card) => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.portfolio-thumb');
      const title = card.querySelector('.portfolio-title');
      const badge = card.querySelector('.portfolio-badge');
      const desc = card.querySelector('.portfolio-desc');

      if (modalImg && img) {
        modalImg.src = img.src;
        modalImg.alt = img.alt || 'Project Preview';
      }
      if (modalTitle && title) {
        modalTitle.textContent = title.textContent;
      }
      if (modalCategory && badge) {
        modalCategory.textContent = badge.textContent;
      }
      if (modalDesc) {
        const fullDesc = card.getAttribute('data-full-desc');
        modalDesc.textContent = fullDesc || (desc ? desc.textContent : 'Project details will be updated here. (รายละเอียดโปรเจกต์จะเพิ่มในภายหลัง)');
      }

      // Display Modal
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
  });

  // Close Modal handler
  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Close when clicking outside of modal container
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
 * 4. Copy-to-Clipboard (Contact Page: Line ID / Email)
 * -------------------------------------------------------------------------- */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.btn-copy');
  const toast = document.getElementById('copyToast');

  if (!copyButtons.length) return;

  copyButtons.forEach((button) => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      const textToCopy = button.getAttribute('data-copy-value');
      const label = button.getAttribute('data-copy-label') || 'Information';

      if (!textToCopy) return;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = textToCopy;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
        }

        // Visual feedback on button
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        button.style.backgroundColor = '#dcfce7';
        button.style.color = '#15803d';

        setTimeout(() => {
          button.innerHTML = originalText;
          button.style.backgroundColor = '';
          button.style.color = '';
        }, 2000);

        // Display Toast Notification
        showToast(toast, `${label} copied to clipboard!`);
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        showToast(toast, `Failed to copy. Please copy manually.`);
      }
    });
  });
}

// Toast helper
let toastTimeout;
function showToast(toastEl, message) {
  if (!toastEl) return;
  const msgText = toastEl.querySelector('.toast-msg');
  if (msgText) msgText.textContent = message;

  toastEl.classList.add('is-show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastEl.classList.remove('is-show');
  }, 2500);
}

/* --------------------------------------------------------------------------
 * 5. Scroll Animations (IntersectionObserver Fade-in)
 * -------------------------------------------------------------------------- */
function initScrollAnimation() {
  const animatedElements = document.querySelectorAll('.reveal-on-scroll');
  if (!animatedElements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    animatedElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback for legacy browsers
    animatedElements.forEach((el) => el.classList.add('is-visible'));
  }
}
