// Generated by CoffeeScript 1.8.0
'use strict';
angular.module('clickingGame', []).controller('RootCtrl', function($scope, $timeout, CanvasDrawing) {
  var dropImages, getXY;
  $scope.drops = 0;
  $scope.dropImgFiles = ['tint_1.png', 'tint_2.png', 'tint_3.png'];
  dropImages = [];
  $timeout(function() {
    return dropImages = $('.drops .drop');
  });
  getXY = function(event) {
    if (event.offsetX === null) {
      return {
        x: event.originalEvent.layerX,
        y: event.originalEvent.layerY
      };
    } else {
      return {
        x: event.offsetX,
        y: event.offsetY
      };
    }
  };
  return $scope.canvasClick = function($event) {
    var pt;
    pt = getXY($event);
    return _.times(10000, function() {
      var size;
      size = _.random(20, 64);
      CanvasDrawing.addDrop({
        img: _.sample(dropImages, 1)[0],
        x: pt.x - size / 2,
        y: pt.y - size / 3,
        w: size,
        h: size,
        xspeed: _.random(-3, 3) + _.random(-3, 3) + _.random(-3, 3),
        yspeed: _.random(-15, -3)
      });
      return $scope.drops++;
    });
  };
}).factory('CanvasDrawing', function() {
  var accumulator, animloop, canvas, ctx, currTime, drops, moveDrop, movedt, render, yacceleration;
  canvas = document.getElementById('canvas');
  ctx = new Context2DWrapper(canvas.getContext('2d'));
  drops = [];
  yacceleration = 1;
  moveDrop = function(drop) {
    drop.y = drop.y + drop.yspeed;
    drop.yspeed = drop.yspeed + yacceleration;
    drop.xspeed = drop.xspeed / 1.03;
    drop.x += drop.xspeed;
    return drop.y < 700;
  };
  movedt = 1000 / 60;
  accumulator = 0;
  currTime = 0;
  render = function(time) {
    var dt;
    dt = time - currTime;
    currTime = time;
    accumulator += dt;
    while (accumulator > movedt) {
      drops = _.filter(drops, moveDrop);
      accumulator -= movedt;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    _.each(drops, function(drop) {
      return ctx.drawImage(drop.img, drop.x, drop.y, drop.w, drop.h);
    });
    return console.log(drops.length, dt, time);
  };
  animloop = function(time) {
    requestAnimationFrame(animloop);
    return render(time);
  };
  animloop(0);
  return {
    addDrop: function(obj) {
      return drops.push(obj);
    }
  };
});
