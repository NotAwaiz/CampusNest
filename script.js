// =========================================================
// CAMPUSNEST — COMPLETE FRONTEND LOGIC
// Includes the brand-video scroll gate + existing site logic.
// =========================================================


/* =========================================================
   01. BRAND INTRO / VIDEO SCROLL EXPERIENCE
   ---------------------------------------------------------
   Behaviour:

   1. First downward scroll:
      - Scroll is stopped.
      - Brand video starts playing.

   2. Second downward scroll:
      - User is allowed to move to the actual homepage.

   3. If user does NOT scroll away:
      - Video finishes.
      - Final frame is held briefly.
      - Page automatically scrolls to the homepage hero.

   4. If user manually leaves the video:
      - Video pauses.
      - No automatic scrolling happens later.

   5. If user returns to the video:
      - Video stays paused.
      - User can click the video to continue.

   6. Clicking the video:
      - Pauses if playing.
      - Resumes if paused.
      - Restarts if video has ended.

   ========================================================= */

const brandIntro = document.getElementById('brand-intro');
const brandVideo = document.getElementById('brand-intro-video');
const brandIntroStatus = document.getElementById('brand-intro-status');
const brandIntroStatusText = document.getElementById('brand-intro-status-text');

let brandVideoStarted = false;
let brandIntroManuallyLeft = false;
let brandAutoScrolling = false;

let firstScrollConsumed = false;

let wheelGestureActive = false;
let wheelGestureTimer = null;

let touchStartY = 0;
let touchGestureActive = false;


/* ---------------------------------------------------------
   Check whether the brand intro is currently visible
   --------------------------------------------------------- */

function isBrandIntroVisible() {
  if (!brandIntro) return false;

  const rect = brandIntro.getBoundingClientRect();

  const viewportHeight =
    window.innerHeight ||
    document.documentElement.clientHeight;

  return (
    rect.top < viewportHeight * 0.65 &&
    rect.bottom > viewportHeight * 0.35
  );
}


/* ---------------------------------------------------------
   Brand intro status message
   --------------------------------------------------------- */

function setBrandStatus(message, hide = false) {
  if (!brandIntroStatus || !brandIntroStatusText) return;

  brandIntroStatusText.textContent = message;

  brandIntroStatus.classList.toggle(
    'is-hidden',
    hide
  );
}


/* ---------------------------------------------------------
   Play brand video
   --------------------------------------------------------- */

function playBrandVideo() {
  if (!brandVideo) return;

  const playPromise = brandVideo.play();

  if (playPromise !== undefined) {

    playPromise
      .then(() => {

        brandVideoStarted = true;

        brandIntro?.classList.add(
          'is-playing'
        );

        setBrandStatus(
          'Brand reveal playing'
        );

      })
      .catch((error) => {

        console.log(
          'CampusNest video playback was blocked:',
          error
        );

        setBrandStatus(
          'Click the reveal to play'
        );

      });

  }
}


/* ---------------------------------------------------------
   Pause brand video
   --------------------------------------------------------- */

function pauseBrandVideo() {
  if (!brandVideo) return;

  if (!brandVideo.paused) {
    brandVideo.pause();
  }
}


/* ---------------------------------------------------------
   Automatically move to homepage hero
   --------------------------------------------------------- */

function scrollToHomepageHero() {

  const hero =
    document.getElementById(
      'hero-search-hub'
    );

  if (!hero || brandAutoScrolling) {
    return;
  }

  brandAutoScrolling = true;

  brandIntro?.classList.add(
    'is-complete'
  );

  setBrandStatus(
    'Welcome to CampusNest',
    true
  );


  /*
     Small delay so the final video frame
     is visible before the transition.
  */

  window.setTimeout(() => {

    hero.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });


    /*
       Unlock scrolling logic after
       the smooth scroll has completed.
    */

    window.setTimeout(() => {

      brandAutoScrolling = false;

    }, 1000);

  }, 550);
}


/* ---------------------------------------------------------
   Start reveal from first scroll
   --------------------------------------------------------- */

function startBrandRevealFromFirstScroll() {

  if (
    !brandIntro ||
    !brandVideo ||
    !isBrandIntroVisible()
  ) {
    return false;
  }


  /*
     Do not start the intro again if
     the first scroll has already happened.
  */

  if (
    brandVideoStarted ||
    firstScrollConsumed ||
    brandVideo.ended
  ) {
    return false;
  }


  /*
     Mark first scroll as consumed.
  */

  firstScrollConsumed = true;

  brandIntroManuallyLeft = false;


  brandIntro.classList.add(
    'scroll-started'
  );


  /*
     Start the video while keeping
     the visitor on the intro.
  */

  playBrandVideo();

  return true;
}


