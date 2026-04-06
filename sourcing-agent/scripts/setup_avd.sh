#!/bin/bash
# Android Virtual Device Setup Script
# Created: 2026-03-28
# Purpose: Create and configure Android AVD for 1688.com automation

set -e

echo "🤖 ANDROID VIRTUAL DEVICE SETUP"
echo "================================"
echo ""

# Configuration
DEVICE_NAME="Pixel_5_API_31"
SYSTEM_IMAGE="system-images;android-31;google_apis;x86_64"
ABI="google_apis/x86_64"
DEVICE="pixel_5"
RAM="4096"
VM_HEAP="512"
INTERNAL_STORAGE="8000M"
SD_CARD="1000M"

echo "📋 Configuration:"
echo "  Device Name: $DEVICE_NAME"
echo "  System Image: Android 11 (API 31) with Google APIs"
echo "  RAM: ${RAM}MB"
echo "  Internal Storage: $INTERNAL_STORAGE"
echo ""

# Check if sdkmanager is available
if ! command -v sdkmanager &> /dev/null; then
    echo "❌ sdkmanager not found!"
    echo "   Please install Android SDK command line tools"
    exit 1
fi

echo "✅ sdkmanager found"

# Accept licenses
echo ""
echo "📜 Accepting Android SDK licenses..."
yes | sdkmanager --licenses

# Download system image
echo ""
echo "📥 Downloading Android system image..."
echo "   This may take 10-20 minutes (download ~1GB)"
sdkmanager "$SYSTEM_IMAGE"

# Create AVD
echo ""
echo "🔧 Creating Android Virtual Device..."
echo "no" | avdmanager create avd \
    -n "$DEVICE_NAME" \
    -k "$SYSTEM_IMAGE" \
    -d "$DEVICE" \
    --force

# Configure AVD
echo ""
echo "⚙️  Configuring AVD settings..."
CONFIG_FILE="$HOME/.android/avd/$DEVICE_NAME.avd/config.ini"

# Set RAM
echo "hw.ramSize=$RAM" >> "$CONFIG_FILE"

# Set VM heap
echo "hw.vm.heapSize=$VM_HEAP" >> "$CONFIG_FILE"

# Set internal storage
echo "disk.dataPartition.size=$INTERNAL_STORAGE" >> "$CONFIG_FILE"

# Enable GPU
echo "hw.gpu.enabled=yes" >> "$CONFIG_FILE"
echo "hw.gpu.mode=auto" >> "$CONFIG_FILE"

# Enable keyboard
echo "hw.keyboard=yes" >> "$CONFIG_FILE"

# Set screen density
echo "hw.lcd.density=420" >> "$CONFIG_FILE"

# Enable camera (optional)
echo "hw.camera.front=emulated" >> "$CONFIG_FILE"
echo "hw.camera.back=emulated" >> "$CONFIG_FILE"

echo ""
echo "✅ AVD configuration complete!"
echo ""
echo "📱 AVD Details:"
echo "  Name: $DEVICE_NAME"
echo "  Config: $CONFIG_FILE"
echo ""
echo "🚀 To launch the device, run:"
echo "   emulator -avd $DEVICE_NAME"
echo ""
echo "🔌 To connect via ADB:"
echo "   adb devices"
echo ""
