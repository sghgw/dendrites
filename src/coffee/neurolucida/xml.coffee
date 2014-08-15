class NeurolucidaXML
  constructor: ->
    @dendrites = []
  load: (xml) ->
    throw new Error('No XML found') if !xml
    # load XML via DOMParser
    @xml = $($.parseXML(xml))
    # load tree-nodes with type="Dendrite"
    @loadDendrites @xml.find('tree[type=Dendrite]')

    # TODO: load tree-nodes with type="Axon"
    # TODO: load cell bodies


  # load dendrite data from a collection of tree[type=Dendrite] tags
  loadDendrites: (tags) ->
    for tag in tags
      @loadDendrite $(tag)

  # load dendrite data from a single tree[type=Dendrite] tag
  loadDendrite: (tag) ->
    # create basic template for dendrite object
    dendrite = {
      segments: []
      spines: []
      length: 0
      total_spines: 0
      surface: 0
      volume: 0
      group: ''
      file: ''
      title: ''
    }

    # loop through all point tags and create a segment of dendrite between this point and the next one
    for point in tag.children('point')
      next = $(point).next('point')
      if next
        segment = new Segment(@_getCoordinates($(point)), @_getCoordinates(next)) 
        dendrite.length += segment.getLength()

    # loop through all spine tags
    for spine in tag.children 'spine'
      start = @_getCoordinates $(spine).prev('point')
      end = @_getCoordinates $(spine).children('point').first()
      spine = new Segment(start, end)
      dendrite.spines.push {
        length: spine.getLength()
      }
      dendrite.total_spines++

    @dendrites.push dendrite

  # return x, y, z, d of point tag as array
  _getCoordinates: (point) ->
    [
      parseFloat(point.attr 'x'),
      parseFloat(point.attr 'y'),
      parseFloat(point.attr 'z'),
      parseFloat(point.attr 'd')
    ]

root = exports ? window
root.NeurolucidaXML = NeurolucidaXML