/* =========================================================
   DESKTOP / MOUSE WHEEL CONTROL
   ========================================================= */

function handleWheelIntroGate(event) {

  if (
    !brandIntro ||
    !brandVideo
  ) {
    return;
  }


  if (
    brandAutoScrolling ||
    !isBrandIntroVisible()
  ) {
    return;
  }


  /*
     We only intercept downward scrolling.

     Scrolling upward is always allowed.
  */

  if (event.deltaY <= 0) {
    return;
  }


  /* -------------------------------------------------------
     FIRST SCROLL
     ------------------------------------------------------- */

  if (!firstScrollConsumed) {

    /*
       Stop the browser from moving
       away from the video.
    */

    event.preventDefault();


    /*
       Start the brand reveal.
    */

    startBrandRevealFromFirstScroll();


    /*
       Track the current wheel gesture.

       This prevents trackpad/mouse momentum
       from immediately triggering the second
       scroll.
    */

    wheelGestureActive = true;

    window.clearTimeout(
      wheelGestureTimer
    );


    wheelGestureTimer =
      window.setTimeout(() => {

        wheelGestureActive = false;

      }, 320);

    return;
  }


  /* -------------------------------------------------------
     SECOND SCROLL
     -------------------------------------------------------

     Once the first gesture has ended,
     the next downward scroll is allowed
     to move naturally to the homepage.
     ------------------------------------------------------- */

  if (wheelGestureActive) {

    /*
       Prevent remaining momentum from
       the first scroll gesture.
    */

    event.preventDefault();

    window.clearTimeout(
      wheelGestureTimer
    );


    wheelGestureTimer =
      window.setTimeout(() => {

        wheelGestureActive = false;

      }, 320);
  }
}


/* =========================================================
   MOBILE / TOUCH CONTROL
   ========================================================= */

function handleTouchStart(event) {

  if (
    !event.touches ||
    !event.touches.length
  ) {
    return;
  }


  touchStartY =
    event.touches[0].clientY;

  touchGestureActive = false;
}


function handleTouchMove(event) {

  if (
    !brandIntro ||
    !brandVideo
  ) {
    return;
  }


  if (
    brandAutoScrolling ||
    !isBrandIntroVisible()
  ) {
    return;
  }


  if (
    !event.touches ||
    !event.touches.length
  ) {
    return;
  }


  const currentY =
    event.touches[0].clientY;


  const deltaY =
    touchStartY - currentY;


  /*
     Ignore upward movement.
  */

  if (deltaY <= 0) {
    return;
  }


  /* -------------------------------------------------------
     FIRST SWIPE
     ------------------------------------------------------- */

  if (!firstScrollConsumed) {

    event.preventDefault();

    startBrandRevealFromFirstScroll();

    touchGestureActive = true;

    return;
  }


  /*
     Prevent the rest of the first
     touch gesture from moving the page.
  */

  if (touchGestureActive) {
    event.preventDefault();
  }
}


/* =========================================================
   KEYBOARD CONTROL
   ========================================================= */

function handleKeydownIntroGate(event) {

  if (
    !brandIntro ||
    !brandVideo ||
    !isBrandIntroVisible()
  ) {
    return;
  }


  if (brandAutoScrolling) {
    return;
  }


  const forwardKeys = [
    'ArrowDown',
    'PageDown',
    ' ',
    'End'
  ];


  if (
    !forwardKeys.includes(
      event.key
    )
  ) {
    return;
  }


  /*
     First keyboard scroll starts
     the video instead of moving away.
  */

  if (!firstScrollConsumed) {

    event.preventDefault();

    startBrandRevealFromFirstScroll();
  }
}


/* =========================================================
   VIDEO EVENT HANDLERS
   ========================================================= */

