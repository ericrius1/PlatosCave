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
window.FW = {}
SC?.initialize({
    client_id: "7da24ca214bf72b66ed2494117d05480",
});
window.soundOn = false
FW.sfxVolume = 0.2
FW.globalTick = 0.16
FW.development = true

#make user let go when they want to explode firework
#flocking birds
#sunrise sunset
window.onload = ->
  FW.myWorld = new FW.World()
  FW.myWorld.animate()
  FW.main = new FW.Main()


FW.Main = class Main
  constructor: ->
    if soundOn
      SC.stream "/tracks/rameses-b-inspire", (sound)->
        if soundOn
          sound.play()



