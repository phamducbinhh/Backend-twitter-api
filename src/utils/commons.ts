import jwt from 'jsonwebtoken'

export const numberEnumToArray = (numberEnum: { [key: string]: string | number }) => {
  return Object.values(numberEnum).filter((value) => typeof value === 'number') as number[]
}

export const verifyAccessToken = async (access_token: string, secretKey: string) => {
  try {
    const decoded_authorization = jwt.verify(access_token, secretKey)
    return decoded_authorization
  } catch (error: any) {
    console.error('Invalid token:', error.message)
    return null
  }
}