if (brandVideo) {

  /*
     Keep browser video controls hidden.
  */

  brandVideo.controls = false;


  /* -------------------------------------------------------
     CLICK VIDEO → PLAY / PAUSE
     ------------------------------------------------------- */

  brandVideo.addEventListener(
    'click',
    () => {

      /*
         If the video has already finished,
         clicking it restarts the reveal.
      */

      if (brandVideo.ended) {

        brandVideo.currentTime = 0;

        brandVideoStarted = false;

        brandIntroManuallyLeft = false;

        brandIntro?.classList.remove(
          'is-complete'
        );

        setBrandStatus(
          'Brand reveal playing'
        );

        playBrandVideo();

        return;
      }


      /*
         If paused → resume.
      */

      if (brandVideo.paused) {

        brandVideoStarted = true;

        brandIntroManuallyLeft = false;

        playBrandVideo();

      }

      /*
         If playing → pause.
      */

      else {

        brandVideo.pause();

        setBrandStatus(
          'Reveal paused — click to continue'
        );
      }

    }
  );


  /* -------------------------------------------------------
     VIDEO PLAY EVENT
     ------------------------------------------------------- */

  brandVideo.addEventListener(
    'play',
    () => {

      brandVideoStarted = true;

      brandIntro?.classList.add(
        'is-playing'
      );

      setBrandStatus(
        'Brand reveal playing'
      );

    }
  );


  /* -------------------------------------------------------
     VIDEO PAUSE EVENT
     ------------------------------------------------------- */

  brandVideo.addEventListener(
    'pause',
    () => {

      /*
         Do not remove playing state
         when the video has naturally ended.
      */

      if (!brandVideo.ended) {

        brandIntro?.classList.remove(
          'is-playing'
        );

      }

    }
  );


  /* -------------------------------------------------------
     VIDEO ENDED EVENT
     ------------------------------------------------------- */

  brandVideo.addEventListener(
    'ended',
    () => {

      brandIntro?.classList.add(
        'is-complete'
      );


      setBrandStatus(
        'Welcome to CampusNest',
        true
      );


      /*
         IMPORTANT:

         Auto-scroll only happens when
         the visitor remained on the
         intro section.

         If the visitor already scrolled
         away, nothing is forced.
      */

      if (
        !brandIntroManuallyLeft &&
        isBrandIntroVisible()
      ) {

        scrollToHomepageHero();

      }

    }
  );
}


/* =========================================================
   INTERSECTION OBSERVER
   ---------------------------------------------------------
   Detects when the visitor leaves the
   brand video section.
   ========================================================= */

if (brandIntro) {

  const introObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach(
          (entry) => {

            /* ---------------------------------------------
               USER RETURNS TO INTRO
               --------------------------------------------- */

            if (entry.isIntersecting) {

              /*
                 Never automatically restart
                 the video when returning.
              */

              if (
                brandVideoStarted &&
                !brandVideo?.ended &&
                brandVideo?.paused
              ) {

                setBrandStatus(
                  'Reveal paused — click to continue'
                );

              }

            }


            /* ---------------------------------------------
               USER LEAVES INTRO
               --------------------------------------------- */

            else if (
              brandVideoStarted &&
              !brandVideo?.ended
            ) {

              /*
                 Mark that the visitor intentionally
                 left the intro.
              */

              brandIntroManuallyLeft = true;


              /*
                 Pause the video exactly where
                 the visitor left it.
              */

              pauseBrandVideo();

            }

          }
        );

      },
      {
        threshold: 0.35
      }
    );


  introObserver.observe(
    brandIntro
  );
}


/* =========================================================
   REGISTER SCROLL / TOUCH / KEYBOARD EVENTS
   ========================================================= */

window.addEventListener(
  'wheel',
  handleWheelIntroGate,
  {
    passive: false
  }
);


window.addEventListener(
  'touchstart',
  handleTouchStart,
  {
    passive: true
  }
);


window.addEventListener(
  'touchmove',
  handleTouchMove,
  {
    passive: false
  }
);


window.addEventListener(
  'touchend',
  () => {

    touchGestureActive = false;

  },
  {
    passive: true
  }
);


window.addEventListener(
  'keydown',
  handleKeydownIntroGate
);


/* =========================================================
   02. MOCK PROPERTY DATA
   ========================================================= */

