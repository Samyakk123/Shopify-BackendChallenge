import "./Main.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";
import Modal from "react-modal";
import Button from "@material-ui/core/Button";

function Main() {
  const [display, setDisplay] = useState([]);
  const [filteredDisplay, setFilteredDisplay] = useState([]);
  const [selected, setSelected] = useState(-1);
  const [modified, setModified] = useState(false);
  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);

  const [edit, setEdit] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [desc, setDesc] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [brand, setBrand] = useState("");
  const [tag, setTag] = useState("");

  const [priceFilter, setPriceFilter] = useState("gt");
  const [priceFilter2, setPriceFilter2] = useState("gt");
  const [submitted, setSubmitted] = useState(false);
  const [filter, setFilter] = useState({
    name: "",
    price: 0,
    description: "",
    quantity: 0,
    brand: "",
    tags: "",
  });

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "black",
    },
  };

  Modal.setAppElement("#root");

  function openModal(edit) {
    if (edit == false) {
      setName("");
      setPrice(0);
      setDesc("");
      setQuantity(0);
      setBrand("");
      setTag([]);
    } else {
      setName(display[selected].name);
      setPrice(display[selected].price);
      setDesc(display[selected].description);
      setQuantity(display[selected].quantity);
      setBrand(display[selected].brand);
      setTag(display[selected].tags.join(", "));
    }

    setModal(true);
  }

  function closeModal() {
    setModal(false);
  }

  async function submitHandler(e) {
    e.preventDefault();
    if (edit == false) {
      var response = await axios
        .post("/api/inventory/", {
          name: name,
          price: price,
          description: desc,
          quantity: quantity,
          brand: brand,
          tags: tag.replaceAll(" ", "").split(","),
        })
        .catch((e) => {
          alert(e);
        });
    } else {
      var response = await axios
        .put("/api/inventory/" + display[selected]._id, {
          name: name,
          price: price,
          description: desc,
          quantity: quantity,
          brand: brand,
          tags: tag.replaceAll(" ", "").split(","),
        })
        .catch((e) => {
          alert(e);
        });
    }
    setModified(!modified);

    // e.preventDefault();
  }

  useEffect(async () => {
    await axios
      .get("/api/inventory/")
      .then((res) => {
        setDisplay(res.data);
      })
      .catch((e) => {
        alert(e);
      });
  }, [modified]);

  async function deleteHandler() {
    if (selected != -1) {
      await axios
        .delete("/api/inventory/" + display[selected]._id)
        .catch((e) => {
          alert(e);
        });
      display.splice(selected, 1);
      setModified(!modified);
    }
  }

  async function newFilterHandler(e) {
    const JSONToSend = filter;
    JSONToSend["comparison1"] = "$" + JSONToSend["comparison1"];
    JSONToSend["comparison2"] = "$" + JSONToSend["comparison2"];
    const additionalString = filter.tags.replaceAll(" ", "").split(",");

    var query = "";
    for (var i = 0; i < additionalString.length; i++) {
      query +=
        i == additionalString.length - 1
          ? additionalString[i]
          : additionalString[i] + "&";
    }

    JSONToSend["tags"] = query;

    JSONToSend["comparison1"] = priceFilter;
    JSONToSend["comparison2"] = priceFilter2;

    const response = await axios.get(
      "/api/inventory/filter/" + JSON.stringify(JSONToSend)
    );
    setFilteredDisplay(response.data);
    e.preventDefault();
  }

  return (
    <div className="box">
      <div
        style={{
          color: "white",
          fontSize: "5rem",
          fontFamily: "font-family: Verdana, sans-serif",
        }}
      >
        INVENTORY MANAGEMENT SYSTEM
      </div>
      <div className="holder">
        {display.map((ele, index) => {
          return (
            <Card
              selected={() => setSelected(index)}
              info={ele}
              index={index}
              selector={selected == index}
            ></Card>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-evenly",
          flexDirection: "row",
          alignItems: "center",
          paddingTop: "20px",
        }}
      >
        <Button
          style={{
            borderRadius: 35,
            backgroundColor:
              selected == -1 ? "rgb(181, 181, 177)" : "rgb(140, 33, 25)",
            padding: "18px 36px",
            fontSize: "18px",
            color: selected == -1 ? "rgb(79, 79, 77)" : "white",
          }}
          variant="contained"
          disabled={selected == -1 ? true : false}
          onClick={() => {
            setEdit(true);
            openModal(true);
          }}
        >
          Edit item
        </Button>
        <Button
          style={{
            borderRadius: 35,
            backgroundColor: "rgb(140, 33, 25)",
            padding: "18px 36px",
            fontSize: "18px",
            color: "white",
          }}
          variant="contained"
          onClick={() => {
            setEdit(false);
            openModal(false);
          }}
        >
          Create new item
        </Button>
        <Button
          style={{
            borderRadius: 35,
            backgroundColor:
              selected == -1 ? "rgb(181, 181, 177)" : "rgb(140, 33, 25)",
            padding: "18px 36px",
            fontSize: "18px",
            color: selected == -1 ? "rgb(79, 79, 77)" : "white",
          }}
          variant="contained"
          disabled={selected == -1 ? true : false}
          onClick={deleteHandler}
        >
          Delete item
        </Button>
        <Button
          style={{
            borderRadius: 35,
            backgroundColor: "rgb(140, 33, 25)",
            padding: "18px 36px",
            fontSize: "18px",
            color: "white",
          }}
          variant="contained"
          onClick={() => setModal2(true)}
        >
          Filter by tag
        </Button>
      </div>
      <Modal
        isOpen={modal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Something"
      >
        <div style={{ color: "white" }}>
          PLEASE ENTER THE FOLLOWING INFORMATION
        </div>

        <form
          className="modalInfo"
          style={{ margin: "20px" }}
          onSubmit={submitHandler}
        >
          <label style={{ margin: "10px", color: "white" }}>
            Item Name:{" "}
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </label>
          <label style={{ margin: "10px", color: "white" }}>
            Price:{" "}
            <input
              type="number"
              name="price"
              onChange={(e) => {
                setPrice(e.target.value);
              }}
            />
          </label>
          <label style={{ margin: "10px", color: "white" }}>
            Description:{" "}
            <input
              type="text"
              name="Description"
              value={desc}
              onChange={(e) => {
                setDesc(e.target.value);
              }}
            />
          </label>

          <label style={{ margin: "10px", color: "white" }}>
            Quantity:{" "}
            <input
              type="number"
              name="Quantity"
              onChange={(e) => {
                setQuantity(e.target.value);
              }}
            />
          </label>
          <label style={{ margin: "10px", color: "white" }}>
            Brand:{" "}
            <input
              type="text"
              name="Brand"
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
              }}
            />
          </label>
          <label style={{ margin: "10px", color: "white" }}>
            Tags (Optional):{" "}
            <input
              type="text"
              name="Tags"
              value={tag}
              onChange={(e) => {
                setTag(e.target.value);
              }}
            />
          </label>

          <input
            style={{ margin: "20px" }}
            type="submit"
            value="Submit"
          ></input>
          <Button
            style={{ color: "white", backgroundColor: "rgb(140, 33, 25)" }}
            onClick={() => {
              closeModal();
            }}
          >
            Close
          </Button>
        </form>
      </Modal>

      <Modal
        isOpen={modal2}
        onRequestClose={() => {
          setModal2(false);
        }}
        style={customStyles}
        contentLabel="Something"
      >
        <div className="modalInfo">
          <div style={{ color: "white", fontSize: "2rem" }}>
            PLEASE ENTER FILTERS
          </div>

          <form>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ margin: "10px", color: "white" }}>
                Name:
                <input
                  style={{ margin: "10px" }}
                  type="text"
                  value={filter.name}
                  onChange={(e) => {
                    setFilter({ ...filter, name: e.target.value });
                  }}
                ></input>
              </label>
              <div>
                <label style={{ margin: "10px", color: "white" }}>
                  Price:{" "}
                  <input
                    style={{ margin: "10px" }}
                    type="number"
                    onChange={(e) => {
                      setFilter({ ...filter, price: e.target.value });
                    }}
                  ></input>
                </label>
                <label>
                  <select
                    style={{
                      backgroundColor: "black",
                      height: "2rem",
                      width: "5rem",
                      color: "white",
                    }}
                    value={priceFilter}
                    onChange={(e) => {
                      setPriceFilter(e.target.value);
                    }}
                  >
                    <option value="gt">{"greater than"}</option>
                    <option value="lt"> {"less than"}</option>
                    <option value="eq"> {"equal"}</option>
                  </select>
                </label>
              </div>
              <label style={{ margin: "10px", color: "white" }}>
                Description:{" "}
                <input
                  style={{ margin: "10px" }}
                  type="text"
                  value={filter.description}
                  onChange={(e) => {
                    setFilter({ ...filter, description: e.target.value });
                  }}
                ></input>
              </label>
              <div>
                <label style={{ margin: "10px", color: "white" }}>
                  Quantity:
                  <input
                    style={{ margin: "10px" }}
                    type="number"
                    value={filter.quantity}
                    onChange={(e) => {
                      setFilter({ ...filter, quantity: e.target.value });
                    }}
                  ></input>
                </label>
                <label>
                  <select
                    style={{
                      backgroundColor: "black",
                      height: "2rem",
                      width: "5rem",
                      color: "white",
                    }}
                    value={priceFilter2}
                    onChange={(e) => {
                      setPriceFilter2(e.target.value);
                    }}
                  >
                    <option value="gt">{"greater than"}</option>
                    <option value="lt"> {"less than"}</option>
                    <option value="eq"> {"equal"}</option>
                  </select>
                </label>
              </div>
              <label style={{ margin: "10px", color: "white" }}>
                Brand:
                <input
                  style={{ margin: "10px" }}
                  type="text"
                  value={filter.brand}
                  onChange={(e) => {
                    setFilter({ ...filter, brand: e.target.value });
                  }}
                ></input>
              </label>
              <label style={{ margin: "10px", color: "white" }}>
                Tags:{" "}
                <input
                  style={{ margin: "10px" }}
                  type="text"
                  value={filter.tags}
                  onChange={(e) => {
                    setFilter({ ...filter, tags: e.target.value });
                  }}
                ></input>
              </label>
            </div>
          </form>

          <Button
            style={{ color: "white", backgroundColor: "rgb(140, 33, 25)" }}
            onClick={(e) => {
              newFilterHandler(e);
              setSubmitted(true);
            }}
          >
            Submit
          </Button>
        </div>

        <div className="holder modalHolder">
          {submitted ? (
            filteredDisplay.length ? (
              filteredDisplay.map((ele, index) => {
                return (
                  <Card
                    selected={() => setSelected(index)}
                    info={ele}
                    index={index}
                    selector={selected == index}
                  ></Card>
                );
              })
            ) : (
              <div
                style={{
                  color: "white",
                  fontFamily: "font-family: Verdana, sans-serif",
                  fontSize: "4rem",
                }}
              >
                No Results.
              </div>
            )
          ) : (
            <div
              style={{
                color: "white",
                fontFamily: "font-family: Verdana, sans-serif",
                fontSize: "4rem",
              }}
            >
              FILTER RESULTS WILL SHOW UP HERE
            </div>
          )}
        </div>
        <Button
          style={{ color: "white", backgroundColor: "rgb(140, 33, 25)" }}
          onClick={() => {
            setModal2(false);
            setSubmitted(false);
          }}
        >
          Close
        </Button>
      </Modal>
    </div>
  );
}

export default Main;
