import { Component } from "react";
import PassengerInput from './PassengerInput';
import ListPassenger from './ListPassenger';
import Header from './Header';

function Home() {
  const tambahPengunjung = () => {
    //code
    console.log('add clicked!')
  }
  const hapusPengunjung = () => {
    // code
    console.log('remove clicked!')
  }
  return (
    <div>
      <Header/>
      <ListPassenger 
        data={data}
        hapusPengunjung={hapusPengunjung}
      />
      <PassengerInput
        tambahPengunjung={tambahPengunjung}
      />
    </div>
  )
}

export default Home;
