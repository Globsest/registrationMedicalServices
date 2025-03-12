import React from 'react';

function RegisterForm() {
  const [state, setState] = React.useState({
    name: "",
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

  const handleOnSubmit = evt => {
    evt.preventDefault();

    const { name, email, password } = state;
    alert(
      `name: ${name} email: ${email} password: ${password}`
    );

    for (const key in state) {
      setState({
        ...state,
        [key]: ""
      });
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Регистрация</h1>
        
        <span>используйте ваш email для регистрации</span>
        <input
          type="text"
          name="name"
          value={state.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <button>зарегистрироватся</button>
      </form>
    </div>
  );
}

export default RegisterForm;
