function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie() {
    var bodyGradient = getGradientColors('body');
    document.cookie = "left-gradient=" + bodyGradient[0]; 
    document.cookie = "right-gradient=" + bodyGradient[1];
    document.cookie = "is-inverted=" + $('#invertColorsCheck').is(':checked');
}

function getGradientColors(element) {
    var bgGrad = $(element).css("background");
    return bgGrad.match(/rgb\(([0-9]+), ([0-9]+), ([0-9]+)\)/g);
}

function setColorsFromCookie() {

    var leftGradient = getCookie('left-gradient');
    var rightGradient = getCookie('right-gradient');
    var isInverted = getCookie('is-inverted');

    if (leftGradient && rightGradient) {
        $('body').css('background', 'linear-gradient(to right, ' + leftGradient + ' 0%, ' + rightGradient + ' 100%)');
    }

    if (isInverted) {
        if (isInverted == 'true') {
            $('#invertColorsCheck').prop('checked', true);
            $('.info_header').css('filter', 'invert(1)');
            $('.color-pick').css('filter', 'invert(1)');
        } else {
            $('#invertColorsCheck').prop('checked', false);
        }
    }
}

$(document).ready(function(){

    $('[name="left-gradient"]').paletteColorPicker({
        onchange_callback: function ( clicked_color ) {
            var bodyGradient = getGradientColors('body');
            if (clicked_color) {
                $('body').css('background', 'linear-gradient(to right, ' + clicked_color + ' 0%, ' + bodyGradient[1] + ' 100%)');
            } else {
                $('body').css('background', 'linear-gradient(to right, rgba(109,179,242,1) 0%, ' + bodyGradient[1] + ' 100%)');
            }
            setCookie();
        }
    });

    $('[name="right-gradient"]').paletteColorPicker({
        onchange_callback: function ( clicked_color ) {
            var bodyGradient = getGradientColors('body');
            if (clicked_color) {
                $('body').css('background', 'linear-gradient(to right, ' + bodyGradient[0] + ' 0%, ' + clicked_color + ' 100%)');
            } else {
                $('body').css('background', 'linear-gradient(to right, ' + bodyGradient[0] + ' 0%, rgba(30,105,222,1) 100%)');
            }
            setCookie();
        }

    });

    $('#invertColorsCheck').change(
        function(){
            if ($(this).is(':checked')) {
                $('.info_header').css('filter', 'invert(1)');
                $('.color-pick').css('filter', 'invert(1)');
            } else {
                $('.info_header').css('filter', '');
                $('.color-pick').css('filter', '');
            }
            setCookie();
        }
    );



    setColorsFromCookie();

});
