import './Main.css';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import './Card.css'
function Card(props) {
    const [style, setStyle] = useState("sections")
  
    useEffect(() => {
        if(props.selector){
            setStyle("selected")
        }
        else{
            setStyle("sections")
        }
    }, [props.selector]);

    return (
        <div style={{padding: "2px"}} className={style} onClick={() => {props.selected(props.index)}}>
            {/* <div style={{marginLeft: "10px"}}>{props.info._id}</div> */}
            <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "20px"}}>
                <div><b>{props.info.name}</b></div>
            </div>
            <div style={{marginLeft: "10px"}}><b>PRICE:</b> {props.info.price}</div>
            <div style={{marginLeft: "10px"}}><b>DESCRIPTION:</b> {props.info.description}</div>
            <div style={{marginLeft: "10px"}}><b>QUANTITY:</b> {props.info.quantity}</div>
            <div style={{marginLeft: "10px"}}><b>BRAND:</b> {props.info.brand}</div>
            <div style={{marginLeft: "10px", marginBottom: "10px"}}><b>TAGS:</b> {props.info.tags.join(", ")}</div>
        </div>
    );
  }
  
  export default Card;
  