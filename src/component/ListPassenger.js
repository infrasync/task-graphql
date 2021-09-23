import ListItem from "./ListItem";

const ListPassenger = (props) => {
  console.log(props.data);
  return (
    <div>
      {!props.data ? (
        <p>Loading....</p>
      ) : (
        <div>
          <table cellPadding="5px" cellSpacing="0" style={{ margin: "auto" }}>
            <thead bgcolor="red">
              <td>Nama</td>
              <td>Umur</td>
              <td>Jenis Kelamin</td>
              <td bgcolor="white" className="removeBorder"></td>
            </thead>
            {props.data?.map((item) => (
              <ListItem
                key={item.id}
                data={item}
                hapusPengunjung={props.hapusPengunjung}
                updatePengunjung={props.updatePengunjung}
              />
            ))}
          </table>
        </div>
      )}
    </div>
  );
};

export default ListPassenger;
