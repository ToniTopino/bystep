$('#menu-button').on('click', function() {
    $(document.body).toggleClass('menu-open');
    let menu=$('.bottom-header');
    menu.toggleClass('showMenu');
  });