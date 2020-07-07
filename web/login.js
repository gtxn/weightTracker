let url = 'http://glendatxn.local:3000'

let submit = () => {
    let famName = document.getElementById('fam').value
    let name = document.getElementById('name').value
    let pwd = document.getElementById('pwd').value

    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            pwd: pwd,
            fam: famName,
        })
    }

    fetch(`${url}/valUser`, options)
        .then(res => {
            return res.json()
        })
        .then(json => {
            if (json.status == 'valid') {
                window.location.href = `${url}/index`
            }
            else {
                document.getElementById('error').innerHTML = json.status
            }
        })
        .catch(err => console.log(err))
}