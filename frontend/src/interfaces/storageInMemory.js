const storage = {};

export const createData = async (collectionName, data) => {
    if (!storage[collectionName]) {
        storage[collectionName] = [];
    }
    storage[collectionName].push({ id: Date.now().toString(), ...data });
};

export const readData = async (collectionName) => {
    return storage[collectionName] || [];
};

export const updateData = async (collectionName, id, data) => {
    if (storage[collectionName]) {
        const index = storage[collectionName].findIndex(item => item.id === id);
        if (index !== -1) {
            storage[collectionName][index] = { ...storage[collectionName][index], ...data };
        }
    }
};

export const deleteData = async (collectionName, id) => {
    if (storage[collectionName]) {
        storage[collectionName] = storage[collectionName].filter(item => item.id !== id);
    }
};