export default function extractData(item) {
    return {
      soc: item.bms.batterySocStack ? item.bms.batterySocStack[1] : null,
      voltage: item.bms["batteryVoltageStack(V)"]
        ? item.bms["batteryVoltageStack(V)"][1]
        : null,
      current: item.bms["batteryCurrentStack(A)"]
        ? item.bms["batteryCurrentStack(A)"][1]
        : null,
      cellVoltages: item.bms.cellVoltages,
      timestamp: 1000*item.bms.tsValue,
    };
  }
  