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

  FW.sfxVolume = 0.2;

  FW.globalTick = 0.16;

  FW.development = true;

  window.soundOn = !FW.development;

  window.onload = function() {
    var infoEl, infoShowing;
    FW.myWorld = new FW.World();
    FW.myWorld.animate();
    FW.main = new FW.Main();
    infoEl = document.getElementsByClassName('info')[0];
    infoShowing = false;
    return document.onclick = function(event) {
      var el;
      el = event.target;
      if (el.className === "icon" && !infoShowing) {
        infoEl.style.display = 'block';
        infoShowing = true;
        return event.stopPropagation();
      } else {
        infoEl.style.display = 'none';
        return infoShowing = false;
      }
    };
  };

  FW.Main = Main = (function() {
    function Main() {
      if (soundOn) {
        SC.stream("/tracks/rameses-b-inspire", function(sound) {});
      }
    }

    return Main;

  })();

}).call(this);
