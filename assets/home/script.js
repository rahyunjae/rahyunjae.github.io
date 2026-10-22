(() => {
'use strict';
const root = document.documentElement;
const toggle = document.querySelector('.theme-toggle');
const update = () => {
  const dark = root.dataset.theme === 'dark';
  toggle.setAttribute('aria-pressed', String(dark));
  toggle.setAttribute('aria-label', 'Switch to ' + (dark ? 'light' : 'dark') + ' theme');
  document.querySelector('meta[name="theme-color"]').content = dark ? '#101925' : '#0759da';
};
toggle.hidden = false;
update();
toggle.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('hyunjae-theme', root.dataset.theme); } catch (_) {}
  update();
});
const links = [...document.querySelectorAll('nav a')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      links.forEach(link => {
        if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }, {rootMargin:'-12% 0px -63% 0px', threshold:0});
  links.forEach(link => { const target = document.querySelector(link.hash); if (target) observer.observe(target); });
}
const dialog = document.querySelector('#citation-dialog');
if (dialog && typeof dialog.showModal === 'function') {
  const trigger = document.querySelector('[data-citation]');
  trigger.hidden = false;
  trigger.addEventListener('click', () => { document.querySelector('.copy-status').textContent = ''; dialog.showModal(); });
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const b = dialog.getBoundingClientRect();
    if (event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom) dialog.close();
  });
  document.querySelector('.copy-citation').addEventListener('click', async () => {
    const status = document.querySelector('.copy-status');
    try {
      await navigator.clipboard.writeText(document.querySelector('#bibtex').textContent.trim());
      status.textContent = 'Citation copied.';
    } catch (_) {
      const range = document.createRange();
      range.selectNodeContents(document.querySelector('#bibtex'));
      const selection = window.getSelection();
      selection.removeAllRanges(); selection.addRange(range);
      status.textContent = 'Citation selected. Press Ctrl+C or ⌘C to copy.';
    }
  });
}
const oldAnchors = {'-news':'news','-publications':'publications','-project':'projects','-honors-and-awards':'honors-and-awards','-education':'education','-teaching-experience':'teaching-experience'};
function followOldAnchor() {
  let hash;
  try { hash = decodeURIComponent(location.hash.slice(1)); } catch (_) { return; }
  if (oldAnchors[hash]) document.getElementById(oldAnchors[hash])?.scrollIntoView();
}
followOldAnchor(); window.addEventListener('hashchange', followOldAnchor);
})();
