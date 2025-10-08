document.addEventListener("DOMContentLoaded", function() {
  // Auto-open modal if URL hash (or query param) matches a card
function tryOpenCardFromUrl() {
  let hash = window.location.hash;
  if (hash && hash.startsWith('#card-')) {
    let cardId = hash.replace('#card-', '');
    let cardEl = Array.from(document.querySelectorAll('.mgmt-advanced-card')).find(c => {
      const member = JSON.parse(c.getAttribute('data-member') || '{}');
      return String(member.id) === cardId;
    });
    if (cardEl) {
      const member = JSON.parse(cardEl.getAttribute('data-member') || '{}');
      showModal(member);
    }
  }
}
document.addEventListener('DOMContentLoaded', tryOpenCardFromUrl);

  // Navbar hide/show on scroll
  const navbar = document.getElementById('mainNav');
  navbar.style.transform = "translateY(-100%)";
  navbar.style.transition = "transform 0.3s";
  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      navbar.style.transform = "translateY(0)";
    } else {
      navbar.style.transform = "translateY(-100%)";
    }
  });

  // Sophisticated Hero Slideshow
  const images = [
    'assets/img/image1.jpg', 
    'assets/img/image2.jpg',
    'assets/img/image3.jpg',
    'assets/img/image4.jpg'
  ];
  let current = 0;
  const slideshow = document.querySelector('.slideshow-bg');
  const indicatorsContainer = document.querySelector('.slideshow-indicators');

  // Create indicators
  indicatorsContainer.innerHTML = images.map((_, i) =>
    `<div class="slideshow-indicator" data-idx="${i}"></div>`
  ).join('');
  const indicators = Array.from(document.querySelectorAll('.slideshow-indicator'));

  function setActiveIndicator(idx) {
    indicators.forEach((el, i) => {
      el.classList.toggle('active', i === idx);
    });
  }

  function showSlide(idx, direction = null) {
    if (!slideshow) return;
    slideshow.classList.add('fading');
    setTimeout(() => {
      const img = new Image();
      img.src = images[idx];
      img.onload = function() {
        slideshow.style.backgroundImage = `url('${images[idx]}')`;
        slideshow.classList.remove('fading');
      };
    }, 350); // Half of transition duration
    setActiveIndicator(idx);
  }

  // Initial
  const img = new Image();
  img.src = images[current];
  img.onload = function() {
    slideshow.style.backgroundImage = `url('${images[current]}')`;
  };
  setActiveIndicator(current);

  // Auto slide
  let timer = setInterval(() => {
    current = (current + 1) % images.length;
    showSlide(current, 'left');
  }, 4000);

  // Indicator click
  indicators.forEach((el, i) => {
    el.addEventListener('click', () => {
      clearInterval(timer);
      showSlide(i, i > current ? 'left' : 'right');
      current = i;
      timer = setInterval(() => {
        current = (current + 1) % images.length;
        showSlide(current, 'left');
      }, 4000);
    });
  });

  // Swipe support
  let startX = null;
  slideshow.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  });
  slideshow.addEventListener('touchend', e => {
    if (startX === null) return;
    let endX = e.changedTouches[0].clientX;
    if (Math.abs(endX - startX) > 50) {
      clearInterval(timer);
      if (endX < startX) {
        current = (current + 1) % images.length;
        showSlide(current, 'left');
      } else {
        current = (current - 1 + images.length) % images.length;
        showSlide(current, 'right');
      }
      timer = setInterval(() => {
        current = (current + 1) % images.length;
        showSlide(current, 'left');
      }, 4000);
    }
    startX = null;
  });

  // Contact form AJAX submit
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  if(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(response => {
        if(response.ok) {
          form.reset();
          successMsg.classList.remove('d-none');
          setTimeout(() => {
            successMsg.classList.add('d-none');
          }, 5000); // Hide after 5 seconds
        }
      });
    });
  }

  // Animated Counters
  function animateCounter(counter) {
    const target = +counter.getAttribute('data-target');
    const duration = 1200; // ms
    const frameRate = 30; // ms
    const steps = Math.ceil(duration / frameRate);
    let current = 0;
    const increment = target / steps;

    function updateCounter() {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current);
        setTimeout(updateCounter, frameRate);
      } else {
        counter.textContent = target + (target >= 1000 ? '+' : '');
      }
    }
    updateCounter();
  }

  // Animate when in viewport
  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top < window.innerHeight && rect.bottom > 0
    );
  }

  let countersAnimated = false;
  function triggerCounters() {
    if (countersAnimated) return;
    const counters = document.querySelectorAll('.counter');
    if (counters.length && isInViewport(counters[0])) {
      counters.forEach(animateCounter);
      countersAnimated = true;
    }
  }

  window.addEventListener('scroll', triggerCounters);
  triggerCounters();

  // Disclaimer Modal Logic
  const disclaimerModal = new bootstrap.Modal(document.getElementById('disclaimerModal'));
  disclaimerModal.show();

  document.getElementById('acceptDisclaimer').onclick = function() {
    disclaimerModal.hide();
    chatbotTimer = setTimeout(function() {
      showChatbot(true); // Play sound only on first popup
      chatbotFirstPopup = false;
    }, 5000);
  };
  document.getElementById('rejectDisclaimer').onclick = function() {
    window.location.href = "https://www.google.com";
  };

  // Chatbot close button
  const closeBtn = document.getElementById('chatbotCloseBtn');
  if (closeBtn) closeBtn.onclick = hideChatbot;

  // --- Chatbot Popup Logic ---
  let chatbotTimer = null;
  let chatbotFirstPopup = true;

  function showChatbot(playSound = false) {
    const popup = document.getElementById('chatbot-popup');
    const fab = document.getElementById('chatbot-fab');
    const sound = document.getElementById('chatbotSound');
    if (popup) {
      popup.classList.remove('d-none');
      popup.style.opacity = "1";
      if (fab) fab.classList.add('d-none');
      if (playSound && sound) {
        sound.currentTime = 0;
        sound.play();
      }
    }
  }

  function hideChatbot() {
    console.log("hideChatbot called");
    const popup = document.getElementById('chatbot-popup');
    const fab = document.getElementById('chatbot-fab');
    if (popup) {
      popup.style.opacity = "0";
      setTimeout(() => {
        popup.classList.add('d-none');
        if (fab) fab.classList.remove('d-none');
      }, 200);
    } else {
      console.log("Chatbot popup not found");
    }
  }

  // Bind FAB click in JS, not HTML!
  const fabBtn = document.getElementById('chatbot-fab');
  if (fabBtn) {
    fabBtn.addEventListener('click', function() {
      console.log('FAB clicked');
      showChatbot(false); // No sound on manual open
    });
  }

  // Highlight current day in hours list
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const today = days[new Date().getDay()];
  const hoursList = document.getElementById('hours-list');
  if (hoursList) {
    const items = hoursList.querySelectorAll('.list-group-item');
    items.forEach(item => {
      if (item.getAttribute('data-day') === today) {
        item.classList.add('active-today');
      }
    });
  }

  // Chatbot "Check Office Timings" button logic
  const timingsBtn = document.getElementById('chatbot-check-timings');
  const timingsResponse = document.getElementById('chatbot-timings-response');
  if (timingsBtn && timingsResponse) {
    timingsBtn.addEventListener('click', function() {
      const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
      const hours = {
        "Sunday": "Closed",
        "Monday": "10:30 am–7:30 pm",
        "Tuesday": "10:30 am–7:30 pm",
        "Wednesday": "10:30 am–7:30 pm",
        "Thursday": "10:30 am–7:30 pm",
        "Friday": "10:30 am–7:30 pm",
        "Saturday": "10:30 am–8:30 pm"
      };
      const today = days[new Date().getDay()];
      const todayHours = hours[today];
      if (todayHours === "Closed") {
        timingsResponse.innerHTML = `<span class="text-danger">Today (${today}): Office is closed.</span>`;
      } else {
        timingsResponse.innerHTML = `<span class="text-success">Today (${today}): Open, ${todayHours}</span>`;
      }
      timingsResponse.style.display = "block";
    });
  }

  // Typewriter effect for hero section
  const typewriterPhrases = [
    "Where Expertise Meets Integrity",
    "Leading Law Firm in Punjab",
    "Expert Legal Solutions for Modern Challenges",
    "Trusted Advisors. Proven Results.",
    "Empowering Justice with Expertise and Ethics",
    "Your Legal Compass in a Complex World",
    "Integrity. Insight. Impact.",
    "Driven by Law. Guided by Principles.",
    "Navigating Legal Complexity with Confidence",
    "Where Legal Precision Meets Practical Advice",
    "Defining Excellence in Legal Consultancy"
  ];

  let typewriterIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typewriterElement = document.getElementById('typewriter');

  function typewriterTick() {
    if (!typewriterElement) return;
    const currentPhrase = typewriterPhrases[typewriterIndex];
    if (isDeleting) {
      charIndex--;
      typewriterElement.textContent = currentPhrase.substring(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        typewriterIndex = (typewriterIndex + 1) % typewriterPhrases.length;
        setTimeout(typewriterTick,1000);// Pause before typing next
        return;
      }
      setTimeout(typewriterTick, 30);
    } else {
      charIndex++;
      typewriterElement.textContent = currentPhrase.substring(0, charIndex);
      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(typewriterTick, 1400); // Pause before erasing
        return;
      }
      setTimeout(typewriterTick, 60);
    }
  }

  // Start animation after DOM is ready
  setTimeout(typewriterTick, 600);
});

  function shareWebsite() {
    if (navigator.share) {
      navigator.share({
        title: 'B.D. Arora & Associates',
        text: 'Visit B.D. Arora & Associates for expert legal services.',
        url: window.location.href
      }).catch((error) => console.log('Sharing failed', error));
    } else {
      alert("Sharing is not supported on this device.");
    }
  }

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const memberId = btn.dataset.id;
        fetch(`/delete_member_ajax/${memberId}`, { method: 'DELETE' })
            .then(res => {
                if (res.ok) {
                    btn.closest('tr').remove();  // remove row from table
                } else {
                    alert("Error deleting member");
                }
            });
    });
});
  function toggleBio(index) {
    const bio = document.getElementById(`bio-${index}`);
    const link = bio.nextElementSibling;
    bio.classList.toggle('expanded');
    link.textContent = bio.classList.contains('expanded') ? 'Show less' : 'Read more';}


