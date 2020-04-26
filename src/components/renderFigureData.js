export default (node) => {

  console.log(node)

  if (node.type === "ExpressionStatement") {
    const exp = node.expression;

    if (exp.right.callee.name === "line") {
      return {
        type: "line",
        name: exp.left.name,
        p1: exp.right.arguments[0].elements.map(n => n.raw),
        p1Start: exp.right.arguments[0].start,
        p1End: exp.right.arguments[0].end,
        p2: exp.right.arguments[1].elements.map(n => n.raw),
        p2Start: exp.right.arguments[1].start,
        p2End: exp.right.arguments[1].end
      }
    }
  }
}