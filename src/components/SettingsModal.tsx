import { Modal } from './Modal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

export function SettingsModal({ isOpen, onClose, onLogout }: SettingsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <div className="settings-sections">
        {onLogout && (
          <section className="settings-section">
            <h4>Account</h4>
            <button type="button" className="settings-logout" onClick={onLogout}>
              Log out
            </button>
          </section>
        )}
        <section className="settings-section">
          <h4>App Settings</h4>
          <label className="settings-row">
            <span>Theme</span>
            <select>
              <option>Dark</option>
              <option>Light</option>
            </select>
          </label>
          <label className="settings-row">
            <span>Language</span>
            <select>
              <option>English</option>
            </select>
          </label>
        </section>
        <section className="settings-section">
          <h4>Notifications</h4>
          <label className="settings-row">
            <span>Enable desktop notifications</span>
            <input type="checkbox" defaultChecked />
          </label>
          <label className="settings-row">
            <span>Sound</span>
            <input type="checkbox" defaultChecked />
          </label>
        </section>
        <section className="settings-section">
          <h4>Privacy & Safety</h4>
          <label className="settings-row">
            <span>Allow direct messages from server members</span>
            <input type="checkbox" defaultChecked />
          </label>
        </section>
      </div>
    </Modal>
  );
}
