import axios from 'axios'
// API Divtec
const apiDivtec = axios.create({
  baseURL: 'https://api-labo.divtec.ch:4483/',
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

const actions = {
  async fetchUsers(){
    const response = await axios.get("https://jsonplaceholder.typicode.com/users");
  }
};
