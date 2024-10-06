

export default function ScreenerPeriodModal({ symbol, currentPeriod, listId}) {

    console.log('symbol ==>', symbol)
    console.log('currentPeriod ==>', currentPeriod)
    console.log('listId ==>', listId)
    
    const handleSetPeriod = (selectedPeriod) => {
        console.log('handleSetPeriod clicked!')
        console.log('selectedPeriod ==>', selectedPeriod)
    }

    return (
        <section className="screener-modal-container">
            <h2 className="modal-title">Set Period for {symbol}</h2>
            <div className="screener-modal-btn-container">
            {['historical_data_6mo', 'historical_data_1yr', 'historical_data_5yr', 'historical_data_10yr'].map((ele, index) => (
                <button
                    key={index}
                    className={`screener-period-map-btn ${ele != currentPeriod ? 'not-added' : 'is-added '}`}
                    onClick={() => handleSetPeriod(ele)}
                    disabled={ele == currentPeriod}
                    >
                    {ele?.split('_')[2]}
                </button>
            ))}
            </div>
        </section>
    )
}