(function() {
  var NeurolucidaXML, root;

  NeurolucidaXML = (function() {
    function NeurolucidaXML() {
      this.dendrites = [];
    }

    NeurolucidaXML.prototype.load = function(xml) {
      if (!xml) {
        throw new Error('No XML found');
      }
      this.xml = $($.parseXML(xml));
      return this.loadDendrites(this.xml.find('tree[type=Dendrite]'));
    };

    NeurolucidaXML.prototype.loadDendrites = function(tags) {
      var tag, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = tags.length; _i < _len; _i++) {
        tag = tags[_i];
        _results.push(this.loadDendrite($(tag)));
      }
      return _results;
    };

    NeurolucidaXML.prototype.loadDendrite = function(tag) {
      var dendrite, end, next, point, segment, spine, start, _i, _j, _len, _len1, _ref, _ref1;
      dendrite = {
        segments: [],
        spines: [],
        length: 0,
        total_spines: 0,
        surface: 0,
        volume: 0,
        group: '',
        file: '',
        title: ''
      };
      _ref = tag.children('point');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        point = _ref[_i];
        next = $(point).next('point');
        if (next) {
          segment = new Segment(this._getCoordinates($(point)), this._getCoordinates(next));
          dendrite.length += segment.getLength();
        }
      }
      _ref1 = tag.children('spine');
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        spine = _ref1[_j];
        start = this._getCoordinates($(spine).prev('point'));
        end = this._getCoordinates($(spine).children('point').first());
        spine = new Segment(start, end);
        dendrite.spines.push({
          length: spine.getLength()
        });
        dendrite.total_spines++;
      }
      return this.dendrites.push(dendrite);
    };

    NeurolucidaXML.prototype._getCoordinates = function(point) {
      return [parseFloat(point.attr('x')), parseFloat(point.attr('y')), parseFloat(point.attr('z')), parseFloat(point.attr('d'))];
    };

    return NeurolucidaXML;

  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : window;

  root.NeurolucidaXML = NeurolucidaXML;

}).call(this);
