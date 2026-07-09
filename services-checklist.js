(() => {
  const checklistItems = Array.from(document.querySelectorAll('input[type="checkbox"][data-check-item]'));
  const doneElement = document.getElementById('checklistDone');
  const totalElement = document.getElementById('checklistTotal');
  const barElement = document.getElementById('checklistBar');
  const resetButton = document.getElementById('resetChecklist');
  const exportButton = document.getElementById('exportChecklist');
  const storageKey = 'ujaa-service-checklist-v1';

  if (!checklistItems.length || !doneElement || !totalElement || !barElement) {
    return;
  }

  const saveState = () => {
    const state = checklistItems.reduce((acc, item) => {
      acc[item.dataset.checkItem || 'unknown'] = item.checked;
      return acc;
    }, {});

    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // Continue without persistence if storage is blocked.
    }
  };

  const updateProgress = () => {
    const total = checklistItems.length;
    const done = checklistItems.filter((item) => item.checked).length;
    const percent = total ? (done / total) * 100 : 0;

    doneElement.textContent = String(done);
    totalElement.textContent = String(total);
    barElement.style.width = `${percent}%`;
  };

  const loadState = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw);
      checklistItems.forEach((item) => {
        const key = item.dataset.checkItem || '';
        if (Object.prototype.hasOwnProperty.call(parsed, key)) {
          item.checked = Boolean(parsed[key]);
        }
      });
    } catch {
      // Ignore malformed or inaccessible local storage.
    }
  };

  checklistItems.forEach((item) => {
    item.addEventListener('change', () => {
      saveState();
      updateProgress();
    });
  });

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      checklistItems.forEach((item) => {
        item.checked = false;
      });
      saveState();
      updateProgress();
    });
  }

  if (exportButton) {
    exportButton.addEventListener('click', () => {
      const done = checklistItems.filter((item) => item.checked).length;
      const total = checklistItems.length;
      const timestamp = new Date().toLocaleString();

      const checkedLines = checklistItems
        .filter((item) => item.checked)
        .map((item) => item.closest('label')?.textContent?.trim() || '')
        .filter(Boolean)
        .map((text) => `<li>${text}</li>`)
        .join('');

      const pendingLines = checklistItems
        .filter((item) => !item.checked)
        .map((item) => item.closest('label')?.textContent?.trim() || '')
        .filter(Boolean)
        .map((text) => `<li>${text}</li>`)
        .join('');

      const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Robotic Environment Deployment Handoff Summary</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 28px; color: #0a0a0a; }
      h1, h2 { margin: 0 0 10px; }
      h1 { font-size: 1.3rem; }
      h2 { font-size: 1rem; margin-top: 20px; }
      .meta { margin: 8px 0 14px; }
      ul { margin: 0; padding-left: 22px; }
      li { margin: 5px 0; line-height: 1.45; }
      .badge { display: inline-block; padding: 4px 8px; border: 1px solid #111; margin-left: 8px; }
    </style>
  </head>
  <body>
    <h1>Robotic Environment Deployment: Customer Handoff Summary</h1>
    <p class="meta">Generated: ${timestamp}</p>
    <p class="meta">Completion: ${done} / ${total} <span class="badge">${Math.round((done / total) * 100)}%</span></p>

    <h2>Completed Items</h2>
    <ul>${checkedLines || '<li>No checklist items completed yet.</li>'}</ul>

    <h2>Pending Items</h2>
    <ul>${pendingLines || '<li>No pending items. All checklist items are complete.</li>'}</ul>
  </body>
</html>`;

      const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=920,height=780');
      if (!printWindow) {
        return;
      }

      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    });
  }

  loadState();
  updateProgress();
})();
