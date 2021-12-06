<template>
  <div class="shapes-container">
    <h1>Shapes</h1>
    <div class="canvas-container">
      <div>
        <canvas id="shapes-canvas" :width="viewWidth" :height="viewHeight" />
      </div>
      <div>
        <canvas id="target-shapes-canvas" :width="viewTargetWidth" :height="viewTargetHeight" />
      </div>
    </div>
    <div class="exam">
      <span v-if="isCorrect">EXAM IS FINISHED</span>
    </div>
  </div>
</template>

<script>
import {
  buildParallelogram,
  buildPolygon,
  buildRectangle, buildTrapezoid,
  drawShapes
} from './helpers/shapes'

export default {
  name: 'Shapes',
  data() {
    return {
      viewWidth: 600,
      viewHeight: 400,
      viewTargetWidth: 300,
      viewTargetHeight: 400,
      draggingPolygon: false,
      currX: null,
      currY: null,
      gridSize: 20,
      polygons: [
        {
          shape: 'triangle',
          x: 200,
          y: 70,
          size: 30,
          rotation: 0,
          color: '#9ECB06',
          isDragged: false,
          points: [],
          expected: {
            x: 50,
            y: 300,
            isCorrect: false
          }
        },
        {
          shape: 'square',
          x: 200,
          y: 320,
          size: 35,
          rotation: 75,
          color: '#0065FF',
          isDragged: false,
          points: [],
          expected: {
            x: 115,
            y: 190,
            isCorrect: false
          }
        },
        {
          shape: 'hexagon',
          x: 70,
          y: 70,
          size: 50,
          rotation: 90,
          color: '#FF00FF',
          isDragged: false,
          points: [],
          expected: {
            x: 80,
            y: 250,
            isCorrect: false
          }
        },
        {
          shape: 'pentagon',
          x: 200,
          y: 240,
          size: 50,
          rotation: 55,
          color: '#FF6050',
          isDragged: false,
          points: [],
          expected: {
            x: null,
            y: null,
            isCorrect: false
          }
        },
        {
          shape: 'trapezoid',
          x: 200,
          y: 150,
          height: 40,
          a: 55,
          b: 100,
          rotation: 150,
          color: '#00337E',
          isDragged: false,
          points: [],
          expected: {
            x: 90,
            y: 320,
            isCorrect: false
          }
        },
        {
          shape: 'parallelogram',
          x: 80,
          y: 180,
          width: 80,
          height: 40,
          rotation: 145,
          color: '#FF8B00',
          isDragged: false,
          points: [],
          expected: {
            x: 155,
            y: 280,
            isCorrect: false
          }
        },
        {
          shape: 'rectangle',
          x: 60,
          y: 320,
          width: 50,
          height: 120,
          rotation: 0,
          color: '#01D1D1',
          isDragged: false,
          points: [],
          expected: {
            x: null,
            y: null,
            isCorrect: false
          }
        }
      ]
    }
  },
  computed: {
    isCorrect() {
      return this.polygons.every(shape => shape.expected.isCorrect)
    }
  },
  methods: {
    getCanvas(canvas) {
      return document.getElementById(canvas)
    },

    getMousePos(canvas, evt) {
      const rect = canvas.getBoundingClientRect()
      return {
        x: parseInt(evt.clientX - rect.left),
        y: parseInt(evt.clientY - rect.top)
      };
    },

    setCanvasListener(canvas) {
      canvas.onmousedown = this.canvasMouseDown
      canvas.onmouseup = this.canvasMouseUp
      canvas.onmousemove = this.canvasMouseMove
    },

    snapToGrid(value, gridSize)
    {
      return Math.round(value / gridSize) * gridSize
    },

    isPolygonClicked(mouseX, mouseY, polygon) {
      let inside = false;
      const points = polygon.points
      const x = mouseX - polygon.x
      const y = mouseY - polygon.y
      for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const xi = points[i].x, yi = points[i].y;
        const xj = points[j].x, yj = points[j].y;

        const intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }

      return inside;
    },

    canvasMouseDown(e) {
      e.preventDefault()
      e.stopPropagation()
      const canvas = this.getCanvas('shapes-canvas')
      const { x, y } = this.getMousePos(canvas, e)

      // Temp mousePosition
      const context = canvas.getContext('2d')
      context.clearRect(500, 0, 100, 20)
      context.font = '10pt Calibri'
      context.fillStyle = 'black'
      context.fillText('x, y: ' + x + ', ' + y, 520, 10)

      this.draggingPolygon = false
      for (let polygon of this.polygons) {
        console.log(x, polygon.x, y, polygon.y)
        if (this.isPolygonClicked(x, y, polygon)) {
          this.draggingPolygon = true
          polygon.isDragged = true
        }
      }
      this.currX = x
      this.currY = y
    },

    canvasMouseUp(e) {
      e.preventDefault()
      e.stopPropagation()

      this.draggingPolygon = false
      for (let polygon of this.polygons) {
        if (polygon.isDragged) {
          polygon.isDragged = false
          polygon.expected.isCorrect = polygon.expected.x === (polygon.x - this.viewTargetWidth)
            && polygon.expected.y === polygon.y
        }
      }
    },

    canvasMouseMove(e) {
      if (this.draggingPolygon) {
        e.preventDefault()
        e.stopPropagation()
        const canvas = this.getCanvas('shapes-canvas')
        const { x, y } = this.getMousePos(canvas, e)

        for (let polygon of this.polygons) {
          if (polygon.isDragged) {
            polygon.x = this.snapToGrid(x, this.gridSize / 2)
            polygon.y = this.snapToGrid(y, this.gridSize / 2)
          }
        }
        drawShapes(canvas, this.polygons, this.viewWidth/2, this.viewWidth, this.viewHeight, this.gridSize)

        this.currX = x
        this.currY = y
      }
    },

    createPoints() {
      for (let polygon of this.polygons) {
        switch (polygon.shape) {
          case 'triangle':
            polygon.points = buildPolygon(polygon.x, polygon.y, polygon.size, 3)
            break
          case 'square':
            polygon.points = buildPolygon(polygon.x, polygon.y, polygon.size, 4)
            break
          case 'rectangle':
            polygon.points = buildRectangle(polygon.x, polygon.y, polygon.width, polygon.height)
            break
          case 'pentagon':
            polygon.points = buildPolygon(polygon.x, polygon.y, polygon.size, 5)
            break
          case 'hexagon':
            polygon.points = buildPolygon(polygon.x, polygon.y, polygon.size, 6)
            break
          case 'trapezoid':
            polygon.points = buildTrapezoid(polygon.x, polygon.y, polygon.height, polygon.a, polygon.b)
            break
          case 'parallelogram':
            polygon.points = buildParallelogram(polygon.x, polygon.y, polygon.width, polygon.height)
            break
        }
      }
    },

    targetPoligons() {
      return this.polygons
        .filter(obj => obj.expected.x)
        .map(polygon =>
          {
            return {
              x: polygon.expected.x,
              y: polygon.expected.y,
              points: polygon.points,
              rotation: polygon.rotation,
              color: polygon.color
            }
          })
    }
  },

  mounted() {
    const canvas = this.getCanvas('shapes-canvas')
    const targetCanvas = this.getCanvas('target-shapes-canvas')
    this.setCanvasListener(canvas)
    this.createPoints()
    drawShapes(canvas, this.polygons, this.viewWidth/2, this.viewWidth, this.viewHeight, this.gridSize)
    drawShapes(targetCanvas, this.targetPoligons(), 0, this.viewWidth, this.viewHeight, this.gridSize)
  }
}
</script>

<style scoped lang="scss">
  .shapes-container {
    margin: 4rem;
    padding: 1rem;
    border: 2px solid black;
    border-radius: 25px;

    .canvas-container {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;

      canvas {
        border: 1px solid grey;
      }
      #target-shapes-canvas {
        background-color: #F5F5F5;
        border-top-right-radius: 15px;
        border-bottom-right-radius: 15px;
      }
      #shapes-canvas {
        border-top-left-radius: 15px;
        border-bottom-left-radius: 15px;
      }
    }
  }
</style>
