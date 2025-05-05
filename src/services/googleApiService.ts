import { google } from "googleapis";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI as string;

class GoogleApiService {
  public instance: InstanceType<typeof google.auth.OAuth2>;

  constructor(
    _instance = new google.auth.OAuth2({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      redirectUri: GOOGLE_REDIRECT_URI,
    })
  ) {
    this.instance = _instance;
  }

  generateAuthUrl(opts?: Parameters<typeof this.instance.generateAuthUrl>[0]) {
    const url = this.instance.generateAuthUrl(opts);
    return url;
  }

  async getToken(code: string) {
    return this.instance.getToken(code);
  }
}

export default new GoogleApiService();
