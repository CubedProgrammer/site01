const size = 1024
const halfsize = size / 2;
const hand = 16;
const ctx = mainCanvas.getContext('2d')
const hourHand = {a: [halfsize - hand, halfsize], b: [halfsize + hand, halfsize], c: [halfsize, halfsize / 2], angle: Math.PI * 0.16666666666666667, fill: '#FF0000'}
const minuteHand = {a: [halfsize - hand, halfsize], b: [halfsize + hand, halfsize], c: [halfsize, halfsize / 4], angle: Math.PI * 0.033333333333333333, fill: '#00FF00'}
const secondHand = {a: [halfsize - hand, halfsize], b: [halfsize + hand, halfsize], c: [halfsize, halfsize / 8], angle: Math.PI * 0.033333333333333333, fill: '#0000FF'}
const handArray = [secondHand, minuteHand, hourHand]
const rotateCoordinate = function(arr, angle)
{
	let x = arr[0] - halfsize, y = arr[1] - halfsize
	let re = Math.cos(angle), im = Math.sin(angle)
	return[re * x - im * y + halfsize, x * im + y * re + halfsize]
}
const fillTriangle = function(a, b, c)
{
	ctx.moveTo(a[0], a[1])
	ctx.lineTo(b[0], b[1])
	ctx.lineTo(c[0], c[1])
	ctx.lineTo(a[0], a[1])
	ctx.fill()
}
const hourMarks = function()
{
	let lines = [[halfsize, 0], [halfsize, 32]]
	ctx.lineWidth = 2
	ctx.strokeStyle = '#FFFFFF'
	for(let i = 0; i < 12; i++)
	{
		ctx.beginPath()
		ctx.moveTo(lines[0][0], lines[0][1])
		ctx.lineTo(lines[1][0], lines[1][1])
		ctx.stroke()
		lines = lines.map((a) => rotateCoordinate(a, hourHand.angle))
	}
	lines[1][1] = 16
	for(let i = 0; i < 60; i++)
	{
		ctx.beginPath()
		ctx.moveTo(lines[0][0], lines[0][1])
		ctx.lineTo(lines[1][0], lines[1][1])
		ctx.stroke()
		lines = lines.map((a) => rotateCoordinate(a, minuteHand.angle))
	}
}
const paint = function()
{
	ctx.fillStyle = '#404040'
	ctx.beginPath()
	ctx.arc(halfsize, halfsize, halfsize, 0, 2 * Math.PI)
	ctx.fill()
	hourMarks()
	let current = Date.now() / 1000 % 43200
	hourHand.value = current / 3600
	minuteHand.value = current / 60 % 60
	secondHand.value = current % 60
	for(const h of handArray)
	{
		ctx.fillStyle = h.fill
		ctx.beginPath()
		fillTriangle(rotateCoordinate(h.a, h.value * h.angle), rotateCoordinate(h.b, h.value * h.angle), rotateCoordinate(h.c, h.value * h.angle))
		ctx.fill()
	}
	ctx.beginPath()
	ctx.fillStyle = '#FF0000'
	ctx.arc(halfsize, halfsize, hand, 0, 2 * Math.PI)
	ctx.fill()
	current = Date.now() % 1000
	setTimeout(paint, 1000 - current)
}
paint()
