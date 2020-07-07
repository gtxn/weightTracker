url = 'http://glendatxn.local:3000'

let newCarElem = (name, weights, first) => {

    let pDiv = document.getElementById('carParent')

    let tDiv = document.createElement('div')
    if (first) {
        tDiv.className = 'carousel-item active'
    } else {
        tDiv.className = 'carousel-item'
    }

    //title
    let title = document.createElement('h4')
    title.innerHTML = name
    tDiv.appendChild(title)

    //table headers
    let table = document.createElement('table')
    table.style.width = '100%'

    let firstR = document.createElement('tr')

    let th1 = document.createElement('th')
    th1.innerHTML = 'Date'
    let th2 = document.createElement('th')
    th2.innerHTML = 'Weight'

    firstR.appendChild(th1)
    firstR.appendChild(th2)

    table.appendChild(firstR)

    for (let i = 0; i < weights.length; i++) {
        let row = document.createElement('tr')

        let td1 = document.createElement('td')
        let td2 = document.createElement('td')

        td1.innerHTML = weights[i][0]
        td2.innerHTML = weights[i][1]

        row.appendChild(td1)
        row.appendChild(td2)

        table.appendChild(row)
    }

    tDiv.appendChild(table)

    pDiv.appendChild(tDiv)

}


let getWeightTable = (fam) => {
    fetch(`${url}/getOne?fam=${fam}`)
        .then(res => {
            return res.json()
        })
        .then(json => {
            if (!json['failed']) {
                return json
            }
        })
        .then(famObj => {
            let names = Object.keys(famObj)
            let pDiv = document.getElementById('carParent')
            pDiv.innerHTML = ''

            names.shift()

            console.log(names)

            for (let j = 0; j < names.length; j++) {
                let name = names[j]

                let obj = famObj[name]
                let keys = Object.keys(obj)
                let weights = []

                for (let i = 0; i < keys.length; i++) {
                    weights.push([keys[i], obj[keys[i]]['weight']])
                }

                if (j == 0) {
                    newCarElem(name, weights, true)
                } else {
                    newCarElem(name, weights, false)
                }
            }

        })
        .catch(err => console.log(err))
}

