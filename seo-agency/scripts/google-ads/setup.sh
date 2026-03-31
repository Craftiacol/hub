#!/usr/bin/env bash
# Setup script for Google Ads Python scripts
set -euo pipefail

echo "=== Google Ads Scripts Setup ==="

# Check Python version
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
MAJOR=$(echo "$PYTHON_VERSION" | cut -d. -f1)
MINOR=$(echo "$PYTHON_VERSION" | cut -d. -f2)

if [ "$MAJOR" -lt 3 ] || { [ "$MAJOR" -eq 3 ] && [ "$MINOR" -lt 10 ]; }; then
    echo "ERROR: Python 3.10+ required (found $PYTHON_VERSION)"
    exit 1
fi
echo "Python $PYTHON_VERSION detected"

# Create virtual environment if not exists
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$SCRIPT_DIR/.venv"

if [ ! -d "$VENV_DIR" ]; then
    echo "Creating virtual environment..."
    python3 -m venv "$VENV_DIR"
fi

# Activate and install
source "$VENV_DIR/bin/activate"

echo "Installing dependencies..."
pip install --upgrade pip
pip install google-ads protobuf grpcio

# Create config from example if not exists
CONFIG_DIR="$SCRIPT_DIR/config"
if [ ! -f "$CONFIG_DIR/google-ads.yaml" ]; then
    if [ -f "$CONFIG_DIR/google-ads.yaml.example" ]; then
        cp "$CONFIG_DIR/google-ads.yaml.example" "$CONFIG_DIR/google-ads.yaml"
        echo ""
        echo "IMPORTANT: Config created at $CONFIG_DIR/google-ads.yaml"
        echo "Edit it with your credentials before running scripts."
    fi
fi

echo ""
echo "=== Setup Complete ==="
echo "Activate venv: source $VENV_DIR/bin/activate"
echo "Then run: python apply_optimization.py --dry-run"