const mockData = {

  'prop-1': {

    title:
      'Heritage Student Suite & Co-Living',

    sub:
      'Powai, Mumbai • 0.6 km to IIT Bombay & Vikhroli Metro',

    price:
      '₹15,000',

    distance:
      '7 mins walk to college gates • 5 mins walk to local metro & transit',

    img:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAtKU3BcpSyVmUSdo3aXWDSGdajX9ZDMxDwyDpi8gSk_m_fzvajdJcUw4L4XclfAbw8VICboE7rnngr7_Aa_PfmIQLuN9o3K_EERQtimWZxqB5cz1vJtcKqGf_Wbx9Ld1Ykndt57a8k4bhH9KMdVOI8lcPW64k5feHfb11DOMIrLCvV6imn8dzyr-s1tieoJVzfmWR7FLl5RSIr6dLY-3vBI49i0S6KmEIlPX6Ibjoo44pMb8K3MJr4',

    desc:
      'Authentic sunlit co-living suite situated right near Powai university transit corridors. Features dedicated study desks, high-speed 300 Mbps Wi-Fi, home-cooked daily meals (breakfast + dinner), 24/7 biometric gated security, and a lively living room community with fellow college students.'

  },


  'prop-2': {

    title:
      'Scholars Inn Boys PG',

    sub:
      'Sector 15, Kharghar, Navi Mumbai • 0.4 km to NIFT & Bharati',

    price:
      '₹9,500',

    distance:
      '5 mins walk to NIFT Campus • 8 mins to Kharghar Metro Station',

    img:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAXemM2v3v48HbLWmOR3dzlaPgOALenKIsCeq3bVtXNunzw6JL0DPM-9osk8x2RnARE0i_YGecQnP6xh1sWu4-pe7XqbW3m4YxRLbV70_hutMMx4IULtSeW1KojyVvXMW3hTq06oSr0A7D57hS_uLXYKRtn30-CzSLv--weSHzJAvMycRNk8K4pRTiJbTcd_n-AAyz_WHxHl9OnVnRCUX11H_cx6e_kQKqPWVGIyPKPIit1oaD_NcGl',

    desc:
      'Realistic, budget-conscious academic student residency for boys. Clean twin wooden beds, individual study workstations, fresh North/South Indian mess catering 3 times daily, 100% backup power, and a zero-distraction study environment.'

  },


  'prop-3': {

    title:
      'Palm Grove Girls Residency',

    sub:
      'Sector 19A, Nerul, Navi Mumbai • 0.5 km to D.Y. Patil',

    price:
      '₹13,500',

    distance:
      '6 mins walk to DY Patil Medical & Engineering Campus',

    img:
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=80',

    desc:
      'Safe, premium female student accommodation featuring round-the-clock female wardens, biometric entry, nutritious hygienic dining, fully air-conditioned rooms, and walking accessibility to colleges and Nerul train station.'

  },


  'prop-4': {

    title:
      'Urban Loft Scholar Flat',

    sub:
      'Bandra West, Mumbai • Near National College & Thadomal',

    price:
      '₹21,000',

    distance:
      '8 mins walk to Bandra local station & colleges',

    img:
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=80',

    desc:
      'Spacious co-living flat curated for college students and interns in Bandra. High aesthetic interior, modular kitchen for self-cooking, 300 Mbps broadband, and complete freedom with zero curfew hassles.'

  },


  'prop-5': {

    title:
      'St. Teresa Student Residence',

    sub:
      'Vile Parle West, Mumbai • 0.3 km to NMIMS & Mithibai',

    price:
      '₹14,500',

    distance:
      '4 mins walk to NMIMS / Mithibai College gates',

    img:
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=80',

    desc:
      'Comfortable student residence located right beside prestigious Vile Parle campuses. Zero deposit option available, daily cleaning, home-cooked food, and quiet evening study hours.'

  },


  'prop-6': {

    title:
      'Valley View Student PG',

    sub:
      'Sector 20, Kharghar, Navi Mumbai • 0.8 km to ITM',

    price:
      '₹11,000',

    distance:
      '10 mins walk to ITM Campus • Fast rickshaws to Kharghar station',

    img:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',

    desc:
      'Peaceful accommodation situated against the Kharghar hills backdrop. Includes fiber Wi-Fi, home cooked food, in-house laundry machines, and friendly batchmate roommates.'

  }

};


let savedProperties = [
  'prop-1',
  'prop-2'
];


let selectedCity = 'all';

let selectedBudget = 'all';


/* =========================================================
   03. TOAST
   ========================================================= */

function showToast(
  msg,
  icon = 'check_circle'
) {

  const toast =
    document.getElementById(
      'toast'
    );

  const msgEl =
    document.getElementById(
      'toast-message'
    );

  const iconEl =
    document.getElementById(
      'toast-icon'
    );


  if (
    !toast ||
    !msgEl ||
    !iconEl
  ) {
    return;
  }


  msgEl.textContent = msg;

  iconEl.textContent = icon;


  toast.classList.remove(
    'translate-y-20',
    'opacity-0'
  );


  setTimeout(() => {

    toast.classList.add(
      'translate-y-20',
      'opacity-0'
    );

  }, 3500);
}


/* =========================================================
   04. OWNER MODAL
   ========================================================= */

function openOwnerModal() {

  const modal =
    document.getElementById(
      'owner-modal'
    );

  const form =
    document.getElementById(
      'owner-listing-form'
    );

  const success =
    document.getElementById(
      'owner-success-view'
    );


  if (
    !modal ||
    !form ||
    !success
  ) {
    return;
  }


  form.classList.remove(
    'hidden'
  );

  success.classList.add(
    'hidden'
  );


  modal.classList.remove(
    'hidden'
  );

  modal.classList.add(
    'flex'
  );


  document.body.classList.add(
    'modal-open'
  );
}


function closeOwnerModal() {

  const modal =
    document.getElementById(
      'owner-modal'
    );


  if (!modal) {
    return;
  }


  modal.classList.add(
    'hidden'
  );

  modal.classList.remove(
    'flex'
  );


  document.body.classList.remove(
    'modal-open'
  );
}


/* ---------------------------------------------------------
   Owner photo upload
   --------------------------------------------------------- */

