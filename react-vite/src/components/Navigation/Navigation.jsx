import "./Navigation.css";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";

import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import SearchModal from "../Search/SearchModal";
import { GiGuitarBassHead } from "react-icons/gi";
import { FaSearch } from "react-icons/fa";


export default function Navigation() {

  const user = useSelector(state => state.session.user)

  return (
    <section className="nav-container">

      <section className='nav-home'>
        <NavLink to="/">
          <GiGuitarBassHead id='nav-site-icon' />
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
