(function() {
  this.Point = (function() {
    function Point(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
      if (!this.z) {
        this.z = 0;
      }
    }

    return Point;

  })();

}).call(this);
