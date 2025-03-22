mkelem = (s) => document.createElement(s)
factor = (x) =>
{
    fs = new Map();
    y = Math.floor(Math.sqrt(x))
    for(i = 2; x > 1 && i <= y; ++i)
    {
        for(; x % i === 0; x /= i)
            fs.set(i, (fs.get(i) ?? 0) + 1)
    }
    if(x > 1)
        fs.set(x, 1)
    return fs
}
act = (e) =>
{
    n = parseInt(v.value)
    for(; r.lastChild; r.removeChild(r.lastChild));
    if(isNaN(n))
        r.append(n)
    else if(n > 9007199254740991)
        r.append('Number is far too big')
    else if(n > 1)
    {
        result = factor(n)
        tableEntry = mkelem('tr')
        numEntry = mkelem('td')
        factorEntry = mkelem('td')
        for(e of result.entries())
        {
            r.append(' ' + e[0])
            factorEntry.append(r.lastChild.cloneNode())
            if(e[1] > 1)
            {
                exp = mkelem('sup')
                exp.append(e[1])
                r.append(exp)
                factorEntry.append(exp.cloneNode(true))
            }
        }
        numEntry.append(n)
        tableEntry.append(numEntry, factorEntry)
        htbody.prepend(tableEntry)
    }
    else
        r.append('Number is far too small')
}
keyact = (e) =>
{
    if(e.keyCode === 13)
        act(e)
}
b.addEventListener('click', act)
document.addEventListener('keyup', keyact)
