/**
 * 波浪背景动画效果
 */
class AWaves extends HTMLElement {
  /**
   * 初始化
   */
  connectedCallback() {
    // 获取元素
    this.svg = this.querySelector('.js-svg')

    // 属性
    this.mouse = {
      x: -10,
      y: 0,
      lx: 0,
      ly: 0,
      sx: 0,
      sy: 0,
      v: 0,
      vs: 0,
      a: 0,
      set: false,
    }

    this.lines = []
    this.paths = []
    this.noise = new Noise(Math.random())

    // 初始化
    this.setSize()
    this.setLines()

    this.bindEvents()
    
    // 启动动画循环
    requestAnimationFrame(this.tick.bind(this))
  }

  /**
   * 绑定事件
   */
  bindEvents() {
    window.addEventListener('resize', this.onResize.bind(this))
    
    window.addEventListener('mousemove', this.onMouseMove.bind(this))
    this.addEventListener('touchmove', this.onTouchMove.bind(this))
  }

  /**
   * 调整大小处理
   */
  onResize() {
    this.setSize()
    this.setLines()
  }

  /**
   * 鼠标移动处理
   */
  onMouseMove(e) {
    this.updateMousePosition(e.pageX, e.pageY)
  }

  /**
   * 触摸处理
   */
  onTouchMove(e) {
    e.preventDefault()

    const touch = e.touches[0]
    this.updateMousePosition(touch.clientX, touch.clientY)
  }

  /**
   * 更新鼠标位置
   */
  updateMousePosition(x, y) {
    const { mouse } = this

    mouse.x = x - this.bounding.left
    mouse.y = y - this.bounding.top + window.scrollY

    if (!mouse.set) {
      mouse.sx = mouse.x
      mouse.sy = mouse.y
      mouse.lx = mouse.x
      mouse.ly = mouse.y

      mouse.set = true
    }
  }

  /**
   * 设置尺寸
   */
  setSize() {
    this.bounding = this.getBoundingClientRect()

    this.svg.style.width = `${this.bounding.width}px`
    this.svg.style.height = `${this.bounding.height}px`
  }

  /**
   * 设置线条
   */
  setLines() {
    const { width, height } = this.bounding
    
    this.lines = []

    this.paths.forEach((path) => {
      path.remove()
    })
    this.paths = []

    const xGap = 10
    const yGap = 32

    const oWidth = width + 200
    const oHeight = height + 30

    const totalLines = Math.ceil(oWidth / xGap)
    const totalPoints = Math.ceil(oHeight / yGap)

    const xStart = (width - xGap * totalLines) / 2
    const yStart = (height - yGap * totalPoints) / 2

    for (let i = 0; i <= totalLines; i++) {
      const points = []

      for (let j = 0; j <= totalPoints; j++) {
        const point = {
          x: xStart + xGap * i,
          y: yStart + yGap * j,
          wave: { x: 0, y: 0 },
          cursor: { x: 0, y: 0, vx: 0, vy: 0 },
        }

        points.push(point)
      }

      // 创建路径
      const path = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path'
      )
      path.classList.add('a__line')
      path.classList.add('js-line')

      this.svg.appendChild(path)
      this.paths.push(path)

      // 添加点
      this.lines.push(points)
    }
  }

  /**
   * 移动点
   */
  movePoints(time) {
    const { lines, mouse, noise } = this

    lines.forEach((points) => {
      points.forEach((p) => {
        // 波浪运动
        const move =
              noise.perlin2(
                (p.x + time * 0.0125) * 0.002,
                (p.y + time * 0.005) * 0.0015
              ) * 12
        p.wave.x = Math.cos(move) * 32
        p.wave.y = Math.sin(move) * 16

        // 鼠标效果
        const dx = p.x - mouse.sx
        const dy = p.y - mouse.sy
        const d = Math.hypot(dx, dy)
        const l = Math.max(175, mouse.vs)

        if (d < l) {
          const s = 1 - d / l
          const f = Math.cos(d * 0.001) * s

          p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00065
          p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00065
        }

        p.cursor.vx += (0 - p.cursor.x) * 0.005 // 弦张力
        p.cursor.vy += (0 - p.cursor.y) * 0.005

        p.cursor.vx *= 0.925 // 摩擦/持续时间
        p.cursor.vy *= 0.925

        p.cursor.x += p.cursor.vx * 2 // 强度
        p.cursor.y += p.cursor.vy * 2

        p.cursor.x = Math.min(100, Math.max(-100, p.cursor.x)) // 限制移动
        p.cursor.y = Math.min(100, Math.max(-100, p.cursor.y))
      })
    })
  }

  /**
   * 获取添加移动后的点坐标
   */
  moved(point, withCursorForce = true) {
    const coords = {
      x: point.x + point.wave.x + (withCursorForce ? point.cursor.x : 0),
      y: point.y + point.wave.y + (withCursorForce ? point.cursor.y : 0),
    }

    // 四舍五入到小数点后1位
    coords.x = Math.round(coords.x * 10) / 10
    coords.y = Math.round(coords.y * 10) / 10

    return coords
  }

  /**
   * 绘制线条
   */
  drawLines() {
    const { lines, paths } = this
    
    lines.forEach((points, lIndex) => {
      let p1 = this.moved(points[0], false)

      let d = `M ${p1.x} ${p1.y}`

      points.forEach((p1, pIndex) => {
        const isLast = pIndex === points.length - 1

        p1 = this.moved(p1, !isLast)

        const p2 = this.moved(
          points[pIndex + 1] || points[points.length - 1],
          !isLast
        )

        d += `L ${p1.x} ${p1.y}`
      })

      paths[lIndex].setAttribute('d', d)
    })
  }

  /**
   * 动画循环
   */
  tick(time) {
    const { mouse } = this

    // 平滑鼠标移动
    mouse.sx += (mouse.x - mouse.sx) * 0.1
    mouse.sy += (mouse.y - mouse.sy) * 0.1

    // 鼠标速度
    const dx = mouse.x - mouse.lx
    const dy = mouse.y - mouse.ly
    const d = Math.hypot(dx, dy)

    mouse.v = d
    mouse.vs += (d - mouse.vs) * 0.1
    mouse.vs = Math.min(100, mouse.vs)

    // 鼠标上一个位置
    mouse.lx = mouse.x
    mouse.ly = mouse.y

    // 鼠标角度
    mouse.a = Math.atan2(dy, dx)

    // 动画
    this.style.setProperty('--x', `${mouse.sx}px`)
    this.style.setProperty('--y', `${mouse.sy}px`)

    this.movePoints(time)
    this.drawLines()
    
    requestAnimationFrame(this.tick.bind(this))
  }
}

// 注册自定义元素
customElements.define('a-waves', AWaves) 