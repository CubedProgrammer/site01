function genQuotes(arr)
{
	for(const q of arr)
	{
		const outer = document.createElement('div');
		const box = document.createElement('div');
		const text = document.createElement('p');
		const from = document.createElement('p');
		const explanation = document.createElement('p');
		outer.className = 'qouterbox';
		box.className = 'qbox';
		text.className = 'qtext';
		from.className = 'qfrom';
		text.append(q[0]);
		from.append(q[1]);
		explanation.append(q[2]);
		box.append(text, from, explanation);
		if(q.length > 3)
		{
			const link = document.createElement('a');
			link.className = 'qlink';
			link.href = q[3];
			link.target = '_blank';
			link.append('Click to Watch');
			box.appendChild(link);
		}
		outer.appendChild(box);
		quotes.appendChild(outer);
	}
}
const main = async function()
{
	const resp = await fetch('garmadon-quotes.txt');
	if(resp.ok)
	{
		const all = await resp.text();
		const quoteArr = all.split('\n\n').filter((s) => s.length > 0).map((s) => s.split('\n'));
		genQuotes(quoteArr);
	}
}
main();
