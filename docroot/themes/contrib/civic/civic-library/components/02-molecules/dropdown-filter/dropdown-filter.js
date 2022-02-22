/**
 * Civic dropdown filter.
 *
 * Provides a filtering system to show hide searched for radio / checkbox
 * options.
 */
function CivicDropdownFilter(el) {
  if (!el || el.hasAttribute('data-dropdown-filter-searchable')) {
    return;
  }

  this.el = el;

  // Threshold determines when the search input is generated.
  this.itemThreshold = this.el.getAttribute('data-dropdown-filter-item-threshold') ? parseInt(this.el.getAttribute('data-dropdown-filter-item-threshold'), 10) : 10;
  this.placeholderText = this.el.getAttribute('data-dropdown-filter-placeholder-text') ? this.el.getAttribute('data-dropdown-filter-placeholder-text') : 'Filter by keyword';

  this.filterFieldset = this.el.querySelector('[data-dropdown-filter-fieldset]');
  this.dropdownFilterItems = this.filterFieldset.querySelectorAll('[data-dropdown-filter-item]');

  // Add a search box to the dropdown filter if there are more options than the threshold.
  if (this.dropdownFilterItems.length >= this.itemThreshold) {
    this.init();
  }
}

/**
 * Initialised the dropdown filter search component.
 */
CivicDropdownFilter.prototype.init = function () {
  this.searchInput = this.createSearchElement();
  this.searchInput.addEventListener('keyup', this.filterKeyUpListener.bind(this), false);
  this.el.setAttribute('data-dropdown-filter-searchable', '');
};

/**
 * Create and search input to dropdown filter.
 */
CivicDropdownFilter.prototype.createSearchElement = function () {
  // Create the search box container.
  const search = document.createElement('div');
  search.classList.add('civic-dropdown-filter__search', 'civic-input', 'civic-theme-light');

  // Create the search box element and add it to the container.
  const searchInput = document.createElement('input');
  searchInput.classList.add('civic-dropdown-filter__search__input', 'civic-input__element', 'civic-input--default', 'civic-input--text');
  searchInput.setAttribute('placeholder', this.placeholderText);
  searchInput.setAttribute('value', '');
  searchInput.setAttribute('type', 'text');
  search.append(searchInput);

  // Add the search box container to the dropdown filter.
  this.filterFieldset.prepend(search);

  return searchInput;
};

/**
 * Provides the filter callback to filter options based on search.
 */
CivicDropdownFilter.prototype.filterKeyUpListener = function () {
  const query = this.searchInput.value.toLowerCase();
  const dropdownFilter = this;

  this.dropdownFilterItems.forEach((item) => {
    if (item.querySelector('label').innerHTML.toLowerCase().includes(query)) {
      dropdownFilter.showItem(item);
    } else {
      dropdownFilter.hideItem(item);
    }
  });
};

/**
 * Show filter option.
 */
CivicDropdownFilter.prototype.showItem = function (item) {
  item.setAttribute('data-dropdown-filter-item-visible', '');
  item.removeAttribute('data-dropdown-filter-item-hidden');
};

/**
 * Hide filter option
 */
CivicDropdownFilter.prototype.hideItem = function (item) {
  item.setAttribute('data-dropdown-filter-item-hidden', '');
  item.removeAttribute('data-dropdown-filter-item-visible');
};

document.querySelectorAll('[data-component-name="civic-dropdown-filter"]').forEach((dropdownFilter) => {
  new CivicDropdownFilter(dropdownFilter);
});
