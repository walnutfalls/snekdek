const nameField = document.getElementById('username')
const submitButton = document.getElementById('submit')
const loginForm = document.getElementById('login')
const retryButton = document.getElementById('retry-btn')

import runGame from './runGame'

const setupLogin = () => {
    let currentName = ''

    submitButton.onclick = () => {
        var name = nameField.value

        if (name == null || name.length == 0) {
            alert('enter name please')
            return
        }

        currentName = name
        loginForm.remove()
        runGame(name)
    }

    retryButton.onclick = () => {
        const retry = document.getElementById('retry')
        retry.classList.add('hidden')
        runGame(currentName)
    }
}

export default setupLogin
