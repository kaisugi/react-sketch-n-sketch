export default (node) => {

  if (node.type === "ExpressionStatement") {
    const exp = node.expression;

    //console.log(exp)

    switch (exp.right.callee.name) {
      case "line":
        return {
          type: "line",
          name: exp.left.name,
          start: exp.start,
          end: exp.end,
          p1: exp.right.arguments[0].elements.map(n => Number(n.raw)),
          p1Start: Number(exp.right.arguments[0].start),
          p1End: Number(exp.right.arguments[0].end),
          p2: exp.right.arguments[1].elements.map(n => Number(n.raw)),
          p2Start: Number(exp.right.arguments[1].start),
          p2End: Number(exp.right.arguments[1].end),
          color: exp.right.arguments[2].value,
          colorStart: exp.right.arguments[2].start,
          colorEnd: exp.right.arguments[2].end
        } 

      case "rect":
        return {
          type: "rect",
          name: exp.left.name,
          start: exp.start,
          end: exp.end,
          p: exp.right.arguments[0].elements.map(n => Number(n.raw)),
          pStart: Number(exp.right.arguments[0].start),
          pEnd: Number(exp.right.arguments[0].end),
          width: Number(exp.right.arguments[1].raw),
          widthStart: Number(exp.right.arguments[1].start),
          widthEnd: Number(exp.right.arguments[1].end),
          height: Number(exp.right.arguments[2].raw),
          heightStart: Number(exp.right.arguments[2].start),
          heightEnd: Number(exp.right.arguments[2].end),
          color: exp.right.arguments[3].value,
          colorStart: exp.right.arguments[3].start,
          colorEnd: exp.right.arguments[3].end
        }

      case "ellipse":
        return {
          type: "ellipse",
          name: exp.left.name,
          start: exp.start,
          end: exp.end,
          p: exp.right.arguments[0].elements.map(n => Number(n.raw)),
          pStart: Number(exp.right.arguments[0].start),
          pEnd: Number(exp.right.arguments[0].end),
          rx: Number(exp.right.arguments[1].raw),
          rxStart: Number(exp.right.arguments[1].start),
          rxEnd: Number(exp.right.arguments[1].end),
          ry: Number(exp.right.arguments[2].raw),
          ryStart: Number(exp.right.arguments[2].start),
          ryEnd: Number(exp.right.arguments[2].end),
          color: exp.right.arguments[3].value,
          colorStart: exp.right.arguments[3].start,
          colorEnd: exp.right.arguments[3].end
        }

      default:

    }

  } 
}