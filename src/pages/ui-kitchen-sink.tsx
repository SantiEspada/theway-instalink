import {
  LoadingState,
  LoadingStateProps,
} from '../common/components/LoadingState';
import BackstageHeader, {
  BackstageHeaderProps,
} from '../components/BackstageHeader';

function backstageHeaderFixture() {
  const props: BackstageHeaderProps = {
    appName: 'App Name',
    authToken: 'auth-token',
    availableApps: [
      {
        key: 'dashboard',
        label: 'Dashboard',
      },
      {
        key: 'sheets',
        label: 'Sheets',
      },
      {
        key: 'messages',
        label: 'Messages',
      },
    ],
    currentApp: '',
    onCurrentAppChange: (newCurrentApp) => {
      alert(`New currentApp: ${newCurrentApp}`);
    },
    userEmail: 'john@foo.com',
  };

  return <BackstageHeader {...props} />;
}
function loadingStateFixture() {
  const props: LoadingStateProps = {
    label: 'Sincronizando publicaciones de Instagram',
  };

  return <LoadingState {...props} />;
}

export default function UIKitchenSink() {
  return (
    <>
      <h1>UI Kitchen Sink</h1>
      <h2>BackstageHeader</h2>
      <div>{backstageHeaderFixture()}</div>
      <hr />
      <h2>LoadingState</h2>
      <div>{loadingStateFixture()}</div>
    </>
  );
}
