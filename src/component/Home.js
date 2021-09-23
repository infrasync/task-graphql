import { useRef, useState, useEffect } from "react";
import PassengerInput from "./PassengerInput";
import ListPassenger from "./ListPassenger";
import Header from "./Header";
import { useMutation, useSubscription } from "@apollo/client";

import "reactjs-popup/dist/index.css";
import {
  ADD_PENGUNJUNG,
  UPDATE_PENGUNJUNG,
  REMOVE_PENGUNJUNG,
  SUBSCRIPTION_PENGUNJUNG,
} from "../graphql/gql";

function Home() {
  const dataId = useRef();
  const [filteredData, setFilteredData] = useState(null);
  const [isFiltered, setFiltered] = useState(false);
  const [whatFiltered, setWhatFilter] = useState({
    type: "",
    value: null,
  });
  const { data } = useSubscription(SUBSCRIPTION_PENGUNJUNG);

  const [addPengunjung] = useMutation(ADD_PENGUNJUNG);
  const [removePengunjung] = useMutation(REMOVE_PENGUNJUNG);
  const [updatingPengunjung] = useMutation(UPDATE_PENGUNJUNG);
  const tambahPengunjung = (data) => {
    addPengunjung({
      variables: data,
    });
  };

  const updatePengunjung = (data) => {
    updatingPengunjung({
      variables: {
        id: data.id,
        _set: data,
      },
    });
  };

  const hapusPengunjung = (item) => {
    removePengunjung({
      variables: {
        id: item,
      },
    });
  };

  function filteringData({ type, value }) {
    const filteredData = data.anggota.filter((item) => {
      return item[type] === value;
    });
    return filteredData;
  }

  function handleQueryById() {
    const id = parseInt(dataId.current.value);
    const typesData = { type: "id", value: id };
    if (id < 1 || isNaN(id)) {
      return alert("nilai id harus lebih dari 1 dan tidak boleh kosong!");
    }
    setWhatFilter(typesData);
    const newFiltered = filteringData(typesData);
    setFilteredData(newFiltered);
    setFiltered(true);
  }

  const handleFilterGender = (e) => {
    const typesData = { type: "jenisKelamin", value: e.target.value };
    setWhatFilter(typesData);
    const newFiltered = filteringData(typesData);
    setFilteredData(newFiltered);
    setFiltered(true);
  };

  useEffect(() => {
    if (isFiltered) {
      const newFiltered = filteringData(whatFiltered);
      setFilteredData(newFiltered);
      setFiltered(true);
    }
  }, [data]);

  return (
    <div>
      <Header />
      <div className="search_id">
        <input type="text" ref={dataId} placeHolder="Search by Id..." />
        <button onClick={handleQueryById}>Search</button>
        <div className="filter_gender">
          Filter gender :
          <label>
            <input
              name="gender"
              type="radio"
              value="Pria"
              onChange={handleFilterGender}
            />
            Pria
          </label>
          <label>
            <input
              name="gender"
              type="radio"
              value="Wanita"
              onChange={handleFilterGender}
            />
            Wanita
          </label>
        </div>
      </div>
      <button onClick={() => setFiltered(false)}>View All Data </button>
      {isFiltered ? (
        <ListPassenger
          data={filteredData}
          hapusPengunjung={hapusPengunjung}
          updatePengunjung={updatePengunjung}
        />
      ) : (
        <ListPassenger
          data={data?.anggota}
          hapusPengunjung={hapusPengunjung}
          updatePengunjung={updatePengunjung}
        />
      )}
      <PassengerInput tambahPengunjung={tambahPengunjung} />
    </div>
  );
}

export default Home;
