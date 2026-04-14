document.addEventListener('DOMContentLoaded', async () => {
    await Auth.requireAuth();

    const vehicleId = Utils.getQueryParam('id');
    if (!vehicleId) {
        window.location.href = 'dashboard.html';
        return;
    }

    const vehicleTitle = document.getElementById('vehicleTitle');
    const vehicleSub = document.getElementById('vehicleSub');
    const logoutBtn = document.getElementById('logoutBtn');
    
    logoutBtn.addEventListener('click', Auth.signOut);

    async function loadVehicleInfo() {
        try {
            const vehicle = await API.getVehicleById(vehicleId);
            vehicleTitle.innerHTML = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
            vehicleSub.textContent = `Plate: ${vehicle.plate_number || 'N/A'}`;
        } catch (err) {
            Utils.showToast('Failed to load vehicle info', 'error');
            vehicleTitle.textContent = 'Vehicle Not Found';
        }
    }

    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal');
            document.getElementById(modalId).classList.remove('active');
        });
    });

    const refuelModal = document.getElementById('refuelModal');
    document.getElementById('openRefuelModal').addEventListener('click', () => refuelModal.classList.add('active'));
    
    async function loadRefueling() {
        const tbody = document.querySelector('#refuelingTable tbody');
        try {
            const logs = await API.getRefuelingLogs(vehicleId);
            tbody.innerHTML = logs.map(l => `
                <tr>
                    <td>${Utils.formatDate(l.date || l.created_at)}</td>
                    <td>${l.odometer}</td>
                    <td>${l.fuel_type || '-'}</td>
                    <td>${l.quantity}</td>
                    <td>$${l.cost}</td>
                    <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${l.notes || ''}">${l.notes || '-'}</td>
                </tr>
            `).join('') || `<tr><td colspan="6" class="text-muted">No refueling logs yet.</td></tr>`;
        } catch (err) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-muted">Error loading.</td></tr>`;
        }
    }

    document.getElementById('refuelForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        btn.disabled = true;
        try {
            await API.addRefuelingLog(vehicleId, {
                date: document.getElementById('rfDate').value || new Date().toISOString().split('T')[0],
                odometer: parseInt(document.getElementById('rfOdometer').value),
                fuel_type: document.getElementById('rfFuelType').value,
                quantity: parseFloat(document.getElementById('rfQuantity').value),
                cost: parseFloat(document.getElementById('rfCost').value),
                notes: document.getElementById('rfNotes').value || null
            });
            Utils.showToast('Refuel logged!', 'success');
            refuelModal.classList.remove('active');
            e.target.reset();
            loadRefueling();
        } catch (err) {
            Utils.showToast(err.message, 'error');
        } finally {
            btn.disabled = false;
        }
    });

    const oilModal = document.getElementById('oilModal');
    document.getElementById('openOilModal').addEventListener('click', () => oilModal.classList.add('active'));
    
    async function loadOil() {
        const tbody = document.querySelector('#oilTable tbody');
        try {
            const logs = await API.getOilChanges(vehicleId);
            tbody.innerHTML = logs.map(l => `
                <tr>
                    <td>${Utils.formatDate(l.date || l.created_at)}</td>
                    <td>${l.odometer}</td>
                    <td>${l.oil_type || '-'}</td>
                    <td>${l.cost ? '$'+l.cost : '-'}</td>
                    <td>${l.next_change_due || '-'}</td>
                    <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${l.notes || ''}">${l.notes || '-'}</td>
                </tr>
            `).join('') || `<tr><td colspan="6" class="text-muted">No oil changes logged.</td></tr>`;
        } catch (err) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-muted">Error loading.</td></tr>`;
        }
    }

    document.getElementById('oilForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        btn.disabled = true;
        try {
            await API.addOilChange(vehicleId, {
                date: document.getElementById('oilDate').value || new Date().toISOString().split('T')[0],
                odometer: parseInt(document.getElementById('oilOdometer').value),
                oil_type: document.getElementById('oilType').value || null,
                cost: parseFloat(document.getElementById('oilCost').value) || null,
                next_change_due: parseInt(document.getElementById('oilNextDue').value) || null,
                notes: document.getElementById('oilNotes').value || null
            });
            Utils.showToast('Oil change logged!', 'success');
            oilModal.classList.remove('active');
            e.target.reset();
            loadOil();
        } catch (err) {
            Utils.showToast(err.message, 'error');
        } finally {
            btn.disabled = false;
        }
    });

    const noteModal = document.getElementById('noteModal');
    document.getElementById('openNoteModal').addEventListener('click', () => noteModal.classList.add('active'));
    
    async function loadNotes() {
        const grid = document.getElementById('notesGrid');
        try {
            const notes = await API.getServiceNotes(vehicleId);
            grid.innerHTML = notes.map(n => `
                <div class="glass-panel card" style="cursor:default">
                    <div class="card-header" style="font-size:14px">
                        ${Utils.formatDate(n.date || n.created_at)} - ${n.title}
                    </div>
                    <div class="card-body">
                        <p style="margin-bottom:10px">${n.description || n.details || ''}</p>
                        ${n.odometer ? `<p style="font-size:12px;color:var(--text-muted);margin-bottom:10px">Odometer: ${n.odometer} | Cost: $${n.cost || 0}</p>` : ''}
                        ${n.bill_image ? `<a href="${n.bill_image}" target="_blank"><img src="${n.bill_image}" class="bill-img-thumb" alt="Bill"></a>` : ''}
                    </div>
                </div>
            `).join('') || `<p class="text-muted" style="grid-column: 1/-1;">No service notes found.</p>`;
        } catch (err) {
            grid.innerHTML = `<p class="text-muted">Error loading notes.</p>`;
        }
    }

    document.getElementById('noteForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        btn.disabled = true; btn.innerHTML = 'Uploading...';
        try {
            const fileInput = document.getElementById('snImage');
            const data = new FormData();
            data.append('title', document.getElementById('snTitle').value);
            data.append('description', document.getElementById('snDetails').value);
            data.append('date', document.getElementById('snDate').value || new Date().toISOString().split('T')[0]);
            
            if (document.getElementById('snOdometer').value) data.append('odometer', document.getElementById('snOdometer').value);
            if (document.getElementById('snCost').value) data.append('cost', document.getElementById('snCost').value);
            
            if (fileInput.files[0]) {
                data.append('bill_image', fileInput.files[0]);
            }

            await API.addServiceNote(vehicleId, data);
            Utils.showToast('Note added!', 'success');
            noteModal.classList.remove('active');
            e.target.reset();
            loadNotes();
        } catch (err) {
            Utils.showToast(err.message, 'error');
        } finally {
            btn.innerHTML = 'Save Note';
            btn.disabled = false;
        }
    });

    loadVehicleInfo();
    loadRefueling();
    loadOil();
    loadNotes();
});
