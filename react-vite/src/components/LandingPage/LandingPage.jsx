import "./LandingPage.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllMyListsThunk } from "../../redux/list";



export default function LandingPage() {
  const nav = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(state => state.session.user)
  const stocks = useSelector(state => state.stocks)
  const lists = useSelector(state => state.lists?.My_Lists)

  console.log('lists ==>', lists)
  console.log('stocks ==>', stocks)
  console.log('nav ==>', nav)
  
  useEffect(() => {
    dispatch(getAllMyListsThunk())
  }, [dispatch, user])

  return (
    <section className="page-container">
      <section className="page-content-container">
        <h1 className="page-title">Landing</h1>
        {lists?.map((eachList) => (
          <div key={eachList?.id}>
            {/* <p>{eachList?.list_name}</p> */}
            <p>{eachList?.list_name}: {eachList?.stock_symbol}</p>
          </div>
        ))}
      </section>

    </section>
  );
}
