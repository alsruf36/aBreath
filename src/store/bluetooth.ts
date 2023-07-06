import { Ref, ref, reactive } from 'vue'
import { defineStore } from 'pinia'

interface BluetoothState {
  deviceConnected: boolean
  deviceName: string
  receivedBuffer: Array<string>
  bufferFlushed: boolean
  latestUpdate: number
  latestConfirm: number
  sensorData: Array<SensorData>
  sensorDataFlat: Array<SensorDataFlat>
  measurementStartTime: number
  sensorDataFlatLength: number
  Mdata: number
}

interface SensorData {
    type: string
    data: Array<MeasurementData>
}

interface SensorDataFlat {
    type: string
    data: Array<number>
}

interface MeasurementData {
    timeDelta: number
    data: number
}

export const SensorType: Array<string> = [
    'hand',
    'tvoc6',
    'tvoc8',
    'co2',
    'temperature',
    'pressure',
    'altitude',
    'fan',
]

export const FlatSensorType: Array<string> = [
    'tvoc6',
    'tvoc8',
    'co2',
    'temperature',
    'pressure',
    'altitude',
]

export const useBluetooth = defineStore('bluetooth', {
  state: (): BluetoothState => ({
    deviceConnected: false,
    deviceName: '',
    receivedBuffer: [],
    bufferFlushed: false,
    latestUpdate: 0,
    latestConfirm: 0,
    sensorData: [],
    sensorDataFlat: [],
    measurementStartTime: 0,
    sensorDataFlatLength: 10,
    Mdata: 0,
  }),
  actions: {
    connected(deviceName: string){
        this.deviceConnected = true
        this.deviceName = deviceName
        this.initSensorData()
    },
    disconnected(){
        this.deviceConnected = false
        this.receivedBuffer = []
        this.bufferFlushed = false
        this.latestUpdate = 0
        this.latestConfirm = 0
    },
    updateBuffer(data: string){
      this.receivedBuffer.push(data)

      if (this.bufferFlushed == true){
        this.bufferFlushed = false
      }

      this.latestUpdate = Date.now()
    },
    readBuffer(){
        const bufferData = [...this.receivedBuffer]

        this.bufferFlushed = true
        this.latestConfirm = Date.now()
        this.receivedBuffer = []

        for(const buffer of bufferData){
            this.parseCommand(buffer)
        }

        return bufferData
    },
    parseCommand(command : string){
        const s = command.split(',')
        const prefix = s[0]

        switch (prefix) {
            case 'hd':
                const grab: number = JSON.parse(s[1])
                this.insertSeonsorData('hand', grab)
                break;

            case 'voc6':
                const tvoc6: number = Number(s[1])
                this.insertSeonsorData('tvoc6', tvoc6)
                break;

            case 'voc8':
                const co2: number = Number(s[1])
                const tvoc8: number = Number(s[2])

                this.insertSeonsorData('co2', co2)
                this.insertSeonsorData('tvoc8', tvoc8)
                this.Mdata = tvoc8
                break;

            case 'ps':
                const temperature: number = Number(s[1])
                const pressure: number = Number(s[2])
                const altitude: number = Number(s[3])

                this.insertSeonsorData('temperature', temperature)
                this.insertSeonsorData('pressure', pressure)
                this.insertSeonsorData('altitude', altitude)
                break;

            case 'fan':
                const fan: number = Number(s[1])

                this.insertSeonsorData('fan', fan)
                break;

            default:
                alert('명령어 오류')
        }
    },
    startMeasurement(){
        this.initSensorData()
        this.measurementStartTime = Date.now()
    },
    timeDeltaFromStart(){
        const timeDelta = Date.now() - this.measurementStartTime

        return timeDelta
    },
    initSensorData(){
        this.sensorData = []
        this.sensorDataFlat = []

        for(const sensorType of SensorType){
            this.sensorData.push({
                type: `${sensorType}`,
                data: []
            })
        }

        for(const flatSensorType of FlatSensorType){
            const initialData = []
            for(let i = 0; i <= this.sensorDataFlatLength; i++){
                initialData.push(0)
            }

            this.sensorDataFlat.push({
                type: `${flatSensorType}`,
                data: initialData
            })
        }
    },
    insertSeonsorData(sensorType: string, sensorData: number){
        const timeDelta = this.timeDeltaFromStart()
        const sensorDataIndex = this.sensorData.findIndex((data) => data.type == sensorType)
        this.sensorData[sensorDataIndex].data.push({
            timeDelta: timeDelta,
            data: sensorData
        })
        
        if(FlatSensorType.includes(sensorType)){
            const sensorDataFlatIndex = this.sensorDataFlat.findIndex((data) => data.type == sensorType)
            this.sensorDataFlat[sensorDataFlatIndex].data.shift()
            this.sensorDataFlat[sensorDataFlatIndex].data.push(sensorData)
        }
    },
    refSensorDataFlatIndex(sensorType: string){
        const sensorDataFlatIndex = this.sensorDataFlat.findIndex((data) => data.type == sensorType)
        //const sonsorDataFlatRef = this.sensorDataFlat[sensorDataFlatIndex]
        
        return sensorDataFlatIndex
    }
  },
})
