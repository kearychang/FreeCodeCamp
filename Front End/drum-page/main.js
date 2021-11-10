var currentMusic = null;

function playMusic(e) {
    $("#display").text($(this).text());
    if (currentMusic !== null) {
        currentMusic.pause();
    }
    currentMusic = e;
    currentMusic.play();
}

$(document).ready( function() {
    $(".drum-pad").on("click", function() {
        playMusic($(this).children()[0])
    });

    $(this).on("keypress", function(e) {
        var key = String.fromCharCode(e.keyCode);
        if (key === 'q' || key === 'w' || key === 'e'
            || key === 'a' || key === 's' || key === 'd'
            || key === 'z' || key === 'x' || key === 'c') {
                playMusic($("#" + key));
        }
    });
});