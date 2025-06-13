const size = 1024
const halfsize = size / 2;
const hand = 16;
const ctx = mainCanvas.getContext('2d')
const hourHand = {a: [halfsize - hand, halfsize], b: [halfsize + hand, halfsize], c: [halfsize, halfsize / 2], fill: '#FF0000'}
const minuteHand = {a: [halfsize - hand, halfsize], b: [halfsize + hand, halfsize], c: [halfsize, halfsize / 4], fill: '#00FF00'}
const secondHand = {a: [halfsize - hand, halfsize], b: [halfsize + hand, halfsize], c: [halfsize, halfsize / 8], fill: '#0000FF'}
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
const paint = function()
{
	ctx.fillStyle = '#404040'
	ctx.beginPath()
	ctx.arc(halfsize, halfsize, halfsize, 0, 2 * Math.PI)
	ctx.fill()
	ctx.beginPath()
	ctx.fillStyle = '#FF0000'
	ctx.arc(halfsize, halfsize, hand, 0, 2 * Math.PI)
	ctx.fill()
	for(const h of handArray)
	{
		ctx.fillStyle = h.fill
		ctx.beginPath()
		fillTriangle(h.a, h.b, h.c)
		ctx.fill()
	}
}
requestAnimationFrame(paint);
