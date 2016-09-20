jQuery("#menu-toggle").click(function (e) {
  e.preventDefault();
  jQuery("#wrapper").toggleClass("toggled");
});
jQuery("#menu-toggle-2").click(function (e) {
  e.preventDefault();
  jQuery("#wrapper").toggleClass("toggled-2");
  jQuery('#menu ul').hide();
});

function initMenu() {
  jQuery('#menu ul').hide();
  jQuery('#menu ul').children('.current').parent().show();
  //jQuery('#menu ul:first').show();
  jQuery('#menu li a').click(
    function () {
      var checkElement = jQuery(this).next();
      if ((checkElement.is('ul')) && (checkElement.is(':visible'))) {
        return false;
      }
      if ((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
        jQuery('#menu ul:visible').slideUp('normal');
        checkElement.slideDown('normal');
        return false;
      }
    }
    );
}
jQuery(document).ready(function () { initMenu(); });