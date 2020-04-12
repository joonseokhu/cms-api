import jwt from 'jsonwebtoken';

class JWT<Payload extends object> {
  constructor(
    private privateKey: string,
  ) {}

  sign = (payload: Payload, options: object = {}): Promise<string> => (
    new Promise((resolve, reject) => {
      jwt.sign(payload, this.privateKey, options, (err, token) => {
        if (err) return reject(err);
        return resolve(token);
      });
    })
  );

  verify = (token: string, options: object = {}): Promise<Payload> => (
    new Promise((resolve, reject) => {
      jwt.verify(token, this.privateKey, options, (err, payload: Payload) => {
        if (err) return reject(err);
        return resolve(payload);
      });
    })
  );
}

export default JWT;
