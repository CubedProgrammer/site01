year = new Date().getFullYear()
cell = reigning.children.item(2)
yearElement = cell.children.length === 0 ? cell : cell.lastElementChild
yearElement.innerText += '-' + year
