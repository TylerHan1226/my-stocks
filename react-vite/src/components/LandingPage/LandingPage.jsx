
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
  const lists = useSelector(state => state.lists?.My_Lists)

  console.log('lists ==>', lists)
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
      <section className="page-content-container">
        <h1 className="page-title">Landing</h1>
        {lists?.map((eachList) => (
          <div key={eachList?.id}>
            {/* <p>{eachList?.list_name}</p> */}
            <p>{eachList?.stock_symbol}</p>
          </div>
        ))}
      </section>

    </section>
  );
}
