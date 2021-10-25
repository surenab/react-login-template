import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useRef,
} from 'react'

import Card from '../UI/Card/Card'
import classes from './Login.module.css'
import Button from '../UI/Button/Button'
import AuthContext from '../../store/auth-context'
import Input from '../UI/Input/Input'

const emailReducer = (state, action) => {
  console.log(state, action)
  switch (action.type) {
    case 'USER_INPUT':
      return { value: action.val, isValid: action.val.includes('@') }
    case 'INPUT_BLUR':
      return { value: state.value, isValid: state.value.includes('@') }
    default:
      return { value: '', isValid: false }
  }
}

const emailInitalState = {
  value: '',
  isValid: undefined,
}

const passwordReducer = (state, action) => {
  switch (action.type) {
    case 'USER_INPUT':
      return { value: action.val, isValid: action.val.trim().length > 6 }
    case 'INPUT_BLUR':
      return { value: state.value, isValid: state.value.trim().length > 6 }
    default:
      return { value: '', isValid: false }
  }
}

const passwordInitalState = {
  value: '',
  isValid: undefined,
}

const Login = (props) => {
  const [formIsValid, setFormIsValid] = useState(false)

  const [emailState, dispatchEmail] = useReducer(emailReducer, emailInitalState)
  const [passwordState, dispatchPassword] = useReducer(
    passwordReducer,
    passwordInitalState,
  )

  const ctx = useContext(AuthContext)

  const { isValid: emailIsValid } = emailState
  const { isValid: passwordIsValid } = passwordState

  useEffect(() => {
    const identifier = setTimeout(() => {
      setFormIsValid(emailIsValid && passwordIsValid)
    }, 500)

    return () => {
      clearTimeout(identifier)
    }
  }, [emailIsValid, passwordIsValid])

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: 'USER_INPUT', val: event.target.value })
    setFormIsValid(
      event.target.value.includes('@') && passwordState.value.trim().length > 6,
    )
  }

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: 'USER_INPUT', val: event.target.value })
    setFormIsValid(emailState.isValid && event.target.value.trim().length > 6)
  }

  const validateEmailHandler = () => {
    dispatchEmail({ type: 'INPUT_BLUR' })
  }

  const validatePasswordHandler = () => {
    dispatchPassword({ type: 'INPUT_BLUR' })
  }

  const submitHandler = (event) => {
    event.preventDefault()
    console.log(formIsValid, emailIsValid, passwordIsValid)
    if (formIsValid) {
      ctx.onLogin(emailState.value, passwordState.value)
    } else if (!emailIsValid) {
      emailInputRef.current.focus()
    } else {
      passwordInputRef.current.focus()
    }
  }
  const emailInputRef = useRef()
  const passwordInputRef = useRef()

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailInputRef}
          id="email"
          isValid={emailState.isValid}
          label="E-Mail"
          type="email"
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          ref={passwordInputRef}
          id="password"
          isValid={passwordState.isValid}
          label="Password"
          type="password"
          value={passwordState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default Login
