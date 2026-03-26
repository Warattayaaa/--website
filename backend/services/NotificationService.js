/* ══════════════════════════════════════════
   NotificationService.js  —  SRS 2.1.2
   Email: Nodemailer/SMTP
══════════════════════════════════════════ */
const nodemailer = require('nodemailer');
const { db, Timestamp } = require('../db/database');

// ── Load config from Firestore (cached per cold-start) ─────────────────────
let _cfg = null;
async function getCfg() {
  if (_cfg) return _cfg;
  const doc = await db.collection('settings').doc('notifications').get();
  _cfg = doc.exists ? doc.data() : {};
  return _cfg;
}
function invalidateCfg() { _cfg = null; }

// ── Send Email ──────────────────────────────────────────────────────────────
async function sendEmail(cfg, { to, subject, html }) {
  if (!to) return { ok: false, reason: 'No recipient' };
  if (!cfg.smtp_host || !cfg.smtp_user || !cfg.smtp_pass) {
    return { ok: false, reason: 'No SMTP configured' };
  }
  try {
    const transporter = nodemailer.createTransport({
      host: cfg.smtp_host,
      port: parseInt(cfg.smtp_port) || 587,
      secure: parseInt(cfg.smtp_port) === 465,
      auth: { user: cfg.smtp_user, pass: cfg.smtp_pass },
      tls: { rejectUnauthorized: false }
    });
    const info = await transporter.sendMail({
      from: `"${cfg.smtp_from_name || 'ระบบแจ้งซ่อม SDDI'}" <${cfg.smtp_user}>`,
      to, subject, html
    });
    return { ok: true };
  } catch(e) {
    console.error('[SMTP] Error:', e.message);
    return { ok: false, reason: e.message };
  }
}

// (SMS/Resend Removed as per user request)

