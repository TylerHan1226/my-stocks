
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loading from "../Loading/Loading";

import "./LandingPage.css";
import { NavLink, useNavigate } from "react-router-dom";
import { getOneStockThunk } from "../../redux/stock";
import { getAllMyListsThunk } from "../../redux/list";



export default function LandingPage() {
  const nav = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(state => state.session.user)
  const stock = useSelector(state => state.stocks)

  // useEffect(() => {
  //   if (!user) {
  //     nav('/')
  //   }
  //   dispatch(getOneStockThunk("AAPL"))
  // }, [dispatch])
  useEffect(() => {
    dispatch(getAllMyListsThunk())
  }, [dispatch])

  return (
    <section className="page-container">
      <h1>Landing</h1>
    </section>
  );
}
