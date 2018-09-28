const clamp = (x, min, max) => {
  if (x < min) return min
  else if (x > max) return max
  return x
}

const GROUND_POSITION_Y = 500

let canvas
let ctx

let player = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  size: 60
}

let input = {
  up: false,
  left: false,
  right: false
}

/**
 * 初期化
 */
const init = () => {
  setupCanvas()

  player.x = canvas.width / 2
  player.y = canvas.height / 2

  update()
}

/**
 * Canvasの初期化
 */
const setupCanvas = () => {
  canvas = document.querySelector("#canvas")
  ctx = canvas.getContext("2d")
}
addEventListener("DOMContentLoaded", init)

/**
 * 更新処理
 * @param {Number}} time
 */
let lastTime = null
const update = time => {
  requestAnimationFrame(update)

  // 前回のフレームからの経過時間(秒)
  const elapsedTime = (time => {
    if (lastTime == null) {
      return 0
    } else {
      return (time - lastTime) / 1000
    }
  })(time)
  lastTime = time

  physics(elapsedTime)

  render()
}

/**
 * 物理処理
 * @param {Number} elapsedTime
 */
const physics = elapsedTime => {
  // 地面に着地している
  const ground = onGround(player.x, player.y + 1)

  // ジャンプ
  if (ground && input.up) {
    player.vy = -500
  }

  // 地面の上での左右移動
  const direction = (() => {
    if (input.left && !input.right) {
      return -1
    } else if (!input.left && input.right) {
      return 1
    } else {
      return 0
    }
  })()
  if (ground) {
    player.vx = 0.5 * player.vx + 100 * direction
  } else {
    player.vx = 0.95 * player.vx + 50 * direction
  }
  player.vx = clamp(player.vx, -300, 300)

  // 重力
  player.vy += 980 * elapsedTime

  // 速度距離
  const distance = Math.sqrt(player.vx * player.vx + player.vy * player.vy)
  const maximum = Math.floor(distance)

  const fraction = 1 / (maximum + 1)

  for (let i = 0; i <= maximum; i++) {
    let newX = player.x + player.vx * elapsedTime * fraction
    let newY = player.y + player.vy * elapsedTime * fraction

    if (onGround(newX, newY)) {
      player.vy = 0
      newY = player.y
    }

    player.x = newX
    player.y = newY
  }
}

/**
 * プレイヤーが地面に立っているか
 */
const onGround = (x, y) => {
  return y + player.size / 2 >= GROUND_POSITION_Y
}

/**
 * キー入力
 * @param {KeyboardEvent}} e
 */
const onKeydown = e => {
  if (e.key == "ArrowLeft") {
    input.left = true
  } else if (e.key == "ArrowRight") {
    input.right = true
  } else if (e.key == "ArrowUp") {
    input.up = true
  }
}
const onKeyup = e => {
  if (e.key == "ArrowLeft") {
    input.left = false
  } else if (e.key == "ArrowRight") {
    input.right = false
  } else if (e.key == "ArrowUp") {
    input.up = false
  }
}
addEventListener("keydown", onKeydown)
addEventListener("keyup", onKeyup)

/**
 * 描画処理
 */
const render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 背景
  ctx.fillStyle = "lightgray"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 地面
  ctx.fillStyle = "gray"
  ctx.fillRect(
    0,
    GROUND_POSITION_Y,
    canvas.width,
    canvas.height - GROUND_POSITION_Y
  )

  // プレイヤーの描画
  ctx.beginPath()
  ctx.arc(player.x, player.y, player.size / 2, 0, Math.PI * 2, false)
  ctx.fillStyle = "black"
  ctx.fill()

  // デバッグ表示
  ctx.font = "24px monospace"
  ctx.textBaseline = "top"
  ctx.fillStyle = "black"
  ctx.fillText(`pos: (${Math.floor(player.x)},${Math.floor(player.y)})`, 10, 10)
  ctx.fillText(
    `vel: (${Math.floor(player.vx)},${Math.floor(player.vy)})`,
    10,
    36
  )
}
