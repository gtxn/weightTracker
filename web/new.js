let url = 'http://glendatxn.local:3000'

let checkDup = (arr) => {
    arr.sort()
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] == arr[i + 1]) {
            return true
        }
    }

    return false
}


let checkName = () => {
    let famName = document.getElementById('fam').value
    let nameAvail = document.getElementById('nameAvail')

    fetch(`${url}/nameAvail?name=${famName}`)
        .then(res => {
            return res.json()
        })
        .then(json => {
            let avail = json.avail

            if (famName == '') {
                nameAvail.style.color = 'red'
                nameAvail.innerHTML = 'Name cannot be left blank'
            }
            else if (avail) {
                nameAvail.style.color = 'green'
                nameAvail.innerHTML = 'Name is availalbe'
            } else {
                nameAvail.style.color = 'red'
                nameAvail.innerHTML = 'Name is unavailable. Please pick another name'
            }
        })
}


let famNum = () => {
    let famNum = document.getElementById('famNum').value

    let div = document.getElementById('members')

    div.innerHTML = ''

    if (famNum <= 0) {
        window.alert('Members of family must be more than 0')
        document.getElementById('famNum').value = 0
        return
    }

    for (let i = 0; i < famNum; i++) {
        let inpLabel = document.createElement('label')
        inpLabel.innerHTML = `Member ${i + 1}  name`
        inpLabel.setAttribute('for', `member${i}`)

        let nameInp = document.createElement('input')
        nameInp.className = 'form-control names'
        nameInp.type = 'text'
        nameInp.id = `member${i + 1}`

        div.appendChild(inpLabel)
        div.appendChild(nameInp)
    }
}

let submit = () => {
    let errMsg = document.getElementById('error')

    let famName = document.getElementById('fam')
    let pwd1 = document.getElementById('pwd1')
    let pwd2 = document.getElementById('pwd2')
    let nameElem = document.getElementsByClassName('names')
    let names = []

    for (let i = 0; i < nameElem.length; i++) {
        names.push(nameElem[i].value)
        if (nameElem[i].value == '') {
            errMsg.innerHTML = 'Member names cannot be left blank'
            return
        }
    }


    if (pwd1.value == '') {
        errMsg.innerHTML = 'Password cannot be left blank'
        return
    }
    else if (pwd1.value != pwd2.value) {
        errMsg.innerHTML = '2 Passwords do not match'
        return
    }
    else if (famName == '') {
        errMsg.innerHTML = 'Family name cannot be left blank'
        return
    }
    else if (checkDup(names)) {
        errMsg.innerHTML = 'Member names cannot be duplicates'
        return
    }

    errMsg.innerHTML = 'allsgd'

    let queryNames = ''

    for (let i = 0; i < names.length; i++) {
        queryNames += names[i]
        if (i != names.length - 1) {
            queryNames += ','
        }
    }

    fetch(`${url}/create?names=${queryNames}&fam=${famName.value}&pwd=${pwd1.value}`, { method: 'POST' })
        .then(res => {
            return res.text()
        })
        .then(text => {
            if (text == 'successfully updated') {
                window.alert('Your details have been updated. You will be directed to the login page.')
                window.location.href = `${url}/login`
            }
        })
        .catch(err => { console.log(err) })
}