function handleFileSelect(e) {

  const files =
    e.target.files;


  const previewContainer =
    document.getElementById(
      'photo-previews'
    );


  if (!previewContainer) {
    return;
  }


  previewContainer.innerHTML = '';


  if (
    files &&
    files.length > 0
  ) {

    previewContainer.classList.remove(
      'hidden'
    );


    Array
      .from(files)
      .slice(0, 4)
      .forEach(file => {

        const reader =
          new FileReader();


        reader.onload =
          (event) => {

            const img =
              document.createElement(
                'img'
              );


            img.src =
              event.target.result;


            img.className =
              'w-16 h-16 object-cover rounded-lg border border-outline-variant shadow-sm';


            img.alt =
              'Selected property photo preview';


            previewContainer.appendChild(
              img
            );

          };


        reader.readAsDataURL(
          file
        );

      });


    showToast(
      `${files.length} photo(s) selected`,
      'add_photo_alternate'
    );
  }
}


/* ---------------------------------------------------------
   Owner listing form submit
   --------------------------------------------------------- */

function handleOwnerFormSubmit(e) {

  e.preventDefault();


  const propName =
    document.getElementById(
      'owner-prop-name'
    ).value;


  const propCity =
    document.getElementById(
      'owner-prop-city'
    ).value;


  const propLocality =
    document.getElementById(
      'owner-prop-locality'
    ).value;


  const propRent =
    document.getElementById(
      'owner-prop-rent'
    ).value;


  const listingData = {

    name:
      propName,

    city:
      propCity,

    locality:
      propLocality,

    rent:
      propRent,

    submittedAt:
      new Date().toISOString()

  };


  const existing =
    JSON.parse(
      localStorage.getItem(
        'cn_owner_submissions'
      ) || '[]'
    );


  existing.push(
    listingData
  );


  localStorage.setItem(
    'cn_owner_submissions',
    JSON.stringify(existing)
  );


  document
    .getElementById(
      'owner-listing-form'
    )
    .classList.add(
      'hidden'
    );


  document
    .getElementById(
      'owner-success-view'
    )
    .classList.remove(
      'hidden'
    );


  showToast(
    'Property submitted for verification!',
    'verified'
  );
}


/* =========================================================
   05. PROPERTY DETAILS MODAL
   ========================================================= */

function openPropertyModal(id) {

  const data =
    mockData[id];


  if (!data) {
    return;
  }


  const title =
    document.getElementById(
      'modal-title'
    );


  const sub =
    document.getElementById(
      'modal-sub'
    );


  const price =
    document.getElementById(
      'modal-price'
    );


  const desc =
    document.getElementById(
      'modal-desc'
    );


  const distance =
    document.getElementById(
      'modal-distance'
    );


  const modalImg =
    document.getElementById(
      'modal-img'
    );


  const modal =
    document.getElementById(
      'property-modal'
    );


  if (
    !title ||
    !sub ||
    !price ||
    !desc ||
    !distance ||
    !modal
  ) {
    return;
  }


  title.textContent =
    data.title;


  sub.innerHTML =
    `<span class="material-symbols-outlined text-secondary text-[16px]">pin_drop</span> ${data.sub}`;


  price.textContent =
    data.price;


  desc.textContent =
    data.desc;


  distance.textContent =
    data.distance;


  if (modalImg) {

    modalImg.src =
      data.img;

  }


  modal.classList.remove(
    'hidden'
  );


  modal.classList.add(
    'flex'
  );


  document.body.classList.add(
    'modal-open'
  );
}


function closePropertyModal() {

  const modal =
    document.getElementById(
      'property-modal'
    );


  if (!modal) {
    return;
  }


  modal.classList.add(
    'hidden'
  );


  modal.classList.remove(
    'flex'
  );


  document.body.classList.remove(
    'modal-open'
  );
}


/* =========================================================
   06. SAVED PROPERTIES
   ========================================================= */

function toggleSaveProperty(
  propId,
  btn
) {

  if (!btn) {
    return;
  }


  const heart =
    btn.querySelector(
      '.material-symbols-outlined'
    );


  if (!heart) {
    return;
  }


  /* -------------------------------------------------------
     REMOVE FROM SAVED
     ------------------------------------------------------- */

  if (
    savedProperties.includes(
      propId
    )
  ) {

    savedProperties =
      savedProperties.filter(
        id => id !== propId
      );


    heart.style.fontVariationSettings =
      "'FILL' 0";


    heart.classList.remove(
      'text-secondary'
    );


    showToast(
      'Removed from saved properties',
      'heart_broken'
    );

  }


  /* -------------------------------------------------------
     ADD TO SAVED
     ------------------------------------------------------- */

  else {

    savedProperties.push(
      propId
    );


    heart.style.fontVariationSettings =
      "'FILL' 1";


    heart.classList.add(
      'text-secondary'
    );


    showToast(
      'Saved to your favorites!',
      'favorite'
    );

  }


  const badge =
    document.getElementById(
      'bookmark-badge'
    );


  if (badge) {

    badge.textContent =
      savedProperties.length;

  }
}


