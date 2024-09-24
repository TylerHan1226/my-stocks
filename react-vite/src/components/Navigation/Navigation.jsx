import "./Navigation.css";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import SearchModal from "../Search/SearchModal";
import { GiReceiveMoney } from "react-icons/gi";
import { FaSearch } from "react-icons/fa";
import { IoListOutline } from "react-icons/io5";


export default function Navigation() {

  const user = useSelector(state => state.session.user)

  return (
    <section className="nav-container">

      <section className='nav-home'>
        <NavLink className='nav-logo-container' to="/">
          <GiReceiveMoney id='nav-site-icon' />
          <h1 id="nav-logo-text">MyStock</h1>
        </NavLink>
        <NavLink className='nav-logo-container' to="/landingBeta">
          <h1 id="nav-logo-text">landingBeta</h1>
        </NavLink>
      </section>

      <div className="nav-icons-container">
        {user &&
          <>
            <section className="nav-icons-container">
              <div className="nav-search-btn">
                <OpenModalMenuItem
                  itemText={<FaSearch className='nav-user-action-icon' />}
                  className='nav-action-button-text'
                  modalComponent={<SearchModal />}
                />
              </div>
              <NavLink to="/my_lists">
                <IoListOutline className="nav-user-action-icon nav-list-icon" />
              </NavLink>
              {/* <NavLink to="/news/1">
                <ImNewspaper className="nav-user-action-icon nav-list-icon" />
              </NavLink> */}
            </section>
            <ProfileButton />
          </>
        }
        {!user &&
          <section className="nav-loginSignup-container">
            <button className="nav-action-button">
              <OpenModalMenuItem
                itemText={"LOG IN"}
                // onItemClick={}
                className='nav-action-button-text'
                modalComponent={<LoginFormModal />}
              />
            </button>
            <button className="nav-action-button">
              <OpenModalMenuItem
                itemText={"SIGN UP"}
                // onItemClick={}
                className='nav-action-button-text'
                modalComponent={<SignupFormModal />}
              />
            </button>
          </section>}
      </div>

    </section>
  );
}
