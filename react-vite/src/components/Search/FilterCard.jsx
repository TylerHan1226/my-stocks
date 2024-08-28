
export const FilterCard = ({ isUsed, minPrice, maxPrice, discountFilter, handleDiscountFilter, handleBrandChange, handleMinPriceChange, handleMaxPriceChange, handleCondition }) => (
    <section className="search-filter-container">

        <div className="filter-containers">
            <h2>Make</h2>
            <div className="brand-filter-container">
                <div className="brand-filters">
                    <input className="radio-dot" type='radio' name='brands' value='' onChange={() => handleBrandChange('')} defaultChecked></input>
                    <label className="brand-filter-labels">All</label>
                </div>
                <div className="brand-filters">
                    <input className="radio-dot" type='radio' name='brands' value='B.C. Rich' onChange={() => handleBrandChange('B.C. Rich')}></input>
                    <label className="brand-filter-labels">B.C. Rich</label>
                </div>
                <div className="brand-filters">
                    <input className="radio-dot" type='radio' name='brands' value='Martin' onChange={() => handleBrandChange('Ernie Ball')}></input>
                    <label className="brand-filter-labels">Ernie Ball</label>
                </div>
                <div className="brand-filters">
                    <input className="radio-dot" type='radio' name='brands' value='ESP' onChange={() => handleBrandChange('ESP')}></input>
                    <label className="brand-filter-labels">ESP</label>
                </div>
                <div className="brand-filters">
                    <input className="radio-dot" type='radio' name='brands' value='Fender' onChange={() => handleBrandChange('Fender')}></input>
                    <label className="brand-filter-labels">Fender</label>
                </div>
                <div className="brand-filters">
                    <input className="radio-dot" type='radio' name='brands' value='Gibson' onChange={() => handleBrandChange('Gibson')}></input>
                    <label className="brand-filter-labels">Gibson</label>
                </div>
                <div className="brand-filters">
                    <input className="radio-dot" type='radio' name='brands' value='Jackson' onChange={() => handleBrandChange('Jackson')}></input>
                    <label className="brand-filter-labels">Jackson</label>
                </div>
                <div className="brand-filters">
                    <input className="radio-dot" type='radio' name='brands' value='Martin' onChange={() => handleBrandChange('Martin')}></input>
                    <label className="brand-filter-labels">Martin</label>
                </div>
                <div className="brand-filters">
                    <input className="radio-dot" type='radio' name='brands' value='PRS' onChange={() => handleBrandChange('PRS')}></input>
                    <label className="brand-filter-labels">PRS</label>
                </div>
                <div className="brand-filters">
                    <input className="radio-dot" type='radio' name='brands' value='Schecter' onChange={() => handleBrandChange('Schecter')}></input>
                    <label className="brand-filter-labels">Schecter</label>
                </div>
                <div className="brand-filters">
                    <input className="radio-dot" type='radio' name='brands' value='Taylor' onChange={() => handleBrandChange('Taylor')}></input>
                    <label className="brand-filter-labels">Taylor</label>
                </div>
            </div>
        </div>

        <div className="filter-containers">
            <h2>Price</h2>
            <div className="filter-price-input-container">
                <label className="filter-price-labels">
                    <input className="filter-price-text-bar" type="text" placeholder="$ Min" value={minPrice} onChange={handleMinPriceChange} />
                </label>
                <label>-</label>
                <label className="filter-price-labels">
                    <input className="filter-price-text-bar" type="text" placeholder="$ Max" value={maxPrice} onChange={handleMaxPriceChange} />
                </label>
            </div>
        </div>

        <div className="filter-containers">
            <h2>Discount</h2>
            <div className="filter-discount-btn-container">
                <button className={`filter-discount-arrow-btns ${discountFilter == true ? 'selected' : ''}`}
                        onClick={() => handleDiscountFilter(true)}>
                    I Want Discount!
                </button>
            </div>
        </div>

        <div className="filter-containers">
            <h2>Condition</h2>
            <div className="filter-condition-input-container">
                <button className={`filter-condition-btn ${isUsed == false ? 'selected' : ''}`} onClick={() => handleCondition(false)}>
                    New
                </button>
                <button className={`filter-condition-btn ${isUsed == true ? 'selected' : ''}`} onClick={() => handleCondition(true)}>
                    Pre-owned
                </button>
            </div>
        </div>
    </section>
);