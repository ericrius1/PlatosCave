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

#inspire rameses b
#Give user option between building a permanent structure or laun@stars fire works
window.onload = ->
  FW.myWorld = new FW.World()
  FW.myWorld.animate()
  FW.main = new FW.Main()


FW.Main = class Main
  constructor: ->
    if soundOn
      SC.stream "/tracks/rameses-b-inspire", (sound)->
         # sound.play()



