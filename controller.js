// Generated by CoffeeScript 1.8.0
'use strict';
angular.module('clickingGame', ['ui.bootstrap']).controller('RootCtrl', function($scope, $timeout, $interval, CanvasDrawing) {
  var dropImages, getXY;
  $scope.drops = 0;
  CanvasDrawing.onDrops(function(numDrops) {
    $scope.drops += numDrops;
    return $scope.$digest();
  });
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
  $scope.userClick = 1;
  $scope.canvasClick = function($event) {
    var pt;
    pt = getXY($event);
    return _.times(Math.round(_.normalRandom($scope.userClick, $scope.userClick * 0.3)), function() {
      var size;
      size = _.normalRandom(40, 20);
      return CanvasDrawing.addDrop({
        img: _.sample(dropImages, 1)[0],
        x: pt.x - size / 2,
        y: pt.y - size / 3,
        w: size,
        h: size,
        xspeed: _.normalRandom(0, 10),
        yspeed: _.normalRandom(-9, 6),
        yacceleration: 1
      });
    });
  };
  $scope.buyClicker = function(clicker) {
    if ($scope.drops < clicker.price) {
      return;
    }
    $scope.drops -= clicker.price;
    if (clicker.bought >= 1) {
      clicker.upgrade(clicker);
    }
    clicker.bought++;
    return clicker.buy(clicker);
  };
  $scope.autoclickers = [];
  CanvasDrawing.onMove(function(movedt) {
    return _.each($scope.autoclickers, function(clicker) {
      var _results;
      if (clicker.bought <= 0) {
        return;
      }
      if (clicker.every <= 0) {
        return;
      }
      clicker.has += movedt;
      _results = [];
      while (clicker.has > clicker.every) {
        clicker["do"](clicker);
        _results.push(clicker.has -= clicker.every);
      }
      return _results;
    });
  });
  $scope.autoclickers.push({
    text: 'Leaking ceiling',
    bought: 0,
    has: 0,
    every: 3000,
    price: 100,
    buy: function(clicker) {
      return clicker.price *= 2;
    },
    upgrade: function(clicker) {
      return clicker.drops++;
    },
    drops: 1,
    "do": function(clicker) {
      return _.times(Math.round(_.normalRandom(clicker.drops, clicker.drops * 0.3)), function() {
        var size;
        size = _.normalRandom(20, 10);
        return CanvasDrawing.addDrop({
          img: _.sample(dropImages, 1)[0],
          x: _.normalRandom(CanvasDrawing.width() / 2, CanvasDrawing.width() / 2) - size / 2,
          y: 10 - size / 3,
          w: size,
          h: size,
          xspeed: 0,
          yspeed: _.normalRandom(0, 3),
          yacceleration: 1
        });
      });
    }
  });
  $scope.autoclickers.push({
    text: 'Open rooftop',
    bought: 0,
    has: 0,
    every: 30,
    price: 2000,
    buy: function(clicker) {
      return clicker.price *= 3;
    },
    upgrade: function(clicker) {
      return clicker.every *= 0.70;
    },
    "do": function(clicker) {
      var size;
      size = _.normalRandom(10, 5);
      return CanvasDrawing.addDrop({
        img: _.sample(dropImages, 1)[0],
        x: _.random(0, CanvasDrawing.width()) - size / 2,
        y: 10 - size / 3,
        w: size,
        h: size,
        xspeed: 0,
        yspeed: _.normalRandom(0, 3),
        yacceleration: 1
      });
    }
  });
  $scope.miscupgrades = [];
  return $scope.miscupgrades.push({
    text: 'Double clicks',
    bought: 0,
    price: 200,
    buy: function(clicker) {
      $scope.userClick++;
      return clicker.removed = true;
    }
  });
}).filter('notRemoved', function() {
  return function(clickers) {
    return _.reject(clickers, {
      removed: true
    });
  };
}).factory('CanvasDrawing', function() {
  var accumulator, animloop, canvas, ctx, currTime, drops, dropsRemoved, moveDrop, move_dt, movedt, render;
  canvas = document.getElementById('canvas');
  ctx = new Context2DWrapper(canvas.getContext('2d'));
  $(window).on('resize', function() {
    $(canvas).attr({
      height: 0
    });
    return $(canvas).attr({
      width: $(canvas).parent().width(),
      height: $(canvas).parent().height() - $(canvas).offset().top
    });
  });
  $(window).trigger('resize');
  drops = [];
  dropsRemoved = function(num) {
    return null;
  };
  move_dt = function(movedt) {
    return null;
  };
  moveDrop = function(drop) {
    drop.y = drop.y + drop.yspeed;
    drop.yspeed = drop.yspeed + drop.yacceleration;
    drop.xspeed = drop.xspeed / 1.03;
    drop.x += drop.xspeed;
    return drop.y < canvas.height;
  };
  movedt = 1000 / 60;
  accumulator = 0;
  currTime = 0;
  render = function(time) {
    var dt, prevNumDrops;
    dt = time - currTime;
    currTime = time;
    accumulator += dt;
    while (accumulator > movedt) {
      prevNumDrops = drops.length;
      drops = _.filter(drops, moveDrop);
      accumulator -= movedt;
      dropsRemoved(prevNumDrops - drops.length);
      move_dt(movedt);
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return _.each(drops, function(drop) {
      return ctx.drawImage(drop.img, drop.x, drop.y, drop.w, drop.h);
    });
  };
  animloop = function(time) {
    requestAnimationFrame(animloop);
    return render(time);
  };
  animloop(0);
  return {
    addDrop: function(obj) {
      return drops.push(obj);
    },
    onDrops: function(fn) {
      return dropsRemoved = fn;
    },
    onMove: function(fn) {
      return move_dt = fn;
    },
    width: function() {
      return canvas.width;
    },
    height: function() {
      return canvas.height;
    }
  };
});

_.mixin({
  normalRandom: function(middle, delta) {
    var max, min, _ref;
    _ref = [middle - delta, middle + delta], min = _ref[0], max = _ref[1];
    return (_.random(min, max) + _.random(min, max) + _.random(min, max)) / 3;
  }
});
