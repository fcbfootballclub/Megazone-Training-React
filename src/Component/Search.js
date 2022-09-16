import React, { useState } from "react";
import List from "./List";

const Search = (props) => {

  return (
    <span>
      <input type="text" class="form-control rounded search-custom" placeholder="Search"
      name="searchTerm"
      value={props.searchTerm}
      onChange={props.func}/>
      <button className="btn" onClick={props.func2}>Clear</button>
    </span>
  );
};

export default Search;
