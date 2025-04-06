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
const divArr = document.getElementsByClassName('inputdiv')
const modifiers = [-5, -1, 1, 5]
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
