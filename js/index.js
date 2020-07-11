$(document).ready(() => {
    $( "#aristocrat" ).click(function() {
        const el = document.querySelector("#root");
        ReactDOM.render(<Cipher marathon={false} type="aristocrat"/>, el);
    });
    $( "#affine" ).click(function() {
        const el = document.querySelector("#root");
        ReactDOM.render(<Cipher marathon={false} type="affine"/>, el);
    });
    $( "#atbash" ).click(function() {
        const el = document.querySelector("#root");
        ReactDOM.render(<Cipher marathon={false} type="atbash"/>, el);
    });
    $( "#caesar" ).click(function() {
        const el = document.querySelector("#root");
        ReactDOM.render(<Cipher marathon={false} type="caesar"/>, el);
    });
    $( "#patristocrat" ).click(function() {
        const el = document.querySelector("#root");
        ReactDOM.render(<Cipher marathon={false} type="patristocrat"/>, el);
    });
    $( "#xenocrypt" ).click(function() {
        const el = document.querySelector("#root");
        ReactDOM.render(<Cipher marathon={false} type="xenocrypt"/>, el);
    });
    $( "#marathon" ).click(function() {
        $( ".problemtype" ).hide();
        $( "#marathon" ).text("marathon!")
        const el = document.querySelector("#root");
        ReactDOM.render(<Cipher marathon={true} type="aristocrat"/>, el);
    });
    const ele = document.getElementById('buttonchoice');
    ele.style.cursor = 'grab';

    let pos = { top: 0, left: 0, x: 0, y: 0 };

    const mouseDownHandler = function(e) {
        ele.style.cursor = 'grabbing';
        ele.style.userSelect = 'none';

        pos = {
            left: ele.scrollLeft,
            top: ele.scrollTop,
            // Get the current mouse position
            x: e.clientX,
            y: e.clientY,
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = function(e) {
        // How far the mouse has been moved
        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;

        // Scroll the element
        ele.scrollTop = pos.top - dy;
        ele.scrollLeft = pos.left - dx;
    };

    const mouseUpHandler = function() {
        ele.style.cursor = 'grab';
        ele.style.removeProperty('user-select');

        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    // Attach the handler
    ele.addEventListener('mousedown', mouseDownHandler);
})
$(document).keydown(function(e){
    if(e.which === 123){
       return false;
    }
});
$(document).bind("contextmenu",function(e) { 
    e.preventDefault();
});
$('body').bind('copy', function(e) {
    e.preventDefault();
    alert("not so fast! in order to prevent cheating, ctrl + c has been disabled. happy codebusting! (¬‿¬ )")
    return false;
});