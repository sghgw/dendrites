chai = require 'chai'
chai.should()
expect = chai.expect

{Segment} = require '../src/coffee/neurolucida/segment'

describe 'Segment', ->
  segment = null

  it 'should have a startpoint', ->
    segment = new Segment [1,2,3], [1,2,3]
    segment.startPoint.should.have.length 3
    segment.startPoint[0].should.equal 1

  it 'should have a endpoint', ->
    segment = new Segment [1,2,3], [1,2,3]
    segment.endPoint.should.have.length 3
    segment.endPoint[0].should.equal 1

  it 'should have a length', ->
    segment = new Segment [1,1,1], [3,1,1]
    segment.getLength().should.equal 2

  it 'should have a direction', ->
    segment = new Segment [1,1,1], [2,3,4]
    segment.direction[0].should.equal (2 - 1)
    segment.direction[1].should.equal (3 - 1)
    segment.direction[2].should.equal (4 - 1)

  it 'should have a distance to a point', ->
    segment = new Segment [1,1,1], [10,1,1]
    segment.distanceToPoint([5,6,1]).should.equal 5
