/**
 * Payload Object to be signed and verified by JWT. Used by the auth middleware to pass data to the request by token signing (jwt.sign) and token verification (jwt.verify).
 * @param userId:string
 * @param role: string 
 */
type payload = { userId: string, role: string };

export default payload;