// Future slider logic or interactivity can go here for `.newnew123`
document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".newnew123");
  if (section) {
    console.log("Pillars of Organisation loaded.");
  }
});
// Animated Counters for Legal Hero
document.addEventListener("DOMContentLoaded", function() {
  const counters = document.querySelectorAll('.custom-counter');
  counters.forEach(counter => {
    const animateCounter = () => {
      const target = +counter.getAttribute('data-target');
      const duration = 1300;
      const frameRate = 24;
      const steps = Math.ceil(duration / frameRate);
      let current = 0;
      const increment = target / steps;
      function updateCounter() {
        current += increment;
        if (current < target) {
          counter.textContent = Math.floor(current);
          setTimeout(updateCounter, frameRate);
        } else {
          counter.textContent = target + (target >= 1000 ? '+' : '');
        }
      }
      updateCounter();
    };
    animateCounter(counter);
  });
});

// Chatbot open/close
document.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('chatbot-popup');
  const fab = document.getElementById('chatbot-fab');
  const closeBtn = document.getElementById('chatbotCloseBtn');

  // Show FAB after delay for animation
  setTimeout(() => fab.classList.remove('d-none'), 600);

  fab.addEventListener('click', () => {
    popup.classList.remove('d-none');
    fab.style.display = 'none';
  });
  closeBtn.addEventListener('click', () => {
    popup.classList.add('d-none');
    fab.style.display = '';
  });

  // Accessibility: close chatbot with Escape key
  document.addEventListener('keydown', (e) => {
    if (!popup.classList.contains('d-none') && e.key === 'Escape') {
      popup.classList.add('d-none');
      fab.style.display = '';
    }
  });
});


