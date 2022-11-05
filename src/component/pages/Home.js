import React, { useRef, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import "./Home.css";

const Home = () => {
  const [users, setUsers] = useState([]);
  const inputRef = useRef();
  let cancelToken;

  const resetInput = () => {
    inputRef.current.value = "";

    // adding focus back after search so that user can continiously search -> user
    inputRef.current.focus();
  };

  const formatAndSave = (userData) => {
    const formattedData = userData.sort((a, b) => b.followers - a.followers);
    setUsers(formattedData);
    resetInput();
  };

  const fetchUsers = async (value) => {
    if (!value.length) {
      // no API call for empty input
      return;
    }
    try {
      // handling previos request axios way to debounce
      if (typeof cancelToken != typeof undefined) {
        cancelToken.cancel(" cancelling the prev request!!");
      }

      cancelToken = axios.CancelToken.source();

      setTimeout(async () => {
        const response = await axios.get(
          `https://api.github.com/users/${value}`,
          {
            cancelToken: cancelToken.token,
          }
        );
        const newData = {
          name: response.data.name,
          followers: response.data.followers,
        };
        formatAndSave([...users, newData]);
      }, 1000)

    } catch (error) {
    }
  };

  const handleQueryInput = async (e) => {
    let value = e.target.value;
    value = value.replaceAll(" ", "");
    setTimeout(async () => {
      await fetchUsers(value);
    }, 2000)
  };

  return (
    <div className="container">
      <div className="search-bar">
        <input
          ref={inputRef}
          onChange={handleQueryInput}
          placeholder="search user..."
        />
        <button className="resetButton" onClick={() => setUsers([])}>
          Reset Table
        </button>
      </div>
      <div className="table">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Followers</th>
            </tr>
          </thead>
          {users.length ? (
            <tbody>
              {users.map((ele, index) => (
                <tr>
                  <td>{index}</td>
                  <td>{ele.name}</td>
                  <td>{ele.followers}</td>
                </tr>
              ))}
            </tbody>
          ) : (
            <span>No Data !!!</span>
          )}
        </Table>
      </div>
    </div>
  );
};

export default Home;
