#!/bin/bash
set -e

echo "=========================================="
echo "🛡️ Verifying Server 1 (Jenkins & Security)"
echo "=========================================="

# 1. Java Version Verification
echo "1. Checking Java Version..."
java -version 2>&1 | head -n 1

# 2. Docker Status & Permissions
echo -e "\n2. Checking Docker Service & User Groups..."
sudo systemctl is-active docker || echo "Docker not running"
groups ubuntu | grep docker || echo "ubuntu user not in docker group"
groups jenkins | grep docker || echo "jenkins user not in docker group"

# 3. Jenkins Service Status & Web URL
echo -e "\n3. Checking Jenkins Service..."
sudo systemctl is-active jenkins || echo "Jenkins not running"

# 4. Trivy Security Scanner Verification
echo -e "\n4. Checking Trivy Security Scanner..."
trivy --version | head -n 1 || echo "Trivy not installed"

# 5. Get Initial Admin Password
echo -e "\n🔑 Jenkins Initial Admin Password:"
if [ -f /var/lib/jenkins/secrets/initialAdminPassword ]; then
    sudo cat /var/lib/jenkins/secrets/initialAdminPassword
else
    echo "Password file not found yet. Ensure Jenkins is running."
fi

echo -e "\n=========================================="
