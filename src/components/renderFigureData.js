export default (node) => {

  if (node.type === "ExpressionStatement") {
    const exp = node.expression;

    if (exp.right.callee.name === "line") {
      return {
        type: "line",
        name: exp.left.name,
        p1: exp.right.arguments[0].elements.map(n => n.raw),
        p2: exp.right.arguments[1].elements.map(n => n.raw)
      }
    }
  }
}