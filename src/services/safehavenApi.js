// services/safehavenmfb.js
const axios = require("axios");

// Configure the SafeHaven API client
const safehavenmfb = axios.create({
  baseURL: process.env.SAFEHAVEN_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.SAFEHAVEN_API_KEY}`,
  },
});

// Add methods for different API endpoints
const safehavenService = {
  createAccount: (params) => {
    return safehavenmfb.post("/accounts", params);
  },

  getAccount: (accountId) => {
    return safehavenmfb.get(`/accounts/${accountId}`);
  },

  // Add other SafeHaven API methods as needed
  fundAccount: (accountId, amount) => {
    return safehavenmfb.post(`/accounts/${accountId}/fund`, { amount });
  },

  getTransactions: (accountId) => {
    return safehavenmfb.get(`/accounts/${accountId}/transactions`);
  },
};

module.exports = safehavenService;
