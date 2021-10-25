function CivicFlyout(el) {
  if (!el) {
    return;
  }

  this.el = el;
  this.trigger = this.el.querySelector('[data-flyout-trigger]');
  this.close = this.el.querySelector('[data-flyout-close]');
  this.closeAll = this.el.querySelector('[data-flyout-close-all]');
  this.panel = this.el.querySelector('[data-flyout-panel]');
  this.duration = this.el.querySelector('[data-flyout-duration]') || 500;
  this.el.expanded = this.el.hasAttribute('data-flyout-expanded');
  this.isToggling = false;

  // Add event listener to element.
  this.trigger.addEventListener('click', this.clickEvent.bind(this));
  this.trigger.expand = true;
  this.close.addEventListener('click', this.clickEvent.bind(this));
  this.close.expand = false;
  this.closeAll.addEventListener('click', this.closeAllClickEvent.bind(this));
}

// eslint-disable-next-line func-names
CivicFlyout.prototype.clickEvent = function (e) {
  e.stopPropagation();
  e.preventDefault();
  e.stopImmediatePropagation();

  e.currentTarget.expand ? this.expand() : this.collapse();
};

// eslint-disable-next-line func-names
CivicFlyout.prototype.closeAllClickEvent = function (e) {
  e.stopPropagation();
  e.preventDefault();
  e.stopImmediatePropagation();

  // todo: add collapse for each flyout
  this.collapse();
};

// eslint-disable-next-line func-names
CivicFlyout.prototype.expand = function () {
  this.el.expanded = true;
  this.trigger.setAttribute('aria-expanded', true);
  // this.trigger.classList.add('civic-flyout__trigger--expanding');
  setTimeout(() => {
    // this.trigger.classList.remove('civic-flyout__trigger--expanding');
  }, this.duration);
  this.panel.style.visibility = 'visible';

  // Add required classes.
  // this.trigger.classList.add('civic-flyout__trigger--expanded');
  this.el.setAttribute('data-flyout-expanded', true);
  // this.panel.classList.add('civic-flyout__content--expanded');
  this.panel.setAttribute('aria-hidden', false);
};

// eslint-disable-next-line func-names
CivicFlyout.prototype.collapse = function () {
  this.el.expanded = false;
  this.trigger.setAttribute('aria-expanded', false);
  this.el.removeAttribute('data-flyout-expanded');
  const currentPanel = this.panel;
  setTimeout(() => {
    // this.trigger.classList.remove('civic-flyout__trigger--collapsing');
    currentPanel.style.visibility = '';
  }, 500);

  this.panel.setAttribute('aria-hidden', true);
};

// Initialize CivicFlyout on every element.
document.querySelectorAll('[data-flyout]').forEach((flyout) => {
  // eslint-disable-next-line no-new
  new CivicFlyout(flyout);
});
