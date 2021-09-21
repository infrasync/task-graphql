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
const queryDataByGender = gql`
query MyQuery($_jenisKelamin: String!) {
  anggota(where: {jenisKelamin: {_eq: $_jenisKelamin}}) {
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

  const [getDataResult, {data: dataResult, loading: loadingResult, refetch: refetchData}] =  useLazyQuery(queryData)
  const [getDataById, {data: dataQueryById, loading: loadingDataId}] =  useLazyQuery(queryDataById)
  const [getDataByGender, {data: dataQueryByGender, loading: loadingDataGender}] =  useLazyQuery(queryDataByGender)

  const tambahPengunjung = () => {
    //code
    console.log('add clicked!')
  }
  const hapusPengunjung = () => {
    // code
    console.log('remove clicked!')
  }

  function handleQueryById () {
    const id = parseInt(dataId.current.value)
    if (id < 1 || isNaN(id)) {
      return alert('nilai id harus lebih dari 1 dan tidak boleh kosong!')
    } 
    setLoading(true)
    getDataById({ variables: {
      "_id": id    
    }})
    setData(dataQueryById)
  }

  const handleGetData =  () => {
    getDataResult()
    setData(dataResult) 
  }

  const handleFilterGender = (e) => {
   const gender = e.target.value
    console.log(e.target.value)
    setLoading(true)
    getDataByGender({ variables: {
      "_jenisKelamin": gender    
    }})
    setData(dataQueryByGender)

  }

  useEffect( () => {
    handleGetData()
    if(dataResult) {
      setData(dataResult)
      setLoading(loadingResult)
    }
  }, [dataResult])

  useEffect(() => {
    if(dataQueryById) {
      setData(dataQueryById)
      setLoading(loadingDataId)
    }
  }, [dataQueryById])

  useEffect(() => {
    if(dataQueryByGender) {
      setData(dataQueryByGender)
      setLoading(loadingDataGender)
    }
  }, [dataQueryByGender])

  return (
    <div>
      <Header/>
      <div className="search_id">
      <input type="text" ref={dataId}  placeHolder="Search by Id..."/>
      <button onClick={handleQueryById}>Search</button>
      <div className='filter_gender'>
        Filter gender : 
        <label>
          <input name="gender" type="radio" value="pria" onChange={handleFilterGender}/>
          Pria
        </label>
       <label>
          <input name="gender" type="radio" value="wanita" onChange={handleFilterGender}/>
          Wanita
        </label>
      </div>
      </div>
      <button onClick={handleGetData}>Refetch data </button>
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
