const API_BASE_URL = 'http://localhost:5000/api';

// Helper to show messages
function showMessage(elementId, text, isError = false) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = text;
    el.className = `message ${isError ? 'error' : 'success'}`;
    setTimeout(() => {
        el.style.display = 'none';
    }, 5000);
}

// Donor Registration
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const payload = {
            name: document.getElementById('name').value,
            bloodGroup: document.getElementById('bloodGroup').value,
            phone: document.getElementById('phone').value,
            city: document.getElementById('city').value,
            lastDonationDate: document.getElementById('lastDonationDate').value || null
        };

        try {
            const btn = registerForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
            btn.disabled = true;

            const response = await fetch(`${API_BASE_URL}/donor/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                showMessage('registerMessage', 'Registration successful! Thank you.');
                registerForm.reset();
            } else {
                showMessage('registerMessage', 'Failed to register. Please try again.', true);
            }
        } catch (error) {
            console.error(error);
            showMessage('registerMessage', 'Network error. Make sure server is running.', true);
        } finally {
            const btn = registerForm.querySelector('button');
            btn.innerHTML = '<i class="fas fa-user-plus" style="margin-right: 8px;"></i> Complete Registration';
            btn.disabled = false;
        }
    });
}

// Search Donors
const searchForm = document.getElementById('searchForm');
if (searchForm) {
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const bloodGroup = encodeURIComponent(document.getElementById('searchBloodGroup').value);
        const city = encodeURIComponent(document.getElementById('searchCity').value);
        const resultsContainer = document.getElementById('resultsContainer');

        try {
            const btn = searchForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
            btn.disabled = true;

            resultsContainer.innerHTML = '';

            const response = await fetch(`${API_BASE_URL}/donor/search?bloodGroup=${bloodGroup}&city=${city}`);

            if (response.ok) {
                const donors = await response.json();

                if (donors && donors.length > 0) {
                    donors.forEach(donor => {
                        const card = document.createElement('div');
                        card.className = 'donor-card';
                        card.innerHTML = `
                            <div class="donor-info">
                                <h3><i class="fas fa-user" style="margin-right: 8px; font-size: 0.9em;"></i>${donor.name}</h3>
                                <p><i class="fas fa-phone" style="margin-right: 8px; width: 14px;"></i>${donor.phone}</p>
                                <p><i class="fas fa-map-marker-alt" style="margin-right: 8px; width: 14px;"></i>${donor.city}</p>
                            </div>
                            <div class="donor-badge">
                                ${donor.bloodGroup || decodeURIComponent(bloodGroup)}
                            </div>
                        `;
                        resultsContainer.appendChild(card);
                    });
                } else {
                    showMessage('searchMessage', 'No donors found in this area for this blood group.', true);
                }
            } else {
                showMessage('searchMessage', 'Error searching for donors.', true);
            }
        } catch (error) {
            console.error(error);
            showMessage('searchMessage', 'Network error. Simulated data will be shown for demo purposes.', true);

            // DEMO FALLBACK if localhost server isn't running
            setTimeout(() => {
                const demoDonors = [
                    { name: 'Alice Smith', phone: '+1 (555) 123-4567', city: decodeURIComponent(city), bloodGroup: decodeURIComponent(bloodGroup) },
                    { name: 'Bob Johnson', phone: '+1 (555) 987-6543', city: decodeURIComponent(city), bloodGroup: decodeURIComponent(bloodGroup) }
                ];
                demoDonors.forEach(donor => {
                    const card = document.createElement('div');
                    card.className = 'donor-card';
                    card.innerHTML = `
                        <div class="donor-info">
                            <h3><i class="fas fa-user-shield" style="margin-right: 8px; font-size: 0.9em; color: var(--success);"></i>${donor.name}</h3>
                            <p><i class="fas fa-phone" style="margin-right: 8px; width: 14px;"></i>${donor.phone}</p>
                            <p><i class="fas fa-map-marker-alt" style="margin-right: 8px; width: 14px;"></i>${donor.city}</p>
                        </div>
                        <div class="donor-badge">
                            ${donor.bloodGroup}
                        </div>
                    `;
                    resultsContainer.appendChild(card);
                });
            }, 800);
        } finally {
            const btn = searchForm.querySelector('button');
            btn.innerHTML = '<i class="fas fa-search" style="margin-right: 8px;"></i> Search Donors';
            btn.disabled = false;
        }
    });
}

// Request Blood
const requestForm = document.getElementById('requestForm');
if (requestForm) {
    requestForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const payload = {
            patientName: document.getElementById('patientName').value,
            bloodGroup: document.getElementById('reqBloodGroup').value,
            city: document.getElementById('reqCity').value,
            hospital: document.getElementById('hospital').value,
            phone: document.getElementById('reqPhone').value
        };

        try {
            const btn = requestForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            btn.disabled = true;

            const response = await fetch(`${API_BASE_URL}/request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                showMessage('requestMessage', 'Blood request submitted successfully. Donors will be notified.');
                requestForm.reset();
            } else {
                showMessage('requestMessage', 'Failed to submit request. Please try again.', true);
            }
        } catch (error) {
            console.error(error);
            showMessage('requestMessage', 'Network error. Make sure server is running.', true);
        } finally {
            const btn = requestForm.querySelector('button');
            btn.innerHTML = '<i class="fas fa-paper-plane" style="margin-right: 8px;"></i> Submit Request';
            btn.disabled = false;
        }
    });
}
