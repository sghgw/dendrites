chai = require 'chai'
chai.should()
expect = chai.expect

{NeurolucidaXML} = require '../src/coffee/neurolucida/xml'

describe 'NeurolucidaXML', ->

  it 'should load a XML'