async function getUser(uid) {
  const doc = await db.collection('users').doc(String(uid)).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

function emailHTML(title, lines, tracking, url) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;background:#f4f4f4;padding:20px">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1)">
    <div style="background:#1a1a2e;padding:20px 24px"><div style="color:#00d4ff;font-weight:700;font-size:1.1rem">🔧 ระบบแจ้งซ่อม SDDI</div></div>
    <div style="padding:24px">
      <h2 style="margin:0 0 12px;color:#1a1a2e;font-size:1.1rem">${title}</h2>
      ${lines.map(l=>`<p style="margin:6px 0;color:#374151;font-size:.9rem">${l}</p>`).join('')}
      ${tracking?`<div style="margin:16px 0;padding:12px;background:#f0f9ff;border-left:4px solid #00d4ff;border-radius:4px;font-weight:700;font-size:1rem">รหัสติดตาม: ${tracking}</div>`:''}
      ${url?`<a href="${url}" style="display:inline-block;margin-top:12px;padding:10px 20px;background:#00d4ff;color:#1a1a2e;border-radius:6px;text-decoration:none;font-weight:700">เปิดระบบ &rarr;</a>`:''}
    </div>
    <div style="padding:12px 24px;background:#f9fafb;font-size:.8rem;color:#9ca3af">ส่งโดยระบบแจ้งซ่อมอัตโนมัติ SDDI • อย่าตอบกลับอีเมลนี้</div>
  </div></body></html>`;
}

async function notifyNewRequest(request, requester) {
  try {
    const cfg = await getCfg();
    if (!cfg.enabled || !cfg.email_enabled) return;
    const appUrl = 'https://sddi-2025.web.app';
    const isUrgent = request.urgency === 'ฉุกเฉิน';

    if (requester?.email) {
      const title = `✅ รับแจ้งซ่อมเรียบร้อย — ${request.tracking_id}`;
      const lines = [`เรียน <strong>${requester.name || 'ผู้ใช้งาน'}</strong>`, `ระบบได้รับการแจ้งซ่อมของท่านเรียบร้อยแล้ว`, `&nbsp;`, `สถานที่: ${request.location || 'ไม่ระบุ'}`, `ความเร่งด่วน: <strong>${request.urgency}</strong>` ];
      await sendEmail(cfg, { to: requester.email, subject: title, html: emailHTML(title, lines, request.tracking_id, `${appUrl}/index.html`) });
    }

    const managers = await db.collection('users').where('role', 'in', ['manager', 'admin']).where('is_active', '==', 1).get();
    for (const doc of managers.docs) {
      const m = doc.data();
      const mgTitle = `🔔 ${isUrgent ? '🚨 [ฉุกเฉิน] ' : ''}แจ้งซ่อมใหม่ — ${request.category}`;
      const mgLines = [`ผู้แจ้ง: <strong>${requester?.name || 'ผู้ใช้งาน'}</strong>`, `สถานที่: ${request.location || 'ไม่ระบุ'}`, `ความเร่งด่วน: <strong>${request.urgency}</strong>` ];
      const mgUrl = `${appUrl}/manager.html?view=request-detail&id=${request.id}`;
      if (m.email) await sendEmail(cfg, { to: m.email, subject: mgTitle, html: emailHTML(mgTitle, mgLines, request.tracking_id, mgUrl) });
    }
  } catch(e) { console.error('[Notify] Error:', e.message); }
}

async function notifyAssigned(request, tech) {
  try {
    const cfg = await getCfg();
    if (!cfg.enabled || !cfg.email_enabled) return;
    const url = `https://sddi-2025.web.app/technician.html?view=request-detail&id=${request.id}`;
    const title = `⚙️ งานใหม่ถูกมอบหมายให้คุณ`;
    const lines = [`รหัสงาน: ${request.tracking_id}`, `ประเภท: ${request.category}`, `สถานที่: ${request.location||'–'}`];
    if (tech?.email) await sendEmail(cfg, { to: tech.email, subject: title, html: emailHTML(title, lines, request.tracking_id, url) });

    const requester = await getUser(request.requester_id);
    if (requester?.email) {
      const t2 = `✅ งานซ่อมของคุณได้รับการมอบหมายช่างแล้ว`;
      const l2 = [`รหัสงาน: ${request.tracking_id}`, `ช่างรับผิดชอบ: ${tech?.name||'–'}`];
      const url2 = `https://sddi-2025.web.app/user.html?view=request-detail&id=${request.id}`;
      await sendEmail(cfg, { to: requester.email, subject: t2, html: emailHTML(t2, l2, request.tracking_id, url2) });
    }
  } catch(e) { console.error('[Notify] Error:', e.message); }
}

async function notifyCompleted(request) {
  try {
    const cfg = await getCfg();
    if (!cfg.enabled || !cfg.email_enabled) return;
    const requester = await getUser(request.requester_id);
    if (requester?.email) {
      const url = `https://sddi-2025.web.app/user.html?view=request-detail&id=${request.id}`;
      const title = `🎉 งานซ่อมของคุณเสร็จสมบูรณ์แล้ว`;
      const lines = [`รหัสงาน: ${request.tracking_id}`, `กรุณาประเมินความพึงพอใจในระบบเพื่อพัฒนาการบริการ` ];
      await sendEmail(cfg, { to: requester.email, subject: title, html: emailHTML(title, lines, request.tracking_id, url) });
    }
  } catch(e) { console.error('[Notify] Error:', e.message); }
}

async function notifySLAWarning(request) {
  try {
    const cfg = await getCfg();
    if (!cfg.enabled || !cfg.email_enabled) return;
    const managers = await db.collection('users').where('role','in',['manager','admin']).get();
    for (const doc of managers.docs) {
      const m = doc.data();
      if (m.email) {
        const title = `⚠️ งานซ่อมใกล้เกิน SLA — ${request.tracking_id}`;
        const lines = [`งาน: ${request.description?.slice(0,60)}`, `กำหนด SLA: ${new Date(request.sla_deadline).toLocaleString('th-TH')}`];
        await sendEmail(cfg, { to: m.email, subject: title, html: emailHTML(title, lines, request.tracking_id) });
      }
    }
  } catch(e) { console.error('[Notify] Error:', e.message); }
}

module.exports = { notifyNewRequest, notifyAssigned, notifyCompleted, notifySLAWarning, getCfg, invalidateCfg, sendEmail };
