/*import mixitup from "./mixitup";*/
/*import mixitup from "../node_modules/mixitup/dist/mixitup.min.js";*/
/*import mixitup from "../node_modules/mixitup/dist/mixitup.min.js";*/
// var mixitup = require("mixitup");
//mixitup.use(mixitupMultifilter);

var mixer = mixitup(".portfolio__images");

$(document).ready(function () {

    $('a[href^="#"]').click(function () {
     //Сохраняем значение атрибута href в переменной:
     var target = $(this).attr('href');
     $('html, body').animate({
      scrollTop: $(target).offset().top//можно вычесть высоту меню
     }, 1000);
     return false;
    });
   
});