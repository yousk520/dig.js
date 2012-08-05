require("../../../test-env");

var graphs = require("../../../test-graphs");

function removeEntry(result, i, j) {
  var entry = result[i][j];
  delete result[i][j];
  var empty = true;
  for (var k in result[i]) {
    if (result[i].hasOwnProperty(k)) {
      empty = false;
      break;
    }
  }
  if (empty) {
    delete result[i];
  }
  return entry;
}

// Helper function for checking results. Removes the entry at result[i][j] and
// checks that it matches the supplied `distance` and `predecessor`.
//
// If `predecessor` is not supplied its value is assumed to be null (indicating
// no predecessor). If `predecessor` is a list then the actual predecessor must
// match one of the elements in the list.
//
// If `distance` is not supplied its value is assumed to be
// `Number.POSITIVE_INFINITY` indicating there is no path from `i` to `j`.
function expect(result, i, j, distance, predecessor) {
  if (arguments.length < 5) {
    predecessor = null;
    if (arguments.length < 4) {
      distance = Number.POSITIVE_INFINITY;
    }
  }
  var entry = removeEntry(result, i, j);
  assert.equal(distance, entry.distance);
  if (predecessor && predecessor.length) {
    assert.memberOf(predecessor, parseInt(entry.predecessor));
  } else {
    assert.equal(predecessor, entry.predecessor);
  }
}

// Helper function that verifies that there were no unexplored results during
// the test.
function expectNoMore(result) {
  assert.deepEqual({}, result);
}

describe("dig.alg.sp.floydWarshall", function() {
  it("should handle singleton graph", function() {
    var results = dig.alg.sp.floydWarshall(graphs.singleton);

    expect(results, 1, 1, 0);

    expectNoMore(results);
  });

  it("should handle two node disjoint graph", function() {
    var results = dig.alg.sp.floydWarshall(graphs.twoNodeDisjoint);

    expect(results, 1, 1, 0);
    expect(results, 1, 2);

    expect(results, 2, 1);
    expect(results, 2, 2, 0);

    expectNoMore(results);
  });

  it("should handle single edge graph", function() {
    var results = dig.alg.sp.floydWarshall(graphs.singleEdge);

    expect(results, 1, 1, 0);
    expect(results, 1, 2, 1, 1);

    expect(results, 2, 1);
    expect(results, 2, 2, 0);

    expectNoMore(results);
  });

  it("should handle two edge graph", function() {
    var results = dig.alg.sp.floydWarshall(graphs.twoEdge);

    expect(results, 1, 1, 0);
    expect(results, 1, 2, 1, 1);
    expect(results, 1, 3, 2, 2);

    expect(results, 2, 1);
    expect(results, 2, 2, 0);
    expect(results, 2, 3, 1, 2);

    expect(results, 3, 1);
    expect(results, 3, 2);
    expect(results, 3, 3, 0);

    expectNoMore(results);
  });

  it("should handle self loop graph", function() {
    var results = dig.alg.sp.floydWarshall(graphs.selfLoop);

    expect(results, 1, 1, 0);

    expectNoMore(results);
  });

  it("should handle short cycle graph", function() {
    var results = dig.alg.sp.floydWarshall(graphs.shortCycle);

    expect(results, 1, 1, 0);
    expect(results, 1, 2, 1, 1);

    expect(results, 2, 1, 1, 2);
    expect(results, 2, 2, 0);

    expectNoMore(results);
  });

  it("should handle diamond graph", function() {
    var results = dig.alg.sp.floydWarshall(graphs.diamond);

    expect(results, 1, 1, 0);
    expect(results, 1, 2, 1, 1);
    expect(results, 1, 3, 1, 1);
    expect(results, 1, 4, 2, [2, 3]);

    expect(results, 2, 1);
    expect(results, 2, 2, 0);
    expect(results, 2, 3);
    expect(results, 2, 4, 1, 2);

    expect(results, 3, 1);
    expect(results, 3, 2);
    expect(results, 3, 3, 0);
    expect(results, 3, 4, 1, 3);

    expect(results, 4, 1);
    expect(results, 4, 2);
    expect(results, 4, 3);
    expect(results, 4, 4, 0);

    expectNoMore(results);
  });

  it("should handle nested cycle graph", function() {
    var results = dig.alg.sp.floydWarshall(graphs.nestedCycle);

    expect(results, 0, 0, 0);
    expect(results, 0, 1, 1, 0);
    expect(results, 0, 2, 2, 1);
    expect(results, 0, 3, 3, 2);

    expect(results, 1, 0);
    expect(results, 1, 1, 0);
    expect(results, 1, 2, 1, 1);
    expect(results, 1, 3, 2, 2);

    expect(results, 2, 0);
    expect(results, 2, 1, 1, 2);
    expect(results, 2, 2, 0);
    expect(results, 2, 3, 1, 2);

    expect(results, 3, 0);
    expect(results, 3, 1);
    expect(results, 3, 2);
    expect(results, 3, 3, 0);

    expectNoMore(results);
  });
});