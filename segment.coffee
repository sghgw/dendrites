class Segment
  constructor: (@startPoint, @endPoint) ->
    # @startPoint.push 0 if @startPoint.length != 3
    # @endPoint.push 0 if @endPoint.length != 3
    @direction = [@endPoint[0] - @startPoint[0], @endPoint[1] - @startPoint[1], @endPoint[2] - @startPoint[2]]

  getLength: ->
    x = Math.pow (@endPoint[0] - @startPoint[0]), 2
    y = Math.pow (@endPoint[1] - @startPoint[1]), 2
    z = Math.pow (@endPoint[2] - @startPoint[2]), 2
    Math.sqrt(x + y + z)

  distanceToPoint: (point) ->
    r = [point[0] - @startPoint[0], point[1] - @startPoint[1], point[2] - @startPoint[2]]
    d1 = [
        @direction[1]*r[2] - @direction[2]*r[1],
        @direction[2]*r[0] - @direction[0]*r[2],
        @direction[0]*r[1] - @direction[1]*r[0]
      ]  
    d1 = Math.sqrt(
        Math.pow(d1[0], 2) + 
        Math.pow(d1[1], 2) +
        Math.pow(d1[2], 2)
      )
    d2 = Math.sqrt(
        Math.pow(@direction[0], 2) + 
        Math.pow(@direction[1], 2) +
        Math.pow(@direction[2], 2)
      )
    d1/d2


    
root = exports ? window
root.Segment = Segment