/* =========================================================
   07. FILTER LOGIC
   ========================================================= */

function applyFilters() {

  const cards =
    document.querySelectorAll(
      '.property-card'
    );


  const genderFilter =
    document.getElementById(
      'gender-filter'
    );


  const sortSelect =
    document.getElementById(
      'sort-select'
    );


  if (
    !genderFilter ||
    !sortSelect
  ) {
    return;
  }


  const genderVal =
    genderFilter.value;


  const sortVal =
    sortSelect.value;


  const checkedAmenities =
    Array.from(
      document.querySelectorAll(
        '.amenity-checkbox:checked'
      )
    ).map(
      cb => cb.value
    );


  let visibleCount = 0;


  const cardArray =
    Array.from(cards);


  /* -------------------------------------------------------
     Check every property
     ------------------------------------------------------- */

  cardArray.forEach(card => {

    const city =
      card.getAttribute(
        'data-city'
      ) || '';


    const price =
      parseInt(
        card.getAttribute(
          'data-price'
        ),
        10
      ) || 0;


    const gender =
      card.getAttribute(
        'data-gender'
      ) || '';


    const cardAmenities =
      (
        card.getAttribute(
          'data-amenities'
        ) || ''
      ).split(',');


    /* City */

    const cityMatch = (

      selectedCity === 'all' ||

      city.toLowerCase() ===
      selectedCity.toLowerCase()

    );


    /* Gender */

    const genderMatch = (

      genderVal === 'all' ||

      gender === genderVal

    );


    /* Budget */

    let budgetMatch = true;


    if (
      selectedBudget ===
      'under-10k'
    ) {

      budgetMatch =
        price < 10000;

    }


    else if (
      selectedBudget ===
      '10k-15k'
    ) {

      budgetMatch =
        price >= 10000 &&
        price <= 15000;

    }


    else if (
      selectedBudget ===
      '15k-25k'
    ) {

      budgetMatch =
        price > 15000 &&
        price <= 25000;

    }


    else if (
      selectedBudget ===
      'luxury'
    ) {

      budgetMatch =
        price > 25000;

    }


    /* Amenities */

    const amenityMatch =
      checkedAmenities.every(
        a =>
          cardAmenities.includes(
            a
          )
      );


    /* -----------------------------------------------------
       Show / hide card
       ----------------------------------------------------- */

    if (
      cityMatch &&
      genderMatch &&
      budgetMatch &&
      amenityMatch
    ) {

      card.style.display =
        'flex';

      visibleCount++;

    }

    else {

      card.style.display =
        'none';

    }

  });


  /* -------------------------------------------------------
     Sorting
     ------------------------------------------------------- */

  const container =
    document.getElementById(
      'properties-container'
    );


  if (container) {

    cardArray.sort(
      (a, b) => {

        const priceA =
          parseInt(
            a.getAttribute(
              'data-price'
            ),
            10
          ) || 0;


        const priceB =
          parseInt(
            b.getAttribute(
              'data-price'
            ),
            10
          ) || 0;


        const ratingA =
          parseFloat(
            a.getAttribute(
              'data-rating'
            )
          ) || 0;


        const ratingB =
          parseFloat(
            b.getAttribute(
              'data-rating'
            )
          ) || 0;


        if (
          sortVal ===
          'price-asc'
        ) {

          return (
            priceA -
            priceB
          );

        }


        if (
          sortVal ===
          'price-desc'
        ) {

          return (
            priceB -
            priceA
          );

        }


        if (
          sortVal ===
          'rating'
        ) {

          return (
            ratingB -
            ratingA
          );

        }


        return 0;

      }
    );


    cardArray.forEach(
      card => {

        container.appendChild(
          card
        );

      }
    );

  }


  /* -------------------------------------------------------
     Update listing counter
     ------------------------------------------------------- */

  const counter =
    document.getElementById(
      'listing-counter'
    );


  if (counter) {

    counter.textContent =
      `Showing ${visibleCount} verified stay${visibleCount === 1 ? '' : 's'}`;

  }
}


/* =========================================================
   RESET FILTERS
   ========================================================= */

