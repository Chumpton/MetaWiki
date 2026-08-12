/**
 * MetaWiki - Global Navbar Component
 */

(function(window) {
  'use strict';

  function updateNavActiveState(activeId) {
    document.querySelectorAll('.mw-nav-item').forEach(el => el.classList.remove('active'));
    const activeEl = document.getElementById(activeId);
    if (activeEl) activeEl.classList.add('active');
  }

  function showGlobalNav() {
    const nav = document.getElementById('mwGlobalNav');
    if (nav) {
      nav.style.display = 'flex';
      nav.classList.remove('nav-hidden');
    }
  }

  window.Navbar = {
    updateNavActiveState,
    showGlobalNav
  };

  window.updateNavActiveState = updateNavActiveState;
  window.showGlobalNav = showGlobalNav;

})(window);
