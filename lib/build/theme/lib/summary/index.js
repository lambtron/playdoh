
/**
 * Analytics.
 */

var links = document.querySelector('.Summary-link');

analytics.trackLink(links, 'Clicked Article Link', function(el){
  return {
    article: {
      name: el.textContent,
      date: el.parentNode.parentNode.querySelector('.Summary-date').getAttribute('datetime'),
      href: el.href,
      external: el.classList.contains('Summary-external-link')
    }
  };
});
