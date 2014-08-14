(function() {
  var Line, root;

  Line = (function() {
    function Line(startPoint, endPoint) {
      this.startPoint = startPoint;
      this.endPoint = endPoint;
      if (this.startPoint.length !== 3) {
        this.startPoint.push(0);
      }
      if (this.endPoint.length !== 3) {
        this.endPoint.push(0);
      }
      this.direction = [this.endPoint[0] - this.startPoint[0], this.endPoint[1] - this.startPoint[1], this.endPoint[2] - this.startPoint[2]];
    }

    Line.prototype.getLength = function() {
      var x, y, z;
      x = Math.pow(this.endPoint[0] - this.startPoint[0], 2);
      y = Math.pow(this.endPoint[1] - this.startPoint[1], 2);
      z = Math.pow(this.endPoint[2] - this.startPoint[2], 2);
      return Math.sqrt(x + y + z);
    };

    Line.prototype.distanceToPoint = function(point) {
      var d1, d2, r;
      r = [point[0] - this.startPoint[0], point[1] - this.startPoint[1], point[2] - this.startPoint[2]];
      d1 = [this.direction[1] * r[2] - this.direction[2] * r[1], this.direction[2] * r[0] - this.direction[0] * r[2], this.direction[0] * r[1] - this.direction[1] * r[0]];
      d1 = Math.sqrt(Math.pow(d1[0], 2) + Math.pow(d1[1], 2) + Math.pow(d1[2], 2));
      d2 = Math.sqrt(Math.pow(this.direction[0], 2) + Math.pow(this.direction[1], 2) + Math.pow(this.direction[2], 2));
      return d1 / d2;
    };

    return Line;

  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : window;

  root.Line = Line;

}).call(this);
