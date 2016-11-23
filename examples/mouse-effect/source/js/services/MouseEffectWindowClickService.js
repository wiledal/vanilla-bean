var MouseEffectWindowClickService = (function() {
  window.addEventListener('click', function(event) {
    var pos = {
      x: event.clientX,
      y: event.clientY
    }
    app.onClick(pos)
  })

  return {}
})()
