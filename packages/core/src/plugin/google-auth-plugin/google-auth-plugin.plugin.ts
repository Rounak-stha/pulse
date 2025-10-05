import gql from 'graphql-tag';

import { PluginCommonModule } from '../plugin-common.module';
import { VendurePlugin } from '../vendure-plugin';

import { GoogleAuthStrategy } from './google-auth-strategy';

export interface GoogleAuthPluginOptions {
  googleClientId: string;
  googleClientSecret: string;
}

@VendurePlugin({
  imports: [PluginCommonModule],
  configuration: (config) => {
    const options = GoogleAuthPlugin.options;

    if (options?.googleClientId) {
      config.authOptions.adminAuthenticationStrategy.push(
        new GoogleAuthStrategy({ googleClientId: options.googleClientId, googleClientSecret: options.googleClientSecret })
      );
    }
    return config;
  },
  adminApiExtensions: {
    schema: gql`
      input GoogleAuthInput {
        token: String!
        shopname: String
        shopcode: String
      }

      extend input AuthenticationInput {
        google: GoogleAuthInput
      }
    `
  }
})
export class GoogleAuthPlugin {
  static options: GoogleAuthPluginOptions;

  static init(options: GoogleAuthPluginOptions) {
    this.options = options;
    return GoogleAuthPlugin;
  }
}