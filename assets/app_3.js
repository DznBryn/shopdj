jQuery(document).foundation();

$(document).ready(function(){
  window.sr = ScrollReveal();
  sr.reveal('.section-container', {
    duration: 500,
    distance: '10px',
    delay: 300,
  });

// $('.free-sample-form').submit(function(e){
//     e.preventDefault();
//   });
});
