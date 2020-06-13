import React from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

const needsEmailVerification = authUser =>
  authUser &&
  !authUser.emailVerified;

const DefaultComponent = ({
  buttonTitle = 'Send confirmation E-Mail',
  children,
  onClick,
  disabled
}) => (
  <div>
    <p>{children}</p>
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      {buttonTitle}
    </button>
  </div>
);

const MESSAGE_IF_EMAIL_IS_SENT = `
  E-Mail confirmation sent: Check your E-Mails (Spam
  folder included) for a confirmation E-Mail.
  Refresh this page once you confirmed your E-Mail.
`;

const MESSAGE_IF_EMAIL_IS_NOT_SENT = `
  Verify your E-Mail: Check your E-Mails (Spam folder
  included) for a confirmation E-Mail or send
  another confirmation E-Mail.
`;

const withEmailVerification = Component => {
  class WithEmailVerification extends React.Component {
    constructor(props) {
      super(props);

      this.state = { isSent: false };
    }
    
    onSendEmailVerification = () => {
      this.props.firebase
        .doSendEmailVerification()
        .then(() => this.setState({ isSent: true }));
    };

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser =>
            needsEmailVerification(authUser) ? (
              <DefaultComponent
                onClick={this.onSendEmailVerification}
                disabled={this.state.isSent}
              >
                {this.state.isSent ? 
                  MESSAGE_IF_EMAIL_IS_SENT
                : 
                  MESSAGE_IF_EMAIL_IS_NOT_SENT
                }
              </DefaultComponent>
            ) : (
              <Component {...this.props} />
            )
          }
        </AuthUserContext.Consumer>
      );
    }
  }

  return withFirebase(WithEmailVerification);
};

export default withEmailVerification;
