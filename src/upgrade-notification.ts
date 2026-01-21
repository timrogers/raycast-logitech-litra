import { LocalStorage } from "@raycast/api";

const LAST_UPGRADE_NOTIFICATION_KEY = "lastUpgradeNotificationTimestamp";
const NOTIFICATION_COOLDOWN_DAYS = 7;

export const shouldShowUpgradeNotification = async (): Promise<boolean> => {
  const lastNotificationTimestamp = await LocalStorage.getItem<string>(LAST_UPGRADE_NOTIFICATION_KEY);

  if (!lastNotificationTimestamp) {
    return true;
  }

  const lastNotificationDate = new Date(parseInt(lastNotificationTimestamp, 10));
  const now = new Date();
  const daysSinceLastNotification = (now.getTime() - lastNotificationDate.getTime()) / (1000 * 60 * 60 * 24);

  return daysSinceLastNotification >= NOTIFICATION_COOLDOWN_DAYS;
};

export const recordUpgradeNotificationShown = async (): Promise<void> => {
  await LocalStorage.setItem(LAST_UPGRADE_NOTIFICATION_KEY, Date.now().toString());
};
