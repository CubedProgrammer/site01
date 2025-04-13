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
const timeDisplayDivArr = Array.from(clockDisplayDiv.getElementsByClassName('timeDisplayDiv'))
const clockButtonDivArr = [clockButton1, clockButton2]
const clock = {
	timeIncrement: [
		{time: 0, increment: 0},
		{time: 0, increment: 0}
	],
	turn: 0,
	on: false,
	start: function()
	{
		if(this.timeIncrement.every((n) => n.time))
		{
			setTimeout(tickTock, 100, Date.now() + 100)
			clock.on = true
			startStopBox.checked = true
		}
	},
	toggle: function()
	{
		this.timeIncrement[this.turn].time += this.timeIncrement[this.turn].increment
		clockButtonDivArr[this.turn].style.marginTop = '48px'
		clockButtonDivArr[this.turn++].style.height = '16px'
		this.turn %= 2
		clockButtonDivArr[this.turn].style.marginTop = null
		clockButtonDivArr[this.turn].style.height = null
	}
}
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
	for(const [i, timer] of timeDisplayDivArr.entries())
	{
		for(; timer.lastChild; timer.removeChild(timer.lastChild));
		timer.append(timeString(clock.timeIncrement[i].time))
	}
}
const setCB = (e) =>
{
	for(const timer of timeDisplayDivArr)
	{
		timer.style.backgroundColor = null
	}
	for(const element of clockButtonDivArr)
	{
		element.style.marginTop = null
		element.style.height = null
	}
	for(const [i, [ti, ii]] of settingElements.entries())
	{
		const tInput = new NumberInput(ti)
		const iInput = new NumberInput(ii)
		clock.timeIncrement[i].time = tInput.parse() * 600
		clock.timeIncrement[i].increment = iInput.parse() * 10
	}
	clock.turn = 0
	displayTime()
}
const tickTock = (desired) =>
{
	--clock.timeIncrement[clock.turn].time
	displayTime()
	if(clock.on && clock.timeIncrement[clock.turn].time)
	{
		const current = Date.now()
		setTimeout(tickTock, desired + 100 - current, desired + 100)
	}
	else
	{
		if(clock.timeIncrement[clock.turn].time === 0)
		{
			timeDisplayDivArr[clock.turn].style.backgroundColor = '#400000'
		}
		startStopBox.checked = clock.on = false
	}
}
const clockButtonAction = (e) =>
{
	if(clock.on)
	{
		clock.toggle()
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
			if(clock.on)
			{
				clock.toggle()
			}
			else
			{
				clock.start()
			}
			break
		case 83:
			clock.on = false
			startStopBox.checked = false
			break
	}
}
const startStopButtonAction = (e) =>
{
	clock.on = !clock.on
	if(clock.on)
	{
		clock.start()
	}
}
for(const element of clockButtonDivArr)
{
	element.addEventListener('click', clockButtonAction)
}
startStopBox.checked = false
copytime.addEventListener('click', copyCB)
settime.addEventListener('click', setCB)
document.addEventListener('keyup', keyact)
startStopBox.addEventListener('change', startStopButtonAction)
