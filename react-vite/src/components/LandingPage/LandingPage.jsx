
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loading from "../Loading/Loading";

import "./LandingPage.css";
import { NavLink, useNavigate } from "react-router-dom";
import { getStockThunk } from "../../redux/stock";


export default function LandingPage() {
  const nav = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(state => state.session.user)
  // const stock = useSelector()

  useEffect(() => {
    dispatch(getStockThunk("AAPL"))
  }, [dispatch])

  return (
    <section className="page-container">
      <h1>Landing</h1>
    </section>
  );
}
