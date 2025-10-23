import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  accentLeft: {
    position: 'absolute',
    top: -140,
    left: -140,
    width: 280,
    height: 280,
    borderRadius: 160,
    backgroundColor: '#1F1F1F',
    opacity: 0.55,
  },
  accentRight: {
    position: 'absolute',
    top: -120,
    right: -120,
    width: 260,
    height: 260,
    borderRadius: 150,
    backgroundColor: '#1B1B1B',
    opacity: 0.4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    gap: 12,
    flexWrap: 'wrap',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    minWidth: 110,
  },
  refreshButtonDisabled: {
    opacity: 0.6,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  addServiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#58F29A',
    shadowColor: '#58F29A',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 18,
  },
  addServiceText: {
    color: '#0F0F0F',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  headerSection: {
    paddingTop: 24,
    paddingBottom: 32,
    gap: 18,
  },
  introBlock: {
    gap: 6,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  fullWidthInput: {
    width: '100%',
  },
  primaryButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonEnabled: {
    backgroundColor: '#58F29A',
    shadowColor: '#58F29A',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 20,
  },
  primaryButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  primaryButtonText: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  primaryButtonTextEnabled: {
    color: '#0F0F0F',
  },
  primaryButtonTextDisabled: {
    color: 'rgba(255,255,255,0.45)',
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  providersLoading: {
    paddingVertical: 12,
  },
  providerHint: {
    color: 'rgba(255,255,255,0.45)',
    fontStyle: 'italic',
  },
  providerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  providerChip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  providerChipSelected: {
    backgroundColor: 'rgba(88, 242, 154, 0.18)',
    borderColor: '#58F29A',
  },
  providerChipText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  providerChipTextSelected: {
    color: '#58F29A',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  durationInput: {
    flex: 1,
  },
  durationSuffix: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  durationSuffixText: {
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  listTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  serviceCard: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 8,
  },
  serviceName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  serviceMeta: {
    color: 'rgba(255,255,255,0.7)',
  },
  serviceMetaMuted: {
    color: 'rgba(255,255,255,0.45)',
  },
  serviceNotes: {
    color: 'rgba(255,255,255,0.55)',
    fontStyle: 'italic',
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusActive: {
    backgroundColor: 'rgba(61, 213, 152, 0.2)',
  },
  statusPaused: {
    backgroundColor: 'rgba(255,107,107,0.2)',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  serviceActions: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  secondaryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  dangerButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,107,107,0.15)',
  },
  dangerText: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: '#151515',
    borderRadius: 24,
    padding: 20,
    gap: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  closeText: {
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '600',
  },
  modalBody: {
    gap: 14,
  },
  notesInput: {
    minHeight: 96,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 10,
  },
});
