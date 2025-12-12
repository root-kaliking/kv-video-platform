// 用户认证工具模块

// 密码哈希
import bcrypt from 'bcryptjs';

export function hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

// 密码验证
export function verifyPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
};

// 生成JWToken
export function generateToken(user) {
    const token = crypto.randomBytes(32).toString('hex');
    return token;
};

// 验证码生成
export function generateVerificationCode(length = 6) {
    return Math.floor(Math.random() * Math.pow(10, length))
        .toString()
        .padStart(length, '0');
};