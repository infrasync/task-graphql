import { useState } from "react";
import "./Home.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const ListItem = (props) => {
  const { id, nama, umur, jenisKelamin } = props.data;
  const [state, setState] = useState({
    id,
    nama,
    umur,
    jenisKelamin,
  });

  const onChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    if (state.nama.trim() && state.umur && state.jenisKelamin) {
      const umur = state.umur;
      if (umur >= 75 || umur <= 12) {
        alert("Umur tidak sesuai");
      } else {
        const newData = {
          id: state.id,
          nama: state.nama,
          umur: state.umur,
          jenisKelamin: state.jenisKelamin,
        };
        props.updatePengunjung(newData);
        setState({
          ...state,
          nama: "",
          umur: "",
          jenisKelamin: "Pria",
        });
      }
    } else {
      alert("Data masih ada yang kosong");
    }
  };

  return (
    <tr>
      <td>{nama}</td>
      <td>{umur}</td>
      <td>{jenisKelamin}</td>
      <td className="removeBorder" onClick={() => props.hapusPengunjung(id)}>
        <button>Hapus</button>
      </td>
      <td className="removeBorder">
        <Popup
          trigger={<button> Edit</button>}
          position="right center"
          modal={true}
        >
          <div>
            <div>
              <p>Nama</p>
              <input
                type="text"
                className="input-text"
                placeholder="Nama anda ..."
                value={state.nama}
                name="nama"
                onChange={onChange}
              />
            </div>
            <div>
              <p>Umur</p>
              <input
                type="number"
                className="input-text"
                placeholder="Umur anda ..."
                value={state.umur}
                name="umur"
                onChange={onChange}
              />
            </div>
            <select name="jenisKelamin" onChange={onChange}>
              <option
                value="Pria"
                selected={
                  state.jenisKelamin === "Pria" || state.jenisKelamin === "pria"
                }
              >
                Pria
              </option>
              <option
                value="Wanita"
                selected={
                  state.jenisKelamin === "Wanita" ||
                  state.jenisKelamin === "wanita"
                }
              >
                Wanita
              </option>
            </select>
          </div>
          <button onClick={handleSubmit}>Update Data</button>
        </Popup>
      </td>
    </tr>
  );
};

export default ListItem;
