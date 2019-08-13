$(document).foundation();

$(document).ready(function(){
  window.sr = ScrollReveal();
  sr.reveal('.top-bar', {
    duration: 300,
    distance: '20px',
    origin: 'top'
  });
  sr.reveal('.section-container', {
    duration: 500,
    distance: '0',
    delay: 300,
  });

  // $('.free-sample-form').submit(function(e){
  //   e.preventDefault();
  // });
});
