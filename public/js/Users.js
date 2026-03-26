/* ═══════════════════════════════════════
   PAGE: USERS & PROFILE
═══════════════════════════════════════ */
async function pageUsers(navId){
  setLoading('users', navId);
  try {
    const users = await apiFetch('/users');
    let st={admin:0,manager:0,technician:0,user:0};
    users.forEach(u=>st[u.role]=(st[u.role]||0)+1);

    renderContent(`
    <div class="stats-grid mb2">
      ${Object.entries(st).map(([r,v])=>`
      <div class="scard"><div class="scard-lbl" style="margin-bottom:.5rem">${roleBadge(r)}</div><div class="scard-val">${v}</div></div>
      `).join('')}
    </div>
    <div class="card">
      <div class="tw"><table>
        <thead><tr><th>ผู้ใช้</th><th>อีเมล</th><th>บทบาท</th><th>รหัส นศ./แผนก</th><th>วันที่สมัคร</th><th>จัดการ</th></tr></thead>
        <tbody>
          ${users.map(u=>`<tr>
            <td>
              <div class="flex ic gap2">
                <div style="width:32px;height:32px;background:var(--spark2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff">${(u.name||u.email||'?')[0].toUpperCase()}</div>
                <strong>${u.name||u.email||'–'}</strong>
              </div>
            </td>
            <td class="text-sm">${u.email}</td>
            <td>${roleBadge(u.role)}</td>
            <td class="text-sm" style="color:var(--chalk2)">
              <div>${u.student_id||'-'}</div>
              <div>${u.department||'-'}</div>
            </td>
            <td class="text-xs" style="color:var(--chalk3)">${fmtDate(u.created_at,true)}</td>
            <td>
              <div class="flex ic gap2">
                <button class="btn btn-ghost btn-sm" onclick='openRoleModal(${JSON.stringify(u).replace(/'/g,"&#39;")})'>✎ สิทธิ์</button>
                <button class="btn btn-ghost btn-sm" style="color:var(--red)" onclick="deleteUser('${u.id}', '${u.name||u.email}')">🗑️ ลบ</button>
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table></div>
    </div>`, 'users', navId);
  } catch(e) { renderContent(`<div class="alert al-danger">❌ ${e.message}</div>`, 'users', navId); }
}

async function deleteUser(id, name) {
  if (id === APP.user.id) return toast('ไม่สามารถลบตัวเองได้', 'warn');
  if (!confirm(`ยืนยันการลบผู้ใช้ "${name}" ใช่หรือไม่?\n⚠️ ข้อมูลบัญชีจะหายไปถาวร`)) return;

  try {
    const res = await apiFetch(`/users/${id}`, { method: 'DELETE' });
    toast(res.message);
    pageUsers(); // Reload
  } catch (e) { toast(e.message, 'err'); }
}

function openRoleModal(u){
  window._roleUserId = u.id;
  openModal(`<div class="modal"><div class="mh"><div class="mt">👤 จัดการสิทธิ์การใช้งาน</div><button class="mx" onclick="closeModal()">✕</button></div>
  <div class="mb2">
    <div class="alert al-info mb2">ชื่อ: <strong>${u.name}</strong><br>อีเมล: ${u.email}</div>
    <div class="fg"><label class="fl">ระบุสิทธิ์ใหม่</label>
      <select class="fc" id="ur-s">
        <option value="user" ${u.role==='user'?'selected':''}>👤 ผู้ใช้ทั่วไป (General User)</option>
        <option value="technician" ${u.role==='technician'?'selected':''}>🔧 ช่างซ่อม (Technician)</option>
        <option value="manager" ${u.role==='manager'?'selected':''}>📋 หัวหน้าช่าง (Manager)</option>
        <option value="admin" ${u.role==='admin'?'selected':''}>🛡️ ผู้ดูแลระบบ (Admin)</option>
      </select>
    </div>
  </div>
  <div class="mf"><button class="btn btn-ghost" onclick="closeModal()">ยกเลิก</button><button class="btn btn-primary" onclick="doChangeRole()">✅ บันทึก</button></div></div>`);
}

async function doChangeRole(){
  const id = window._roleUserId;
  const nr = document.getElementById('ur-s')?.value;
  if(!id || !nr){ toast('เกิดข้อผิดพลาด','err'); return; }
  try {
    const res = await apiFetch(`/users/${id}/role`, { method:'PATCH', body:JSON.stringify({ role: nr }) });
    toast(res.message);
    closeModal();
    pageUsers();
  } catch(e) { toast(e.message, 'err'); }
}

