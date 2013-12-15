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

  window.soundOn = true;

  FW.sfxVolume = 0.2;

  FW.globalTick = 0.16;

  FW.development = false;

  window.onload = function() {
    FW.myWorld = new FW.World();
    FW.myWorld.animate();
    return FW.main = new FW.Main();
  };

  FW.Main = Main = (function() {
    function Main() {
      if (soundOn) {
        SC.stream("/tracks/rameses-b-inspire", function(sound) {
          return sound.play();
        });
      }
    }

    return Main;

  })();

}).call(this);
