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

export default function UIKitchenSink() {
  return <div>{backstageHeaderFixture()}</div>;
}
