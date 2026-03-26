/* ═══════════════════════════════════════
   PAGE: UNIFIED SETTINGS (ADMIN/MANAGER)
   Consolidates SMTP, User Management, and Activity Logs
═══════════════════════════════════════ */
async function pageSettings(navId) {
  const c = document.getElementById('page-content');
  const role = APP.user?.role;
  if (!['admin', 'manager'].includes(role)) {
    renderContent(`<div class="alert al-danger">❌ เฉพาะ Admin และ Manager เท่านั้น</div>`, 'settings', navId);
    return;
  }

  setLoading('settings', navId);

  try {
    const [cfg, users, logData] = await Promise.all([
      apiFetch('/notification-settings'),
      apiFetch('/users'),
      apiFetch('/audit-logs?limit=30')
    ]);

    const logs = logData.items;

    renderContent(`
    <div style="max-width:1080px; margin: 0 auto;">
      <div class="flex ic jb mb2">
        <div>
          <div style="font-size:1.25rem;font-weight:700;margin-bottom:.25rem">⚙️ ตั้งค่าระบบ (System Settings)</div>
          <div class="text-muted text-xs">จัดการผู้ใช้งาน, ตั้งค่าการแจ้งเตือน และตรวจสอบบันทึกกิจกรรมในหน้าเดียว</div>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="pageSettings()">↺ รีเฟรชข้อมูล</button>
      </div>

      <!-- SECTION 1: SYSTEM & SMTP CONFIG (Admin Only) -->
      ${role === 'admin' ? `
      <div class="card mb2">
        <div class="card-h"><div class="card-t">🔔 การตั้งค่าระบบและการแจ้งเตือน (SMTP)</div></div>
        <div class="card-b">
          <div class="stats-grid mb2" style="grid-template-columns: 1fr 1fr; gap: 1.5rem;">
            <div class="flex jb ic p2" style="background:var(--ink2); border-radius:8px;">
              <div>
                <div style="font-weight:700">🤖 มอบหมายงานช่างอัตโนมัติ</div>
                <div class="text-muted text-xs">ระบบจะเลือกช่างที่งานว่างที่สุดให้อัตโนมัติ</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="cfg-auto-assign" ${cfg.auto_assign_enabled ? 'checked' : ''} onchange="saveQuickSettings()">
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="flex jb ic p2" style="background:var(--ink2); border-radius:8px;">
              <div>
                <div style="font-weight:700">📧 เปิดใช้งานการส่งอีเมล</div>
                <div class="text-muted text-xs">ส่งแจ้งเตือนผ่านช่องทาง SMTP</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="cfg-email-en" ${cfg.email_enabled ? 'checked' : ''} onchange="saveQuickSettings()">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="frow">
            <div class="fg"><label class="fl">SMTP Host</label><input class="fc" id="cfg-smtp-host" placeholder="smtp.gmail.com" value="${cfg.smtp_host || ''}"></div>
            <div class="fg" style="max-width:120px"><label class="fl">Port</label><input class="fc" id="cfg-smtp-port" type="number" value="${cfg.smtp_port || 587}"></div>
          </div>
          <div class="frow">
            <div class="fg"><label class="fl">SMTP User (Email)</label><input class="fc" id="cfg-smtp-user" placeholder="yourname@gmail.com" value="${cfg.smtp_user || ''}"></div>
            <div class="fg"><label class="fl">SMTP Password / App Password</label><input class="fc" id="cfg-smtp-pass" type="password" value="${cfg.smtp_pass || ''}"></div>
          </div>
          <div class="frow">
            <div class="fg"><label class="fl">ชื่อผู้ส่ง (Sender Name)</label><input class="fc" id="cfg-smtp-name" value="${cfg.smtp_from_name || 'ระบบแจ้งซ่อม SDDI'}"></div>
          </div>
          
          <div class="flex jb mt2" style="gap:.5rem">
            <button class="btn btn-primary" onclick="saveFullSettings()">💾 บันทึกการตั้งค่า SMTP</button>
            <button class="btn btn-ghost" onclick="testEmailSettings()">📤 ทดสอบส่งอีเมล</button>
          </div>
        </div>
      </div>
      ` : `
      <div class="alert al-info mb2">ℹ️ คุณมีสิทธิ์เข้าถึงในฐานะ Manager: สามารถจัดการผู้ใช้และดูบันทึกกิจกรรมได้เท่านั้น</div>
      `}

      <!-- SECTION 2: USER MANAGEMENT -->
      <div class="card mb2">
        <div class="card-h flex ic jb">
          <div class="card-t">👥 จัดการผู้ใช้งาน (${users.length} คน)</div>
        </div>
        <div class="tw">
          <table>
            <thead><tr><th>ผู้ใช้งาน</th><th>อีเมล</th><th>สิทธิ์การใช้งาน</th><th>คณะ/แผนก</th><th>จัดการ</th></tr></thead>
            <tbody>
              ${users.map(u => `
              <tr>
                <td>
                  <div class="flex ic gap2">
                    <div style="width:32px;height:32px;background:var(--spark2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;font-size:.8rem">${(u.name || u.email || '?')[0].toUpperCase()}</div>
                    <div style="font-weight:600;font-size:.9rem">${u.name || 'ไม่ระบุชื่อ'}</div>
                  </div>
                </td>
                <td class="text-sm">${u.email}</td>
                <td>${roleBadge(u.role)}</td>
                <td class="text-xs text-muted">${u.department || '-'}</td>
                <td>
                  <div class="flex ic gap2">
                    <button class="btn btn-ghost btn-xs" onclick='openRoleModal(${JSON.stringify(u).replace(/'/g, "&#39;")})'>✎ เปลี่ยนสิทธิ์</button>
                    ${u.id !== APP.user.id ? `<button class="btn btn-ghost btn-xs" style="color:var(--red)" onclick="deleteUserSimple('${u.id}', '${u.name || u.email}')">🗑️ ลบ</button>` : ''}
                  </div>
                </td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- SECTION 3: RECENT AUDIT LOGS -->
      <div class="card mb2">
        <div class="card-h flex ic jb">
          <div class="card-t">📋 บันทึกกิจกรรมระบบล่าสุด (30 รายการ)</div>
          <button class="btn btn-ghost btn-xs" onclick="switchPage('system-log')">ดูทั้งหมด →</button>
        </div>
        <div class="tw">
          <table style="font-size:.82rem">
            <thead><tr><th>เวลา</th><th>ผู้กระทำ</th><th>กิจกรรม</th><th>รายละเอียด</th></tr></thead>
            <tbody>
              ${logs.map(l => `
              <tr>
                <td class="text-xs" style="white-space:nowrap">${fmtDate(l.created_at, true)}</td>
                <td style="font-weight:600">${l.user_id === 'SYSTEM' ? '🤖 {SYSTEM}' : (l.user_name || l.user_id)}</td>
                <td><span class="badge ${logBadge(l.action)}">${l.action}</span></td>
                <td class="text-muted text-xs">${l.detail || '-'}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- SECTION 4: DANGER ZONE (Admin Only) -->
      ${role === 'admin' ? `
      <div class="card" style="border-color:rgba(255,71,87,0.3);background:rgba(255,71,87,0.03)">
        <div class="card-h"><div class="card-t" style="color:var(--red)">🚨 พื้นที่อันตราย (Danger Zone)</div></div>
        <div class="card-b flex ic jb">
          <div>
            <div style="font-weight:700;margin-bottom:.25rem">ล้างข้อมูลระบบทั้งหมด (Factory Reset)</div>
            <div class="text-xs text-muted">ลบงานซ่อม, วัสดุ, และประวัติทั้งหมดทิ้งถาวร (ยกเว้นไอดีผู้ใช้)</div>
          </div>
          <button class="btn btn-danger" onclick="triggerReset()">🔴 ล้างข้อมูล</button>
        </div>
      </div>
      ` : ''}
    </div>`, 'settings', navId);
  } catch (e) {
    renderContent(`<div class="alert al-danger">❌ ${e.message}</div>`, 'settings', navId);
  }
}

