document.addEventListener("DOMContentLoaded", function() {
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
