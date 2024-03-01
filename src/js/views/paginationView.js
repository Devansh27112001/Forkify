import View from './View';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
  _generateMarkup() {
    const curPage = this._data.page;
    const numOfPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // Page 1 and there are other pages
    if (curPage === 1 && numOfPages > 1) {
      return this._generateMarkupButton('next', curPage);
    }
    // On the last page
    if (curPage === numOfPages && numOfPages > 1) {
      return this._generateMarkupButton('prev', curPage);
    }
    // On some other page
    if (curPage < numOfPages) {
      return `${this._generateMarkupButton(
        'prev',
        curPage
      )}${this._generateMarkupButton('next', curPage)}`;
    }
    // Page 1 and there are NO other pages
    return '';
  }

  _generateMarkupButton(direction, curPage) {
    // direction can be next or prev.
    return `
    <button data-goto="${
      direction === 'next' ? curPage + 1 : curPage - 1
    }" class="btn--inline pagination__btn--${direction}">

      ${direction === 'next' ? `<span>Page ${curPage + 1} </span>` : ''}

      <svg class="search__icon">
        <use href="${icons}#icon-arrow-${
      direction === 'next' ? 'right' : 'left'
    }"></use>
      </svg>

      ${direction === 'prev' ? `<span>Page ${curPage - 1}</span>` : ''}

    </button>

`;
  }
}

export default new PaginationView();
