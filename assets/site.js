// Kalinisan concept site: small progressive enhancements. Everything works without it.
(function () {
  // Filter chips: <div class="chips" data-filter-for="#grid"> with <button class="chip" data-filter="cip">.
  // Optional: data-page (cards per page), data-more (load-more button), data-sort (A-Z select), data-total.
  document.querySelectorAll('.chips[data-filter-for]').forEach(function (group) {
    var target = document.querySelector(group.getAttribute('data-filter-for'));
    if (!target) return;
    var q = function (a) { return document.querySelector(group.getAttribute(a) || '#__none'); };
    var items = Array.prototype.slice.call(target.querySelectorAll('[data-cat]')), base = items.slice(); // server renders A to Z
    var counter = q('data-count'), total = q('data-total'), empty = q('data-empty'), more = q('data-more'), sort = q('data-sort');
    var page = parseInt(group.getAttribute('data-page'), 10) || Infinity;
    var filter = 'all', limit = page;
    function render() {
      if (sort) {
        items = /Z to A/.test(sort.value) ? base.slice().reverse() : base.slice();
        items.forEach(function (el) { target.appendChild(el); });
      }
      var matched = items.filter(function (el) { return filter === 'all' || (' ' + el.getAttribute('data-cat') + ' ').indexOf(' ' + filter + ' ') > -1; });
      var cap = filter === 'all' ? limit : Infinity;
      items.forEach(function (el) { el.hidden = true; });
      matched.forEach(function (el, i) { el.hidden = i >= cap; });
      var shown = Math.min(cap, matched.length);
      if (counter) counter.textContent = shown;
      if (total) total.textContent = matched.length;
      if (more) more.hidden = shown >= matched.length;
      if (empty) empty.hidden = matched.length !== 0;
    }
    group.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip) return;
      group.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
      filter = chip.getAttribute('data-filter'); limit = page; render();
    });
    if (more) more.addEventListener('click', function () { limit += page; render(); });
    if (sort) sort.addEventListener('change', render);
    if (sort && /Z to A/.test(sort.value)) render();
  });

  // Close the phone menu after a link is chosen.
  document.querySelectorAll('.menu-toggle .panel a').forEach(function (a) {
    a.addEventListener('click', function () { a.closest('details').removeAttribute('open'); });
  });
})();
