type LineType = {
  type: "line",
  start: number,
  end: number,
  name: string,
  nameStart: number,
  nameEnd: number,
  p1: number[],
  p1Start: number,
  p1End: number,
  p2: number[],
  p2Start: number,
  p2End: number,
  color: string,
  colorStart: number,
  colorEnd: number
}

type RectType = {
  type: "rect",
  start: number,
  end: number
  name: string,
  nameStart: number,
  nameEnd: number,
  p: number[],
  pStart: number,
  pEnd: number,
  width: number,
  widthStart: number,
  widthEnd: number,
  height: number,
  heightStart: number
  heightEnd: number,
  color: string,
  colorStart: number,
  colorEnd: number
}

type EllipseType = {
  type: "ellipse",
  start: number,
  end: number,
  name: string,
  nameStart: number,
  nameEnd: number,
  p: number[],
  pStart: number,
  pEnd: number,
  rx: number,
  rxStart: number,
  rxEnd: number,
  ry: number,
  ryStart: number,
  ryEnd: number
  color: string,
  colorStart: number,
  colorEnd: number
}


export default (node): LineType | RectType | EllipseType | undefined => {

  //console.log(node)

  if (node.type === "ExpressionStatement") {
    const exp = node.expression;

    switch (exp.right.callee.name) {
      case "line":
        return {
          type: "line",
          start: exp.start,
          end: exp.end,
          name: exp.left.name,
          nameStart: exp.left.start,
          nameEnd: exp.left.end,
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
          start: exp.start,
          end: exp.end,
          name: exp.left.name,
          nameStart: exp.left.start,
          nameEnd: exp.left.end,
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
          start: exp.start,
          end: exp.end,
          name: exp.left.name,
          nameStart: exp.left.start,
          nameEnd: exp.left.end,
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