import React from "react";
import { loginUser } from '../../services/api.js';


function LoginForm() {
  const [state, setState] = React.useState({
    email: "",
    password: ""
  });
  const handleChange = evt => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();

    const { email, password } = state;
    
    try {
      const response = await loginUser({ email, password });
      alert('Вход выполнен успешно!');
      console.log('Авторизация:', response.data);
    } 
    catch (error) {
      console.error('Ошибка авторизации:', error);
      alert('Ошибка авторизации. Пожалуйста, проверьте данные.');
    }
    
    // alert(`email: ${email} password: ${password}`);

    for (const key in state) {
      setState({
        ...state,
        [key]: ""
      });
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Вход</h1>
        
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={state.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={state.password}
          onChange={handleChange}
        />
        {/* <a href="#">Забыли пароль?</a> */}
        <button>войти</button>
      </form>
    </div>
  );
}

export default LoginForm;
