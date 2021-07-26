$(document).ready(function () {
    $(document).on("scroll", onScroll);
    //console.log($('#analyticsLink'));
    
    //smoothscroll
    $('a[data-target^="#"]').on('click', function (e) {
        e.preventDefault();
        $(document).off("scroll");
        //console.log(document);
        
        $('a').each(function () {
            $(this).removeClass('active');
        })
        $(this).addClass('active');
      
        var target = this.hash,
        menu = target;
        $target = $(target);
        $('html, body').stop().animate({
            'scrollTop': $target.offset()
        }, 1000, 'swing', function () {
            window.location.hash = target;
            $(document).on("scroll", onScroll2);
        });
    });
});

function onScroll2(event){
    var scrollPos = $(document).scrollTop();
    $('#menu-center a').each(function () {
        var currLink = $(this);
        var refElement = $(currLink.attr("data-target"));
        //console.log(refElement);
        if(!refElement.length) return;
        if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
            //$('#menu-center ul li a').removeClass("active");
            //currLink.addClass("active");
        }
        else{
            //currLink.removeClass("active");
        }
    });
    $(document).on("scroll", onScroll);
}

function onScroll(event){
    var scrollPos = $(document).scrollTop();
    $('#menu-center a').each(function () {
        var currLink = $(this);
        var refElement = $(currLink.attr("data-target"));
        //console.log(refElement);
        if(!refElement.length) return;
        if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
            $('#menu-center ul li a').removeClass("active");
            currLink.addClass("active");
        }
        else{
            currLink.removeClass("active");
        }
    });
}

