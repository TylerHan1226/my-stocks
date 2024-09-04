import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import { GrMoney } from "react-icons/gr";


function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        username,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <div className="profile-log-modal-container">
      <div className="profile-log-modal-header">
        <h1>Start Investing!</h1>
        <GrMoney className="login-model-icon" />
        
      </div>
      {errors.server && <p>{errors.server}</p>}
      <form className="profile-log-modal-form" onSubmit={handleSubmit}>
        <label className="profile-log-modal-label">
          Email
          <input
            type="text"
            className="profile-log-modal-textfield"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p className="validation-error-text">* {errors.email}</p>}
        <label className="profile-log-modal-label">
          Username
          <input
            type="text"
            className="profile-log-modal-textfield"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p className="validation-error-text">* {errors.username}</p>}
        <label className="profile-log-modal-label">
          Password
          <input
            type="password"
            className="profile-log-modal-textfield"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p className="validation-error-text">* {errors.password}</p>}
        <label className="profile-log-modal-label">
          Confirm Password
          <input
            type="password"
            className="profile-log-modal-textfield"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && <p className="validation-error-text">* {errors.confirmPassword}</p>}
        <button className="profile-log-modal-btn" type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
