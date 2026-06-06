const mapEntries = raw.innerText.split(' ').map((e) => e.split(','));
function buildEntry(dat, d)
{
	const outerbox = document.createElement('div');
	const img = document.createElement('img');
	const innerbox = document.createElement('div');
	outerbox.className = d;
	img.src = dat.mapURL;
	const nameElem = document.createElement('p');
	const idDiffElem = document.createElement('p');
	const playersElem = document.createElement('p');
	const victorsElem = document.createElement('p');
	playersElem.className = 'desc';
	victorsElem.className = 'desc';
	nameElem.append(dat.name);
	idDiffElem.append(dat.id + ' Difficulty: ' + d);
	playersElem.append('Players: ' + dat.playsUnique);
	victorsElem.append('Victors: ' + dat.winsUnique);
	innerbox.append(nameElem, idDiffElem, playersElem, victorsElem);
	outerbox.append(img, innerbox);
	content.appendChild(outerbox);
}
async function fetchData(entries)
{
	for(const [id, difficulty] of entries)
	{
		const resp = await fetch('https://data.ninjakiwi.com/btd6/maps/map/' + id);
		if(resp.ok)
		{
			const obj = JSON.parse(await resp.text());
			buildEntry(obj.body, difficulty);
		}
		else
		{
			console.error('fetching map ' + id + ' failed with status ' + resp.status);
		}
	}
}
fetchData(mapEntries);
