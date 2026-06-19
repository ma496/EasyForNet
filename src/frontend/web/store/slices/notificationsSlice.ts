import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface NotificationsState {
  unreadCount: number;
}

const initialState: NotificationsState = {
  unreadCount: 0,
};

/**
 * Notifications slice holding the current unread notification count,
 * used by the UI to render the badge. Updated via the setUnreadCount
 * reducer (e.g. by useNotificationHub polling).
 */
export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setUnreadCount(state, action: PayloadAction<number>) {
      state.unreadCount = action.payload;
    },
  },
});

export const { setUnreadCount } = notificationsSlice.actions;