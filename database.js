let fs = require('fs')
let process = require('process')
let path = require('path')

const fsp = require('fs').promises;

let databaseFilePath = path.join(process.cwd(), 'database.txt')
if (!fs.existsSync(databaseFilePath)) {
    fsp.writeFile("database.txt", "{}", "utf8")
        .then(() => { console.log('success') })
}

let getAll = () => {
    let p = fsp.readFile("database.txt", "utf8")
        .then((res) => {
            return JSON.parse(res)
        })
        .then(allData => {
            return allData
        })
        .catch((err) => { console.log(err) })

    return p
}


let get = (key) => {
    let p = fsp.readFile("database.txt", "utf8")
        .then(res => {

            return JSON.parse(res)
        })
        .then(json => {
            let allKeysArr = Object.keys(json)
            if (allKeysArr.includes(key)) {
                return json[key]
            } else {
                return undefined
            }
        })
        .catch(err => { console.log(err) })

    return p

}

let create = (dataObj) => {
    let names = dataObj.names.split(',')
    let famName = dataObj.fam
    let pwd = dataObj.pwd

    let upObj = {}
    upObj[famName] = { pwd: pwd }

    for (let i = 0; i < names.length; i++) {
        upObj[famName][names[i]] = {}
    }

    let p = fsp.readFile('database.txt', 'utf8')
        .then(dataInfo => {
            return JSON.parse(dataInfo)
        })
        .then(json => {
            if (json[famName]) {
                return new Promise((resolve, reject) => {
                    resolve(false)
                })
            } else {
                let allUsers = Object.assign(json, upObj)
                return fsp.writeFile('database.txt', JSON.stringify(allUsers), 'utf8')
            }
        })
        .catch(err => { console.log(err) })

    return p

}

let update = (dataObj) => {

    let name = dataObj.name
    let date = dataObj.date
    let time = dataObj.time
    let weight = dataObj.weight
    let famName = dataObj.fam

    let p = fsp.readFile('database.txt', 'utf8')
        .then(res => {
            return JSON.parse(res)
        })
        .then(json => {
            if (json[famName]) {

                json[famName][name][date] = { time: time, weight: weight }

                // if (json[famName][name][date]) {
                //     json[famName][name][date]['time'] = time
                //     json[famName][name][date]['weight'] = weight
                // } else {
                // }

                return fsp.writeFile('database.txt', JSON.stringify(json), 'utf8')

            }
            return new Promise((resolve, reject) => {
                resolve(false)
            })

        })
        .catch(err => { console.log(err) })

    return p
}

let delUser = (fam) => {

    let p = fsp.readFile('database.txt', 'utf8')
        .then(res => {
            return JSON.parse(res)
        })
        .then(json => {
            if (json[fam]) {
                delete json[fam]
                return fsp.writeFile('database.txt', JSON.stringify(json), 'utf8')
            } else {
                return new Promise(resolve => { resolve(false) })
            }
        })
        .catch(err => { console.log(err) })
    return p
}

module.exports = {
    "getAll": getAll,
    "get": get,
    'create': create,
    'update': update,
    'delUser': delUser,
}