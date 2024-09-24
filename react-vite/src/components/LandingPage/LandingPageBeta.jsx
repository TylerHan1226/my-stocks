import "./LandingPage.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState, useMemo } from "react";
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { makeChartSmall } from "../Helper/Helper";
import { GoTriangleUp, GoTriangleDown } from "react-icons/go";
import Loading from "../Loading/Loading";
import { NavLink } from "react-router-dom";
import { getAllMyListsThunk, getAllMyStocksThunk } from "../../redux/list";
import { getMultipleStocksThunk } from "../../redux/stock";
import { getMarketNewsThunk, getMyNewsThunk } from "../../redux/news";

Chart.register(annotationPlugin)

export default function LandingPageBeta() {

    return (
        <h2>Landing Page Beta</h2>
    )
}