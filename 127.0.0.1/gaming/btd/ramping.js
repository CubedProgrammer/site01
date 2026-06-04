const baseHealths = [200, 700, 4000, 400, 20000];
const baseSpeeds = [25, 6.25, 4.5, 66, 4.5];

let healthFactor = 100;
let speedFactor = 100;
let round = 81;

function addRampRow(round, factor, base)
{
	const r = document.createElement('tr');
	const roundElem = document.createElement('td');
	const scalar = document.createElement('td');
	roundElem.append(round.toString());
	scalar.append(factor.toString() + '%');
	r.appendChild(roundElem);
	r.appendChild(scalar);
	for(const val of base)
	{
		const cell = document.createElement('td');
		cell.append((val * factor / 100).toString());
		r.appendChild(cell);
	}
	ramptable.appendChild(r);
}

for(; round < 101; round++)
{
	healthFactor += 2;
	speedFactor += 2;
	addRampRow(round, healthFactor, baseHealths);
	addRampRow(round, speedFactor, baseSpeeds);
}

speedFactor += 18;

for(; round < 126; round++)
{
	healthFactor += 5;
	speedFactor += 2;
	addRampRow(round, healthFactor, baseHealths);
	addRampRow(round, speedFactor, baseSpeeds);
}

for(; round < 151; round++)
{
	healthFactor += 15;
	speedFactor += 2;
	addRampRow(round, healthFactor, baseHealths);
	addRampRow(round, speedFactor, baseSpeeds);
}

speedFactor += 40;

for(; round < 251; round++)
{
	healthFactor += 35;
	speedFactor += 2;
	if(round == 201)
		speedFactor += 50;
	addRampRow(round, healthFactor, baseHealths);
	addRampRow(round, speedFactor, baseSpeeds);
}

for(; round < 301; round++)
{
	healthFactor += 100;
	speedFactor += 2;
	if(round == 252)
		speedFactor += 48;
	addRampRow(round, healthFactor, baseHealths);
	addRampRow(round, speedFactor, baseSpeeds);
}

for(; round < 401; round++)
{
	healthFactor += 150;
	speedFactor += 2;
	addRampRow(round, healthFactor, baseHealths);
	addRampRow(round, speedFactor, baseSpeeds);
}

for(; round < 501; round++)
{
	healthFactor += 250;
	speedFactor += 2;
	addRampRow(round, healthFactor, baseHealths);
	addRampRow(round, speedFactor, baseSpeeds);
}
	
for(; round < 1201; round++)
{
	healthFactor += 500;
	speedFactor += 2;
	addRampRow(round, healthFactor, baseHealths);
	addRampRow(round, speedFactor, baseSpeeds);
}

function calculateRampingFactor(round)
{
	if(round < 81)
		return[100, 100];
	else if(round < 101)
		return[round * 2 - 60, round * 2 - 60];
	else if(round < 126)
		return[round * 5 - 360, round * 2 - 42];
	else if(round < 151)
		return[round * 15 - 1610, round * 2 - 42];
	else if(round < 201)
		return[round * 35 - 4610, round * 2 - 2];
	else if(round < 251)
		return[round * 35 - 4610, round * 2 + 48];
	else if(round < 252)
		return[round * 100 - 20860, round * 2 + 48];
	else if(round < 301)
		return[round * 100 - 20860, round * 2 + 96];
	else if(round < 401)
		return[round * 150 - 35860, round * 2 + 96];
	else if(round < 501)
		return[round * 250 - 75860, round * 2 + 96];
	else
		return[round * 500 - 200860, round * 2 + 96];
}

calcbutton.addEventListener('click', () => {

	const factors = calculateRampingFactor(parseInt(roundNum.value));
	for(; result.lastChild; result.removeChild(result.lastChild));
	const healthRow = document.createElement('tr');
	const speedRow = document.createElement('tr');

	for(let hp of baseHealths)
	{
		const cell = document.createElement('td');
		cell.append(hp * factors[0] / 100);
		healthRow.appendChild(cell);
	}

	for(let s of baseSpeeds)
	{
		const cell = document.createElement('td');
		cell.append(s * factors[1] / 100);
		speedRow.appendChild(cell);
	}

	result.append(healthRow, speedRow);

})
