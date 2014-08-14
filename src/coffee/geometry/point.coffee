class @Point
  constructor: (@x, @y, @z) ->
    @z = 0 if !@z