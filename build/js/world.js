(function() {
  var World,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.World = World = (function() {
    var onWindowResize, time;

    time = Date.now();

    function World() {
      this.animate = __bind(this.animate, this);
      var light;
      this.entities = [];
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
      this.scene = new THREE.Scene();
      light = new THREE.DirectionalLight(0xffeeee, 1.0);
      light.position.set(1, 1, 1);
      this.scene.add(light);
      light = new THREE.DirectionalLight(0xffffff, 0.75);
      light.position.set(-1, -0.5, -1);
      this.scene.add(light);
      this.stats = new Stats();
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.left = '0px';
      this.stats.domElement.style.top = '0px';
      document.body.appendChild(this.stats.domElement);
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      this.renderer.setClearColor(0x000000, 1);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);
      this.controls = new THREE.FirstPersonControls(this.camera, this.renderer.domElement);
      this.controls.movementSpeed = .05;
      this.controls.lookSpeed = .0003;
      this.scene.add(this.controls);
      window.addEventListener("resize", onWindowResize, false);
    }

    World.prototype.addEntity = function(script) {
      var start;
      this.g = new grow3.System(this.scene, this.camera, script);
      start = (new Date).getTime();
      this.entities.push(this.g.build());
      return this.gameOn = true;
    };

    onWindowResize = function() {
      myWorld.camera.aspect = window.innerWidth / window.innerHeight;
      myWorld.camera.updateProjectionMatrix();
      return myWorld.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    World.prototype.animate = function() {
      requestAnimationFrame(this.animate);
      this.stats.update();
      this.controls.update(Date.now() - time);
      this.renderer.render(this.scene, this.camera);
      return time = Date.now();
    };

    return World;

  })();

}).call(this);
