var canvas = document.getElementById('viz');
var pjs = [];
var p = Processing(canvas);

var data = JSON.parse(p.ajax('data.json'));
data.nextEdges = [];

for (var i = 0; i < data.edges.length; i++) {
  var edge = data.edges[i];
  if (edge[0] + 1 == edge[1]) {
    edge.isNext = true;
    data.nextEdges.push(edge);
  }
  var start = data.coords[edge[0]];
  var end = data.coords[edge[1]];
  start.outgoing = start.outgoing || [];
  start.outgoing.push(edge);
  end.incoming = end.incoming || [];
  end.incoming.push(edge);
}

var maxX = 0;
var maxY = 0;
var minX = Number.MAX_VALUE;
var minY = Number.MAX_VALUE;
for (i = 0; i < data.coords.length; i++) {
  var coord = data.coords[i];
  var origPos = {x: coord[0], y: coord[1]};
  if (origPos.x > maxX) {
    maxX = origPos.x;
  }
  else if (origPos.x < minX) {
    minX = origPos.x;
  }
  if (origPos.y > maxY) {
    maxY = origPos.y;
  }
  else if (origPos.y < minY) {
    minY = origPos.y;
  }
  coord.origPos = origPos;
}

for (i = 0; i < data.coords.length; i++) {
  var coord = data.coords[i];
  coord.x = (coord.origPos.x - minX) / (maxX - minX);
  coord.y = (coord.origPos.y -minY) / (maxY - minY);
}

function edgeExists(start, end) {
    var coord = data.coords[start];
    if (!coord) {
        return false;
    }
    var edges = coord.outgoing;
    if (!edges) {
        return false;
    }
    for (var i = 0; i < edges.length; i++) {
        if (edges[i][1] == end) {
            return true;
        }
    }
    return false;
}

for (i = 0; i < data.edges.length; i++) {
    var edge = data.edges[i];
    var start = edge[0];
    var end = edge[1];
    // is this the first node is a sequence of connected nodes
    if (!edgeExists(start - 1, end - 1)) {
        edge.isFirst = true;
        for (var j = 0; j < 50; j++) {
            if (!edgeExists(start + j + 1, end + j + 1)) {
                break;
            }
        }
        edge.sharedLength = j + 1;
        console.log(edge.sharedLength);
    }
    if (!edgeExists(start + 1, end + 1)) {
        edge.isLast = true;
    }
}

var defaultVis = 'test';

var viz = location.hash ? location.hash.substring(1) : defaultVis;

p.init(p.ajax('pjs/' + viz + '.pjs'));
