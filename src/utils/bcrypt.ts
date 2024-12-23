import bcrypt from 'bcrypt'

const saltRounds = 12

export const hashPassword = (password: string): string => {
  try {
    const salt = bcrypt.genSaltSync(saltRounds)
    return bcrypt.hashSync(password, salt)
  } catch (error) {
    console.error('Error hashing password:', error)
    throw error
  }
}

export const comparePassword = (password: string, hash: string): boolean => {
  try {
    return bcrypt.compareSync(password, hash)
  } catch (error) {
    console.error('Error comparing password:', error)
    throw error
  }
}
