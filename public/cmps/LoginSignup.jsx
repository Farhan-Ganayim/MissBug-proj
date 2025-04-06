const { useState } = React
const { useNavigate } = ReactRouterDOM

import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'
import { authService } from '../services/auth.service.js'

export function LoginSignup({ setLoggedinUser }) {

    const [isSignup, setIsSignup] = useState(false)
    const [credentials, setCredentials] = useState(userService.getEmptyCredentials())

    const navigate = useNavigate()

    function handleChange({ target }) {
        const { name, value } = target
        setCredentials(prevCreds => ({ ...prevCreds, [name]: value }))
    }

    function handleSubmit(ev) {
        ev.preventDefault()
        const action = isSignup ? authService.signup : authService.login

        action(credentials)
            .then(user => {
                setLoggedinUser(user)
                showSuccessMsg(`Welcome, ${user.fullname}`)
                navigate('/bug')
            })
            .catch(err => {
                console.error('Auth error:', err)
                showErrorMsg(`Couldn't ${isSignup ? 'signup' : 'login'}`)
            })
    }

    return (
        <div className="login-page">
            <form className="login-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    value={credentials.username}
                    placeholder="Username"
                    onChange={handleChange}
                    required
                    autoFocus
                />
                <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    placeholder="Password"
                    onChange={handleChange}
                    required
                    autoComplete="off"
                />
                {isSignup && (
                    <input
                        type="text"
                        name="fullname"
                        value={credentials.fullname}
                        placeholder="Full name"
                        onChange={handleChange}
                        required
                    />
                )}
                <button>{isSignup ? 'Signup' : 'Login'}</button>
            </form>

            <div className="btns">
                <a href='#' onClick={(ev) => {
                    ev.preventDefault()
                    setIsSignup(prev => !prev)
                }}>
                    {isSignup ? 'Already a member? Login' : 'New user? Signup here'}
                </a>
            </div>
        </div>
    )
}
