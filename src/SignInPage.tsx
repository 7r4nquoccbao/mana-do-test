import React, {useState} from 'react';

import {useHistory} from 'react-router-dom'
import Service from './service'

const SignInPage = () => {
    const [form, setForm] = useState({
        userId: '',
        password: ''
    });
    const history = useHistory();

    const [userIdActive, setUserIdActive] = useState(false);
    const [passwordActive, setPasswordActive] = useState(false);

    localStorage.setItem('token', '');

    const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const resp = await Service.signIn(form.userId, form.password)

        localStorage.setItem('token', resp)
        history.push('/todo')
    }

    const onChangeField = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.persist()
        setForm(prev=>({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <div className="signIn__box">
            <form onSubmit={signIn}>
                <div className="form__field">
                    <i className={`fas fa-user ${userIdActive ? 'active' : ''}`}></i>
                    <div className="input__form">
                        <input
                            autoComplete="off"
                            id="user_id"
                            name="userId"
                            value={form.userId}
                            onChange={onChangeField}
                            onFocus={() => setUserIdActive(true)}
                            onBlur={() => setUserIdActive(false)}
                            placeholder="User ID"
                        />
                        <div className={`underline__input ${userIdActive ? 'active' : ''}`}></div>
                    </div>
                </div>
                <div className="form__field">
                    <i className={`fas fa-lock ${passwordActive ? 'active' : ''}`}></i>
                     <div className="input__form">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={onChangeField}
                            onFocus={() => setPasswordActive(true)}
                            onBlur={() => setPasswordActive(false)}
                            placeholder="Password"
                        />
                        <div className={`underline__input ${passwordActive ? 'active' : ''}`}></div>
                    </div>
                </div>
                <button type="submit">
                    <i className="fas fa-sign-in-alt" style={{marginRight: '2%'}}></i>Sign in
                </button>
            </form>
        </div>
    );
};

export default SignInPage;