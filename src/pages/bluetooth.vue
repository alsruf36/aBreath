<script setup lang="ts">
import { useCounter } from '~/store/counter'
import BluetoothTerminal from '~/utils/bluetoothTerminal'

let terminal = new BluetoothTerminal();

terminal.receive = function(data) {
  alert(data);
};

let requestDevice = () => {
    terminal.connect().then(() => {
        alert(terminal.getDeviceName() + ' is connected!');
    });
}

const counter = useCounter()
</script>

<template>
  <div>
    <div class="global-text">
      <pre>{{ counter.$state }}</pre>
      <!-- Remove this component to get started! -->
      <p>
        N: {{ counter.n }}
        <br>
        myRef: {{ counter.myRef }}
      </p>

      <button @click="requestDevice()">
        Request Bluetooth Device
    </button>

      <input v-model="counter.myRef" class="text-black" type="text">
      <br>
      <input v-model="counter.n" class="text-black" type="number">
    </div>
    <button class="global-text p-4" @click="counter.increment()">
      +1 number click
    </button>
  </div>
</template>
