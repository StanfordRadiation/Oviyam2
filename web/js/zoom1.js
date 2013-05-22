var canvas = null;
var ctx = null;
var lastX,lastY;
var dragStart,dragged;
var scaleFactor;
var zoomFlag = 0;

var gkhead = new Image();

var mY = 0;

doZoom = function(zCanvas){
    canvas = zCanvas;
    var kCanvas = jQuery(canvas).siblings().get(1);
    ctx = canvas.getContext('2d');
    gkhead.src = canvas.toDataURL("image/jpeg");
    trackTransforms(ctx);
    //redraw();  //remove recently

    //lastX=canvas.width/2, lastY=canvas.height/2;

    kCanvas.addEventListener('mousedown', mouseDown, false);
    kCanvas.addEventListener('mouseup',function(evt){
        dragStart = null;
        //if (!dragged) zoom(evt.shiftKey ? -1 : 1 );
        kCanvas.removeEventListener('mousemove', mouseMove, false);
        evt.target.style.cursor = 'default';
    },false);

    scaleFactor = 1.1;

//kCanvas.addEventListener('DOMMouseScroll',handleScroll,false);
//kCanvas.addEventListener('mousewheel',handleScroll,false);

//redraw();
}

function mouseDown(evt) {
    document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
    lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
    lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
    dragStart = ctx.transformedPoint(lastX,lastY);
    dragged = false;
    mY = lastY;

    evt.target.addEventListener('mousemove', mouseMove, false);
    
    evt.preventDefault();
    evt.stopPropagation();
    evt.target.style.cursor = "url(images/zoomin.png), auto";
    jQuery(evt.target).parent().parent().parent().find('#contextmenu1').css('visibility', 'hidden');
}

function mouseMove(evt) {
    //jQuery(evt.target).parent().parent().parent().find('#contextmenu1').hide();

    lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
    lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);

    if(evt.button == 0) {
        //evt.target.style.cursor = "url(images/zoom.png), auto";
        if(lastY < mY) {
            zoom(1);
            zoomFlag++;
        } else {
            if(zoomFlag >= -25) {
                zoom(-1);
                zoomFlag--;
            }
        }
    } else if(evt.button == 2) {
        evt.target.style.cursor = 'move';

        dragged = true;
        if (dragStart){
            var pt = ctx.transformedPoint(lastX,lastY);
            ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
            redraw();
        }

    }
    mY = lastY;
}

function redraw() {
    // Clear the entire canvas
    var p1 = ctx.transformedPoint(0,0);
    var p2 = ctx.transformedPoint(canvas.width,canvas.height);
    ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);

    // Alternatively:
    // ctx.save();
    // ctx.setTransform(1,0,0,1,0,0);
    // ctx.clearRect(0,0,canvas.width,canvas.height);
    // ctx.restore();

    ctx.drawImage(gkhead,0,0);
}

var zoom = function(clicks){
    var pt = ctx.transformedPoint(lastX,lastY);
    ctx.translate(pt.x,pt.y);
    var factor = Math.pow(scaleFactor,clicks);
    ctx.scale(factor,factor);
    ctx.translate(-pt.x,-pt.y);
    redraw();
}

var handleScroll = function(evt){
    var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
    if (delta) zoom(delta);
    return evt.preventDefault() && false;
};


// Adds ctx.getTransform() - returns an SVGMatrix
// Adds ctx.transformedPoint(x,y) - returns an SVGPoint
function trackTransforms(ctx){
    var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
    var xform = svg.createSVGMatrix();
    ctx.getTransform = function(){
        return xform;
    };

    var savedTransforms = [];
    var save = ctx.save;
    ctx.save = function(){
        savedTransforms.push(xform.translate(0,0));
        return save.call(ctx);
    };
    var restore = ctx.restore;
    ctx.restore = function(){
        xform = savedTransforms.pop();
        return restore.call(ctx);
    };

    var scale = ctx.scale;
    ctx.scale = function(sx,sy){
        xform = xform.scaleNonUniform(sx,sy);
        return scale.call(ctx,sx,sy);
    };
    var rotate = ctx.rotate;
    ctx.rotate = function(radians){
        xform = xform.rotate(radians*180/Math.PI);
        return rotate.call(ctx,radians);
    };
    var translate = ctx.translate;
    ctx.translate = function(dx,dy){
        xform = xform.translate(dx,dy);
        return translate.call(ctx,dx,dy);
    };
    var transform = ctx.transform;
    ctx.transform = function(a,b,c,d,e,f){
        var m2 = svg.createSVGMatrix();
        m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
        xform = xform.multiply(m2);
        return transform.call(ctx,a,b,c,d,e,f);
    };
    var setTransform = ctx.setTransform;
    ctx.setTransform = function(a,b,c,d,e,f){
        xform.a = a;
        xform.b = b;
        xform.c = c;
        xform.d = d;
        xform.e = e;
        xform.f = f;
        return setTransform.call(ctx,a,b,c,d,e,f);
    };
    var pt  = svg.createSVGPoint();
    ctx.transformedPoint = function(x,y){
        pt.x=x; pt.y=y;
        return pt.matrixTransform(xform.inverse());
    }
}
