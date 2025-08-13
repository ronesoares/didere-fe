import { combineReducers } from '@reduxjs/toolkit';
import { reducer as calendarReducer } from '../slices/calendar';
import { reducer as kanbanReducer } from '../slices/kanban';

export const rootReducer = combineReducers({
  calendar: calendarReducer,
  kanban: kanbanReducer
});
