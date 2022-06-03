import { google } from "googleapis";

// eslint-disable-next-line import/prefer-default-export
export class MyGoogleAuth extends google.auth.OAuth2 {
  override isTokenExpiring() {
    return super.isTokenExpiring();
  }

  override async refreshToken(token: string | null | undefined) {
    return super.refreshToken(token);
  }
}
