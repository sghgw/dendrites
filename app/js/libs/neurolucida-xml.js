(function(){var a,b;a=function(){function a(a,b){this.startPoint=a,this.endPoint=b,this.direction=[this.endPoint[0]-this.startPoint[0],this.endPoint[1]-this.startPoint[1],this.endPoint[2]-this.startPoint[2]]}return a.prototype.getLength=function(){var a,b,c;return a=Math.pow(this.endPoint[0]-this.startPoint[0],2),b=Math.pow(this.endPoint[1]-this.startPoint[1],2),c=Math.pow(this.endPoint[2]-this.startPoint[2],2),Math.sqrt(a+b+c)},a.prototype.distanceToPoint=function(a){var b,c,d;return d=[a[0]-this.startPoint[0],a[1]-this.startPoint[1],a[2]-this.startPoint[2]],b=[this.direction[1]*d[2]-this.direction[2]*d[1],this.direction[2]*d[0]-this.direction[0]*d[2],this.direction[0]*d[1]-this.direction[1]*d[0]],b=Math.sqrt(Math.pow(b[0],2)+Math.pow(b[1],2)+Math.pow(b[2],2)),c=Math.sqrt(Math.pow(this.direction[0],2)+Math.pow(this.direction[1],2)+Math.pow(this.direction[2],2)),b/c},a}(),b="undefined"!=typeof exports&&null!==exports?exports:window,b.Segment=a}).call(this),function(){var a,b;a=function(){function a(){this.dendrites=[]}return a.prototype.load=function(a){if(!a)throw new Error("No XML found");return this.xml=$($.parseXML(a)),this.loadDendrites(this.xml.find("tree[type=Dendrite]"))},a.prototype.loadDendrites=function(a){var b,c,d,e;for(e=[],c=0,d=a.length;d>c;c++)b=a[c],e.push(this.loadDendrite($(b)));return e},a.prototype.loadDendrite=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n;for(b={segments:[],spines:[],length:0,total_spines:0,surface:0,volume:0,group:"",file:"",title:""},m=a.children("point"),i=0,k=m.length;k>i;i++)e=m[i],d=$(e).next("point"),d&&(f=new Segment(this._getCoordinates($(e)),this._getCoordinates(d)),b.length+=f.getLength());for(n=a.children("spine"),j=0,l=n.length;l>j;j++)g=n[j],h=this._getCoordinates($(g).prev("point")),c=this._getCoordinates($(g).children("point").first()),g=new Segment(h,c),b.spines.push({length:g.getLength()}),b.total_spines++;return this.dendrites.push(b)},a.prototype._getCoordinates=function(a){return[parseFloat(a.attr("x")),parseFloat(a.attr("y")),parseFloat(a.attr("z")),parseFloat(a.attr("d"))]},a}(),b="undefined"!=typeof exports&&null!==exports?exports:window,b.NeurolucidaXML=a}.call(this);