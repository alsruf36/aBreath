<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBluetooth, FlatSensorType } from '~/store/bluetooth'
import BluetoothTerminal from '~/utils/bluetoothTerminal'
import { LineChart, useLineChart } from "vue-chart-3";
import { Chart, ChartData, ChartDataset, ScriptableContext, Point, ChartOptions, registerables } from "chart.js";

const screenNumber = ref()
screenNumber.value = 2

// bluetooth functions

const terminal = new BluetoothTerminal();
const bluetooth = useBluetooth()
const bluetoothRef = storeToRefs(bluetooth);
bluetooth.initSensorData()

terminal.receive = function(data) {
  bluetooth.updateBuffer(data);
  bluetooth.readBuffer();
};

const connectDevice = () => {
    terminal.connect().then(() => {
        const deviceName = terminal.getDeviceName()
        bluetooth.connected(deviceName)
    });
};

const disconnectDevice = () => {
  terminal.disconnect()
  bluetooth.disconnected()
};

const sendCommand = (prefix: string, data: string) => {
  const command = prefix + ', ' + data
  terminal.send(command)
};

// chart functions

Chart.register(...registerables);

const colors = {
  purple: {
    default: "rgba(149, 76, 233, 1)",
    half: "rgba(149, 76, 233, 0.5)",
    quarter: "rgba(149, 76, 233, 0.25)",
    zero: "rgba(149, 76, 233, 0)"
  },
  indigo: {
    default: "rgba(80, 102, 120, 1)",
    quarter: "rgba(80, 102, 120, 0.25)"
  }
};

const options = computed<ChartOptions<"line">>(() => ({
  plugins: {
    legend: {
      display: false,
      position: "top",
    },
    title: {
      display: false,
      text: "분석",
    },
  },
  scales: {
      y: {
          display: false
      },
      x: {
          display: false
      }
  },   
  animation: {
    duration: 1000,
  },
  responsive: false,
  maintainAspectRatio: true
}));

const labels: Array<string> = [];
for (let i = 0; i <= bluetooth.sensorDataFlatLength; ++i) {
  labels.push(i.toString());
}

const sensorDataFlatIndex = bluetooth.refSensorDataFlatIndex('tvoc8')

const testData = computed<ChartData<"line">>(() => ({
  labels: labels,
  datasets: [
    {
      data: bluetooth.sensorDataFlat[sensorDataFlatIndex].data,
      backgroundColor: (ctx: ScriptableContext<"line">) => {
        const canvas = ctx.chart.ctx;
        const gradient = canvas.createLinearGradient(0,0,0,160);

        canvas.createLinearGradient(0, 25, 0, 300);
        gradient.addColorStop(0, colors.purple.half);
        gradient.addColorStop(0.35, colors.purple.quarter);
        gradient.addColorStop(1, colors.purple.zero);

        return gradient;
      },
      borderColor: colors.purple.default,
      borderWidth: 3,
      pointRadius: 0,
      tension: 0.3,
      fill: true,
    }
  ],
}));

const { lineChartProps, lineChartRef } = useLineChart({
  chartData: testData,
  options,
});
</script>

