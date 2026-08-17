import { 
  subscribeToLeads, 
  updateLeadStatus, 
  updateLeadNotes, 
  deleteLead, 
  submitLead 
} from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. DOM Element Selectors
  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');
  const loginForm = document.getElementById('admin-login-form');
  const logoutBtn = document.getElementById('btn-admin-logout');

  // KPI Counter Elements
  const kpiTotal = document.getElementById('kpi-total-leads');
  const kpiNew = document.getElementById('kpi-new-leads');
  const kpiInProgress = document.getElementById('kpi-in-progress');
  const kpiConverted = document.getElementById('kpi-converted');

  // Control Toolbar Elements
  const searchInput = document.getElementById('crm-search-input');
  const filterPills = document.querySelectorAll('#status-filter-pills .filter-pill');
  const btnExportCSV = document.getElementById('btn-export-csv');
  const btnSeedLead = document.getElementById('btn-seed-lead');
  const leadsTbody = document.getElementById('crm-leads-tbody');

  // Modal Elements
  const leadModal = document.getElementById('lead-modal');
  const modalCloseX = document.getElementById('modal-close-x');
  const modalClientName = document.getElementById('modal-client-name');
  const modalLeadId = document.getElementById('modal-lead-id');
  const modalCompany = document.getElementById('modal-company');
  const modalService = document.getElementById('modal-service');
  const modalEmail = document.getElementById('modal-email');
  const modalPhone = document.getElementById('modal-phone');
  const modalMessage = document.getElementById('modal-message');
  const modalStatusSelect = document.getElementById('modal-status-select');
  const modalNotesInput = document.getElementById('modal-notes-input');
  const btnSaveLeadChanges = document.getElementById('btn-save-lead-changes');

  // State Store
  let allLeads = [];
  let currentFilter = 'ALL';
  let activeLeadId = null;

  // 3. Theme Toggle Engine
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const htmlEl = document.documentElement;

  const savedTheme = localStorage.getItem('gerizim_theme') || 'light';
  htmlEl.setAttribute('data-theme', savedTheme);
  if (themeIcon) {
    themeIcon.setAttribute('data-lucide', savedTheme === 'light' ? 'moon' : 'sun');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlEl.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      htmlEl.setAttribute('data-theme', newTheme);
      localStorage.setItem('gerizim_theme', newTheme);
      if (themeIcon) {
        themeIcon.setAttribute('data-lucide', newTheme === 'light' ? 'moon' : 'sun');
        if (window.lucide) window.lucide.createIcons();
      }
    });
  }

  // 4. Session Auth Checking
  const sessionToken = sessionStorage.getItem('gerizim_admin_token');
  if (sessionToken === 'authenticated') {
    showDashboard();
  } else {
    showLogin();
  }

  // Handle Login Form Submit
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('login-username').value.trim();
      const pass = document.getElementById('login-password').value.trim();

      if (user === 'root' && pass === 'toor') {
        sessionStorage.setItem('gerizim_admin_token', 'authenticated');
        showToast('Access Granted! Welcome to Gerizim Admin CRM.', 'success');
        showDashboard();
      } else {
        showToast('Invalid Username or Password! (Use root / toor)', 'error');
      }
    });
  }

  // Handle Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('gerizim_admin_token');
      showToast('Logged out successfully.', 'info');
      showLogin();
    });
  }

  function showLogin() {
    loginView.style.display = 'flex';
    dashboardView.style.display = 'none';
  }

  function showDashboard() {
    loginView.style.display = 'none';
    dashboardView.style.display = 'block';
    if (window.lucide) window.lucide.createIcons();
    initFirestoreListener();
  }

  // 5. Real-Time Firestore Subscription
  let unsubscribeLeads = null;

  function initFirestoreListener() {
    if (unsubscribeLeads) return;

    unsubscribeLeads = subscribeToLeads((leads) => {
      allLeads = leads;
      updateKPICounters(leads);
      renderTable();
    });
  }

  // Update KPI Counter Cards
  function updateKPICounters(leads) {
    if (!kpiTotal) return;

    const total = leads.length;
    const newCount = leads.filter(l => l.status === 'New').length;
    const inProgressCount = leads.filter(l => l.status === 'In Progress').length;
    const convertedCount = leads.filter(l => l.status === 'Converted').length;

    kpiTotal.textContent = total;
    kpiNew.textContent = newCount;
    kpiInProgress.textContent = inProgressCount;
    kpiConverted.textContent = convertedCount;
  }

  // Render Table Rows
  function renderTable() {
    if (!leadsTbody) return;

    const searchVal = searchInput ? searchInput.value.toLowerCase() : '';

    const filtered = allLeads.filter(lead => {
      const matchStatus = currentFilter === 'ALL' || lead.status === currentFilter;
      const matchSearch = 
        (lead.name && lead.name.toLowerCase().includes(searchVal)) ||
        (lead.company && lead.company.toLowerCase().includes(searchVal)) ||
        (lead.email && lead.email.toLowerCase().includes(searchVal)) ||
        (lead.service && lead.service.toLowerCase().includes(searchVal));

      return matchStatus && matchSearch;
    });

    if (filtered.length === 0) {
      leadsTbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
            <i data-lucide="inbox" style="width: 36px; height: 36px; display: block; margin: 0 auto 10px; opacity: 0.5;"></i>
            No enquiries or leads match the current filters.
          </td>
        </tr>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    leadsTbody.innerHTML = filtered.map(lead => {
      const dateStr = lead.submittedAt ? new Date(lead.submittedAt).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      }) : 'Recently';

      const statusClass = getStatusBadgeClass(lead.status);

      return `
        <tr data-id="${lead.id}">
          <td>
            <div style="font-weight: 700; color: var(--text-main);">${lead.name || 'Anonymous Client'}</div>
            <div style="font-size: 0.775rem; color: var(--color-primary); font-weight: 600;">${lead.company || 'Individual Query'}</div>
          </td>
          <td>
            <div><i data-lucide="mail" style="width: 14px; color: var(--text-muted); vertical-align: middle;"></i> ${lead.email || 'N/A'}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);"><i data-lucide="phone" style="width: 14px; vertical-align: middle;"></i> ${lead.phone || 'N/A'}</div>
          </td>
          <td>
            <div style="font-weight: 600;">${lead.service || 'Statutory Consultation'}</div>
            <span style="font-size: 0.725rem; color: var(--text-muted); background: rgba(0,0,0,0.05); padding: 2px 6px; border-radius: 4px;">${lead.source || 'Website'}</span>
          </td>
          <td>
            <span style="font-weight: 600; font-size: 0.85rem;">${lead.state || 'Delhi NCR'}</span>
          </td>
          <td style="white-space: nowrap; font-size: 0.825rem; color: var(--text-muted);">
            ${dateStr}
          </td>
          <td>
            <select class="status-select-inline form-select" data-id="${lead.id}" style="padding: 4px 8px; font-size: 0.775rem; border-radius: 20px;">
              <option value="New" ${lead.status === 'New' ? 'selected' : ''}>New</option>
              <option value="In Progress" ${lead.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
              <option value="Contacted" ${lead.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
              <option value="Converted" ${lead.status === 'Converted' ? 'selected' : ''}>Converted</option>
              <option value="Archived" ${lead.status === 'Archived' ? 'selected' : ''}>Archived</option>
            </select>
          </td>
          <td style="white-space: nowrap;">
            <button class="btn-view-lead btn" data-id="${lead.id}" style="padding: 6px 12px; font-size: 0.775rem; background: rgba(144, 193, 38, 0.15); color: var(--color-primary);">
              <i data-lucide="eye" style="width: 14px;"></i> View
            </button>
            <button class="btn-delete-lead btn" data-id="${lead.id}" style="padding: 6px 10px; font-size: 0.775rem; background: rgba(239, 68, 68, 0.1); color: #EF4444; border: none; margin-left: 4px;">
              <i data-lucide="trash-2" style="width: 14px;"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
    attachTableEventHandlers();
  }

  function getStatusBadgeClass(status) {
    switch (status) {
      case 'New': return 'status-new';
      case 'In Progress': return 'status-in-progress';
      case 'Contacted': return 'status-contacted';
      case 'Converted': return 'status-converted';
      default: return 'status-archived';
    }
  }

  // Table Row Interactivity
  function attachTableEventHandlers() {
    // Inline status change
    document.querySelectorAll('.status-select-inline').forEach(select => {
      select.addEventListener('change', async (e) => {
        const id = select.getAttribute('data-id');
        const newStatus = select.value;
        const res = await updateLeadStatus(id, newStatus);
        if (res.success) {
          showToast(`Lead status updated to '${newStatus}'!`, 'success');
        }
      });
    });

    // View lead details modal
    document.querySelectorAll('.btn-view-lead').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openLeadModal(id);
      });
    });

    // Delete lead
    document.querySelectorAll('.btn-delete-lead').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this lead from Firestore?')) {
          const res = await deleteLead(id);
          if (res.success) {
            showToast('Lead deleted successfully from Firestore.', 'info');
          }
        }
      });
    });
  }

  // Open Lead Modal
  function openLeadModal(leadId) {
    const lead = allLeads.find(l => l.id === leadId);
    if (!lead) return;

    activeLeadId = leadId;
    modalClientName.textContent = lead.name || 'Anonymous Client';
    modalLeadId.textContent = `Firestore ID: ${lead.id}`;
    modalCompany.textContent = lead.company || 'N/A';
    modalService.textContent = lead.service || 'General Consultation';
    modalEmail.textContent = lead.email || 'N/A';
    modalPhone.textContent = lead.phone || 'N/A';
    modalMessage.textContent = lead.message || 'No specific requirements mentioned.';
    modalStatusSelect.value = lead.status || 'New';
    modalNotesInput.value = lead.notes || '';

    leadModal.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  }

  if (modalCloseX) {
    modalCloseX.addEventListener('click', () => {
      leadModal.classList.remove('active');
      activeLeadId = null;
    });
  }

  // Save Modal Notes & Status Changes
  if (btnSaveLeadChanges) {
    btnSaveLeadChanges.addEventListener('click', async () => {
      if (!activeLeadId) return;

      const newStatus = modalStatusSelect.value;
      const newNotes = modalNotesInput.value;

      showToast('Saving lead updates to Firestore...', 'info');

      await updateLeadStatus(activeLeadId, newStatus);
      await updateLeadNotes(activeLeadId, newNotes);

      showToast('Lead status & notes updated successfully!', 'success');
      leadModal.classList.remove('active');
      activeLeadId = null;
    });
  }

  // Filter Pills Event Listeners
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.getAttribute('data-status');
      renderTable();
    });
  });

  // Search Input Handler
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderTable();
    });
  }

  // Seed Test Lead to Firestore
  if (btnSeedLead) {
    btnSeedLead.addEventListener('click', async () => {
      showToast('Creating sample lead in Firestore...', 'info');
      const sampleNames = ['Vikram Sethi', 'Ananya Deshmukh', 'Priya Ramanathan', 'Sanjay Goel'];
      const sampleCompanies = ['Apex Logistics India', 'Vanguard Tech Solutions', 'Sunlight Solar Systems', 'Zenith Infrastructure'];
      const randomIdx = Math.floor(Math.random() * sampleNames.length);

      const res = await submitLead({
        name: sampleNames[randomIdx],
        email: `${sampleNames[randomIdx].toLowerCase().replace(' ', '.')}@${sampleCompanies[randomIdx].toLowerCase().split(' ')[0]}.com`,
        phone: `+91 ${Math.floor(7000000000 + Math.random() * 2999999999)}`,
        company: sampleCompanies[randomIdx],
        service: 'Statutory Compliance Management',
        state: 'Delhi NCR',
        message: 'Interested in full factory licensing and EPFO/ESIC compliance audit.',
        source: 'Admin CRM Portal'
      });

      if (res.success) {
        showToast('Sample test lead added to Firestore!', 'success');
      }
    });
  }

  // Export CSV Handler
  if (btnExportCSV) {
    btnExportCSV.addEventListener('click', () => {
      if (!allLeads.length) {
        showToast('No leads available to export.', 'info');
        return;
      }

      let csv = 'ID,Name,Company,Email,Phone,Service,State,Status,Submitted At,Notes\n';
      allLeads.forEach(l => {
        csv += `"${l.id}","${l.name || ''}","${l.company || ''}","${l.email || ''}","${l.phone || ''}","${l.service || ''}","${l.state || ''}","${l.status || ''}","${l.submittedAt || ''}","${(l.notes || '').replace(/"/g, '""')}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('href', url);
      a.setAttribute('download', `Gerizim_CRM_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
      a.click();
      showToast('Leads exported to CSV file successfully!', 'success');
    });
  }

  // Toast Helper
  function showToast(msg, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'alert-triangle' : 'info'}" style="color: var(--color-accent);"></i>
      <span>${msg}</span>
    `;

    toastContainer.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.remove();
    }, 4000);
  }
});
