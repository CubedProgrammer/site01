mkelem = (s) => document.createElement(s)
a = 1
b = 2
i = 3
while(b <= 9007199254740991)
{
    r = mkelem('tr')
	c1 = mkelem('td')
	c2 = mkelem('td')
	c1.append(i)
	c2.append(b)
	r.append(c1, c2)
	fbody.append(r)
	++i
	c = a+b
	a = b, b = c
}
function onCalculate(e)
{
	foutput.innerHTML = null
	try
	{
		index = BigInt(finput.value)
		desired = [0n, 1n]
		fa = 0n
		fb = 1n
		for(; index; index >>= 1n)
		{
			if(index & 1n)
			{
				temporary = (desired[0] + desired[1]) * fb + desired[1] * fa
				desired[0] *= fa
				desired[1] *= fb
				desired[0] += desired[1]
				desired[1] = temporary
			}
			fc = 2n * fa * fb
			fa *= fa
			fb *= fb
			fa += fb
			fb += fc
		}
		foutput.append(desired[0])
	}
	catch(e)
	{
		foutput.append(e.toString())
		console.error(e)
	}
}
function onEnter(e)
{
	if(e.keyCode === 13)
	{
		onCalculate(e)
	}
}
calculateButton.addEventListener('click', onCalculate)
document.addEventListener('keyup', onEnter)
