chai = require 'chai'
chai.should()
expect = chai.expect

{Line} = require '../src/coffee/geometry/line'

describe 'Line', ->
  line = null

  it 'should have a startpoint', ->
    line = new Line [1,2,3], [1,2,3]
    line.startPoint.should.have.length 3
    line.startPoint[0].should.equal 1

  it 'should have a endpoint', ->
    line = new Line [1,2,3], [1,2,3]
    line.endPoint.should.have.length 3
    line.endPoint[0].should.equal 1

  it 'should have a length', ->
    line = new Line [1,1,1], [3,1,1]
    line.getLength().should.equal 2

  it 'should have a direction', ->
    line = new Line [1,1,1], [2,3,4]
    line.direction[0].should.equal (2 - 1)
    line.direction[1].should.equal (3 - 1)
    line.direction[2].should.equal (4 - 1)

  it 'should have a distance to a point', ->
    line = new Line [1,1,1], [10,1,1]
    line.distanceToPoint([5,6,1]).should.equal 5
