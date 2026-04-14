document.addEventListener('DOMContentLoaded', async () => {
    await Auth.requireAuth();

    const vehiclesGrid = document.getElementById('vehiclesGrid');
    const addVehicleBtn = document.getElementById('addVehicleBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const addVehicleModal = document.getElementById('addVehicleModal');
    const closeVehicleModal = document.getElementById('closeVehicleModal');
    const addVehicleForm = document.getElementById('addVehicleForm');

    async function loadVehicles() {
        try {
            Utils.showLoader('vehiclesGrid');
            const vehicles = await API.getVehicles();
            
            if (!vehicles || vehicles.length === 0) {
                vehiclesGrid.innerHTML = '<p class="text-muted" style="grid-column: 1/-1;">Your garage is empty. Add a vehicle to get started!</p>';
                return;
            }

            vehiclesGrid.innerHTML = vehicles.map(v => `
                <div class="glass-panel card" onclick="window.location.href='vehicle.html?id=${v.id}'">
                    <div class="card-header">${v.year} ${v.make} ${v.model}</div>
                    <div class="card-body">
                        Plate: <span style="color:var(--text-main)">${v.plate_number || 'N/A'}</span><br>
                        Added: ${Utils.formatDate(v.created_at)}
                    </div>
                </div>
            `).join('');
        } catch (err) {
            vehiclesGrid.innerHTML = `<p class="text-muted">Error loading vehicles: ${err.message}</p>`;
            Utils.showToast('Could not fetch vehicles.', 'error');
        }
    }

    logoutBtn.addEventListener('click', Auth.signOut);
    
    addVehicleBtn.addEventListener('click', () => {
        addVehicleModal.classList.add('active');
    });
    
    closeVehicleModal.addEventListener('click', () => {
        addVehicleModal.classList.remove('active');
        addVehicleForm.reset();
    });

    addVehicleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = addVehicleForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Saving...';
        btn.disabled = true;

        const data = {
            name: `${document.getElementById('vehicleMake').value} ${document.getElementById('vehicleModel').value}`,
            make: document.getElementById('vehicleMake').value,
            model: document.getElementById('vehicleModel').value,
            year: parseInt(document.getElementById('vehicleYear').value),
            plate_number: document.getElementById('vehiclePlate').value
        };

        try {
            await API.createVehicle(data);
            Utils.showToast('Vehicle added successfully!', 'success');
            addVehicleModal.classList.remove('active');
            addVehicleForm.reset();
            loadVehicles();
        } catch (err) {
            Utils.showToast(err.message, 'error');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    });

    loadVehicles();
});
