jQuery(function ($) {
    $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();
        var hash = this.hash;
        $('html, body').animate({ scrollTop: $(hash).offset().top }, 300, function () { window.location.hash = hash; });
    });
    
    $('.landing .navbar-sds').addClass('hide');
    
    var prev = 0;
    var win = $(window);
    var nav = $('.navbar-sds');
    
    win.on('scroll', function(){
        var scrollTop = win.scrollTop();
        nav.toggleClass('hide', scrollTop > prev);
        prev = scrollTop;
    });
    
    
    // Twitter
    !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
});