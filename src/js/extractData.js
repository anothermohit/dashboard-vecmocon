export default function extractData(item) {
    return {
      soc: item.bms && item.bms.batterySocStack ? item.bms.batterySocStack[1] : null,
      voltage: item.bms && item.bms["batteryVoltageStack(V)"]
        ? item.bms["batteryVoltageStack(V)"][1]
        : null,
      current: item.bms && item.bms["batteryCurrentStack(A)"]
        ? item.bms["batteryCurrentStack(A)"][1]
        : null,
      cellVoltages: item.bms ? item.bms.cellVoltages: null,
      temperatures: item.bms ? item.bms.temperatures : null,
      iot: item.bms ? {
        voltage: item.bms["batteryVoltageStack(V)"] ? item.bms["batteryVoltageStack(V)"][1] : null,
        temperature: item.deviceInfo[6],
        speed: item.gps[3],
        distance: item.gps[7]
      } : {},
      timestamp: 1000*(item.bms ? item.bms.tsValue : 0),
    };
  }
  