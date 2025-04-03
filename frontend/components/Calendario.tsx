"use client";

import { useState } from "react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { ChevronLeft, ChevronRight } from "lucide-react";

dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.extend(weekday);
dayjs.extend(weekOfYear);

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());

  const startOfMonth = currentDate.startOf("month").weekday();
  const daysInMonth = currentDate.daysInMonth();

  const prevMonth = () => {
    setCurrentDate(currentDate.subtract(1, "month"));
  };

  const nextMonth = () => {
    setCurrentDate(currentDate.add(1, "month"));
  };

  return (
    <div className="flex items-center justify-center py-8 px-4">
      <div className="max-w-sm w-full shadow-lg">
        <div className="p-5 bg-white rounded-t dark:bg-gray-800">
          <div className="px-4 flex items-center justify-between">
            <span className="text-base font-bold text-gray-800 dark:text-gray-100">
              {currentDate.format("MMMM YYYY")}
            </span>
            <div className="flex items-center">
              <button onClick={prevMonth} className="hover:text-gray-400">
                <ChevronLeft size={24} />
              </button>
              <button onClick={nextMonth} className="ml-3 hover:text-gray-400">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
          <table className="w-full mt-4">
            <thead>
              <tr>
                {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
                  <th key={day} className="text-gray-800 dark:text-gray-100 font-medium">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(6)].map((_, week) => (
                <tr key={week}>
                  {[...Array(7)].map((_, day) => {
                    const dayNumber = week * 7 + day - startOfMonth + 1;
                    return (
                      <td key={day} className="p-2 text-center">
                        {dayNumber > 0 && dayNumber <= daysInMonth ? (
                          <span className="text-gray-800 dark:text-gray-100">
                            {dayNumber}
                          </span>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
