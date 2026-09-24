const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { query, getClient } = require('../../config/db');
const env = require('../../config/env');

const generateTokens = (user) => {
  const payload = { userId: user.id, tenantId: user.tenant_id, role: user.role };
  const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRY });
  const refreshToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRY });
  return { accessToken, refreshToken };
};

const setRefreshCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

exports.createOrg = async (req, res, next) => {
  try {
    const { name, email, password, orgName, industry } = req.body;
    const emailCheck = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) return res.status(400).json({ success: false, message: 'Email already in use' });

    const client = await getClient();
    try {
      await client.query('BEGIN');
      const tenantRes = await client.query('INSERT INTO tenants (name, industry) VALUES ($1, $2) RETURNING id', [orgName, industry]);
      const tenantId = tenantRes.rows[0].id;
      const hash = await bcrypt.hash(password, 10);
      const userRes = await client.query(
        `INSERT INTO users (tenant_id, name, email, password_hash, role) VALUES ($1, $2, $3, $4, 'tenant_admin') RETURNING id, tenant_id, name, email, role`,
        [tenantId, name, email, hash]
      );
      await client.query('COMMIT');

      const user = userRes.rows[0];
      const { accessToken, refreshToken } = generateTokens(user);
      setRefreshCookie(res, refreshToken);

      return res.status(201).json({ success: true, message: 'Organization created', data: { accessToken, user } });
    } catch (dbError) {
      await client.query('ROLLBACK');
      throw dbError; // Bubble up to outer catch
    } finally {
      client.release();
    }
  } catch (error) {
    next(error);
  }
};

exports.joinOrg = async (req, res, next) => {
  try {
    const { name, email, password, inviteCode } = req.body;
    const inviteRes = await query('SELECT * FROM invites WHERE code = $1 AND used_at IS NULL AND expires_at > NOW()', [inviteCode]);
    if (inviteRes.rows.length === 0) return res.status(400).json({ success: false, message: 'Invalid or expired invite code' });
    const invite = inviteRes.rows[0];

    const emailCheck = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) return res.status(400).json({ success: false, message: 'Email already in use' });

    const client = await getClient();
    try {
      await client.query('BEGIN');
      const hash = await bcrypt.hash(password, 10);
      const userRes = await client.query(
        `INSERT INTO users (tenant_id, name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, tenant_id, name, email, role`,
        [invite.tenant_id, name, email, hash, invite.role_to_assign]
      );
      await client.query('UPDATE invites SET used_at = NOW() WHERE id = $1', [invite.id]);
      await client.query('COMMIT');

      const user = userRes.rows[0];
      const { accessToken, refreshToken } = generateTokens(user);
      setRefreshCookie(res, refreshToken);

      return res.status(201).json({ success: true, message: 'Joined organization', data: { accessToken, user } });
    } catch (dbError) {
      await client.query('ROLLBACK');
      throw dbError; // Bubble up to outer catch
    } finally {
      client.release();
    }
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userRes = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    
    const user = userRes.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const { accessToken, refreshToken } = generateTokens(user);
    setRefreshCookie(res, refreshToken);

    const { password_hash, ...profile } = user;
    return res.status(200).json({ success: true, message: 'Logged in successfully', data: { accessToken, user: profile } });
  } catch (error) {
    next(error);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(401).json({ success: false, message: 'No refresh token provided' });

    const payload = jwt.verify(refreshToken, env.JWT_SECRET);
    
    // Explicit Database verification
    const userCheck = await query(
      'SELECT id, tenant_id, role FROM users WHERE id = $1',
      [payload.userId]
    );
    if (userCheck.rows.length === 0) {
      res.clearCookie('refreshToken');
      return res.status(401).json({ success: false, message: 'Invalid session' });
    }
    
    const user = userCheck.rows[0];
    const { accessToken } = generateTokens({ id: user.id, tenant_id: user.tenant_id, role: user.role });

    return res.status(200).json({ success: true, message: 'Token refreshed', data: { accessToken } });
  } catch (error) {
    res.clearCookie('refreshToken');
    return res.status(401).json({ success: false, message: 'Refresh token invalid or expired' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('refreshToken');
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
};

exports.getMe = async (req, res, next) => {
  try {
    const userRes = await query('SELECT id, tenant_id, name, email, role, created_at FROM users WHERE id = $1', [req.user.userId]);
    if (userRes.rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ success: true, message: 'User profile retrieved', data: { user: userRes.rows[0] } });
  } catch (error) {
    next(error);
  }
};

exports.createInvite = async (req, res, next) => {
  try {
    const { role_to_assign, expiresInDays } = req.body;
    const code = crypto.randomBytes(8).toString('hex');
    const inviteRes = await query(
      `INSERT INTO invites (tenant_id, code, role_to_assign, expires_at) VALUES ($1, $2, $3, NOW() + INTERVAL '1 day' * $4) RETURNING code, expires_at`,
      [req.user.tenantId, role_to_assign, expiresInDays]
    );
    return res.status(201).json({ success: true, message: 'Invite created', data: inviteRes.rows[0] });
  } catch (error) {
    next(error);
  }
};
