let name
let fam
let url
url = 'http://glendatxn.local:3000'

let getUser = new Promise((resolve, reject) => {
    fetch(`${url}/userDetails`)
        .then(res => res.json())
        .then(json => {
            if (json.name == '' || json.fam == '') {
                reject()
            } else {
                resolve(json)
            }
        })
        .catch(err => {
            console.log(err)
        })
})

let dateObj = new Date()
let dateTdy = dateObj.getDate()
let monthTdy = dateObj.getMonth()
let time = dateObj.getTime()
let date = `${dateTdy}/${monthTdy + 1}`

window.onload = () => {
    getUser
        .then(json => {
            name = json.name
            fam = json.fam
        })
        .then(() => {
            chartAllMembers(fam)
            getWeightTable(fam)
        })
        .catch(() => {
            window.alert('Sorry, an error occured. Please log in again')
            window.location.href = `${url}/login`
        })

}

let submitWeight = () => {
    let weight = document.getElementById('weight').value
    dateObj = new Date()
    dateTdy = dateObj.getDate()
    monthTdy = dateObj.getMonth()
    time = dateObj.getTime()

    date = `${dateTdy}/${monthTdy + 1}`

    updateWeight(date, time, weight)
        .then((res) => {
            console.log(res)
            getWeightTable(fam)
            updateChart(fam)
        })

}