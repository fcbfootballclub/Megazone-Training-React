import React, { useState } from "react";

const Add = (props) => {
  const [billionaire, setBillionaire] = useState({
    id: 0,
    fullName: "",
    assets: 0,
    age: 0,
  });

  const handleOnChange = (e) => {
    setBillionaire((prevState) => {
      const { name, value, type, checked } = e.target;
      return {
        ...prevState,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  const add = (e) => {
    e.preventDefault();
    console.log("log billionaire ", billionaire);
    props.add(billionaire);
  };

  return (
    <div className="add-component">
      <form onSubmit={add}>
        <input
          type="hidden"
          class="form-control"
          name={"id"}
          placeholder={"Id"}
          onChange={handleOnChange}
        />
        <input
          type="text"
          class="form-control"
          name={"fullName"}
          placeholder={"Full name"}
          onChange={handleOnChange}
        />
        <input
          type="number"
          class="form-control"
          name={"assets"}
          placeholder={"Assets"}
          onChange={handleOnChange}
        />

        <input
          type="number"
          class="form-control"
          name={"age"}
          placeholder={"Age"}
          onChange={handleOnChange}
        />
        <div>
          <button type="submit" class="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add;