<template>
  <div
    :style="{position: 'relative', backgroundColor: '#322b5a', width: '100%', height: '900px', overflow: 'hidden', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start', textAlign: 'center', fontSize: '60px', color: '#d9d9d9', fontFamily: 'Inter'}"
  >
    <div
      :style="{alignSelf: 'stretch', flex: '1', backgroundColor: '#322b5a', display: 'flex', flexDirection: 'row', padding: '30px', alignItems: 'flex-start', justifyContent: 'flex-start'}"
    >
      <div
        :style="{alignSelf: 'stretch', flex: '1', borderRadius: '20px', backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(120px)', display: 'flex', flexDirection: 'row', padding: '30px', alignItems: 'center', justifyContent: 'center'}"
      >
        <div
          :style="{alignSelf: 'stretch', flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', gap: '17px'}"
        >
          <div
            :style="{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}"
          >
            <div :style="{position: 'relative', lineHeight: '60px'}">
              <b>
                <span :style="{color: '#6366f1'}">æ</span>
                <span>Heath</span>
              </b>
            </div>
            <div
              :style="{position: 'relative', fontSize: '30px', lineHeight: '36px', fontWeight: '600'}"
            >
              <span>For</span>
              <span :style="{color: '#6366f1'}"> æ</span>
              <span>Breath</span>
            </div>
          </div>
          <div
            :style="{alignSelf: 'stretch', flex: '1', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', fontSize: '30px', color: '#818cf8'}"
            v-if="screenNumber === 2"
          >
            <div
              :style="{alignSelf: 'stretch', flex: '1', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px'}"
            >
              <div
                :style="{alignSelf: 'stretch', flex: '1', borderRadius: '30px', backgroundColor: '#eef2ff', display: 'flex', flexDirection: 'column', padding: '27px 36px', alignItems: 'center', justifyContent: 'center', gap: '10px'}"
              >
                <div
                  :style="{alignSelf: 'stretch', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: '10px'}"
                >
                  <div
                    :style="{position: 'relative', lineHeight: '36px', fontWeight: '600'}"
                  >
                    TVOC
                  </div>
                  <div
                    :style="{display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: '10px', fontSize: '48px', color: '#6366f1'}"
                  >
                    <div
                      :style="{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}"
                    >
                      <div
                        :style="{position: 'relative', lineHeight: '48px', fontWeight: '600'}"
                      >
                        {{bluetooth.Mdata}}
                      </div>
                    </div>
                    <div
                      :style="{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', fontSize: '30px', color: '#818cf8'}"
                    >
                      <div
                        :style="{position: 'relative', lineHeight: '36px', fontWeight: '600'}"
                      >
                        ppm
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  :style="{alignSelf: 'stretch', flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '48px', color: '#6366f1'}"
                >
                  <div
                    :style="{position: 'relative', lineHeight: '48px', fontWeight: '600'}"
                  >
                    <LineChart v-bind="lineChartProps" />
                  </div>
                </div>
              </div>
              <div
                :style="{alignSelf: 'stretch', borderRadius: '100px', backgroundColor: '#6366f1', backdropFilter: 'blur(50px)', display: 'flex', flexDirection: 'column', padding: '19px 26px', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#312e81'}"
                @click="connectDevice()"
                v-if="bluetooth.deviceConnected === false"
              >
                <div
                  :style="{alignSelf: 'stretch', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}"
                >
                  <div
                    :style="{position: 'relative', lineHeight: '32px', fontWeight: '600'}"
                  >
                    기기 연결
                  </div>
                </div>
              </div>
              <div
                :style="{alignSelf: 'stretch', borderRadius: '100px', backgroundColor: '#6366f1', backdropFilter: 'blur(50px)', display: 'flex', flexDirection: 'column', padding: '19px 26px', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#312e81'}"
                v-else
              >
                <div
                  :style="{alignSelf: 'stretch', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}"
                >
                  <div
                    :style="{position: 'relative', lineHeight: '32px', fontWeight: '600'}"
                  >
                    측정 시작
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="screenNumber.value === 3"
            :style="{alignSelf: 'stretch', flex: '1', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', gap: '19px', fontSize: '30px', color: '#818cf8'}"
          >
            <div
              :style="{alignSelf: 'stretch', borderRadius: '100px', backgroundColor: '#6366f1', backdropFilter: 'blur(50px)', display: 'flex', flexDirection: 'column', padding: '19px 26px', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#312e81'}"
            >
              <div
                :style="{alignSelf: 'stretch', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}"
              >
                <div
                  :style="{position: 'relative', lineHeight: '32px', fontWeight: '600'}"
                >
                  측정 기록 검색
                </div>
                <img
                  :style="{position: 'relative', width: '30px', height: '30px', overflow: 'hidden', flexShrink: '0'}"
                  alt=""
                  src="/fibrsearch.svg"
                />
              </div>
            </div>
            <div
              :style="{alignSelf: 'stretch', flex: '1', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}"
            >
              <div
                :style="{alignSelf: 'stretch', flex: '1', borderRadius: '30px', backgroundColor: '#eef2ff', display: 'flex', flexDirection: 'column', padding: '27px 36px', alignItems: 'center', justifyContent: 'center'}"
              >
                <div
                  :style="{alignSelf: 'stretch', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: '10px'}"
                >
                  <div
                    :style="{position: 'relative', lineHeight: '36px', fontWeight: '800'}"
                  >
                    이전 결과 확인
                  </div>
                  <div
                    :style="{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', fontSize: '48px', color: '#6366f1'}"
                  >
                    <div
                      :style="{position: 'relative', lineHeight: '48px', fontWeight: '800'}"
                    >
                      결과 검색
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              :style="{alignSelf: 'stretch', flex: '1', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}"
            >
              <div
                :style="{alignSelf: 'stretch', flex: '1', borderRadius: '30px', backgroundColor: '#eef2ff', display: 'flex', flexDirection: 'column', padding: '27px 36px', alignItems: 'center', justifyContent: 'center'}"
              >
                <div
                  :style="{alignSelf: 'stretch', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: '10px'}"
                >
                  <div
                    :style="{position: 'relative', lineHeight: '36px', fontWeight: '600'}"
                  >
                    æBreath 이용
                  </div>
                  <div
                    :style="{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', fontSize: '48px', color: '#6366f1'}"
                    @click="screenNumber.value = 2"
                  >
                  <div
                      :style="{position: 'relative', lineHeight: '48px', fontWeight: '800'}"
                    >
                      호흡 측정
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
