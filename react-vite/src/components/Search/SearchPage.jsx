import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { useModal } from "../../context/Modal";
import Loading from "../Loading/Loading";
import { getOneStockThunk } from "../../redux/stock";
import AddListModal from "../MyList/AddListModal";
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(annotationPlugin);
import { makeChart } from "../Helper/Helper";

export default function SearchPage() {
    const nav = useNavigate();
    const dispatch = useDispatch();
    const { searchInput } = useParams();
    const user = useSelector(state => state.session.user);
    const stock = useSelector(state => state.stocks);
    const [isLoading, setIsLoading] = useState(true);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const stockName = stock?.name;
    const stockSymbol = stock?.ticker;
    const stockCurrentPrice = stock?.currentPrice?.toFixed(2);
    const stockOpenPrice = stock?.info?.previousClose?.toFixed(2);
    const [chartPeriod, setChartPeriod] = useState('historical_data_1d');
    const { setModalContent } = useModal();
    console.log(setChartPeriod)
    const handleOpenModal = () => {
        setModalContent(<AddListModal stockSymbol={stockSymbol} />);
    };

    const handleChartPeriod = () => {
        console.log('handleChartPeriod clicked!');
    };

    useEffect(() => {
        if (!user) {
            return nav('/');
        }
        dispatch(getOneStockThunk(searchInput))
            .then(() => setIsLoading(false));
        window.scrollTo(0, 0);
    }, [nav, dispatch, searchInput, user]);

    const isGreen = stockCurrentPrice > stockOpenPrice ? true : false;

    useEffect(() => {
        if (stock?.historical_data_1d && chartRef.current) {
            console.log('Creating chart with data:', stock.historical_data_1d);
            makeChart(chartPeriod, stock, chartInstance, chartRef, isGreen, setIsLoading);
        }
    }, [chartPeriod, stock, chartInstance, chartRef, isGreen]);

    if (isLoading) {
        return <Loading />;
    }

    console.log('stock ==>', stock);

    return (
        <section className="page-container">
            <section className="page-content-container">
                <h1 className="page-title">{`${stockName} (${stockSymbol})`}</h1>
                <section className="search-info-container">
                    <div className="stock-page-action-btn-container">
                        <button
                            className="stock-page-action-btn"
                            onClick={handleOpenModal}>
                            ADD TO LIST
                        </button>
                    </div>
                    <div className="stock-chart-container">
                        <canvas className="stock-sparkline-chart" ref={chartRef}></canvas>
                        <div className="stock-chart-btn-container">
                            <button className={`stock-chart-btns ${isGreen ? 'is-green' : 'is-red'}`}
                                onClick={handleChartPeriod}>
                                1D
                            </button>
                            <button className={`stock-chart-btns ${isGreen ? 'is-green' : 'is-red'}`}
                                onClick={handleChartPeriod}>
                                1W
                            </button>
                            <button className={`stock-chart-btns ${isGreen ? 'is-green' : 'is-red'}`}
                                onClick={handleChartPeriod}>
                                1M
                            </button>
                            <button className={`stock-chart-btns ${isGreen ? 'is-green' : 'is-red'}`}
                                onClick={handleChartPeriod}>
                                3M
                            </button>
                            <button className={`stock-chart-btns ${isGreen ? 'is-green' : 'is-red'}`}
                                onClick={handleChartPeriod}>
                                1Y
                            </button>
                            <button className={`stock-chart-btns ${isGreen ? 'is-green' : 'is-red'}`}
                                onClick={handleChartPeriod}>
                                5Y
                            </button>
                            <button className={`stock-chart-btns ${isGreen ? 'is-green' : 'is-red'}`}
                                onClick={handleChartPeriod}>
                                10Y
                            </button>
                            <button className={`stock-chart-btns ${isGreen ? 'is-green' : 'is-red'}`}
                                onClick={handleChartPeriod}>
                                YTD
                            </button>
                        </div>
                    </div>
                </section>
            </section>
        </section>
    );
}
