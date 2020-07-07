let ctx = document.getElementById('myChart').getContext('2d')

let myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: []
    },
    options: {
        spanGaps: true,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

let updateWeight = (date, time, weight) => {
    let p1 = fetch(`${url}/getOne?fam=${fam}`)
        .then(res => {
            return res.json()
        })
        .then(json => {
            if (!json['failed']) {
                let p2 = fetch(`${url}/update?name=${name}&date=${date}&time=${time}&weight=${weight}&fam=${fam}`, { method: 'PUT' })
                    .then(res => {
                        return res.text()
                    })
                    .catch(err => console.log(err))
                return p2
            } else {
                window.alert('you are not an authorised user')
                return Promise.resolve('failed')
            }
        })

        .catch(err => console.log(err))

    return p1
}

let sortDates = (arr) => {

    let sortMonth = []
    let finArr = []

    for (let i = 0; i < arr.length; i++) {
        let dates = arr[i].split('/')
        let month = [parseInt(dates[1]), parseInt(dates[0])]
        sortMonth.push(month)
    }

    sortMonth.sort((a, b) => {
        if (a[0] < b[0]) {
            return -1

        } else {
            return 0
        }
    })

    sortMonth.sort((a, b) => {
        if (a[1] < b[1] && a[0] == b[0]) {
            return -1
        } else {
            return 0
        }
    })

    for (let i = 0; i < sortMonth.length; i++) {
        let date = `${sortMonth[i][1]}/${sortMonth[i][0]}`
        finArr.push(date)
    }

    return finArr
}

let fullArr = (arr1, arr2) => {
    for (let i = 0; i < arr1.length; i++) {
        if (!arr2.includes(arr1[i])) {
            arr2.push(arr1[i])
        }
    }

    return sortDates(arr2)
}

let updateChart = (fam) => {

    fetch(`${url}/getOne?fam=${fam}`)
        .then(res => {
            return res.json()
        })
        .then(json => {

            if (!json['failed']) {
                let people = Object.keys(json)

                people.shift() //delete pwd key

                myChart.data = { labels: [], datasets: [] }


                people.forEach((x) => {
                    let keys = Object.keys(json[x])
                    let labels = fullArr(keys, myChart.data.labels)
                    myChart.data.labels = labels
                })
                myChart.update()

                let col = 0
                people.forEach((x) => {
                    let colArr = [[255, 0, 0], [0, 255, 0], [0, 0, 255], [51, 255, 255], [153, 0, 153]]

                    let dataSet = []

                    for (let i = 0; i < myChart.data.labels.length; i++) {
                        if (json[x][myChart.data.labels[i]]) {
                            dataSet.push(json[x][myChart.data.labels[i]].weight)
                        } else {
                            dataSet.push(undefined)
                        }
                    }

                    myChart.data.datasets.push({ data: dataSet, label: `${x}'s weight`, backgroundColor: `rgba(${colArr[col][0]}, ${colArr[col][1]}, ${colArr[col][2]}, 0.1)`, borderColor: `rgba(${colArr[col][0]}, ${colArr[col][1]}, ${colArr[col][2]}, 0.8)` })
                    myChart.update()

                    col += 1

                })
            }

            else {
                window.alert('you are not an authorised user')
            }
        })
        .catch(err => console.log(err))
}

let chartAllMembers = (fam) => {

    fetch(`${url}/getOne?fam=${fam}`)
        .then(res => {
            return res.json()
        })
        .then(json => {
            updateChart(fam)
        })
}