// ── Settings Actions ────────────────────────────────────────────────────────

async function saveQuickSettings() {
  const payload = {
    auto_assign_enabled: document.getElementById('cfg-auto-assign')?.checked,
    email_enabled: document.getElementById('cfg-email-en')?.checked
  };
  try {
    await apiFetch('/notification-settings', { method: 'POST', body: JSON.stringify(payload) });
    toast('บันทึกการตั้งค่าด่วนแล้ว');
  } catch (e) { toast(e.message, 'err'); }
}

async function saveFullSettings() {
  const payload = {
    auto_assign_enabled: document.getElementById('cfg-auto-assign')?.checked,
    email_enabled: document.getElementById('cfg-email-en')?.checked,
    smtp_host: document.getElementById('cfg-smtp-host')?.value.trim(),
    smtp_port: parseInt(document.getElementById('cfg-smtp-port')?.value) || 587,
    smtp_user: document.getElementById('cfg-smtp-user')?.value.trim(),
    smtp_pass: document.getElementById('cfg-smtp-pass')?.value,
    smtp_from_name: document.getElementById('cfg-smtp-name')?.value.trim(),
    enabled: true // Master enable
  };
  try {
    const r = await apiFetch('/notification-settings', { method: 'POST', body: JSON.stringify(payload) });
    toast(r.message);
  } catch (e) { toast(e.message, 'err'); }
}

async function testEmailSettings() {
  try {
    await saveFullSettings(); // Save before test
    const r = await apiFetch('/notification-settings/test-email', { method: 'POST' });
    toast(r.message);
  } catch (e) { toast(e.message, 'err'); }
}

async function deleteUserSimple(id, name) {
  if (!confirm(`ต้องการลบผู้ใช้ "${name}" ใช่หรือไม่?`)) return;
  try {
    const res = await apiFetch(`/users/${id}`, { method: 'DELETE' });
    toast(res.message);
    pageSettings();
  } catch (e) { toast(e.message, 'err'); }
}

async function triggerReset() {
  if (confirm('⚠️ ยืนยันการล้างข้อมูลระบบทั้งหมด? ข้อมูลงานซ่อมและประวัติจะหายไปถาวร!') && prompt('โปรดพิมพ์คำว่า "RESET" เพื่อยืนยัน:') === 'RESET') {
    try {
      const res = await apiFetch('/system/reset', { method: 'POST' });
      toast(res.message);
      switchPage('dashboard');
    } catch (e) { toast(e.message, 'err'); }
  }
}

function logBadge(action) {
  if (action.includes('CREATE')) return 'b-green';
  if (action.includes('DELETE')) return 'b-red';
  if (action.includes('UPDATE') || action.includes('ASSIGN')) return 'b-blue';
  return 'b-gray';
}
