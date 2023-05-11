import crypto from 'crypto';

class DevKeys {
    _privateKey: string;
    _publicKey: string;

    constructor() {
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'pkcs1',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: 'top secret'
            }
        });
        this._privateKey = privateKey;
        this._publicKey = publicKey;
    }

    sign(data: any): Buffer {
        const sign = crypto.createSign('SHA256');
        sign.write(data);
        sign.end();
        return sign.sign({
            key: this._privateKey,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        });
    }

    verify(data: any, signature: any): boolean {
        const verify = crypto.createVerify('SHA256');
        verify.write(data);
        verify.end();
        return verify.verify({
            key: this._publicKey,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        }, signature);
    }

    encrypt(data: any): string {
        const encrypted = crypto.publicEncrypt({
            key: this._publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256',
        }, Buffer.from(data));
        return encrypted.toString('base64');
    }

    decrypt(data: any): string {
        const decrypted = crypto.privateDecrypt({
            key: this.privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256',
        }, Buffer.from(data, 'base64'));
        return decrypted.toString('utf8');
    }

    get publicKey(): string {
        return this._publicKey;
    }

    get privateKey(): string {
        return this._privateKey;
    }
}

export default DevKeys;