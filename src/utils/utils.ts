export function decodeEncodedCreds(encodedCredentials: string){
const decodedString = Buffer.from(encodedCredentials, 'base64').toString('utf-8');

const [email, password] = decodedString.split(':');
return {"email": email, "password": password};
}