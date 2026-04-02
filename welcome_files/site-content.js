(function () {
  var config = window.siteConfig || (window.parent && window.parent.siteConfig);
  if (!config) {
    return;
  }

  var monthsShort = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
  var monthsRod = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  var monthsTitle = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  var weekDaysShort = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];

  function parseDate(value) {
    var parts = value.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function parseDateTime(dateValue, timeValue) {
    var date = parseDate(dateValue);
    var timeParts = (timeValue || "00:00").split(":").map(Number);
    date.setHours(timeParts[0] || 0, timeParts[1] || 0, 0, 0);
    return date;
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function stripHtml(html) {
    var temp = document.createElement("div");
    temp.innerHTML = html;
    return (temp.textContent || temp.innerText || "").trim();
  }

  function updateText(key, value) {
    document.querySelectorAll('[data-sm-text="' + key + '"]').forEach(function (node) {
      node.innerHTML = value;
      node.setAttribute("title", stripHtml(value));
    });
  }

  function updateTextContent(selector, value) {
    document.querySelectorAll(selector).forEach(function (node) {
      node.textContent = value;
    });
  }

  function renderWishes(items) {
    var slider = document.querySelector(".sm-wishes__content-slider");
    if (!slider || !Array.isArray(items) || !items.length) {
      return;
    }

    slider.innerHTML = items.map(function (item) {
      return '<div class="sm-wishes__content-item"><div class="sm-wishes__content-slide">' + item + "</div></div>";
    }).join("");

    var total = document.getElementById("count-slides");
    var current = document.getElementById("current-slide");
    if (total) total.textContent = String(items.length);
    if (current) current.textContent = "1";
  }

  function updateDateGroup(rootSelector, dateValue) {
    var date = parseDate(dateValue);
    document.querySelectorAll(rootSelector + ' [data-sm-day]').forEach(function (node) {
      node.textContent = pad(date.getDate());
    });
    document.querySelectorAll(rootSelector + ' [data-sm-month]').forEach(function (node) {
      node.textContent = pad(date.getMonth() + 1);
    });
    document.querySelectorAll(rootSelector + ' [data-sm-year]').forEach(function (node) {
      node.textContent = String(date.getFullYear()).slice(-2);
    });
  }

  function renderCalendar(dateValue) {
    var date = parseDate(dateValue);
    var calendar = document.querySelector(".js-calendar-body");
    var monthLabel = document.querySelector("[data-sm-tmonth]");
    if (!calendar || !monthLabel) {
      return;
    }

    monthLabel.textContent = monthsTitle[date.getMonth()];

    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    var startIndex = (firstDay.getDay() + 6) % 7;
    var html = weekDaysShort.map(function (day, index) {
      var weekendClass = index >= 5 ? " sm-weekend" : "";
      return '<span class="sm-calendar-day-week-title sm-date__calendar-number sm-text-hl-20-14' + weekendClass + '">' + day + "</span>";
    }).join("");

    for (var i = 0; i < startIndex; i += 1) {
      html += '<span class="sm-calendar-day sm-date__calendar-number sm-text-c-40-24"></span>';
    }

    for (var day = 1; day <= lastDay.getDate(); day += 1) {
      var activeClass = day === date.getDate() ? " number-active sm-number-active" : "";
      html += '<span class="sm-calendar-day sm-date__calendar-number sm-text-c-40-24' + activeClass + '">' + day + "</span>";
    }

    calendar.innerHTML = html;
  }

  function renderTimeBlock(blockId, value, minDigits) {
    var digits = String(value).padStart(minDigits, "0").split("");
    var holder = document.getElementById(blockId);
    if (!holder) {
      return;
    }

    var spans = holder.querySelectorAll(".sm-timer-time_number > span");
    if (!spans.length) {
      holder.textContent = digits.join("");
      return;
    }

    holder.querySelectorAll(".sm-timer-time_number").forEach(function (node, index) {
      node.style.display = index < digits.length ? "" : "none";
    });

    digits.forEach(function (digit, index) {
      if (spans[index]) {
        spans[index].textContent = digit;
      }
    });
  }

  function startCountdown(dateValue, timeValue) {
    var targetDate = parseDateTime(dateValue, timeValue);

    function tick() {
      var diff = targetDate.getTime() - Date.now();
      var totalSeconds = Math.max(0, Math.floor(diff / 1000));
      var days = Math.floor(totalSeconds / 86400);
      var hours = Math.floor((totalSeconds % 86400) / 3600);
      var minutes = Math.floor((totalSeconds % 3600) / 60);
      var seconds = totalSeconds % 60;

      renderTimeBlock("days", days, 2);
      renderTimeBlock("hours", hours, 2);
      renderTimeBlock("minutes", minutes, 2);
      renderTimeBlock("seconds", seconds, 2);
    }

    tick();
    window.setInterval(tick, 1000);
  }

  function updateParentMeta() {
    var parentDocument = window.parent && window.parent.document;
    if (!parentDocument || parentDocument === document) {
      return;
    }

    parentDocument.title = config.meta.title;

    var descriptionMeta = parentDocument.querySelector('meta[name="description"]');
    var ogDescriptionMeta = parentDocument.querySelector('meta[property="og:description"]');
    var ogTitleMeta = parentDocument.querySelector('meta[property="og:title"]');

    if (descriptionMeta) descriptionMeta.setAttribute("content", config.meta.description);
    if (ogDescriptionMeta) ogDescriptionMeta.setAttribute("content", config.meta.description);
    if (ogTitleMeta) ogTitleMeta.setAttribute("content", config.meta.title);
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateText("GROOM", config.people.groom);
    updateText("BRIDE", config.people.bride);
    updateText("CONTACTS_NAME", config.people.contactName);

    Object.keys(config.texts).forEach(function (key) {
      updateText(key, config.texts[key]);
    });

    updateTextContent(".sm-intro_string-1", config.intro.line1);
    updateTextContent(".sm-intro_string-2", config.intro.line2);

    updateDateGroup(".sm-main__content-date", config.dates.coverDate);
    updateDateGroup(".sm-envelope_card-text", config.dates.coverDate);
    updateDateGroup(".sm-datetime", config.dates.eventDate);

    var deadline = parseDate(config.dates.responseDeadline);
    updateTextContent("[data-sm-bday]", String(deadline.getDate()));
    updateTextContent("[data-sm-bmonth-rod]", monthsRod[deadline.getMonth()]);

    renderWishes(config.wishes);

    var routeButton = document.querySelector('[data-sm-href="LOCATION_MAP"]');
    if (routeButton && config.location.mapUrl) {
      routeButton.href = config.location.mapUrl;
      routeButton.style.display = "";
    }

    var contactButton = document.querySelector('[data-sm-href="CONTACT_LINK"]');
    if (contactButton && config.contacts && config.contacts.linkUrl) {
      contactButton.href = config.contacts.linkUrl;
    }

    var contactPhone = document.querySelector('[data-sm-tel]');
    if (contactPhone && config.contacts) {
      if (config.contacts.phoneHref) {
        contactPhone.href = "tel:" + config.contacts.phoneHref;
      }
      if (config.contacts.phoneDisplay) {
        contactPhone.textContent = config.contacts.phoneDisplay;
      }
    }

    renderCalendar(config.dates.eventDate);
    startCountdown(config.dates.eventDate, config.event.time);
    if (typeof window.initWishSlider === "function") {
      window.initWishSlider();
    }
    updateParentMeta();
  });
})();
