const game = {
  life: 5,
  clock: 0,
  score: 0,
  first: true,

  enemy: {
    list: [],
    last: 0,
    bonus: 0,
    timer: 0,

    create: () => {
      game.enemy.list.push({
        x: (0.1 + Math.random() * 0.8) * game.app.width,
        y: 0,
        dy: 2.4,
        life: 3
      })
    },

    update: (e) => {
      if (e.life <= 0) {
        game.samosa.count[0] += 6
        if (game.enemy.last && game.clock - game.enemy.last <= 4) {
          game.samosa.count[game.enemy.bonus + 1] += 3
          game.enemy.bonus = 1 - game.enemy.bonus
        } else {
          game.enemy.last = game.clock
        }

        game.score++
        return false
      }

      e.y += e.dy
      if (e.y >= game.app.height * 0.88) {
        game.life--
        return false
      }

      game.ctx.beginPath()
      game.ctx.arc(e.x, e.y, game.app.height * 0.02, 0, 2 * Math.PI)
      game.ctx.closePath()

      game.ctx.fillStyle = "#a9b665"
      game.ctx.fill()
      return true
    }
  },

  samosa: {
    list: [],
    count: [10, 5, 5],
    types: ["#d8a657", "#ea6962", "#d4be98"],
    current: 0,

    create: (dir, type) => {
      game.samosa.list.push({
        x: game.app.width * 0.5,
        y: game.app.height * 0.88,
        dx: Math.cos(dir) * 20,
        dy: Math.sin(dir) * 20,
        dir: dir,
        type: type
      })
    },

    update: (s) => {
      s.x += s.dx
      s.y += s.dy
      if (s.x <= 0 || s.x >= game.app.width || s.y <= 0 || s.y >= game.app.height) {
        return false
      }

      for (let i = 0; i < game.enemy.list.length; i++) {
        const enemy = game.enemy.list[i]
        if (enemy.life > 0) {
          if (Math.pow(enemy.x - s.x, 2) + Math.pow(enemy.y - s.y, 2) <= Math.pow(game.app.height * 0.02, 2)) {
            switch (s.type) {
              case 0:
                enemy.life--
                break

              case 1:
                enemy.life -= 2
                break

              case 2:
                enemy.life--
                enemy.dy -= 0.8
                break
            }

            return false
          }
        }
      }

      const a = Math.PI * 2 / 3
      const r = game.app.height * 0.02

      game.ctx.beginPath()
      game.ctx.moveTo(s.x + r * Math.cos(s.dir + a * 0), s.y + r * Math.sin(s.dir + a * 0))
      game.ctx.lineTo(s.x + r * Math.cos(s.dir + a * 1), s.y + r * Math.sin(s.dir + a * 1))
      game.ctx.lineTo(s.x + r * Math.cos(s.dir + a * 2), s.y + r * Math.sin(s.dir + a * 2))
      game.ctx.closePath()

      game.ctx.fillStyle = game.samosa.types[s.type]
      game.ctx.fill()
      return true
    }
  },

  init: async () => {
    game.app = document.getElementById("app")
    game.ctx = game.app.getContext("2d")
    game.font = document.fonts.add(
      await new FontFace("November", "url(november.ttf)").load())

    window.onclick = (e) => {
      game.click(e.offsetX, e.offsetY)
    }

    window.onresize = () => {
      game.app.width = window.innerWidth
      game.app.height = window.innerHeight
    }

    window.onresize()
    window.requestAnimationFrame(game.update)
  },

  click: (x, y) => {
    if (game.first) {
      game.first = false
      return
    }

    if (game.life <= 0) {
      game.life = 5
      game.score = 0

      game.enemy.timer = 0
      game.enemy.list.length = 0

      game.samosa.current = 0
      game.samosa.list.length = 0
      return
    }

    if (y < game.app.height * 0.9) {
      if (game.samosa.count[game.samosa.current]) {
        game.samosa.count[game.samosa.current]--
        game.samosa.create(
          Math.atan2(
            y - game.app.height * 0.9,
            x - game.app.width * 0.5),
          game.samosa.current)
      }
    } else {
      game.samosa.current = Math.floor(x * 3 / game.app.width)
      console.log(game.samosa.current)
    }
  },

  filter: (list, predicate) => {
    let final = 0
    for (let i = 0; i < list.length; i++) {
      if (predicate(list[i])) {
        list[final++] = list[i]
      }
    }
    list.length = final
  },

  update: () => {
    game.ctx.fillStyle = "#282828"
    game.ctx.fillRect(0, 0, game.app.width, game.app.height)

    if (game.first) {
      game.ctx.font = game.app.height * 0.05 + "px November"
      game.ctx.textAlign = "center"
      game.ctx.fillStyle = "#d4be98"
      game.ctx.fillText("Samosa Invaders", game.app.width * 0.5, game.app.height * 0.5)

      game.ctx.font = game.app.height * 0.03 + "px November"
      game.ctx.fillText("(Click to start)", game.app.width * 0.5, game.app.height * 0.55)
    } else if (game.life <= 0) {
      game.ctx.font = game.app.height * 0.05 + "px November"
      game.ctx.textAlign = "center"
      game.ctx.fillStyle = "#d4be98"
      game.ctx.fillText("Game Over", game.app.width * 0.5, game.app.height * 0.5)

      game.ctx.font = game.app.height * 0.03 + "px November"
      game.ctx.fillText("(Click to restart)", game.app.width * 0.5, game.app.height * 0.55)
    } else {
      game.clock += 0.016
      if (game.clock >= 30) {
        if (game.life < 5) {
          game.life++
          game.clock = 0
        }
      }

      game.enemy.timer += 0.016
      if (game.enemy.timer >= 1) {
        game.enemy.create()
        game.enemy.timer = 0
      }

      game.ctx.beginPath()
      game.ctx.arc(game.app.width * 0.5, game.app.height * 0.9, game.app.height * 0.02, 0, 2 * Math.PI)
      game.ctx.closePath()

      game.ctx.fillStyle = game.samosa.types[game.samosa.current]
      game.ctx.fill()

      for (let i = 0; i < game.samosa.types.length; i++) {
        game.ctx.fillStyle = game.samosa.types[i]
        game.ctx.fillRect(
          game.app.width * i / 3,
          game.app.height * 0.9,
          game.app.width / 3,
          game.app.height * 0.1)

        game.ctx.font = game.app.height * 0.05 + "px November"
        game.ctx.textAlign = "center"
        game.ctx.fillStyle = "#282828"
        game.ctx.fillText(
          game.samosa.count[i],
          game.app.width * (0.5 + i) / 3,
          game.app.height * 0.97)
      }

      game.filter(game.enemy.list, game.enemy.update)
      game.filter(game.samosa.list, game.samosa.update)

      game.ctx.font = game.app.height * 0.05 + "px November"
      game.ctx.textAlign = "left"
      game.ctx.fillStyle = "#d4be98"
      game.ctx.fillText(game.score, game.app.width * 0.01, game.app.height * 0.05)

      for (let i = 0; i < game.life; i++) {
        game.ctx.beginPath()
        game.ctx.arc(
          game.app.width + (0.04 * (4 - i) - 0.18) * game.app.height,
          game.app.height * 0.03,
          game.app.height * 0.015, 0, 2 * Math.PI)
        game.ctx.closePath()

        game.ctx.fillStyle = "#ea6962"
        game.ctx.fill()
      }
    }

    window.requestAnimationFrame(game.update)
  }
}

window.onload = game.init
