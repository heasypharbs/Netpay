const axios = require("axios");

const safehavenmfb = axios.create({
  baseURL: process.env.SAFEHAVEN_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.SAFEHAVEN_API_KEY}`,
  },
});

const safehavenService = {
  createAccount: (params) => {
    return safehavenmfb.post("/accounts", params);
  },

  getAccount: (accountId) => {
    return safehavenmfb.get(`/accounts/${accountId}`);
  },

  fundAccount: (accountId, amount) => {
    return safehavenmfb.post(`/accounts/${accountId}/fund`, { amount });
  },

  getTransactions: (accountId) => {
    return safehavenmfb.get(`/accounts/${accountId}/transactions`);
  },
};

module.exports = safehavenService;
