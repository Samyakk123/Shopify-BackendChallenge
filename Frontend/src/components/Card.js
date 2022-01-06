import './Main.css';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import './Card.css'
function Card(props) {
    const [style, setStyle] = useState("sections")

    // const [display, setDisplay] = useState([])

    // useEffect(() => {
    //   axios.get("http://localhost:5000/api/inventory/").then((res) => {
    //     console.log("OVER HERE ", res.data)
    //     setDisplay(res.data)
    //   });
    // }, []);
  
    useEffect(() => {
        console.log("HEREEEEE : ", props.selector)
        if(props.selector){
            setStyle("selected")
        }
        else{
            setStyle("sections")
        }
    }, [props.selector]);

    return (
        <div style={{padding: "10px"}} className={style} onClick={() => {props.selected(props.index)}}>
            <p>{props.info._id}</p>
            <p>{props.info.name}</p>
            <p>{props.info.price}</p>
            <p>{props.info.description}</p>
            <p>{props.info.quantity}</p>
            <p>{props.info.brand}</p>
            <p>{props.info.tags}</p>
        </div>
    );
  }
  
  export default Card;
  