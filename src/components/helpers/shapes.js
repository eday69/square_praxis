
export function buildPolygon(x, y, size, sides) {
  const points = []
  points.push({ x: size, y: 0 })
  const a = (Math.PI * 2) / sides
  for (let i = 1; i < sides; i++) {
    points.push({ x: size * Math.cos(a * i), y: size * Math.sin(a * i)})
  }
  return points
}

export function buildRectangle(x, y, w, h) {
  const points = []
  points.push( { x: -w / 2, y: -h / 2 } );
  points.push( { x: w / 2, y: -h / 2 } );
  points.push( { x: w / 2, y: h / 2 } );
  points.push( { x: -w / 2, y: h / 2 } );
  return points
}

export function buildTrapezoid(x, y, h, a, b) {
  const points = []
  points.push( { x: -a / 2, y: -h / 2 } );
  points.push( { x: a / 2, y: -h / 2 } );
  points.push( { x: b / 2, y: h / 2 } );
  points.push( { x: -b / 2, y: h / 2 } );
  return points
}

export function buildParallelogram(x, y, w, h) {
  const points = []
  points.push( { x: -w / 3, y: -h / 2 } );
  points.push( { x: w * 2 / 3, y: -h / 2 } );
  points.push( { x: w * 1 / 3, y: h / 2 } );
  points.push( { x: -w * 2 / 3, y: h / 2 } );
  return points
}

function drawPolygon(ctx, x, y, points, rotateAngle, fillColor) {
  ctx.translate(x, y)
  ctx.rotate(rotateAngle * Math.PI / 180)
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y)
  }
  ctx.closePath()
  ctx.fillStyle = fillColor;
  ctx.fill()
  ctx.stroke()
  ctx.setTransform(1, 0, 0, 1, 0, 0)
}

function drawGrid(ctx, gridStart, width, height, size) {
  ctx.clearRect(0, 0, gridStart, height)
  ctx.rect(gridStart, 0, width, height)
  ctx.fillStyle = '#F5F5F5'
  ctx.fill();
  ctx.beginPath()
  ctx.lineWidth = 1
  ctx.strokeStyle = '#E0E0E0'
  ctx.setLineDash([3, 3])
  for (let x = gridStart; x <= width; x += size) {
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    for (let y = 0; y <= height; y += size) {
      ctx.moveTo(gridStart, y)
      ctx.lineTo(width, y)
    }
  }
  ctx.stroke()
  ctx.setLineDash([])
  ctx.setTransform(1, 0, 0, 1, 0, 0)
}

export function drawShapes(canvas, shapes, gridStart, width, height, size) {
  const ctx = canvas.getContext('2d')
  drawGrid(ctx, gridStart, width, height, size)
  for (let polygon of shapes) {
    const ctx = canvas.getContext('2d')
    drawPolygon(ctx, polygon.x, polygon.y, polygon.points, polygon.rotation, polygon.color)
  }
  ctx.beginPath();
  ctx.fillStyle = '#000000'
  ctx.fillRect(35, 100,2,2);
  ctx.stroke()
}