document.addEventListener('DOMContentLoaded', function () {
  // Show tap hint briefly & animate wiggle
  setTimeout(() => {
    document.querySelectorAll('.mgmt-advanced-tap-hint').forEach(hint => {
      hint.style.opacity = "1";
    });
  }, 600);
  setTimeout(() => {
    document.querySelectorAll('.mgmt-advanced-tap-hint').forEach(hint => {
      hint.style.opacity = "0";
    });
  }, 4000);

  setTimeout(() => {
    document.querySelectorAll('.mgmt-advanced-card').forEach(card => {
      card.setAttribute('data-animate', 'true');
      setTimeout(() => card.removeAttribute('data-animate'), 800);
    });
  }, 1800);

  // Show modal and fill data
  function showModal(member) {
    const modal = document.getElementById('mgmt-card-modal');
    modal.classList.remove('d-none');
    document.body.style.overflow = "hidden";

    document.getElementById('mgmt-card-modal-name').textContent = member.name || '';
    document.getElementById('mgmt-card-modal-role').textContent = member.designation || '';
    document.getElementById('mgmt-card-modal-img').src = member.image_url || '';
    document.getElementById('mgmt-card-modal-img').alt = member.name || '';
    document.getElementById('mgmt-card-modal-bio').textContent = member.bio || '';

    const socialRoot = document.getElementById('mgmt-card-modal-social');
    socialRoot.innerHTML = '';
    if (member.linkedin) {
      socialRoot.innerHTML = `<a href="${member.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a>`;
    }

    const callBtn = document.getElementById('mgmt-modal-call-btn');
    if (member.phone) {
      callBtn.href = "tel:" + member.phone;
      callBtn.style.display = "inline-flex";
    } else {
      callBtn.style.display = "none";
    }

    const whatsappBtn = document.getElementById('mgmt-modal-whatsapp-btn');
    if (member.phone) {
      const cleanPhone = member.phone.replace(/\D/g, '');
      whatsappBtn.href = "https://wa.me/" + cleanPhone;
      whatsappBtn.style.display = "inline-flex";
    } else {
      whatsappBtn.style.display = "none";
    }

    const shareBtn = document.getElementById('mgmt-modal-share-btn');
    shareBtn.onclick = function () {
  const cardUrl = window.location.origin + window.location.pathname + "#card-" + member.id;
  if (navigator.share) {
    navigator.share({
      title: member.name + " - BD Arora And Associates",
      text: "View the digital business card of " + member.name,
      url: cardUrl,
    });
  } else {
    navigator.clipboard.writeText(cardUrl);
    shareBtn.textContent = "Copied card link!";
    setTimeout(() => shareBtn.textContent = "Share Card", 1200);
  }
};
window.history.replaceState(null, '', '#card-' + (member.id || ''));

  }

  // Click and keyboard handling
  document.querySelectorAll('.mgmt-advanced-card').forEach(card => {
    const member = JSON.parse(card.getAttribute('data-member') || '{}');
    card.addEventListener('click', () => showModal(member));
    card.addEventListener('keydown', e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        showModal(member);
      }
    });
  });

  // Close modal handlers
  function closeModal() {
    const modal = document.getElementById('mgmt-card-modal');
    modal.classList.add('d-none');
    document.body.style.overflow = "";
      document.getElementById('mgmt-card-modal').classList.add('d-none');
  document.body.style.overflow = "";
  window.history.replaceState(null, '', window.location.pathname);
  }
  document.getElementById('mgmtCardModalCloseBtn').onclick = closeModal;
  document.getElementById('mgmt-card-modal').addEventListener('click', function (e) {
    if (e.target === this || e.target.classList.contains('mgmt-card-modal-backdrop')) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === "Escape" && !document.getElementById('mgmt-card-modal').classList.contains('d-none')) closeModal();
  });
});
// Assuming you already load data-member into modal
const whatsappBtn = document.getElementById("mgmt-modal-whatsapp-btn");

if (member.phone) {
  // remove spaces / special chars just in case
  const phoneClean = member.phone.replace(/\D/g, '');
  whatsappBtn.href = `https://wa.me/${phoneClean}`;
  whatsappBtn.classList.remove("d-none");
} else {
  whatsappBtn.href = "#";
  whatsappBtn.classList.add("d-none"); // hide if no phone
}
