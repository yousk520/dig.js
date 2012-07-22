var assert = require('assert')
    dig = require('../index')

describe('dig.graph', function() {
  var graph, n1, n2, n3;

  beforeEach(function() {
    graph = dig.graph();
    n1 = {name: "n1"};
    n2 = {name: "n2"};
    n3 = {name: "n3"};
  });

  it('should allow nodes to be added', function() {
    assert.deepEqual([n1, n2].sort(), graph.addNodes([n1, n2]).nodes().sort());
    assert.ok(graph.containsNode(n1));
    assert.ok(graph.containsNode(n2));
    assert.equal(false, graph.containsNode(n3));
  });

  it('should fail to add the same node twice', function() {
    graph.addNode(n1);
    
    assert.throws(function() {
      graph.addNode(n1);
    });

    assert.deepEqual([n1], graph.nodes());
  });

  it('should allow removal of nodes', function() {
    graph.addNodes([n1, n2]);
    assert.deepEqual([n2], graph.copy().removeNode(n1).nodes());
    assert.deepEqual([n1], graph.copy().removeNode(n2).nodes());
  });

  it('should allow edges to be added', function() {
    graph
      .addNodes([n1, n2, n3])
      .addEdge(n1, n2)
      .addEdge(n2, n3);

    var expected = [
      {from: n1, to: n2},
      {from: n2, to: n3}
    ];

    assert.deepEqual(expected.sort(), graph.edges().sort());
    assert.ok(graph.containsEdge(n1, n2));
    assert.ok(graph.containsEdge(n2, n3));
    assert.equal(false, graph.containsEdge(n3, n1));

    assert.deepEqual([], graph.predecessors(n1));
    assert.deepEqual([n1], graph.predecessors(n2));
    assert.deepEqual([n2], graph.predecessors(n3));

    assert.deepEqual([n2], graph.successors(n1));
    assert.deepEqual([n3], graph.successors(n2));
    assert.deepEqual([], graph.successors(n3));

    assert.deepEqual([n2], graph.neighbors(n1));
    assert.deepEqual([n1, n3].sort(), graph.neighbors(n2).sort());
    assert.deepEqual([n2], graph.neighbors(n3));
  });

  it('should allow edges to be removed', function() {
    graph
      .addNodes([n1, n2, n3])
      .addEdge(n1, n2)
      .addEdge(n2, n3);

    assert.deepEqual([{from: n2, to: n3}],
                     graph.copy().removeEdge(n1, n2).edges());
    assert.deepEqual([{from: n1, to: n2}],
                     graph.copy().removeEdge(n2, n3).edges());
  });

  it('should remove edges when removing incident nodes', function() {
    graph
      .addNodes([n1, n2])
      .addEdge(n1, n2);
    assert.deepEqual([], graph.copy().removeNode(n1).edges());
    assert.deepEqual([], graph.copy().removeNode(n2).edges());
  });

  it('should treat opposite directed edges as distinct', function() {
    graph
      .addNodes([n1, n2])
      .addEdge(n1, n2)
      .addEdge(n2, n1);

    assert.deepEqual([{from: n2, to: n1}],
                     graph.copy().removeEdge(n1, n2).edges());
    assert.deepEqual([{from: n1, to: n2}],
                     graph.copy().removeEdge(n2, n1).edges());
  });

  it('should allow access to out edges for a node', function() {
    graph.addNodes([n1, n2]).addEdge(n1, n2);

    assert.deepEqual([{from: n1, to: n2}], graph.outEdges(n1));
    assert.deepEqual([], graph.outEdges(n2));
  });

  it('should allow access to in edges for a node', function() {
    graph.addNodes([n1, n2]).addEdge(n1, n2);

    assert.deepEqual([], graph.inEdges(n1));
    assert.deepEqual([{from: n1, to: n2}], graph.inEdges(n2));
  });

  it('should allow edges with labels', function() {
    graph.addNodes([n1, n2]).addEdge(n1, n2, "label");

    var expected = [{from: n1, to: n2, label: "label"}];

    assert.deepEqual(expected, graph.edges());
    assert.deepEqual(expected, graph.outEdges(n1));
    assert.deepEqual(expected, graph.inEdges(n2));
  });

  it('should allow edges between the same nodes with different labels', function() {
    graph
      .addNodes([n1, n2]) 
      .addEdge(n1, n2, "label1")
      .addEdge(n1, n2, "label2");

    var expected = [
      {from: n1, to: n2, label: "label1"},
      {from: n1, to: n2, label: "label2"}
    ].sort();

    assert.deepEqual(expected, graph.edges().sort());
    assert.deepEqual(expected, graph.outEdges(n1).sort());
    assert.deepEqual(expected, graph.inEdges(n2).sort());

    graph.removeEdge(n1, n2, "label2");

    expected = [{from: n1, to: n2, label: "label1"}];

    assert.deepEqual(expected, graph.edges());
    assert.deepEqual(expected, graph.outEdges(n1));
    assert.deepEqual(expected, graph.inEdges(n2));
  });

  it('should fail to remove a node that does not exist', function() {
    assert.throws(function() {
      graph.removeNode(n1);
    });
  });

  it('should fail to add the same edge twice', function() {
    graph.addNodes([n1, n2]).addEdge(n1, n2);

    assert.throws(function() {
      graph.addEdge(n1, n2);
    });
  });

  it('should fail to remove an edge that does not exist', function() {
    graph.addNodes([n1, n2]);
 
    assert.throws(function() {
      graph.removeEdge(n1, n2);
    });
  });

  it('should fail to add an edge for a node that is not in the graph', function() {
    graph.addNode(n1);

    assert.throws(function() { graph.addEdge(n1, n2); });

    assert.ok(graph.containsNode(n1));
    assert.equal(false, graph.containsNode(n2));
    assert.equal(false, graph.containsEdge(n1, n2)); 
  });

  it('should return a predecessor once, even if there are multiple edges', function() {
    graph
      .addNodes([n1, n2])
      .addEdge(n1, n2, "label1")
      .addEdge(n1, n2, "label2");

    assert.deepEqual([n1], graph.predecessors(n2));
  });

  it('should return a successor once, even if there are multiple edges', function() {
    graph
      .addNodes([n1, n2])
      .addEdge(n1, n2, "label1")
      .addEdge(n1, n2, "label2");

    assert.deepEqual([n2], graph.successors(n1));
  });

  it('should return a neighbor once, even if there are multiple edges', function() {
    graph
      .addNodes([n1, n2])
      .addEdge(n1, n2)
      .addEdge(n2, n1);

    assert.deepEqual([n2], graph.neighbors(n1));
    assert.deepEqual([n1], graph.neighbors(n2));
  });

  it('should return sources in the graph', function() {
    graph
      .addNodes([n1, n2, n3])
      .addEdge(n1, n2);
  
    assert.deepEqual([n1, n3].sort(), graph.sources().sort());

    // form a cyle
    graph
      .addEdge(n2, n3)
      .addEdge(n3, n1);

    assert.deepEqual([], graph.sources());
  });

  it('should return sinks in the graph', function() {
    graph
      .addNodes([n1, n2, n3])
      .addEdge(n1, n2);

    assert.deepEqual([n2, n3].sort(), graph.sinks().sort());

    // form a cycle
    graph
      .addEdge(n2, n3)
      .addEdge(n3, n1);

    assert.deepEqual([], graph.sinks());
  });

  it('should provide a means to get the in-degree of a node', function() {
    graph
      .addNodes([n1, n2, n3])
      .addEdge(n1, n2, "label1")
      .addEdge(n1, n2, "label2")
      .addEdge(n2, n3);

    assert.equal(0, graph.inDegree(n1));
    assert.equal(2, graph.inDegree(n2));
    assert.equal(1, graph.inDegree(n3));
  });

  it('should provide a means to get the out-degree of a node', function() {
    graph
      .addNodes([n1, n2, n3])
      .addEdge(n1, n2, "label1")
      .addEdge(n1, n2, "label2")
      .addEdge(n2, n3);

    assert.equal(2, graph.outDegree(n1));
    assert.equal(1, graph.outDegree(n2));
    assert.equal(0, graph.outDegree(n3));
  });

  it('should provide a means to get the degree of a node', function() {
    graph
      .addNodes([n1, n2, n3])
      .addEdge(n1, n2, "label1")
      .addEdge(n1, n2, "label2")
      .addEdge(n2, n3);

    assert.equal(2, graph.degree(n1));
    assert.equal(3, graph.degree(n2));
    assert.equal(1, graph.degree(n3));
  });
});
