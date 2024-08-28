
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loading from "../Loading/Loading";

import "./LandingPage.css";
import { NavLink, useNavigate } from "react-router-dom";



export default function LandingPage() {
  const nav = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(state => state.session.user)
  // const stock = useSelector()

  return (
    <section className="page-container">
      <h1>Landing</h1>
    </section>
  );
}
