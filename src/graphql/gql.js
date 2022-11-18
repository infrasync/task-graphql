import { gql } from "@apollo/client";

export const ADD_PENGUNJUNG = gql`
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

export const REMOVE_PENGUNJUNG = gql`
  mutation MyMutation($id: Int!) {
    delete_anggota_by_pk(id: $id) {
      id
      nama
    }
  }
`;

export const UPDATE_PENGUNJUNG = gql`
  mutation MyMutation($id: Int!, $_set: anggota_set_input = {}) {
    update_anggota_by_pk(pk_columns: { id: $id }, _set: $_set) {
      nama
      id
    }
  }
`;

export const SUBSCRIPTION_PENGUNJUNG = gql`
  subscription MySubscription {
    anggota {
      id
      jenisKelamin
      nama
      umur
    }
  }
`;
