import BackstageHeader, {
  BackstageHeaderProps,
} from '../components/BackstageHeader';

function backstageHeaderFixture() {
  const props: BackstageHeaderProps = {
    appName: 'App Name',
    authToken: 'auth-token',
    availableApps: [
      {
        label: 'Dashboard',
        value: '',
      },
      {
        label: 'Sheets',
        value: 'sheets',
      },
      {
        label: 'Messages',
        value: 'messages',
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
