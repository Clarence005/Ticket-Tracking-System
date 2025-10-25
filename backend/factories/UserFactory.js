const bcrypt = require('bcryptjs');

class UserFactory {
  static async createStudent(userData) {
    const { name, email, password, studentId } = userData;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return {
      name,
      email,
      password: hashedPassword,
      role: 'student',
      studentId
    };
  }

  static async createAdmin(userData) {
    const { name, email, password } = userData;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return {
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    };
  }

  static async createSupport(userData) {
    const { name, email, password } = userData;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return {
      name,
      email,
      password: hashedPassword,
      role: 'support'
    };
  }
}

module.exports = UserFactory;