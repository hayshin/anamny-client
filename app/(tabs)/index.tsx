import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function HomeScreen() {
  const { user } = useAuth();

  const handleFeaturePress = (feature: string) => {
    Alert.alert('Coming Soon', `${feature} feature will be available soon!`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Welcome back{user?.full_name ? `, ${user.full_name}` : ''}!
        </Text>
        <Text style={styles.subtitle}>How are you feeling today?</Text>
      </View>

      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: '#3498db' }]}
            onPress={() => handleFeaturePress('AI Chat')}
          >
            <IconSymbol size={32} name="bubble.left.and.bubble.right.fill" color="#fff" />
            <Text style={styles.actionText}>AI Chat</Text>
            <Text style={styles.actionSubtext}>Describe symptoms</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: '#27ae60' }]}
            onPress={() => handleFeaturePress('Add Record')}
          >
            <IconSymbol size={32} name="plus.circle.fill" color="#fff" />
            <Text style={styles.actionText}>Add Record</Text>
            <Text style={styles.actionSubtext}>Upload test results</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: '#e74c3c' }]}
            onPress={() => handleFeaturePress('Medications')}
          >
            <IconSymbol size={32} name="pills.fill" color="#fff" />
            <Text style={styles.actionText}>Medications</Text>
            <Text style={styles.actionSubtext}>Set reminders</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: '#f39c12' }]}
            onPress={() => handleFeaturePress('Appointments')}
          >
            <IconSymbol size={32} name="calendar" color="#fff" />
            <Text style={styles.actionText}>Appointments</Text>
            <Text style={styles.actionSubtext}>Schedule visits</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.sectionTitle}>Health Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <IconSymbol size={24} name="doc.text.fill" color="#3498db" />
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryLabel}>Medical Records</Text>
              <Text style={styles.summaryValue}>0 records</Text>
            </View>
          </View>
          
          <View style={styles.summaryItem}>
            <IconSymbol size={24} name="bell.fill" color="#e74c3c" />
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryLabel}>Reminders</Text>
              <Text style={styles.summaryValue}>0 pending</Text>
            </View>
          </View>
          
          <View style={styles.summaryItem}>
            <IconSymbol size={24} name="heart.fill" color="#e91e63" />
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryLabel}>Health Score</Text>
              <Text style={styles.summaryValue}>Good</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.tipsContainer}>
        <Text style={styles.sectionTitle}>Health Tips</Text>
        <View style={styles.tipCard}>
          <IconSymbol size={24} name="lightbulb.fill" color="#f39c12" />
          <View style={styles.tipTextContainer}>
            <Text style={styles.tipTitle}>Stay Hydrated</Text>
            <Text style={styles.tipDescription}>
              Drink at least 8 glasses of water daily to maintain good health.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  quickActionsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  actionSubtext: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
    marginTop: 4,
  },
  summaryContainer: {
    padding: 20,
    paddingTop: 0,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  tipsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  tipCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
});
 