// =========================================================
// SAKAY MANILA — shared site scripts
// =========================================================

document.addEventListener('DOMContentLoaded', function () {

  // ---- Footer year (small dynamic content touch, all pages) ----
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Mobile nav toggle (interactive menu) ----
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('primary-nav');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Dynamic greeting + live clock on the home hero ticket ----
  var greetingEl = document.getElementById('greeting-lede');
  if (greetingEl) {
    function updateGreeting() {
      var now = new Date();
      var hour = now.getHours();
      var greeting;
      if (hour < 5) greeting = 'Traveling late? Real bus, LRT, tricycle, and ride-hailing fares in Manila — no tourist markups.';
      else if (hour < 12) greeting = 'Magandang umaga! Plan today\u2019s trip with real bus, LRT, tricycle, and ride-hailing fares within Manila — no tourist markups.';
      else if (hour < 18) greeting = 'Magandang hapon! Real bus, LRT, tricycle, and ride-hailing fares in Manila — no tourist markups.';
      else greeting = 'Magandang gabi! Real bus, LRT, tricycle, and ride-hailing fares in Manila — no tourist markups.';

      greetingEl.textContent = greeting;
    }
    updateGreeting();
    setInterval(updateGreeting, 30000);
  }

  // ---- FAQ accordion (services page) ----
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    question.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      faqItems.forEach(function (i) {
        i.classList.remove('open');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // =========================================================
  // SHARED: Student / Senior Citizen / PWD discount toggle
  // One switch, read live by every calculator on the page.
  // =========================================================
  var discountToggle = document.getElementById('discountToggle');
  var discountLabel = document.getElementById('discountLabel');

  function isDiscountActive() {
    return !!(discountToggle && discountToggle.checked);
  }

  function applyDiscount(fare) {
    return isDiscountActive() ? Math.round(fare * 0.5) : fare;
  }

  if (discountToggle) {
    discountToggle.addEventListener('change', function () {
      discountLabel.textContent = isDiscountActive() ? 'Discount ON (-50%)' : 'Discount off';
    });
  }

  // =========================================================
  // SHARED: Manila landmark pins + distance helper
  // Used by both the Tricycle Fare Calculator and the
  // Ride-Hailing Estimator.
  // =========================================================
  var manilaSpots = {
    'Divisoria': [14.6091, 120.9739],
    '168 Shopping Mall': [14.6060, 120.9756],
    'Divisoria Public Market': [14.6094, 120.9745],
    'Quiapo': [14.5996, 120.9836],
    'Lawton': [14.5952, 120.9789],
    'Binondo': [14.6019, 120.9744],
    'Tutuban': [14.6155, 120.9702],
    'Intramuros': [14.5895, 120.9750],
    'Espa\u00f1a': [14.6091, 120.9889],
    'University Belt': [14.6037, 120.9884],
    'UST': [14.6098, 120.9887],
    'Dangwa': [14.6178, 120.9877],
    'FEU': [14.6039, 120.9885],
    'San Sebastian College': [14.6019, 120.9857],
    'CEU Mendiola': [14.5989, 120.9903],
    'Colegio de San Juan de Letran': [14.6027, 120.9748],
    'Rizal Park': [14.5831, 120.9794],
    'National Museum': [14.5854, 120.9808],
    'Manila City Hall': [14.5951, 120.9821],
    'Fort Santiago': [14.5946, 120.9702],
    'Manila Cathedral': [14.5906, 120.9747],
    'San Agustin Church': [14.5911, 120.9739],
    'Casa Manila': [14.5904, 120.9744],
    'Manila Ocean Park': [14.5823, 120.9739],
    'Quirino Grandstand': [14.5827, 120.9789],
    'SM City Manila': [14.5932, 120.9811],
    'SM San Lazaro': [14.6198, 120.9819],
    'Tayuman': [14.6197, 120.9784],
    'Isetann Recto': [14.6039, 120.9832],
    'Recto Station': [14.6027, 120.9827],
    'Robinsons Place Manila': [14.5764, 120.9838],
    'Pedro Gil': [14.5745, 120.9862],
    'Taft Avenue': [14.5769, 120.9927],
    'Ermita': [14.5813, 120.9847],
    'Philippine General Hospital': [14.5776, 120.9884],
    'University of the Philippines Manila': [14.5774, 120.9899],
    'Manila Zoo': [14.5713, 120.9922],
    'CCP Complex': [14.5522, 120.9822],
    'Roxas Boulevard': [14.5652, 120.9832]
  };

  function haversineKm(a, b) {
    var R = 6371;
    var dLat = (b[0] - a[0]) * Math.PI / 180;
    var dLon = (b[1] - a[1]) * Math.PI / 180;
    var lat1 = a[0] * Math.PI / 180;
    var lat2 = b[0] * Math.PI / 180;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
    return R * c;
  }

  function populateSpotSelect(select) {
    Object.keys(manilaSpots).sort().forEach(function (name) {
      var opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      select.appendChild(opt);
    });
  }

  // =========================================================
  // BUS TICKET MACHINE — named Manila routes, fixed fares, bidirectional
  // =========================================================
  var busRoutes = [
    ['Divisoria', 'Quiapo', 18],
    ['Divisoria', 'Lawton', 20],
    ['Divisoria', 'Binondo', 18],
    ['Divisoria', 'Tutuban', 18],
    ['Divisoria', '168 Shopping Mall', 18],
    ['Divisoria', 'Divisoria Public Market', 18],
    ['Quiapo', 'Isetann Recto', 18],
    ['Quiapo', 'SM San Lazaro', 20],
    ['Quiapo', 'SM City Manila', 18],
    ['Quiapo', 'Lawton', 18],
    ['Quiapo', 'Intramuros', 20],
    ['Quiapo', 'Espa\u00f1a', 20],
    ['Espa\u00f1a', 'University Belt', 18],
    ['Espa\u00f1a', 'UST', 18],
    ['Espa\u00f1a', 'Dangwa', 18],
    ['University Belt', 'FEU', 18],
    ['University Belt', 'San Sebastian College', 18],
    ['University Belt', 'CEU Mendiola', 18],
    ['University Belt', 'Colegio de San Juan de Letran', 20],
    ['Lawton', 'Intramuros', 18],
    ['Lawton', 'Rizal Park', 18],
    ['Lawton', 'National Museum', 18],
    ['Lawton', 'Manila City Hall', 18],
    ['Lawton', 'Binondo', 20],
    ['Intramuros', 'Fort Santiago', 18],
    ['Intramuros', 'Manila Cathedral', 18],
    ['Intramuros', 'San Agustin Church', 18],
    ['Intramuros', 'Casa Manila', 18],
    ['Rizal Park', 'National Museum', 18],
    ['Rizal Park', 'Manila Ocean Park', 18],
    ['Rizal Park', 'Quirino Grandstand', 18],
    ['SM City Manila', 'Manila City Hall', 18],
    ['SM City Manila', 'Lawton', 18],
    ['SM San Lazaro', 'Tayuman', 18],
    ['SM San Lazaro', 'UST', 20],
    ['SM San Lazaro', 'Dangwa', 18],
    ['Isetann Recto', 'Recto Station', 18],
    ['Isetann Recto', 'Divisoria', 18],
    ['Isetann Recto', 'Quiapo', 18],
    ['Robinsons Place Manila', 'Pedro Gil', 18],
    ['Robinsons Place Manila', 'Taft Avenue', 18],
    ['Robinsons Place Manila', 'Ermita', 18],
    ['Philippine General Hospital', 'Taft Avenue', 18],
    ['Philippine General Hospital', 'Pedro Gil', 18],
    ['University of the Philippines Manila', 'Pedro Gil', 18],
    ['University of the Philippines Manila', 'Taft Avenue', 18],
    ['Manila Zoo', 'CCP Complex', 20],
    ['CCP Complex', 'Roxas Boulevard', 18]
  ];

  var busForm = document.getElementById('busTicketForm');
  var busFromSelect = document.getElementById('busFrom');
  var busToSelect = document.getElementById('busTo');
  var busOutput = document.getElementById('bus-ticket-output');

  if (busForm && busFromSelect && busToSelect && busOutput) {

    function busAllLocations() {
      var set = {};
      busRoutes.forEach(function (r) { set[r[0]] = true; set[r[1]] = true; });
      return Object.keys(set).sort();
    }

    function busDestinationsFor(origin) {
      var dests = [];
      busRoutes.forEach(function (r) {
        if (r[0] === origin) dests.push(r[1]);
        else if (r[1] === origin) dests.push(r[0]);
      });
      return dests.sort();
    }

    function busFareFor(a, b) {
      for (var i = 0; i < busRoutes.length; i++) {
        var r = busRoutes[i];
        if ((r[0] === a && r[1] === b) || (r[0] === b && r[1] === a)) return r[2];
      }
      return null;
    }

    function populateBusFrom() {
      var locations = busAllLocations();
      busFromSelect.innerHTML = '';
      locations.forEach(function (name) {
        var opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        busFromSelect.appendChild(opt);
      });
    }

    function populateBusTo() {
      var dests = busDestinationsFor(busFromSelect.value);
      busToSelect.innerHTML = '';
      dests.forEach(function (name) {
        var opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        busToSelect.appendChild(opt);
      });
    }

    populateBusFrom();
    populateBusTo();

    busFromSelect.addEventListener('change', function () {
      populateBusTo();
      busOutput.innerHTML = '';
    });

    busForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var from = busFromSelect.value;
      var to = busToSelect.value;
      var fare = busFareFor(from, to);

      if (fare === null) {
        busOutput.innerHTML = '<p style="color:var(--color-accent);">That route isn\u2019t in our Manila bus list yet — try a different stop.</p>';
        return;
      }

      var finalFare = applyDiscount(fare);

      var now = new Date();
      var timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      var dateStr = now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

      var fareHtml = isDiscountActive()
        ? '<div style="text-decoration:line-through; opacity:0.55; font-size:1rem;">\u20b1' + fare + '</div><strong>\u20b1' + finalFare + '</strong>'
        : '<strong>\u20b1' + fare + '</strong>';

      busOutput.innerHTML =
        '<div class="issued-ticket">' +
          '<div class="issued-ticket__main">' +
            '<h4>City Bus</h4>' +
            '<div class="issued-ticket__row"><span>From</span><span>' + from + '</span></div>' +
            '<div class="issued-ticket__row"><span>To</span><span>' + to + '</span></div>' +
            '<div class="issued-ticket__row"><span>Fare Guide</span><span>For planning only</span></div>' +
            '<div class="issued-ticket__row"><span>Updated</span><span>' + dateStr + ', ' + timeStr + '</span></div>' +
          '</div>' +
          '<div class="issued-ticket__fare">' +
            fareHtml +
            '<small>Single Journey' + (isDiscountActive() ? ' \u2022 -50% Discount' : '') + '</small>' +
          '</div>' +
        '</div>';
    });
  }

  // =========================================================
  // LRT Ticket Machine (services page)
  // =========================================================
  var lineTabs = document.querySelectorAll('.line-tab');
  var ticketForm = document.getElementById('ticketForm');
  var fromSelect = document.getElementById('stationFrom');
  var toSelect = document.getElementById('stationTo');
  var ticketOutput = document.getElementById('ticket-output');

  if (lineTabs.length && ticketForm && fromSelect && toSelect && ticketOutput) {
    var lrtLines = {
      lrt1: {
        name: 'LRT Line 1',
        stations: ['Vito Cruz', 'Quirino', 'Pedro Gil', 'United Nations', 'Central Terminal', 'Carriedo', 'Doroteo Jose', 'Bambang', 'Tayuman', 'Blumentritt', 'Abad Santos', 'R. Papa']
      },
      lrt2: {
        name: 'LRT Line 2',
        stations: ['Recto', 'Legarda', 'Pureza', 'V. Mapa']
      }
    };

    var currentLine = 'lrt1';
    function fareForLine1(stopsApart) {
      var fare = 13 + stopsApart * 3.4;
      fare = Math.round(fare / 5) * 5;
      return Math.max(15, Math.min(50, fare));
    }

    function fareForLine2(stopsApart) {
      var table = { 1: 15, 2: 20, 3: 25 };
      return table[stopsApart] || 15;
    }

    function populateStations(lineKey) {
      var stations = lrtLines[lineKey].stations;
      fromSelect.innerHTML = '';
      toSelect.innerHTML = '';
      stations.forEach(function (name, idx) {
        var opt1 = document.createElement('option');
        opt1.value = idx;
        opt1.textContent = name;
        fromSelect.appendChild(opt1);

        var opt2 = document.createElement('option');
        opt2.value = idx;
        opt2.textContent = name;
        toSelect.appendChild(opt2);
      });
      fromSelect.selectedIndex = 0;
      toSelect.selectedIndex = stations.length - 1;
      ticketOutput.innerHTML = '';
    }

    lineTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        currentLine = tab.getAttribute('data-line');

        lineTabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        populateStations(currentLine);
      });
    });

    populateStations(currentLine);

    ticketForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var stations = lrtLines[currentLine].stations;
      var fromIdx = parseInt(fromSelect.value, 10);
      var toIdx = parseInt(toSelect.value, 10);

      if (fromIdx === toIdx) {
        ticketOutput.innerHTML = '<p style="color:var(--color-accent);">Please choose a different "To" station than your "From" station.</p>';
        return;
      }

      var stopsApart = Math.abs(toIdx - fromIdx);
      var fare = currentLine === 'lrt1' ? fareForLine1(stopsApart) : fareForLine2(stopsApart);
      var fromName = stations[fromIdx];
      var toName = stations[toIdx];
      var lineName = lrtLines[currentLine].name;
      var finalFare = applyDiscount(fare);

      var now = new Date();
      var timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      var dateStr = now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

      var fareHtml = isDiscountActive()
        ? '<div style="text-decoration:line-through; opacity:0.55; font-size:1rem;">\u20b1' + fare + '</div><strong>\u20b1' + finalFare + '</strong>'
        : '<strong>\u20b1' + fare + '</strong>';

      ticketOutput.innerHTML =
        '<div class="issued-ticket">' +
          '<div class="issued-ticket__main">' +
            '<h4>' + lineName + '</h4>' +
            '<div class="issued-ticket__row"><span>From</span><span>' + fromName + '</span></div>' +
            '<div class="issued-ticket__row"><span>To</span><span>' + toName + '</span></div>' +
            '<div class="issued-ticket__row"><span>Fare Guide</span><span>For planning only</span></div>' +
            '<div class="issued-ticket__row"><span>Updated</span><span>' + dateStr + ', ' + timeStr + '</span></div>' +
          '</div>' +
          '<div class="issued-ticket__fare">' +
            fareHtml +
            '<small>Single Journey' + (isDiscountActive() ? ' \u2022 -50% Discount' : '') + '</small>' +
          '</div>' +
        '</div>';
    });
  }

  // =========================================================
  // TRICYCLE FARE CALCULATOR — short Manila hops, ₱40–₱60,
  // distance-based (not a single flat price)
  // =========================================================
  var tricycleForm = document.getElementById('tricycleForm');
  var tricyclePickupSelect = document.getElementById('tricyclePickup');
  var tricycleDropoffSelect = document.getElementById('tricycleDropoff');
  var tricycleOutput = document.getElementById('tricycle-output');

  if (tricycleForm && tricyclePickupSelect && tricycleDropoffSelect && tricycleOutput) {

    populateSpotSelect(tricyclePickupSelect);
    populateSpotSelect(tricycleDropoffSelect);
    tricycleDropoffSelect.selectedIndex = Math.min(3, tricycleDropoffSelect.options.length - 1);

    tricycleForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var pickupName = tricyclePickupSelect.value;
      var dropoffName = tricycleDropoffSelect.value;

      if (pickupName === dropoffName) {
        tricycleOutput.innerHTML = '<p style="color:var(--color-accent);">Please choose a different drop-off point than your pickup.</p>';
        return;
      }

      var straightKm = haversineKm(manilaSpots[pickupName], manilaSpots[dropoffName]);
      var roadKm = straightKm * 1.35;

      // Tricycles are for short hops — fare scales with distance but
      // always lands somewhere between \u20b140 and \u20b160.
      var fare = 40 + roadKm * 10;
      fare = Math.max(40, Math.min(60, Math.round(fare / 5) * 5));
      var finalFare = applyDiscount(fare);

      var now = new Date();
      var timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      var dateStr = now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

      var fareHtml = isDiscountActive()
        ? '<div style="text-decoration:line-through; opacity:0.55; font-size:1rem;">\u20b1' + fare + '</div><strong>\u20b1' + finalFare + '</strong>'
        : '<strong>\u20b1' + fare + '</strong>';

      tricycleOutput.innerHTML =
        '<div class="issued-ticket">' +
          '<div class="issued-ticket__main">' +
            '<h4>Tricycle</h4>' +
            '<div class="issued-ticket__row"><span>From</span><span>' + pickupName + '</span></div>' +
            '<div class="issued-ticket__row"><span>To</span><span>' + dropoffName + '</span></div>' +
            '<div class="issued-ticket__row"><span>Distance</span><span>\u2248' + roadKm.toFixed(1) + ' km</span></div>' +
            '<div class="issued-ticket__row"><span>Updated</span><span>' + dateStr + ', ' + timeStr + '</span></div>' +
          '</div>' +
          '<div class="issued-ticket__fare">' +
            fareHtml +
            '<small>Estimate only' + (isDiscountActive() ? ' \u2022 -50% Discount' : '') + '</small>' +
          '</div>' +
        '</div>';
    });
  }

  // =========================================================
  // RIDE-HAILING ESTIMATOR — pick pickup/drop-off around Manila,
  // distance-based fare (Haversine), capped near \u20b1999
  // =========================================================
  var rideForm = document.getElementById('rideForm');
  var ridePickupSelect = document.getElementById('ridePickup');
  var rideDropoffSelect = document.getElementById('rideDropoff');
  var rideResult = document.getElementById('ride-result');

  if (rideForm && ridePickupSelect && rideDropoffSelect && rideResult) {

    populateSpotSelect(ridePickupSelect);
    populateSpotSelect(rideDropoffSelect);
    // default to two different spots so the first estimate isn't 0 km
    rideDropoffSelect.selectedIndex = Math.min(5, rideDropoffSelect.options.length - 1);

    rideForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var pickupName = ridePickupSelect.value;
      var dropoffName = rideDropoffSelect.value;

      if (pickupName === dropoffName) {
        rideResult.textContent = 'Please choose a different drop-off point than your pickup.';
        rideResult.classList.add('show');
        return;
      }

      var straightKm = haversineKm(manilaSpots[pickupName], manilaSpots[dropoffName]);
      // Street routing is never a straight line — pad it a bit like a real app would
      var roadKm = straightKm * 1.35;

      var provider = document.getElementById('rideProvider').value;

      var estimate = 45 + roadKm * 35;
      estimate = Math.max(45, Math.min(999, Math.round(estimate / 5) * 5));

      var low = Math.max(45, Math.round(estimate * 0.9));
      var high = Math.min(999, Math.round(estimate * 1.15));

      var discountedLow = applyDiscount(low);
      var discountedHigh = applyDiscount(high);

      var rangeHtml = isDiscountActive()
        ? '<span class="price-original">\u20b1' + low + '\u2013\u20b1' + high + '</span> <strong>\u20b1' + discountedLow + '\u2013\u20b1' + discountedHigh + '</strong>'
        : '<strong>\u20b1' + low + '\u2013\u20b1' + high + '</strong>';

      rideResult.innerHTML =
        'Estimated <strong>' + provider + '</strong> fare for ' + pickupName + ' \u2192 ' + dropoffName +
        ' (\u2248' + roadKm.toFixed(1) + ' km): ' + rangeHtml +
        (isDiscountActive() ? '<span class="discount-pill">-50% Student/Senior/PWD</span>' : '') +
        '<br><small>Rough estimate only \u2014 actual fares vary by app, traffic, and surge pricing. Manila pickups/drop-offs only.</small>';
      rideResult.classList.add('show');
    });
  }

  // ---- Contact form validation (contact page) ----
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    var formStatus = document.getElementById('formStatus');

    function setError(fieldId, message) {
      var field = document.getElementById('field-' + fieldId);
      var errorEl = document.getElementById('error-' + fieldId);
      if (message) {
        field.classList.add('has-error');
        errorEl.textContent = message;
      } else {
        field.classList.remove('has-error');
        errorEl.textContent = '';
      }
    }

    function validateName() {
      var val = document.getElementById('name').value.trim();
      if (val.length < 2) {
        setError('name', 'Please enter your full name (at least 2 characters).');
        return false;
      }
      setError('name', '');
      return true;
    }

    function validateEmail() {
      var val = document.getElementById('email').value.trim();
      var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!pattern.test(val)) {
        setError('email', 'Please enter a valid email address.');
        return false;
      }
      setError('email', '');
      return true;
    }

    function validateTopic() {
      var val = document.getElementById('topic').value;
      if (!val) {
        setError('topic', 'Please choose a topic.');
        return false;
      }
      setError('topic', '');
      return true;
    }

    function validateMessage() {
      var val = document.getElementById('message').value.trim();
      if (val.length < 10) {
        setError('message', 'Message should be at least 10 characters so we can help properly.');
        return false;
      }
      setError('message', '');
      return true;
    }

    document.getElementById('name').addEventListener('blur', validateName);
    document.getElementById('email').addEventListener('blur', validateEmail);
    document.getElementById('topic').addEventListener('change', validateTopic);
    document.getElementById('message').addEventListener('blur', validateMessage);

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var validName = validateName();
      var validEmail = validateEmail();
      var validTopic = validateTopic();
      var validMessage = validateMessage();

      if (validName && validEmail && validTopic && validMessage) {
        formStatus.classList.add('success');
        formStatus.textContent = 'Thanks, ' + document.getElementById('name').value.trim().split(' ')[0] + '! Your message has been noted — we\'ll reply soon.';
        contactForm.reset();
      } else {
        formStatus.classList.remove('success');
        var firstError = contactForm.querySelector('.has-error input, .has-error select, .has-error textarea');
        if (firstError) firstError.focus();
      }
    });
  }

});