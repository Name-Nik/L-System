let canvas = document.getElementById('main_canvas')
let ctx = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight
const rgba = (r, g, b, a) => 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
const random = (min, max) => Math.random() * (max - min) + min;
const rRandom = (min, max) => Math.round(random(min, max));
let gens = 16
let axiom = 'FX'
let rule = {
    'X': 'F[@[-X]+X]'
}
let angle = 45

let step = 85

function apply_rules(axiom) {
    let res = ''
    for (let ch of axiom)
        res += rule[ch] == undefined ? ch : rule[ch]
    return res
}

function get_result(gens, axiom) {

    for (let i = 0; i < gens; i++) axiom = apply_rules(axiom)
    return axiom
}

function cos(x) {
    return Math.cos(x * Math.PI / 180)
}

function sin(x) {
    return Math.sin(x * Math.PI / 180)
}



class Turtle {
    constructor(ctx) {
        this.ctx = ctx
        this.x = 0
        this.y = 0
        this.angle = 0
        this.penC = 'black'
        this.penS = 1
        this.isDraw = false
    }
    setPos(x, y) {
        if (this.isDraw) {
            this.ctx.strokeStyle = this.penC
            this.ctx.lineWidth = this.penS
            this.ctx.beginPath()
            this.ctx.moveTo(this.x, this.y)
            this.ctx.lineTo(x, y)
            this.ctx.stroke()
        }
        this.x = x
        this.y = y
    }
    forward(val) {
        this.setPos(this.x + val * sin(this.angle), this.y - val * cos(this.angle))
    }
    penSize(size) {
        this.penS = size
    }
    penDown() {
        this.isDraw = true
    }
    penUp() {
        this.isDraw = false
    }
    color(c) {
        this.penC = c
    }
    left(a) {
        this.angle -= a
    }
    right(a) {
        this.angle += a
    }
    draw(str) {
        let cords = []
        for (let ch of str) {
            switch (ch) {
                case '+':
                    this.right(random(0, 25))
                    break
                case '-':
                    this.left(random(0, 25))
                    break
                case '[':
                    cords.push([this.x, this.y, this.angle, step, this.penS, this.penC])
                    break
                case ']':
                    [this.x, this.y, this.angle, step, this.penS, this.penC] = cords.pop()
                    break
                case '@':
                    step -= random(2, 10)
                    this.penS -= 1
                    this.penS = Math.max(1, this.penS)
                    break
                default:
                    if (step <= 15) {
                        this.penC = rgba(0, rRandom(100, 255), 0, 1)
                        this.penS = 8
                    }
                    this.forward(step)
                    break;
            }
        }
    }
}
let leo = new Turtle(ctx)
leo.setPos(canvas.width / 2, canvas.height)
let cmd = get_result(gens, axiom)
leo.penDown()
leo.penSize(10)
leo.color('brown')
leo.draw(cmd)