import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface NotificationsState {
  unreadCount: number;
}

const initialState: NotificationsState = {
  unreadCount: 0,
};

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