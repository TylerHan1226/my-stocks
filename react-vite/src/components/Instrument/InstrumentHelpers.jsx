
import { NavLink } from "react-router-dom";
import { GoHeartFill } from "react-icons/go";

export const InstrumentCard = ({ eachInst, favoriteInstIds, user, orders, isDisable, handleFav, handleAddToCart, dispatch, nav }) => (
    <section className="instrument-container">
      <NavLink className="instrument-dtl-container" to={`/instruments/${eachInst?.id}`}>
        <img className="instrument-image" src={eachInst?.image_url} />
      </NavLink>
      <div className="search-inst-info-container">
        <h3>{eachInst?.model}</h3>
        
        {eachInst?.discount < 1 ? (
                <div className="landing-discount-container">
                  <div className="discount-price-container">
                    <p className="instrument-card-dtl-text discount-price">
                      ${eachInst?.price}
                    </p>
                    <p className="instrument-card-dtl-text">
                      ${(eachInst?.price * eachInst?.discount).toFixed(2)}
                    </p>
                  </div>
                  <div className="landing-money-saved">
                    <p >
                    Save ${(eachInst?.price - (eachInst?.price * eachInst?.discount)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="instrument-card-dtl-text">${eachInst?.price}</p>
              )}

        <h4 className="black-text">{eachInst?.color}</h4>
        {eachInst?.is_used ? (
          <p className="black-text">Pre-owned</p>
        ) : (
          <p className="black-text">New</p>
        )}
      </div>
      <div className="inst-details-text">
        <p className="black-text">{eachInst?.details}</p>
      </div>
      <div className="my-inst-item-btn-container">
        <button className={`dtl-fav-btn ${favoriteInstIds?.includes(eachInst?.id) ? 'favorite' : ''} search-fav-btn`}
          onClick={() => handleFav(eachInst?.id, eachInst)}
        >
          <GoHeartFill className={`dtl-fav-icon ${favoriteInstIds?.includes(eachInst?.id) ? 'favorite' : ''}`} />
        </button>
        {eachInst?.seller_id == user?.id ? (
          <button className="search-add-to-cart-button ">
            <NavLink className='search-add-to-cart-text' to={`/instruments/${eachInst?.id}/update`}>
              Update
            </NavLink>
          </button>
        ) : (
          <button
            className={`search-add-to-cart-button  ${user ? '' : 'disabled'}`}
            onClick={() => handleAddToCart(eachInst.id, orders, dispatch, nav)}
            disabled={isDisable}
          >
            <NavLink className='search-add-to-cart-text'>
              Add to Cart
            </NavLink>
          </button>
        )}
      </div>
    </section>
  );
