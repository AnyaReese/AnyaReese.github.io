/*
 * 一个Perlin噪声的JavaScript实现
 * 移植自Stefan Gustavson的Java实现
 */
class Noise {
  constructor(seed) {
    this.grad3 = [
      [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
      [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
      [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
    ];
    
    this.p = [];
    for (let i = 0; i < 256; i++) {
      this.p[i] = Math.floor(seed * (i + 1) * 256) % 256;
    }
    
    // 填充排列表
    this.perm = new Array(512);
    this.gradP = new Array(512);
    
    // 扩展排列
    for (let i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255];
      this.gradP[i] = this.grad3[this.perm[i] % 12];
    }
  }
  
  dot2(g, x, y) {
    return g[0] * x + g[1] * y;
  }
  
  perlin2(x, y) {
    // 找到单元格的整数坐标
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    
    // 获取相对于单元格的坐标
    x -= Math.floor(x);
    y -= Math.floor(y);
    
    // 计算淡入淡出曲线
    const u = this.fade(x);
    const v = this.fade(y);
    
    // 计算哈希坐标
    const n00 = this.dot2(this.gradP[(X + this.perm[Y]) & 511], x, y);
    const n01 = this.dot2(this.gradP[(X + this.perm[Y + 1]) & 511], x, y - 1);
    const n10 = this.dot2(this.gradP[(X + 1 + this.perm[Y]) & 511], x - 1, y);
    const n11 = this.dot2(this.gradP[(X + 1 + this.perm[Y + 1]) & 511], x - 1, y - 1);
    
    // 插值结果
    return this.lerp(
      this.lerp(n00, n10, u),
      this.lerp(n01, n11, u),
      v
    );
  }
  
  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  
  lerp(a, b, t) {
    return (1 - t) * a + t * b;
  }
} 