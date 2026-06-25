const apiUrl = 'https://jsonplaceholder.typicode.com/';
const cache = {};

// private helper
async function request(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Request failed');
    }

    return response.json();
}

export async function fetchData(id) {
    if (cache[id]) {
        return cache[id];
    }

    const data = await request(`${apiUrl}/posts/${id}`);

    cache[id] = data;

    return data;
}

export function clearCache() {
    Object.keys(cache).forEach(key => delete cache[key]);
}

// remaining 7 functions
export function updateData() {}
export function deleteData() {}
export function createData() {}
export function getCachedData() {}
export function refreshData() {}
export function validateData() {}
export function logRequest() {}