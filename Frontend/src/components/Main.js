import './Main.css';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import Card from './Card';
import Modal from 'react-modal';

function Main() {
    const [display, setDisplay] = useState([])
    const [filteredDisplay, setFilteredDisplay] = useState([])
    const [selected, setSelected] = useState(-1)
    const [modified, setModified] = useState(false)
    const [modal, setModal] = useState(false)
    const [modal2, setModal2] = useState(false)


    const [edit, setEdit] = useState(false)

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [desc, setDesc] = useState('')
    const [quantity, setQuantity] = useState(0)    
    const [brand, setBrand] = useState('')
    const [tag, setTag] = useState([]) 

    const [filter, setFilter] = useState("")

    const customStyles = {
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
      },
    };

    Modal.setAppElement('#root')

    function openModal(edit) {

      if(edit==false){
        setName('')
        setPrice(0)
        setDesc('')
        setQuantity(0)
        setBrand('')
        setTag([])
      }else{
        setName(display[selected].name)
        setPrice(display[selected].price)
        setDesc(display[selected].description)
        setQuantity(display[selected].quantity)
        setBrand(display[selected].brand)
        setTag(display[selected].tags.join(", "))
      }

      setModal(true);
    }

    function closeModal(){ 
      setModal(false);
    }
  
    
    async function submitHandler(e){
      if (edit == false){
        var response = await axios.post("http://localhost:5000/api/inventory/", {
          name: name, 
          price: price,
          description: desc,
          quantity: quantity,
          brand: brand,
          tags: tag.replaceAll(" ", "").split(",")
        })
      }
      else{
        var response = await axios.put("http://localhost:5000/api/inventory/" + display[selected]._id, {
          name: name, 
          price: price,
          description: desc,
          quantity: quantity,
          brand: brand,
          tags: tag.replaceAll(" ", "").split(",")
        })
      }
      setModified(!modified)
      console.log("I AM THE RESPONSE: ", response)
      e.preventDefault();

      // e.preventDefault();
    }


    useEffect(() => {
      axios.get("http://localhost:5000/api/inventory/").then((res) => {
        setDisplay(res.data)
      });
    }, [modified]);


    async function deleteHandler(){
      if (selected != -1){
        await axios.delete("http://localhost:5000/api/inventory/" + display[selected]._id)
        display.splice(selected, 1)
        setModified(!modified)
      }
    }


    async function filterHandler(e) {

      console.log("BEFORE EVERYTHING: ", filter.replaceAll(" ", "").split(","))
      const additionalString = filter.replaceAll(" ", "").split(",")
      for (const x of additionalString){
        var query = "/" + x
      }
      const response = await axios.get("http://localhost:5000/api/inventory/filter" + query);
      console.log("OVER HERE: ", "http://localhost:5000/api/inventory/filter" + query)
      setFilteredDisplay(response.data)
      console.log(response.data)
      e.preventDefault();
    }



    return (
      <div className="box">

        <div className="holder">
          {display.map((ele, index) => {
            return <Card selected={() => setSelected(index)} info={ele} index={index} selector={selected==index}></Card>
          })}
        </div>
        
        <div style={{display: "flex", width: "100%", justifyContent: "space-evenly", flexDirection: "row", alignItems:"center"}}>
          <button disabled={selected == -1 ? true : false} onClick={() => {setEdit(true);openModal(true);}}>Edit item</button>
          <button onClick={() => {setEdit(false);openModal(false);}}>Create new item</button>
          <button disabled={selected == -1 ? true : false} onClick={deleteHandler}>Delete item</button>
          <button onClick={() => setModal2(true)}>Filter by tag</button>
        </div>
        <Modal isOpen={modal} onRequestClose={closeModal} style={customStyles} contentLabel='Something'>

          <div className="modalInfo">
            <div style={{color: "white"}}>PLEASE ENTER THE FOLLOWING INFORMATION</div>
            
            <form className="modalInfo" style={{margin: "20px"}} onSubmit={submitHandler}>
              <label style={{margin: "10px", color: "white"}}>Item Name: <input type="text" name="name" value={name} onChange={(e) => {setName(e.target.value)}} /></label>
              <label style={{margin: "10px", color: "white"}}>Price: <input type="number" name="price" onChange={(e) => {setPrice(e.target.value)}}/></label>
              <label style={{margin: "10px", color: "white"}}>Description: <input type="text" name="Description" value={desc} onChange={(e) => {setDesc(e.target.value)}}/></label>
              <label style={{margin: "10px", color: "white"}}>Quantity: <input type="number" name="Quantity"  onChange={(e) => {setQuantity(e.target.value)}}/></label>
              <label style={{margin: "10px", color: "white"}}>Brand: <input type="text" name="Brand" value={brand} onChange={(e) => {setBrand(e.target.value)}}/></label>
              <label style={{margin: "10px", color: "white"}}>Tags (Optional): <input type="text" name="Tags" value={tag} onChange={(e) => {setTag(e.target.value)}}/></label>

              <input style={{margin: "20px"}} type="submit" value="Submit"></input>
              <button onClick={() => {closeModal()}}>Close</button>
            </form>
            </div>
        </Modal>
        
        
        <Modal isOpen={modal2} onRequestClose={() => {setModal2(false)}} style={customStyles} contentLabel='Something'>
          <div>PLEASE ENTER FILTERS, SEPERATED BY COMMAS (NO SPACES IN BETWEEN)</div>

          <form>
            <label style={{margin: "10px"}}>Filter:<input style={{margin: "20px"}} type="text" value={filter} onChange={(e) => {setFilter(e.target.value)}} ></input></label>
          </form>

          <button onClick={filterHandler}>Submit</button>

          <div className="holder">
          {filteredDisplay.map((ele, index) => {
            return <Card selected={() => setSelected(index)} info={ele} index={index} selector={selected==index}></Card>
          })}
          </div>
          <button onClick={() => {setModal2(false)}}>Close</button>
        </Modal>
      </div>
    );
  }
  
  export default Main;
  