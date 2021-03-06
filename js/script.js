var windowX = $(window).width()-20;
var windowY = $(window).height() -40;
var initCoords= {x:0,y:0};
var imagesOK = 0;
var imgs = [];  
var imgArr = [{path:"img/apple.jpeg",
                    x:200,
                    y:30},
                    {path:"img/logo.png",
                     x:300,
                     y:30},
                     {path:"img/banana.jpeg",
                     x:300,
                     y:30},
                     {path:"img/mango.jpeg",
                     x:300,
                     y:30},
                     {path:"img/onion.jpeg",
                     x:300,
                     y:30},
                     {path:"img/orange.jpeg",
                     x:300,
                     y:30},
                    {path:"img/tomato.jpeg",
                    x:300,
                    y:30}
              ];

var rotateDegree = 0;
var lineWidth = windowX - 140;
var lineHeight = 0;
var rectWidth = lineWidth - (lineWidth/1.4);
var rectHeight = lineWidth - (lineWidth/1.4);


var stage = new Kinetic.Stage({
  container:'container',
  width:windowX ,
  height:windowY  

});

var layer = new Kinetic.Layer();

var Line = new Kinetic.Rect({
  name:'line',
  width:lineWidth,
  height:lineHeight,
  stroke:'black',
  strokeWidth:4
});

var leftRect = new Kinetic.Rect({
  name:'leftRect',
  x:0,
  y:-rectWidth,
  width:rectWidth,
  height:rectHeight,
  stroke:'black',
  strokeWidth:4
});


var rightRect = new Kinetic.Rect({
  name:'rightRect',
  x:lineWidth - rectWidth,
  y:-rectWidth,
  width:rectWidth,
  height:rectHeight,
  stroke:'black',
  strokeWidth:4
});

var groupLayer = new Kinetic.Rect({
  width:lineWidth,
  height:-rectWidth,
  name:'seeSaw'

});

var rectGroup = new Kinetic.Group({
  x:windowX/2,
  y:windowY - 200,
  width:groupLayer.width(),
  height:groupLayer.height(),
  offsetX:groupLayer.width()/2,
  offsetY:groupLayer.height()/2
});

layer.add(rectGroup);
rectGroup.add(groupLayer);
rectGroup.add(Line);
rectGroup.add(leftRect);
rectGroup.add(rightRect);
stage.add(layer);


 loadAllImages(start); 

function loadAllImages(callback) {
  for(var i=0; i< imgArr.length;i++) {
    var img = new Image();
    imgs.push(img);
    img.onload = function() {
        imagesOK++;
        if (imagesOK >= imgArr.length) {
            callback();
        }            
    };
    img.src = imgArr[i].path; 
  }
}      

function start () {
  var x = windowX/10;
  var y = 60;
  for(var i = 0; i < imgs.length; i++) {
    var cx = x+(i*90);
    var cy = 0;
    if(cx < (windowX - 50)) {
       cx = cx;
       cy = 30;
    }
    else {
       cx = cx-windowX + 50;
       cy = 120;
    }


      // var cy = parseInt(imgArr[i].y);
      Images = new Kinetic.Image({
        x: cx, 
        y: cy,
        width: windowX/200*20,
        height: windowX/200*20,
        image: imgs[i],
        path:imgArr[i].path, 
        draggable:true
        })
      layer.add(Images);
      ImageDRAGGER();      
  }
    layer.draw();
}  

function ImageDRAGGER() {
  Images.on('dragstart', function(e) { 
    initCoords = {  x:e.target.x(),
                    y:e.target.y()
                 };
  });

  Images.on('dragend',function(e) {            
      var droppableTargets = rectGroup.find('.leftRect');
      var droppableTargets2 = rectGroup.find('.rightRect');
      var draggable = e.target;

      if(intersectRect(draggable, droppableTargets[0]) == true){
        isDropTrue(draggable, droppableTargets[0])
        rotateDegree = -30;
        incheightonDrop(draggable,droppableTargets[0])
        rotateEverything(rectGroup,rotateDegree);
      }
      else 
      if( intersectRect(draggable, droppableTargets2[0]) == true){
        isDropTrue(draggable, droppableTargets2[0])
        rotateDegree = 30;
        incheightonDrop(draggable,droppableTargets2[0])
        rotateEverything(rectGroup,rotateDegree);
      }
      else {
       var tween = new Kinetic.Tween({
          node: draggable, 
          duration: 0.4,
          x: initCoords.x,
          y: initCoords.y
          }); 
        tween.play();
      }    
  });
}

function isDropTrue(draggable,droppableRect) {
  droppableRect.setStroke("#ff0000");
  addImage(draggable);
  var targetW = droppableRect.width();
  var targetH = droppableRect.height();
  var targetX = droppableRect.x() + (targetW/2- draggable.width()/2);
  var targetY = droppableRect.y() + (targetH/2- draggable.height()/2);

  draggable.x(targetX);
  draggable.y(targetY);

}

function addImage(draggable) {
  rectGroup.add(draggable);
}

function rotateEverything(obj,rotateDegree) {
  var tween = new Kinetic.Tween({
    node: obj,
    rotationDeg: rotateDegree,
    duration: 4,
    easing: Kinetic.Easings.EaseInOut,
    setStroke:"#eee"
  });
    tween.play(); 
}   


function intersectRect(r1, r2) {
  prepareForIntersect(r1);
  prepareForIntersect(r2);
  return !(r2.left > r1.right || parseInt(r2.right) < r1.left || r2.top > r1.bottom ||parseInt(r2.bottom )< r1.top);
}

function prepareForIntersect(r2){

  point=r2.getAbsolutePosition();

  r2.left=point.x;
  r2.right=parseInt(point.x)+r2.width();
  r2.top=point.y;
  r2.bottom=parseInt(point.y)+r2.height();
}

function changeBoxColor(r2) {
  r2.setStroke("#ff0000");
}

var leftimgArr = [];
var rightimgArr = [];

function incheightonDrop(draggable,droppableTargets){
  console.log(droppableTargets.name())

  if(droppableTargets.name()=="leftRect") {
    leftimgArr.push(draggable.attrs.path);
    console.log(leftimgArr)
    increaseHeight(leftimgArr,droppableTargets,draggable);
  }
  if(droppableTargets.name()=="rightRect") {
    rightimgArr.push(draggable.attrs.path);
    console.log(rightimgArr)
    increaseHeight(rightimgArr,droppableTargets,draggable);
  }
}

function increaseHeight(imgArr,droppableTargets,draggable) {
  var uniqueNames = [];
  $.each(imgArr, function(i, el){
    if($.inArray(el, uniqueNames) === -1 ) {
      uniqueNames.push(el);
      if(uniqueNames.length>1) {
        var newHeight = droppableTargets.height()+draggable.height()/2;
        droppableTargets.height(newHeight);
        droppableTargets.y(-newHeight);
      } 
    }
  });
}




