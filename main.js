window.addEventListener('load',init);

var canvas;
var ctx;

function init(){
    canvas = document.getElementById('maincanvas');
    ctx = canvas.getContext('2d');

    requestAnimationFrame(update);
}
function update(){
    requestAnimationFrame(update);

    render();
}

function render(){
    ctx.clearRext(0,0,canvas.width, canvas.height);
}