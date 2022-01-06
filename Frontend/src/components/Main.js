import './Main.css';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import Card from './Card';


function Main() {
    const [display, setDisplay] = useState([])
    const [selected, setSelected] = useState(-1)
    const [modified, setModified] = useState(false)


    useEffect(() => {
      axios.get("http://localhost:5000/api/inventory/").then((res) => {
        console.log("OVER HERE ", res.data)
        setDisplay(res.data)
      });
    }, [modified]);

    function selectHandler(index){
      console.log("NEW INDEX: ", index)
      setSelected(index);
    }


    


    async function deleteHandler(){
      if (selected != -1){
        await axios.delete("http://localhost:5000/api/inventory/" + display[selected]._id)
        display.splice(selected, 1)
        setModified(!modified)
      }
    }

    return (
      <div className="box">

        <div className="holder">
          {display.map((ele, index) => {
            return <Card selected={selectHandler} info={ele} index={index} selector={selected==index}></Card>
          })}
        </div>


        <button>Edit item</button>
        <button>Create new item</button>
        <button onClick={deleteHandler}>Delete item</button>
      </div>
    );
  }
  
  export default Main;
  