import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import { GiGuitarBassHead } from "react-icons/gi";
import { FaShoppingCart } from "react-icons/fa";
import { MdSailing } from "react-icons/md";
import { GoHeartFill } from "react-icons/go";
import OpenModalMenuItem from "./OpenModalMenuItem";
import SearchModal from "../Search/SearchModal";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { FaSearch } from "react-icons/fa";

export default function Navigation() {

  const user = useSelector(state => state.session.user)

  return (
    <section className="nav-container">

      <section className='nav-home'>
        <NavLink to="/">
          <GiGuitarBassHead id='nav-site-icon' />
        </NavLink>
        <h1 id='nav-site-name'>
          Riff Harbor
        </h1>
        <MdSailing className="nav-text-icon" />
      </section>

      {user &&
        <section className="nav-action-button-container">
          <button className="nav-action-button">
            <NavLink className='nav-action-button-text' to={`/instruments/${user.id}/MyInstruments`}>
              My Instruments
            </NavLink>
          </button>
          <button className="nav-action-button">
            <NavLink className='nav-action-button-text' to='/instruments/new'>
              Sell Your Gear!
            </NavLink>
          </button>
          <button className="nav-action-button">
            <NavLink className='nav-action-button-text' to='/news/1'>
              News
            </NavLink>
          </button>
        </section>
      }

      <div className="nav-icons-container">
        <div className="nav-search-btn">
          <OpenModalMenuItem
            itemText={<FaSearch className='nav-user-action-icon' />}
            // onItemClick={}
            className='nav-action-button-text'
            modalComponent={<SearchModal />}
          />
        </div>

        {user &&
          <>
            <NavLink to='/orders/MyOrders'>
              <FaShoppingCart className='nav-user-action-icon' />
            </NavLink>
            <NavLink to='/favorites'>
              <GoHeartFill className='nav-user-action-icon' />
            </NavLink>
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
