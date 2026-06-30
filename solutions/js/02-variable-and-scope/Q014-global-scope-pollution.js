/* var apiUrl = 'https://api.example.com';
var cache = {};

function fetchData(id) {
    // uses apiUrl and cache
}

function clearCache() {
    cache = {};
}

function createData() {}
function updateData() {}
function deleteData() {}
function refreshData() {}
function validateData() {}
function logRequest() {}
function getCachedData() {}
function setCachedData() {}


Problem is Scope  
    window.apiUrl
    window.cache
    window.fetchData
    window.clearCache


Fix
*/


import {
    fetchData,
    clearCache,
    updateData,
    deleteData,
    createData,
    getCachedData,
    refreshData,
    validateData,
    logRequest
} from './partials/Q014-1.js';

const result  = await fetchData(1);

console.log(result)
clearCache();