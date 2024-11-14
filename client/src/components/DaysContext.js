import React, { createContext, useContext, useState } from 'react';
import { STARTING_TIDE_DAYS } from '../constants';

const DaysContext = createContext();

export const DaysProvider = ({ children }) => {
  const [days, setDays] = useState(STARTING_TIDE_DAYS);  // Default number of days

  return (
    <DaysContext.Provider value={{ days, setDays }}>
      {children}
    </DaysContext.Provider>
  );
};

export const useDays = () => useContext(DaysContext);