import {useEffect, useState, useRef} from 'react'
import PassengerInput from './PassengerInput';
import ListPassenger from './ListPassenger';
import Header from './Header';
import {
  useQuery,
  useLazyQuery,
  gql
} from "@apollo/client";


function Home() {
const queryData = gql`
query MyQuery {
  anggota {
    id
    nama
    umur
    jenisKelamin
  }
}
`
const queryDataById = gql`
query MyQuery($_id: Int!) {
  anggota(where: {id: {_eq: $_id}}) {
    id
    nama
    umur
    jenisKelamin
  }
}
`
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState()
  const dataId = useRef()

  const [getDataResult, {data: dataResult, loading: loadingResult}] =  useLazyQuery(queryData)
  const [getDataById, {data: dataQueryById, loading: loadingDataId}] =  useLazyQuery(queryDataById)


  const tambahPengunjung = () => {
    //code
    console.log('add clicked!')
  }
  const hapusPengunjung = () => {
    // code
    console.log('remove clicked!')
  }

  function handleQueryById () {
    setLoading(loadingDataId)
    getDataById({ variables: {
      "_id": parseInt(dataId.current.value)
    }})
    if(dataQueryById) {
      setData(dataQueryById)
      setLoading(loadingDataId)
    }
  }

  const handleGetData =  () => {
    getDataResult()
    console.log(dataResult)
  }

  useEffect( () => {
    handleGetData()
    if(dataResult) {
      setData(dataResult)
      setLoading(loadingResult)
    }
  }, [dataResult])

  return (
    <div>
      <Header/>
      <div className="search_id">
      <input type="number" ref={dataId} placeholder="Search by Id..."/>
      <button onClick={handleQueryById}>Search</button>
      </div>
      {loading ? <p>Loading...</p> :
      <ListPassenger 
        data={data?.anggota}
        hapusPengunjung={hapusPengunjung}
      />
      }
      <PassengerInput
        tambahPengunjung={tambahPengunjung}
      />
    </div>
  )
}

export default Home;
