import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import WebEngage from 'react-native-webengage';
import {getArchitectureInfo} from '../utils/ArchitectureDetector';

type TestResult = {
  name: string;
  status: 'pass' | 'fail' | 'running' | 'pending';
  error?: string;
};

const SDKTestScreen = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);
  const archInfo = getArchitectureInfo();

  const updateResult = (name: string, status: TestResult['status'], error?: string) => {
    setResults(prev => {
      const idx = prev.findIndex(r => r.name === name);
      const updated = {name, status, error};
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      return [...prev, updated];
    });
  };

  const runTest = async (name: string, fn: () => void | Promise<void>) => {
    updateResult(name, 'running');
    try {
      await fn();
      updateResult(name, 'pass');
    } catch (e: any) {
      updateResult(name, 'fail', e.message || String(e));
    }
  };

  const runAllTests = useCallback(async () => {
    setResults([]);
    setRunning(true);

    const we = new WebEngage();

    // 1. Initialize
    await runTest('initialize()', () => {
      we.initialize();
    });

    // 2. Track event without attributes
    await runTest('track(name)', () => {
      we.track('TestEvent_NoAttr');
    });

    // 3. Track event with attributes
    await runTest('track(name, attrs)', () => {
      we.track('TestEvent_WithAttr', {
        stringKey: 'value',
        numberKey: 42,
        boolKey: true,
        dateKey: '2023-10-10T10:10:10.000Z',
        arrayKey: ['a', 'b'],
        mapKey: {nested: 'value'},
      });
    });

    // 4. Screen without data
    await runTest('screen(name)', () => {
      we.screen('TestScreen');
    });

    // 5. Screen with data
    await runTest('screen(name, data)', () => {
      we.screen('TestScreen', {section: 'integration_test'});
    });

    // 6. Login without JWT
    await runTest('user.login(id)', () => {
      // we.user.login('test_user_bridgeless');
    });

    // 7. Set user attributes
    await runTest('user.setFirstName()', () => {
      we.user.setFirstName('TestFirst');
    });

    await runTest('user.setLastName()', () => {
      we.user.setLastName('TestLast');
    });

    await runTest('user.setEmail()', () => {
      we.user.setEmail('test@bridgeless.com');
    });

    await runTest('user.setHashedEmail()', () => {
      we.user.setHashedEmail('hashed_email_123');
    });

    await runTest('user.setPhone()', () => {
      we.user.setPhone('+1234567890');
    });

    await runTest('user.setHashedPhone()', () => {
      we.user.setHashedPhone('hashed_phone_456');
    });

    await runTest('user.setCompany()', () => {
      we.user.setCompany('TestCompany');
    });

    await runTest('user.setGender()', () => {
      we.user.setGender('male');
    });

    await runTest('user.setBirthDateString()', () => {
      we.user.setBirthDateString('1990-05-15');
    });

    await runTest('user.setLocation()', () => {
      we.user.setLocation(19.076, 72.8777);
    });

    // 8. Custom attributes
    await runTest('user.setAttribute(string)', () => {
      we.user.setAttribute('city', 'Mumbai');
    });

    await runTest('user.setAttribute(number)', () => {
      we.user.setAttribute('age', 30);
    });

    await runTest('user.setAttribute(boolean)', () => {
      we.user.setAttribute('isPremium', true);
    });

    await runTest('user.setAttribute(array)', () => {
      we.user.setAttribute('interests', ['tech', 'music']);
    });

    await runTest('user.setAttribute(map)', () => {
      we.user.setAttribute('address', {street: '123 Main', zip: '10001'});
    });

    // 9. Delete attributes
    await runTest('user.deleteAttribute()', () => {
      we.user.deleteAttribute('city');
    });

    await runTest('user.deleteAttributes([])', () => {
      we.user.deleteAttributes(['age', 'isPremium']);
    });

    // 10. Opt-in channels
    await runTest('user.setOptIn(push)', () => {
      we.user.setOptIn('push', true);
    });

    await runTest('user.setOptIn(email)', () => {
      we.user.setOptIn('email', true);
    });

    await runTest('user.setOptIn(sms)', () => {
      we.user.setOptIn('sms', true);
    });

    await runTest('user.setOptIn(in_app)', () => {
      we.user.setOptIn('in_app', true);
    });

    await runTest('user.setOptIn(whatsapp)', () => {
      we.user.setOptIn('whatsapp', true);
    });

    await runTest('user.setOptIn(viber)', () => {
      we.user.setOptIn('viber', true);
    });

    await runTest('user.setDevicePushOptIn()', () => {
      we.user.setDevicePushOptIn(true);
    });

    // 11. Push callbacks
    await runTest('push.onClick(callback)', () => {
      const sub = we.push.onClick((data) => {
        console.log('SDKTest: push clicked', data);
      });
      if (!sub) throw new Error('No subscription returned');
    });

    // 12. In-app callbacks
    await runTest('notification.onPrepare()', () => {
      const sub = we.notification.onPrepare((data) => {
        console.log('SDKTest: inapp prepared', data);
      });
      if (!sub) throw new Error('No subscription returned');
    });

    await runTest('notification.onShown()', () => {
      const sub = we.notification.onShown((data) => {
        console.log('SDKTest: inapp shown', data);
      });
      if (!sub) throw new Error('No subscription returned');
    });

    await runTest('notification.onClick()', () => {
      const sub = we.notification.onClick((data, clickId) => {
        console.log('SDKTest: inapp clicked', data, clickId);
      });
      if (!sub) throw new Error('No subscription returned');
    });

    await runTest('notification.onDismiss()', () => {
      const sub = we.notification.onDismiss((data) => {
        console.log('SDKTest: inapp dismissed', data);
      });
      if (!sub) throw new Error('No subscription returned');
    });

    // 13. Universal link
    await runTest('universalLink.onClick()', () => {
      const sub = we.universalLink.onClick((location) => {
        console.log('SDKTest: universal link', location);
      });
      if (!sub) throw new Error('No subscription returned');
    });

    // 14. Anonymous ID callback
    await runTest('user.onAnonymousIdChanged()', () => {
      const sub = we.user.onAnonymousIdChanged((id) => {
        console.log('SDKTest: anonymous id changed', id);
      });
      if (!sub) throw new Error('No subscription returned');
    });

    // 15. Token invalidation callback
    await runTest('user.tokenInvalidatedCallback()', () => {
      const sub = we.user.tokenInvalidatedCallback((data) => {
        console.log('SDKTest: token invalidated', data);
      });
      if (!sub) throw new Error('No subscription returned');
    });

    // 16. Platform-specific: FCM token (Android only)
    if (Platform.OS === 'android') {
      await runTest('push.sendFcmToken()', () => {
        we.push.sendFcmToken('fake-fcm-token-for-test');
      });

      await runTest('startGAIDTracking()', () => {
        we.startGAIDTracking();
      });
    }

    // 17. Login with JWT
    await runTest('user.login(id, jwt)', () => {
      // we.user.login('test_user_jwt', 'fake-jwt-token');
    });

    // 18. Set secure token
    await runTest('user.setSecureToken()', () => {
      // we.user.setSecureToken('test_user_jwt', 'new-fake-jwt');
    });

    // 19. Logout
    await runTest('user.logout()', () => {
      // we.user.logout();
    });

    setRunning(false);
  }, []);

  const passCount = results.filter(r => r.status === 'pass').length;
  const failCount = results.filter(r => r.status === 'fail').length;
  const total = results.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.archText}>{archInfo.displayText}</Text>
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            Total: {total} | ✅ {passCount} | ❌ {failCount}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.runButton, running && styles.runButtonDisabled]}
          onPress={runAllTests}
          disabled={running}>
          <Text style={styles.runButtonText}>
            {running ? 'Running...' : 'Run All Tests'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.resultsList}>
        {results.map((result, index) => (
          <View key={index} style={styles.resultRow}>
            <Text style={styles.statusIcon}>
              {result.status === 'pass'
                ? '✅'
                : result.status === 'fail'
                ? '❌'
                : result.status === 'running'
                ? '⏳'
                : '⬜'}
            </Text>
            <View style={styles.resultContent}>
              <Text style={styles.testName}>{result.name}</Text>
              {result.error && (
                <Text style={styles.errorText}>{result.error}</Text>
              )}
            </View>
          </View>
        ))}
        {results.length === 0 && (
          <Text style={styles.placeholder}>
            Press "Run All Tests" to validate SDK APIs
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5'},
  header: {padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd'},
  archText: {fontSize: 14, fontWeight: '600', color: '#6200ee', marginBottom: 8, textAlign: 'center'},
  summary: {marginBottom: 12, alignItems: 'center'},
  summaryText: {fontSize: 16, fontWeight: 'bold'},
  runButton: {backgroundColor: '#6200ee', padding: 14, borderRadius: 8, alignItems: 'center'},
  runButtonDisabled: {backgroundColor: '#999'},
  runButtonText: {color: '#fff', fontSize: 16, fontWeight: '600'},
  resultsList: {flex: 1, padding: 12},
  resultRow: {flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 6, paddingHorizontal: 8, backgroundColor: '#fff', marginBottom: 4, borderRadius: 6},
  statusIcon: {fontSize: 16, marginRight: 10, marginTop: 2},
  resultContent: {flex: 1},
  testName: {fontSize: 14, fontWeight: '500'},
  errorText: {fontSize: 12, color: 'red', marginTop: 2},
  placeholder: {textAlign: 'center', marginTop: 40, fontSize: 16, color: '#888'},
});

export default SDKTestScreen;
