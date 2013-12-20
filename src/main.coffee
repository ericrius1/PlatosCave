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
FW.sfxVolume = 0.2
FW.globalTick = 0.16
FW.development = false
window.soundOn = !FW.development

#make user let go when they want to explode firework
#flocking birds
#sunrise sunset
window.onload = ->
  FW.myWorld = new FW.World()
  FW.myWorld.animate()
  FW.main = new FW.Main()
  infoEl = document.getElementsByClassName('infoWrapper')[0]
  infoShowing = false
  document.onclick = (event)-> 
    console.log event.target.className
    el = event.target;
    if (el.className is "icon") 
      infoEl.style.display = if infoShowing then 'none' else 'block'
      infoShowing = !infoShowing;

        
      


FW.Main = class Main
  constructor: ->
    if soundOn
      SC.stream "/tracks/rameses-b-inspire", (sound)->
        if soundOn
          sound.play()