function resetFilters() {

  selectedCity =
    'all';


  selectedBudget =
    'all';


  /* Reset city buttons */

  document
    .querySelectorAll(
      '.city-btn'
    )
    .forEach(btn => {

      btn.classList.remove(
        'bg-secondary',
        'text-on-secondary'
      );


      btn.classList.add(
        'bg-surface-container',
        'text-on-surface'
      );

    });


  const firstCityBtn =
    document.querySelector(
      '.city-btn[data-filter-city="all"]'
    );


  if (firstCityBtn) {

    firstCityBtn.classList.add(
      'bg-secondary',
      'text-on-secondary'
    );


    firstCityBtn.classList.remove(
      'bg-surface-container',
      'text-on-surface'
    );

  }


  /* Reset amenities */

  document
    .querySelectorAll(
      '.amenity-checkbox'
    )
    .forEach(
      cb =>
        cb.checked = false
    );


  /* Reset gender */

  const genderFilter =
    document.getElementById(
      'gender-filter'
    );


  if (genderFilter) {

    genderFilter.value =
      'all';

  }


  /* Reset sorting */

  const sortSelect =
    document.getElementById(
      'sort-select'
    );


  if (sortSelect) {

    sortSelect.value =
      'recommended';

  }


  /* Reset hero budget */

  const heroBudget =
    document.getElementById(
      'hero-budget-select'
    );


  if (heroBudget) {

    heroBudget.value =
      'all';

  }


  /* Reset hero location */

  const heroLocation =
    document.getElementById(
      'hero-location-input'
    );


  if (heroLocation) {

    heroLocation.value =
      '';

  }


  applyFilters();


  showToast(
    'Filters cleared',
    'refresh'
  );
}


/* =========================================================
   08. CITY FILTER BUTTONS
   ========================================================= */

document
  .querySelectorAll(
    '.city-btn'
  )
  .forEach(btn => {

    btn.addEventListener(
      'click',
      () => {

        /* Reset all city buttons */

        document
          .querySelectorAll(
            '.city-btn'
          )
          .forEach(b => {

            b.classList.remove(
              'bg-secondary',
              'text-on-secondary'
            );


            b.classList.add(
              'bg-surface-container',
              'text-on-surface'
            );

          });


        /* Activate clicked city */

        btn.classList.add(
          'bg-secondary',
          'text-on-secondary'
        );


        btn.classList.remove(
          'bg-surface-container',
          'text-on-surface'
        );


        selectedCity =
          btn.getAttribute(
            'data-filter-city'
          );


        applyFilters();

      }
    );

  });


/* =========================================================
   09. QUICK SEARCH CHIPS
   ========================================================= */

document
  .querySelectorAll(
    '.quick-chip'
  )
  .forEach(chip => {

    chip.addEventListener(
      'click',
      () => {

        const city =
          chip.getAttribute(
            'data-city'
          );


        const locality =
          chip.getAttribute(
            'data-locality'
          ) || '';


        selectedCity =
          city;


        /* Put locality into search */

        const locationInput =
          document.getElementById(
            'hero-location-input'
          );


        if (locationInput) {

          locationInput.value =
            locality;

        }


        /* Activate matching city */

        document
          .querySelectorAll(
            '.city-btn'
          )
          .forEach(btn => {

            if (
              btn.getAttribute(
                'data-filter-city'
              ) === city
            ) {

              btn.classList.add(
                'bg-secondary',
                'text-on-secondary'
              );


              btn.classList.remove(
                'bg-surface-container',
                'text-on-surface'
              );

            }

            else {

              btn.classList.remove(
                'bg-secondary',
                'text-on-secondary'
              );


              btn.classList.add(
                'bg-surface-container',
                'text-on-surface'
              );

            }

          });


        applyFilters();


        /* Scroll to listings */

        const discSection =
          document.getElementById(
            'discover-section'
          );


        if (discSection) {

          discSection.scrollIntoView({
            behavior: 'smooth'
          });

        }

      }
    );

  });


/* =========================================================
   10. HERO SEARCH
   ========================================================= */

const heroSearchBtn =
  document.getElementById(
    'hero-search-btn'
  );


