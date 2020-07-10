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