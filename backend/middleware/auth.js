const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'maint_sys_secret_2568';

const { db } = require('../db/database');

async function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบก่อน' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    
    // FETCH LATEST FROM DB (Fix for stale role issue)
    const userRef = db.collection('users').doc(String(decoded.id));
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) return res.status(401).json({ error: 'ไม่พบผู้ใช้งานในระบบ' });
    
    const user = userDoc.data();
    if (user.is_active === 0) return res.status(403).json({ error: 'บัญชีของคุณถูกระงับการใช้งาน' });

    // Use latest role from DB, override JWT role
    req.user = { ...decoded, role: user.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token ไม่ถูกต้องหรือหมดอายุ กรุณาเข้าสู่ระบบใหม่' });
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return res.status(403).json({ error: 'ไม่มีสิทธิ์เข้าถึงส่วนนี้' });
    next();
  };
}

module.exports = { authenticate, authorize, JWT_SECRET };