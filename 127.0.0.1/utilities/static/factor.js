function onCalculateClick(e)
{
	const n = BigInt(number.value);
	for(; result.lastChild; result.removeChild(result.lastChild));
	const ps = factor(n);
	let second = false;
	for(const [p, e] of ps)
	{
		let txt = p.toString();
		if(second)
		{
			txt = '\u00d7' + txt;
		}
		result.appendChild(document.createTextNode(txt));
		if(e > 1)
		{
			const exponentElem = document.createElement('sup');
			exponentElem.append(e.toString());
			result.appendChild(exponentElem);
		}
		second = true;
	}
}
function sqrtBig(n, len)
{
	const digits = (len - 1) * 3.321928095 / 2;
	let guess = 1n << BigInt(Math.floor(digits));
	let check = n / guess;
	guess = (guess + check) / 2n;
	check = n / guess;
	while(guess > check)
	{
		guess = (guess + check) / 2n;
		check = n / guess;
	}
	return check;
}
function divideFully(dividend, divisor)
{
	let cnt = 0;
	divisor = BigInt(divisor);
	while(dividend[0] % divisor == 0)
	{
		dividend[0] /= divisor;
		++cnt;
	}
	return cnt;
}
function factor(n)
{
	const primes = new Map();
	const m = sqrtBig(n, number.value.length);
	const np = [n];
	const exponent2 = divideFully(np, 2);
	const exponent3 = divideFully(np, 3);
	const exponent5 = divideFully(np, 5);
	if(exponent2 > 0)
	{
		primes.set(2, exponent2);
	}
	if(exponent3 > 0)
	{
		primes.set(3, exponent3);
	}
	if(exponent5 > 0)
	{
		primes.set(5, exponent5);
	}
	for(let i = 6; np[0] > 1 && i < m; i += 6)
	{
		const cnt1 = divideFully(np, i + 1);
		const cnt2 = divideFully(np, i + 5);
		if(cnt1 > 0)
		{
			primes.set(i + 1, cnt1);
		}
		if(cnt2 > 0)
		{
			primes.set(i + 5, cnt2);
		}
	}
	if(np[0] > 1)
	{
		primes.set(np[0], 1);
	}
	return primes;
}
calculate.addEventListener('click', onCalculateClick);
