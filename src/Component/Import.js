import React from "react";
import { useState } from "react";
import Papa from "papaparse";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

// Allowed extensions for input file
const allowedExtensions = ["csv"];

const Import = (props) => {
  // This state will store the parsed data
  const [data, setData] = useState([]);

  // It state will contain the error when
  // correct file extension is not used
  const [error, setError] = useState("");

  // It will store the file uploaded by the user
  const [file, setFile] = useState("");

  // This function will be called when
  // the file input changes
  const handleFileChange = (e) => {
    setError("");

    // Check if user has entered the file
    if (e.target.files.length) {
      const inputFile = e.target.files[0];

      // Check the file extensions, if it not
      // included in the allowed extensions
      // we show the error
      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please input a csv file");
        return;
      }

      // If input type is correct set the state
      setFile(inputFile);
    }
  };
  const handleParse = () => {
    // If user clicks the parse button without
    // a file we show a error
    if (!file) return setError("Enter a valid file");

    // Initialize a reader which allows user
    // to read any file or blob.
    const reader = new FileReader();

    // Event listener on reader when the file
    // loads, we parse it and set the data.
    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, { header: true });
      const parsedData = csv?.data;
      setData(parsedData);
      //console.log("log data <>>>>>>>>>>>>>>>>>>><<<<<<<<<<<", data);
      if(parsedData.length > 0) {
        alert('Import success')
      } else {
        alert('Empty file')
      }
    };
    reader.readAsText(file);
  };

  console.log(">>>>>>>>>>data import ", data);
  if(data.length !== 0) {
    props.propFunc(data);
  }

  //modal pop up
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow} className={'btn-success'}>
        Import
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Enter CSV File</Modal.Title>
        </Modal.Header>
        <Modal.Body>    
            <input
                onChange={handleFileChange}
                id="csvInput"
                name="file"
                type="File"
            />
            <div>
                <button onClick={handleParse}>Import File</button>
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} className={'btn btn-primary'}>
            Close
          </Button>
          {/* <Button variant="primary" onClick={() => {handleClose(); handleParse()}}>
            Save Changes
          </Button> */}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Import;