if (heroSearchBtn) {

  heroSearchBtn.addEventListener(
    'click',
    () => {

      const input =
        document.getElementById(
          'hero-location-input'
        );


      const budget =
        document.getElementById(
          'hero-budget-select'
        );


      const loc =
        (
          input?.value ||
          ''
        ).toLowerCase();


      selectedBudget =
        budget?.value ||
        'all';


      /* Navi Mumbai */

      if (
        loc.includes(
          'kharghar'
        ) ||

        loc.includes(
          'nerul'
        ) ||

        loc.includes(
          'navi mumbai'
        )
      ) {

        selectedCity =
          'Navi Mumbai';

      }


      /* Mumbai */

      else if (

        loc.includes(
          'powai'
        ) ||

        loc.includes(
          'bandra'
        ) ||

        loc.includes(
          'vile parle'
        ) ||

        loc.includes(
          'mumbai'
        )

      ) {

        selectedCity =
          'Mumbai';

      }


      /* Update city buttons */

      document
        .querySelectorAll(
          '.city-btn'
        )
        .forEach(btn => {

          if (
            btn.getAttribute(
              'data-filter-city'
            ) === selectedCity
          ) {

            btn.classList.add(
              'bg-secondary',
              'text-on-secondary'
            );


            btn.classList.remove(
              'bg-surface-container',
              'text-on-surface'
            );

          }

          else {

            btn.classList.remove(
              'bg-secondary',
              'text-on-secondary'
            );


            btn.classList.add(
              'bg-surface-container',
              'text-on-surface'
            );

          }

        });


      applyFilters();


      /* Scroll to listings */

      const discSection =
        document.getElementById(
          'discover-section'
        );


      if (discSection) {

        discSection.scrollIntoView({
          behavior: 'smooth'
        });

      }


      showToast(
        'Matching stays found!',
        'travel_explore'
      );

    }
  );

}


/* =========================================================
   11. CATEGORY TABS
   ========================================================= */

document
  .querySelectorAll(
    '.stay-tab'
  )
  .forEach(tab => {

    tab.addEventListener(
      'click',
      () => {

        /* Reset tabs */

        document
          .querySelectorAll(
            '.stay-tab'
          )
          .forEach(t => {

            t.classList.remove(
              'bg-secondary',
              'text-on-secondary'
            );


            t.classList.add(
              'bg-surface-container',
              'text-on-surface'
            );

          });


        /* Activate current tab */

        tab.classList.add(
          'bg-secondary',
          'text-on-secondary'
        );


        tab.classList.remove(
          'bg-surface-container',
          'text-on-surface'
        );


        const type =
          tab.getAttribute(
            'data-type'
          );


        const genderFilter =
          document.getElementById(
            'gender-filter'
          );


        if (!genderFilter) {
          return;
        }


        /* Map tab → gender filter */

        if (
          type === 'girls'
        ) {

          genderFilter.value =
            'girls';

        }

        else if (
          type === 'boys'
        ) {

          genderFilter.value =
            'boys';

        }

        else if (
          type === 'coliving'
        ) {

          genderFilter.value =
            'co-living';

        }

        else {

          genderFilter.value =
            'all';

        }


        applyFilters();

      }
    );

  });


/* =========================================================
   12. FILTER EVENTS
   ========================================================= */

document
  .querySelectorAll(
    '.amenity-checkbox'
  )
  .forEach(
    cb =>
      cb.addEventListener(
        'change',
        applyFilters
      )
  );


document
  .getElementById(
    'gender-filter'
  )
  ?.addEventListener(
    'change',
    applyFilters
  );


document
  .getElementById(
    'sort-select'
  )
  ?.addEventListener(
    'change',
    applyFilters
  );


/* =========================================================
   13. MODAL / ESCAPE SUPPORT
   ========================================================= */

window.addEventListener(
  'keydown',
  (event) => {

    if (
      event.key === 'Escape'
    ) {

      closePropertyModal();

      closeOwnerModal();

    }

  }
);


/* ---------------------------------------------------------
   Close owner modal by clicking overlay
   --------------------------------------------------------- */

document
  .getElementById(
    'owner-modal'
  )
  ?.addEventListener(
    'click',
    (event) => {

      if (
        event.target.id ===
        'owner-modal'
      ) {

        closeOwnerModal();

      }

    }
  );


/* ---------------------------------------------------------
   Close property modal by clicking overlay
   --------------------------------------------------------- */

document
  .getElementById(
    'property-modal'
  )
  ?.addEventListener(
    'click',
    (event) => {

      if (
        event.target.id ===
        'property-modal'
      ) {

        closePropertyModal();

      }

    }
  );


/* =========================================================
   14. INITIAL BOOKMARK STATE
   ========================================================= */

document
  .querySelectorAll(
    '.property-card'
  )
  .forEach(card => {

    const id =
      card.getAttribute(
        'data-id'
      );


    const btn =
      card.querySelector(
        '.save-btn'
      );


    if (
      btn &&
      savedProperties.includes(
        id
      )
    ) {

      const heart =
        btn.querySelector(
          '.material-symbols-outlined'
        );


      if (heart) {

        heart.style.fontVariationSettings =
          "'FILL' 1";


        heart.classList.add(
          'text-secondary'
        );

      }

    }

  });


/* ---------------------------------------------------------
   Update bookmark badge
   --------------------------------------------------------- */

const bookmarkBadge =
  document.getElementById(
    'bookmark-badge'
  );


if (bookmarkBadge) {

  bookmarkBadge.textContent =
    savedProperties.length;

}


/* =========================================================
   15. INITIAL FILTER STATE
   ========================================================= */

applyFilters();