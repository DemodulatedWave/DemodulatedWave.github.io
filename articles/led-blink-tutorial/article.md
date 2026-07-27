---
title: Getting Started - LED Blink with Arduino
date: 2026-07-25
author: DemodulatedWave
---

# Getting Started: LED Blink with Arduino

This is your first electronics project! In this tutorial, we'll make an LED blink using an Arduino microcontroller.

## What You'll Need

- Arduino Uno (or compatible)
- 1x 220Ω resistor
- 1x 5mm LED (any color)
- Breadboard and jumper wires
- USB cable for programming

## Circuit Diagram

Here's the basic circuit:

```
Arduino Pin 13 ──→ [220Ω Resistor] ──→ [LED] ──→ GND
```

## The Code

```cpp
void setup() {
  pinMode(13, OUTPUT);  // Set pin 13 as output
}

void loop() {
  digitalWrite(13, HIGH);  // Turn LED on
  delay(1000);             // Wait 1 second
  digitalWrite(13, LOW);   // Turn LED off
  delay(1000);             // Wait 1 second
}
```

## How It Works

The `digitalWrite()` function sets the pin to either HIGH (5V) or LOW (0V). When set HIGH, current flows through the LED, making it light up.

### Key Parameters

- **Resistor Value**: The 220Ω resistor limits current. Too much current damages the LED!
- **Delay**: The 1000ms delays create the blinking effect

## Troubleshooting

If your LED doesn't blink:

1. Check the LED polarity (long leg = positive)
2. Verify the resistor value
3. Make sure the USB cable is connected
4. Try uploading the code again

## Next Steps

Once you master the blink, try:

- Changing the delay times
- Using a button to control the LED
- Creating LED patterns
- PWM brightness control

Happy blinking! 🔌
