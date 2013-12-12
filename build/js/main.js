(function() {
  var Main;

  window.uniforms1 = {
    time: {
      type: "f",
      value: 1.0
    },
    resolution: {
      type: "v2",
      value: new THREE.Vector2()
    }
  };

  window.FW = {};

  if (typeof SC !== "undefined" && SC !== null) {
    SC.initialize({
      client_id: "7da24ca214bf72b66ed2494117d05480"
    });
  }

  window.soundOn = false;

  FW.sfxVolume = 0.2;

  window.onload = function() {
    FW.myWorld = new FW.World();
    FW.myWorld.animate();
    return FW.main = new FW.Main();
  };

  FW.Main = Main = (function() {
    function Main() {
      if (soundOn) {
        SC.stream("/tracks/rameses-b-inspire", function(sound) {});
      }
    }

    return Main;

  })();

  FW.rocketMat = new THREE.ShaderMaterial({
    uniforms: uniforms1,
    vertexShader: document.getElementById('rocketVertexShader').textContent,
    fragmentShader: document.getElementById('fragment_shader1').textContent
  });

}).call(this);
