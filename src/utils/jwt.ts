import jwt from 'jsonwebtoken';

class JWT {
  constructor(
    private privateKey: string,
  ) {}

  sign = (payload: object, options: object = {}): Promise<string> => (
    new Promise((resolve, reject) => {
      jwt.sign(payload, this.privateKey, options, (err, token) => {
        if (err) return reject(err);
        return resolve(token);
      });
    })
  );

  verify = (token: string, options: object = {}): Promise<object> => (
    new Promise((resolve, reject) => {
      jwt.verify(token, this.privateKey, options, (err, payload: object) => {
        if (err) return reject(err);
        return resolve(payload);
      });
    })
  );
}

export default JWT;
