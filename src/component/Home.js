import { useEffect, useState, useRef } from "react";
import PassengerInput from "./PassengerInput";
import ListPassenger from "./ListPassenger";
import Header from "./Header";
import { useQuery, useLazyQuery, gql, useMutation } from "@apollo/client";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const ADD_PENGUNJUNG = gql`
  mutation MyMutation($nama: name!, $umur: Int!, $jenisKelamin: String!) {
    insert_anggota(
      objects: { nama: $nama, umur: $umur, jenisKelamin: $jenisKelamin }
    ) {
      returning {
        nama
        umur
        jenisKelamin
      }
    }
  }
`;

const REMOVE_PENGUNJUNG = gql`
  mutation MyMutation($id: Int!) {
    delete_anggota_by_pk(id: $id) {
      id
      nama
    }
  }
`;

const UPDATE_PENGUNJUNG = gql`
  mutation MyMutation($id: Int!, $_set: anggota_set_input = {}) {
    update_anggota_by_pk(pk_columns: { id: $id }, _set: $_set) {
      nama
      id
    }
  }
`;

const queryData = gql`
  query MyQuery {
    anggota {
      id
      nama
      umur
      jenisKelamin
    }
  }
`;
const queryDataById = gql`
  query MyQuery($_id: Int!) {
    anggota(where: { id: { _eq: $_id } }) {
      id
      nama
      umur
      jenisKelamin
    }
  }
`;
const queryDataByGender = gql`
  query MyQuery($_jenisKelamin: String!) {
    anggota(where: { jenisKelamin: { _eq: $_jenisKelamin } }) {
      id
      nama
      umur
      jenisKelamin
    }
  }
`;

function Home() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const dataId = useRef();

  const [
    getDataResult,
    { data: dataResult, loading: loadingResult, refetch: refetchData },
  ] = useLazyQuery(queryData);
  const [getDataById, { data: dataQueryById, loading: loadingDataId }] =
    useLazyQuery(queryDataById);
  const [
    getDataByGender,
    { data: dataQueryByGender, loading: loadingDataGender },
  ] = useLazyQuery(queryDataByGender);

  const [addPengunjung, { loading: loadingAddPengunjung }] = useMutation(
    ADD_PENGUNJUNG,
    {
      refetchQueries: queryData,
    }
  );
  const [removePengunjung, { loading: loadingRemovePengunjung }] = useMutation(
    REMOVE_PENGUNJUNG,
    { refetchQueries: queryData }
  );
  const [updatingPengunjung, { loading: loadingUpdatePengunjung }] =
    useMutation(UPDATE_PENGUNJUNG, {
      refetchQueries: queryData,
    });
  const tambahPengunjung = (data) => {
    //code
    console.log("add clicked!");
    addPengunjung({
      variables: data,
    });
    refetchData();
  };

  const updatePengunjung = (data) => {
    console.log("update clicked");
    updatingPengunjung({
      variables: {
        id: data.id,
        _set: data,
      },
    });
  };

  const hapusPengunjung = (item) => {
    // code
    console.log("remove clicked!");
    removePengunjung({
      variables: {
        id: item,
      },
    });
  };

  function handleQueryById() {
    const id = parseInt(dataId.current.value);
    if (id < 1 || isNaN(id)) {
      return alert("nilai id harus lebih dari 1 dan tidak boleh kosong!");
    }
    setLoading(true);
    getDataById({
      variables: {
        _id: id,
      },
    });
    setData(dataQueryById);
  }

  const handleGetData = () => {
    getDataResult();
    setData(dataResult);
  };

  const handleFilterGender = (e) => {
    const gender = e.target.value;
    console.log(e.target.value);
    setLoading(true);
    getDataByGender({
      variables: {
        _jenisKelamin: gender,
      },
    });
    setData(dataQueryByGender);
  };

  useEffect(() => {
    handleGetData();
    if (dataResult) {
      setData(dataResult);
      setLoading(loadingResult);
    }
  }, [dataResult]);

  useEffect(() => {
    if (dataQueryById) {
      setData(dataQueryById);
      setLoading(loadingDataId);
    }
  }, [dataQueryById]);

  useEffect(() => {
    if (dataQueryByGender) {
      setData(dataQueryByGender);
      setLoading(loadingDataGender);
    }
  }, [dataQueryByGender]);

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
              value="pria"
              onChange={handleFilterGender}
            />
            Pria
          </label>
          <label>
            <input
              name="gender"
              type="radio"
              value="wanita"
              onChange={handleFilterGender}
            />
            Wanita
          </label>
        </div>
      </div>
      <button onClick={handleGetData}>Refetch data </button>
      {loading ? (
        <p>Loading...</p>
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
