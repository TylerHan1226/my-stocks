import { useDispatch } from "react-redux"
import { updateListThunk } from "../../redux/list"
import { useModal } from "../../context/Modal"
import { useState } from "react"

export default function ScreenerSettingsModal({
    showType,
    setShowType,
    showTrPE,
    setShowTrPE,
    showFwPE,
    setShowFwPE,
    showCurrentPrice,
    setShowCurrentPrice,
    showHistoricalPrice,
    setShowHistoricalPrice,
    showYPC,
    show52wkHigh,
    setShow52wkHigh,
    show52wkLow,
    setShow52wkLow,
    showCurrPr52kwk,
    setShowCurrPr52kwk,
    setShowYPC,
    showDivYield,
    setShowDivYield,
    showCurrDiv,
    setShowCurrDiv,
    showHistDiv,
    setShowHistDiv,
    showTotalDivGrowth,
    setShowTotalDivGrowth,
    showYearlyDivGrowth,
    setShowYearlyDivGrowth,
    showEPS,
    setShowEPS,
    showPR,
    setShowPR,
    showPerformance,
    setShowPerformance,
    showColors,
    setShowColors,
}) {
    // const dispatch = useDispatch()
    // const {closeModal} = useModal()
    // console.log('symbol ==>', symbol)
    const [showTypeBtn, setShowTypeBtn] = useState(showType)
    const handleShowType = () => {
        setShowType(prev => !prev)
        setShowTypeBtn(prev => !prev)
    }
    const [showTrPEBtn, setShowTrPEBtn] = useState(showTrPE)
    const handleShowTrPE = () => {
        setShowTrPE(prev => !prev)
        setShowTrPEBtn(prev => !prev)
    }
    const [showFwPEBtn, setShowFwPEBtn] = useState(showFwPE)
    const handleShowFwPE = () => {
        setShowFwPE(prev => !prev)
        setShowFwPEBtn(prev => !prev)
    }
    const [showCurrentPriceBtn, setShowCurrentPriceBtn] = useState(showCurrentPrice)
    const handleShowCurrentPrice = () => {
        setShowCurrentPrice(prev => !prev)
        setShowCurrentPriceBtn(prev => !prev)
    }
    const [showHistoricalPriceBtn, setShowHistoricalPriceBtn] = useState(showHistoricalPrice)
    const handleShowHistoricalPrice = () => {
        setShowHistoricalPrice(prev => !prev)
        setShowHistoricalPriceBtn(prev => !prev)
    }
    const [showYPCBtn, setShowYPCBtn] = useState(showYPC)
    const handleShowYPC = () => {
        setShowYPC(prev => !prev)
        setShowYPCBtn(prev => !prev)
    }
    const [show52wkHighBtn, setShow52wkHighBtn] = useState(show52wkHigh)
    const handleShow52wkHigh = () => {
        setShow52wkHigh(prev => !prev)
        setShow52wkHighBtn(prev => !prev)
    }
    const [show52wkLowBtn, setShow52wkLowBtn] = useState(show52wkLow)
    const handleShow52wkLow = () => {
        setShow52wkLow(prev => !prev)
        setShow52wkLowBtn(prev => !prev)
    }
    const [showCurrPr52kwkBtn, setShowCurrPr52kwkBtn] = useState(showCurrPr52kwk)
    const handleShowCurrPr52kwk = () => {
        setShowCurrPr52kwk(prev => !prev)
        setShowCurrPr52kwkBtn(prev => !prev)
    }
    const [showDivYieldBtn, setShowDivYieldBtn] = useState(showDivYield)
    const handleShowDivYield = () => {
        setShowDivYield(prev => !prev)
        setShowDivYieldBtn(prev => !prev)
    }
    const [showCurrDivBtn, setShowCurrDivBtn] = useState(showCurrDiv)
    const handleShowCurrDiv = () => {
        setShowCurrDiv(prev => !prev)
        setShowCurrDivBtn(prev => !prev)
    }
    const [showHistDivBtn, setShowHistDivBtn] = useState(showHistDiv)
    const handleShowHistDiv = () => {
        setShowHistDiv(prev => !prev)
        setShowHistDivBtn(prev => !prev)
    }
    const [showTotalDivGrowthBtn, setShowTotalDivGrowthBtn] = useState(showTotalDivGrowth)
    const handleShowTotalDivGrowth = () => {
        setShowTotalDivGrowth(prev => !prev)
        setShowTotalDivGrowthBtn(prev => !prev)
    }
    const [showYearlyDivGrowthBtn, setShowYearlyDivGrowthBtn] = useState(showYearlyDivGrowth)
    const handleShowYearlyDivGrowth = () => {
        setShowYearlyDivGrowth(prev => !prev)
        setShowYearlyDivGrowthBtn(prev => !prev)
    }
    const [showEPSBtn, setShowEPSBtn] = useState(showEPS)
    const handleShowEPS = () => {
        setShowEPS(prev => !prev)
        setShowEPSBtn(prev => !prev)
    }
    const [showPRBtn, setShowPRBtn] = useState(showPR)
    const handleShowPR = () => {
        setShowPR(prev => !prev)
        setShowPRBtn(prev => !prev)
    }
    const [showPerformanceBtn, setShowPerformanceBtn] = useState(showPerformance)
    const handleShowPerformance = () => {
        setShowPerformance(prev => !prev)
        setShowPerformanceBtn(prev => !prev)
    }
    const [showColorBtn, setShowColorBtn] = useState(showColors)
    const handleShowColors = () => {
        setShowColors(prev => !prev)
        setShowColorBtn(prev => !prev)
    }

    return (
        <section className="screener-settings-modal-container">
            <h2 className="modal-title">Settings</h2>
            <div className="screener-settings-color-btn-container">
            <button className={`screener-settings-modal-btn ${showColorBtn ? 'label-shown' : 'label-not-shown'}`}
            onClick={handleShowColors}>
                Show Colors
            </button>
            </div>

            <div className="screener-settings-btn-container">
                <div className="screener-settings-btn-column">
                    <button
                        className={`screener-settings-modal-btn ${showTypeBtn ? 'label-shown' : 'label-not-shown'}`}
                        onClick={handleShowType}>
                        Type
                    </button>
                    <button
                        className={`screener-settings-modal-btn ${showTrPEBtn ? 'label-shown' : 'label-not-shown'}`}
                        onClick={() => handleShowTrPE()}>
                        Trailing P/E
                    </button>
                    <button
                        className={`screener-settings-modal-btn ${showFwPEBtn ? 'label-shown' : 'label-not-shown'}`}
                        onClick={() => handleShowFwPE()}>
                        Forward P/E
                    </button>
                    <button
                        className={`screener-settings-modal-btn ${showCurrentPriceBtn ? 'label-shown' : 'label-not-shown'}`}
                        onClick={() => handleShowCurrentPrice()}>
                        Current Price
                    </button>
                    <button
                        className={`screener-settings-modal-btn ${showHistoricalPriceBtn ? 'label-shown' : 'label-not-shown'}`}
                        onClick={() => handleShowHistoricalPrice()}>
                        Historical Price
                    </button>
                    <button
                        className={`screener-settings-modal-btn ${showYPCBtn ? 'label-shown' : 'label-not-shown'}`}
                        onClick={() => handleShowYPC()}>
                        Yearly Price Change
                    </button>
                    <button
                        className={`screener-settings-modal-btn ${show52wkHighBtn ? 'label-shown' : 'label-not-shown'}`}
                        onClick={() => handleShow52wkHigh()}
                    >
                        52Wk High
                    </button>
                    <button
                        className={`screener-settings-modal-btn ${show52wkLowBtn ? 'label-shown' : 'label-not-shown'}`}
                        onClick={() => handleShow52wkLow()}
                    >
                        52Wk Low
                    </button>
                    <button
                        className={`screener-settings-modal-btn ${showCurrPr52kwkBtn ? 'label-shown' : 'label-not-shown'}`}
                        onClick={() => handleShowCurrPr52kwk()}
                    >
                        Current Price in 52Wk
                    </button>
                </div>

                <div className="screener-settings-btn-column">
                    <button
                        className={`screener-settings-modal-btn ${showDivYieldBtn ? 'label-shown' : 'label-not-shown'}`}
                        onClick={() => handleShowDivYield()}>
                        Dividend Yield
                    </button>
                    <button
                        className={`screener-settings-modal-btn ${showCurrDivBtn ? 'label-shown' : 'label-not-shown'}`}
                        onClick={() => handleShowCurrDiv()}>
                        Current Dividend
                    </button>
                    <button
                        className={`screener-settings-modal-btn ${showHistDivBtn ? 'label-shown' : 'label-not-shown'}`}
                        onClick={() => handleShowHistDiv()}>
                        Historical Dividend
                    </button>
                    <button
                        className={`screener-settings-modal-btn ${showTotalDivGrowthBtn ? 'label-shown' : 'label-not-shown'}`}
                        onClick={() => handleShowTotalDivGrowth()}>
                        Total Dividend Growth
                    </button>
                    <button
                        className={`screener-settings-modal-btn ${showYearlyDivGrowthBtn ? 'label-shown' : 'label-not-shown'}`}
                        onClick={() => handleShowYearlyDivGrowth()}>
                        Yearly Dividend Growth
                    </button>
                    <button
                        className={`screener-settings-modal-btn ${showEPSBtn ? 'label-shown' : 'label-not-shown'}`}
                        onClick={() => handleShowEPS()}>
                        Earning Per Share
                    </button>
                    <button
                        className={`screener-settings-modal-btn ${showPRBtn ? 'label-shown' : 'label-not-shown'}`}
                        onClick={() => handleShowPR()}>
                        Payout Ratio
                    </button>
                    <button
                        className={`screener-settings-modal-btn ${showPerformanceBtn ? 'label-shown' : 'label-not-shown'}`}
                        onClick={() => handleShowPerformance()}>
                        Performance
                    </button>
                </div>

            </div>
        </section>
    )
}