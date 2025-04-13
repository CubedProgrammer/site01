class NumberInput
{
	constructor(iElem)
	{
		this.inputElem = iElem
	}
	parse()
	{
		const str = this.inputElem.value
		if(str.length === 0)
		{
			return 0
		}
		else
		{
			const ind = str.indexOf('/')
			if(ind === -1)
			{
				return parseFloat(str)
			}
			else
			{
				const parts = str.split('/')
				let num = parseInt(parts[0])
				for(const s of parts.slice(1))
				{
					num /= parseInt(s)
				}
				return num
			}
		}
	}
	add(n)
	{
		this.inputElem.value = this.parse() + n
	}
}
const divArr = Array.from(document.getElementsByClassName('inputdiv'))
const modifiers = [-5, -1, 1, 5]
const settingElements = [[time1input, inc1input], [time2input, inc2input]]
const clock = {
	timeIncrement: [
		{time: 0, increment: 0},
		{time: 0, increment: 0}
	],
	turn: 0
}
let clockOn = false
for(const elem of divArr)
{
	const buttonArr = Array.from(elem.getElementsByClassName('roundbutton'))
	const textbox = elem.getElementsByTagName('input').item(0)
	for(const [i, b] of buttonArr.entries())
	{
		const callback = (e) => new NumberInput(textbox).add(modifiers[i])
		b.addEventListener('click', callback)
	}
}
const timeString = (n) =>
{
	if(n >= 36000)
	{
		const hourCount = Math.floor(n / 36000)
		const minuteCount = Math.floor(n / 600) % 60
		return hourCount.toString() + ':' + (minuteCount > 9 ? '' : '0') + minuteCount.toString()
	}
	else if(n > 599)
	{
		const minuteCount = Math.floor(n / 600)
		const secondCount = Math.floor(n / 10) % 60
		return minuteCount.toString() + ':' + (secondCount > 9 ? '' : '0') + secondCount.toString()
	}
	else
	{
		const hundreds = Math.floor(n / 100)
		const tens = Math.floor(n / 10) % 10
		const ones = n % 10
		return'0:' + hundreds.toString() + tens.toString() + '.' + ones.toString()
	}
}
const copyCB = (e) =>
{
	for(const [i, v] of divArr.slice(0, divArr.length / 2).entries())
	{
		const textbox1 = v.getElementsByTagName('input').item(0)
		const textbox2 = divArr[i + divArr.length / 2].getElementsByTagName('input').item(0)
		textbox2.value = textbox1.value
	}
}
const displayTime = () =>
{
	const arr = Array.from(clockDisplayDiv.children)
	for(const [i, timer] of arr.entries())
	{
		for(; timer.lastChild; timer.removeChild(timer.lastChild));
		timer.append(timeString(clock.timeIncrement[i].time))
	}
}
const setCB = (e) =>
{
	for(const [i, [ti, ii]] of settingElements.entries())
	{
		const tInput = new NumberInput(ti)
		const iInput = new NumberInput(ii)
		clock.timeIncrement[i].time = tInput.parse() * 600
		clock.timeIncrement[i].increment = iInput.parse() * 10
	}
	displayTime()
}
const tickTock = (last) =>
{
	--clock.timeIncrement[clock.turn].time
	displayTime()
	if(clockOn && clock.timeIncrement[clock.turn].time)
	{
		const current = Date.now()
		setTimeout(tickTock, last + 200 - current, current)
	}
	else
	{
		clockOn = false
	}
}
const keyact = (e) =>
{
	switch(e.keyCode)
	{
		case 13:
			setCB(e)
			break
		case 32:
			if(clockOn)
			{
				clock.timeIncrement[clock.turn].time += clock.timeIncrement[clock.turn].increment
				clock.turn++
				clock.turn %= 2
			}
			else
			{
				setTimeout(tickTock, 100, Date.now())
				clockOn = true
			}
			break
		case 83:
			clockOn = false
			break
	}
}
copytime.addEventListener('click', copyCB)
settime.addEventListener('click', setCB)
document.addEventListener('keyup', keyact)
