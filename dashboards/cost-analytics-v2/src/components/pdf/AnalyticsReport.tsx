import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statBox: {
    width: '30%',
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 4,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 4,
  },
  tableHeaderCell: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4b5563',
    width: '20%',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableCell: {
    fontSize: 10,
    color: '#374151',
    width: '20%',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: '#9ca3af',
    textAlign: 'center',
  },
})

interface SessionData {
  sessionKey: string
  model: string
  totalTokens: number
  cost: number
  updatedAt: number
}

interface ReportData {
  title?: string
  generatedAt: string
  dateRange?: string
  totalCost: number
  totalTokens: number
  sessionCount: number
  sessions: SessionData[]
}

export function AnalyticsReport({ data }: { data: ReportData }) {
  const { 
    title = 'ESTUDIO AI Analytics Report',
    generatedAt = new Date().toISOString(),
    dateRange = 'Last 7 days',
    totalCost = 0,
    totalTokens = 0,
    sessionCount = 0,
    sessions = []
  } = data

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            Generated: {new Date(generatedAt).toLocaleString()} | Period: {dateRange}
          </Text>
        </View>

        {/* Stats Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total Cost</Text>
              <Text style={styles.statValue}>${totalCost.toFixed(2)}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total Tokens</Text>
              <Text style={styles.statValue}>{totalTokens.toLocaleString()}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Sessions</Text>
              <Text style={styles.statValue}>{sessionCount}</Text>
            </View>
          </View>
        </View>

        {/* Sessions Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sessions</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { width: '30%' }]}>Model</Text>
              <Text style={[styles.tableHeaderCell, { width: '25%' }]}>Tokens</Text>
              <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Cost</Text>
              <Text style={[styles.tableHeaderCell, { width: '25%' }]}>Date</Text>
            </View>
            {sessions.slice(0, 30).map((session, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: '30%' }]}>{session.model}</Text>
                <Text style={[styles.tableCell, { width: '25%' }]}>{session.totalTokens.toLocaleString()}</Text>
                <Text style={[styles.tableCell, { width: '20%' }]}>${session.cost.toFixed(4)}</Text>
                <Text style={[styles.tableCell, { width: '25%' }]}>
                  {new Date(session.updatedAt).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
          {sessions.length > 30 && (
            <Text style={{ fontSize: 10, color: '#6b7280', marginTop: 10 }}>
              Showing first 30 of {sessions.length} sessions
            </Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ESTUDIO AI Analytics | Generated automatically by OpenClaw
          </Text>
        </View>
      </Page>
    </Document>
  )
}
