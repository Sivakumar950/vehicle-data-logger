const API = {
    getHeaders: async () => {
        const session = await Auth.getSession();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token || ''}`
        };
    },
    _handleResponse: async (response) => {
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'API error occurred.' }));
            throw new Error(error.message || 'Something went wrong');
        }
        return response.json();
    },

    getVehicles: async () => {
        const headers = await API.getHeaders();
        const response = await fetch(`${CONFIG.API_BASE_URL}/vehicles`, { headers });
        return API._handleResponse(response);
    },
    getVehicleById: async (id) => {
        const headers = await API.getHeaders();
        const response = await fetch(`${CONFIG.API_BASE_URL}/vehicles/${id}`, { headers });
        return API._handleResponse(response);
    },
    createVehicle: async (data) => {
        const headers = await API.getHeaders();
        const response = await fetch(`${CONFIG.API_BASE_URL}/vehicles`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });
        return API._handleResponse(response);
    },
    deleteVehicle: async (id) => {
        const headers = await API.getHeaders();
        const response = await fetch(`${CONFIG.API_BASE_URL}/vehicles/${id}`, {
            method: 'DELETE',
            headers
        });
        return API._handleResponse(response);
    },

    getRefuelingLogs: async (vehicleId) => {
        const headers = await API.getHeaders();
        const response = await fetch(`${CONFIG.API_BASE_URL}/vehicles/${vehicleId}/refueling`, { headers });
        return API._handleResponse(response);
    },
    addRefuelingLog: async (vehicleId, data) => {
        const headers = await API.getHeaders();
        const response = await fetch(`${CONFIG.API_BASE_URL}/vehicles/${vehicleId}/refueling`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });
        return API._handleResponse(response);
    },

    getOilChanges: async (vehicleId) => {
        const headers = await API.getHeaders();
        const response = await fetch(`${CONFIG.API_BASE_URL}/vehicles/${vehicleId}/oil-changes`, { headers });
        return API._handleResponse(response);
    },
    addOilChange: async (vehicleId, data) => {
        const headers = await API.getHeaders();
        const response = await fetch(`${CONFIG.API_BASE_URL}/vehicles/${vehicleId}/oil-changes`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });
        return API._handleResponse(response);
    },

    getServiceNotes: async (vehicleId) => {
        const headers = await API.getHeaders();
        const response = await fetch(`${CONFIG.API_BASE_URL}/vehicles/${vehicleId}/service-notes`, { headers });
        return API._handleResponse(response);
    },
    addServiceNote: async (vehicleId, data) => {
        const headers = await API.getHeaders();
        let body = data;
        let isFormData = data instanceof FormData;
        
        if (!isFormData) {
            body = JSON.stringify(data);
        } else {
            delete headers['Content-Type'];
        }

        const response = await fetch(`${CONFIG.API_BASE_URL}/vehicles/${vehicleId}/service-notes`, {
            method: 'POST',
            headers,
            body
        });
        return API._handleResponse(response);
    }
};
