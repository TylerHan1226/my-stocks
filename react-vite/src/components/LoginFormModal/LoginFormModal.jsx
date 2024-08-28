import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import { MdSailing } from "react-icons/md";
import { NavLink } from "react-router-dom";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  const loginDemo = (e) => {
    e.preventDefault()
    return dispatch(thunkLogin({email:'demo@gmail.com', password:'password'}))
    .then(closeModal)
  }

  return (
    <div className="profile-log-modal-container">
      <div className="profile-log-modal-header">
        <h2>Log In to Riff Harbor</h2>
        <MdSailing className="login-model-icon" />
      </div>
      
      <form className="profile-log-modal-form" onSubmit={handleSubmit}>
        <label className="profile-log-modal-label">
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p className="validation-error-text">* {errors.email}</p>}
        <label className="profile-log-modal-label">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p className="validation-error-text">* {errors.password}</p>}
        <button className="profile-log-modal-btn" type="submit">Log In</button>
        <button className='profile-log-modal-btn'>
        <NavLink
          onClick={loginDemo}
          to='/'
          className="profile-log-modal-demo-text"
        >
          Log in as Demo User
        </NavLink>
      </button>
      </form>
    </div>
  );
}

export default LoginFormModal;
