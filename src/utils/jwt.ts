import jwt from 'jsonwebtoken';

class JWT {
  constructor(
    private privateKey: string,
    public options: object,
  ) {

  }

  public sign = (payload: object): Promise<string> => new Promise((resolve, reject) => {
    jwt.sign(payload, this.privateKey, this.options, (err, token) => {
      if (err) return reject(err);
      return resolve(token);
    });
  });

  public verify = (token: string): Promise<object> => new Promise((resolve, reject) => {
    jwt.verify(token, this.privateKey, (err, payload: object) => {
      if (err) return reject(err);
      return resolve(payload);
    });
  });
}

export default JWT;
