(function($){
  initStyles();
  adjustImgVideoHeights(true);
  $(window).on('resize', function(e){
    adjustImgVideoHeights(true);
  });

  function initStyles(){
    var img_wrapper = $('#bookview'),
        video_wrapper = $('#myvideo');
    img_wrapper.css({
      'float': 'left',
      'max-width': '36%'
    });
    video_wrapper.css({
      'float': 'right',
      'width': '64% !important'
    });
  }

  function adjustImgVideoHeights($img_gutter){
    var book_img = $('#bookview'),
        video = $('#myvideo video');
    if($img_gutter){
//       book_img.css('max-width', '35.5%');
      book_img.find('img').css('padding-right', '10px');
    } else {
      book_img.find('img').css('padding-right', '0px');
    }
    equalHeights(book_img, video);
  }

  function equalHeights($elem1, $elem2){
    var elem1_height = $elem1.height();
    $elem2.height(elem1_height);
    return false;
  }

})(jQuery);
