/*
 * Given an undirected graph, find a minimum spanning tree and return it as
 * an undirected graph (an unrooted tree). This function uses Prim's
 * algorithm as described in "Introduction to Algorithms", Third Edition,
 * Comen, et al., Pg 634.
 */
var dig_alg_prim = dig.alg.prim = function(g, weight) {
  var parents = {};
  var result = new dig.UGraph();
  var q = new dig_data_PriorityQueue();

  if (g.order() == 0) {
    return result;
  }

  g.nodes().forEach(function(v) {
    q.add(v, Number.POSITIVE_INFINITY);
    result.addNode(v);
  });

  // Start from an arbitary node
  q.decrease(g.nodes()[0], 0);

  var u, v, parent;
  var init = false;
  while (q.size() > 0) {
    u = q.removeMin();
    if (u in parents) {
      result.addEdge(u, parents[u]);
    } else if (init) {
      throw new Error("Input graph is not connected: " + g);
    } else {
      init = true;
    }
    g.neighbors(u, "both").forEach(function(v) {
      var pri = q.priority(v);
      if (pri !== undefined) {
        var edgeWeight = weight(u, v);
        if (edgeWeight < pri) {
          parents[v] = u;
          q.decrease(v, edgeWeight);
        }
      }
    });
  }

  return result;
};
