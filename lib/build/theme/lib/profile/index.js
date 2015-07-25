
/**
 * Analytics.
 */

var links = document.querySelectorAll('.Profile-link');
var re = /Profile-(\w+)-link/;

analytics.trackLink(links, 'Clicked Profile Link', function(el){
  return {
    type: re.exec(el.className)[1],
    href: el.href
  }
});
