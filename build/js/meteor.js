(function() {
  var Meteor;

  FW.Meteor = Meteor = (function() {
    var rnd;

    rnd = FW.rnd;

    function Meteor() {
      var i, _i;
      this.meteors = [];
      this.meteorGroup = new ShaderParticleGroup({
        texture: THREE.ImageUtils.loadTexture('assets/star.png'),
        blending: THREE.AdditiveBlending,
        maxAge: 15
      });
      this.meteorVisibleDistance = 10000;
      for (i = _i = 1; _i <= 3; i = ++_i) {
        this.newMeteor();
      }
      FW.scene.add(this.meteorGroup.mesh);
      this.calcPositions();
    }

    Meteor.prototype.generateSpeed = function(meteor) {
      meteor.speedX = rnd(0.01, 1);
      meteor.speedY = .005;
      meteor.speedZ = rnd(0.01, 1);
      meteor.accelX = .01;
      meteor.accelY = 0;
      meteor.accelZ = .1;
      meteor.dirX = rnd(-1, 1);
      meteor.dirY = -1;
      return meteor.dirZ = rnd(1, -1);
    };

    Meteor.prototype.newMeteor = function() {
      var colorEnd, colorStart, meteor;
      colorStart = new THREE.Color();
      colorStart.setRGB(Math.random(), Math.random(), Math.random());
      meteor = new THREE.Object3D();
      this.generateSpeed(meteor);
      meteor.position = new THREE.Vector3(0, 2000, 0);
      colorEnd = new THREE.Color();
      colorEnd.setRGB(Math.random(), Math.random(), Math.random());
      meteor.light = new THREE.PointLight(colorStart, 2, 1000);
      FW.scene.add(meteor.light);
      meteor.tailEmitter = new ShaderParticleEmitter({
        position: meteor.position,
        positionSpread: new THREE.Vector3(20, 20, 2),
        size: rnd(1000, 3000),
        sizeSpread: 1000,
        acceleration: new THREE.Vector3(meteor.dirX, meteor.dirY, meteor.dirZ),
        accelerationSpread: new THREE.Vector3(.7, .7, .7),
        particlesPerSecond: 10,
        colorStart: colorStart,
        colorEnd: colorEnd
      });
      this.meteorGroup.addEmitter(meteor.tailEmitter);
      return this.meteors.push(meteor);
    };

    Meteor.prototype.calcPositions = function() {
      var distance, meteor, _i, _len, _ref,
        _this = this;
      _ref = this.meteors;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        meteor = _ref[_i];
        distance = FW.camera.position.distanceTo(meteor.position);
        if (distance > this.meteorVisibleDistance) {
          this.generateSpeed(meteor);
          meteor.position = new THREE.Vector3(0, 1000, 0);
        }
      }
      return setTimeout(function() {
        return _this.calcPositions();
      }, 10000);
    };

    Meteor.prototype.tick = function() {
      var meteor, _i, _len, _ref;
      _ref = this.meteors;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        meteor = _ref[_i];
        meteor.speedX += meteor.accelX;
        meteor.speedY += meteor.accelY;
        meteor.speedZ += meteor.accelZ;
        meteor.translateX(meteor.speedX * meteor.dirX);
        meteor.translateY(meteor.speedY * meteor.dirY);
        meteor.translateZ(meteor.speedZ * meteor.dirZ);
        meteor.light.position = new THREE.Vector3().copy(meteor.position);
        meteor.tailEmitter.position = new THREE.Vector3().copy(meteor.position);
      }
      return this.meteorGroup.tick(FW.globalTick);
    };

    return Meteor;

  })();

}).call(this);
