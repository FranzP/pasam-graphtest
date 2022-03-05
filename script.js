var nodes = [];
var edges = [];

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

workflow.AllowedTransfers.forEach((c) => {
  nodes.push(c.From);
  nodes.push(c.To);

  var link = {
    data: {
      source: c.From,
      target: c.To,
    },
  };

  edges.push(link);
});

nodes = nodes.filter(onlyUnique).map((c) => {
  return {
    data: {
      id: c,
      name: c,
    },
  };
});

console.log(nodes);

var cy = cytoscape({
  container: document.getElementById('cy'),

  style: cytoscape
    .stylesheet()
    // nodes
    .selector('node')
    .css({
      height: 100,
      width: 100,
      'background-fit': 'cover',
      'background-color': 'white',
      'border-color': '#000',
      'border-width': 3,
      'border-opacity': 0.5,
      'background-image': 'data(image)',
      label: 'data(name)',
      'text-valign': 'bottom',
      'text-halign': 'center',
    })
    .selector('edge')
    .css({
      'curve-style': 'bezier',
      width: 4,
      'target-arrow-shape': 'triangle',
      'line-color': 'lightgray',
      'target-arrow-color': 'grey',
    }),

  boxSelectionEnabled: false,
  autounselectify: true,

  elements: {
    nodes: nodes,
    edges: edges,
  },

  layout: {
    // name: 'concentric',
    // name: 'breadthfirst',
    name: 'klay',
    directed: true,
    avoidOverlap: true,
    padding: 20,
  },
});
