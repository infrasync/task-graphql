import { useRef, useState, useEffect } from "react";
import PassengerInput from "./PassengerInput";
import ListPassenger from "./ListPassenger";
import Header from "./Header";
import { useMutation, useSubscription } from "@apollo/client";
import toast, { Toaster } from "react-hot-toast";

import "reactjs-popup/dist/index.css";
import {
  ADD_PENGUNJUNG,
  UPDATE_PENGUNJUNG,
  REMOVE_PENGUNJUNG,
  SUBSCRIPTION_PENGUNJUNG,
} from "../graphql/gql";

function Home() {
  // NOTE: data for filtering
  const dataId = useRef();
  const [filteredData, setFilteredData] = useState(null);
  const [isFiltered, setFiltered] = useState(false);
  const [whatFiltered, setWhatFilter] = useState({
    type: "",
    value: null,
  });

  // NOTE: GraphQL mutation and subs
  const { data } = useSubscription(SUBSCRIPTION_PENGUNJUNG);
  const [addPengunjung] = useMutation(ADD_PENGUNJUNG);
  const [removePengunjung] = useMutation(REMOVE_PENGUNJUNG);
  const [updatingPengunjung] = useMutation(UPDATE_PENGUNJUNG);

  // NOTE: method for manipulate data
  const tambahPengunjung = (data) => {
    addPengunjung({
      variables: data,
    }).then((res) => {
      const { nama } = res.data.insert_anggota.returning[0];
      toast.success(`Data: ${nama} berhasil ditambahkan`);
    });
  };

  const updatePengunjung = (data) => {
    updatingPengunjung({
      variables: {
        id: data.id,
        _set: data,
      },
    }).then((res) => {
      const nama = res.data.update_anggota_by_pk.nama;
      toast.success(`Data : ${nama} berhasil diupdate`);
    });
  };

  const hapusPengunjung = (item) => {
    removePengunjung({
      variables: {
        id: item,
      },
    }).then((res) => {
      const nama = res.data.delete_anggota_by_pk.nama;
      toast.success(`Data : ${nama} berhasil dihapus`);
    });
  };

  // NOTE: method for filtering data
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
          data={filteredData.sort((a, b) => a.id - b.id)}
          hapusPengunjung={hapusPengunjung}
          updatePengunjung={updatePengunjung}
        />
      ) : (
        <ListPassenger
          data={data?.anggota.sort((a, b) => a.id - b.id)}
          hapusPengunjung={hapusPengunjung}
          updatePengunjung={updatePengunjung}
        />
      )}
      <PassengerInput tambahPengunjung={tambahPengunjung} />
      <Toaster />
    </div>
  );
}

export default Home;
