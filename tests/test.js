// import axios from "axios";

// const transaction = {
//   tokenContractAddress: "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
//   userAddress: "0xC9cE5ac72eF382326f4CAeB04F643D4A22448824",
// };

// const test = async () => {
//   // console.log(transaction);
//   const response = await axios.post(
//     "http://localhost:4000/api/v1/getBalance/contract/eth",
//     transaction,
//     {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );
// };

// test();
const salut = { bonjours: "hey", date : new Date() };
const { bonjours } = salut;
console.log(bonjours);
