// import axios from "axios";
const axios = require("axios")
// const VAR = require("../../config/vars")

async function getSourceFromExternal(){
    let res = await axios.post("http://212.174.130.210/NewTapdk/ViewApp/sorgu.aspx");
    console.log(res);
};

getSourceFromExternal()