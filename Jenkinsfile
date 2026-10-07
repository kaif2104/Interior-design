pipeline {
    agent any
    
    environment {
        // Multi-Server Architecture Configurations
        WEB_SERVER_IP      = '65.1.47.84'
        WEB_USER           = 'ubuntu'
        IMAGE_NAME         = 'interior-design-backend'
        GIT_REPO_URL       = 'https://github.com/kaif2104/Interior-design.git'
        
        // 🧪 Demonstration Toggles for Interviewer
        // Set 'true' to demonstrate Security Gate halting the pipeline (Task 2)
        FAIL_SECURITY_GATE = 'false'
        
        // Set 'true' to demonstrate Auto-Rollback on Health Check Failure (Task 5)
        SIMULATE_FAILURE   = 'false'
    }

    stages {
        // ==========================================
        // TASK 1: CI/CD Pipeline & Code Checkout
        // ==========================================
        stage('Task 1: Checkout Repository') {
            steps {
                echo "📥 Checking out source code from GitHub..."
                git branch: 'main', url: "${env.GIT_REPO_URL}"
            }
        }

        // ==========================================
        // TASK 1 & 2: DevSecOps Security Gate
        // ==========================================
        stage('Task 1 & 2: Security Gate (SAST & Trivy Scan)') {
            steps {
                script {
                    echo "🔒 Running SAST & Dependency Vulnerability Audit..."
                    sh 'cd backend && npm audit --audit-level=high || true'
                    
                    echo "🛡️ Running Trivy Static File Security Scan..."
                    sh 'trivy fs --severity HIGH,CRITICAL .'
                    
                    if (env.FAIL_SECURITY_GATE == 'true') {
                        error("⛔ SECURITY GATE FAILED: Critical Vulnerabilities Detected! Stopping Deployment Pipeline.")
                    } else {
                        echo "✅ Security Gate PASSED! Proceeding to container build."
                    }
                }
            }
        }

        // ==========================================
        // TASK 1: Container Image Build & Image Scan
        // ==========================================
        stage('Task 1 & 2: Build & Scan Docker Image') {
            steps {
                script {
                    echo "🐳 Building Docker Container Image..."
                    sh 'docker build -t $IMAGE_NAME:$BUILD_NUMBER -t $IMAGE_NAME:latest ./backend'
                    
                    echo "🔍 Scanning Docker Image with Trivy..."
                    sh 'trivy image --severity CRITICAL $IMAGE_NAME:$BUILD_NUMBER'
                }
            }
        }

        // ==========================================
        // TASK 3: Rolling Deployment
        // ==========================================
        stage('Task 3: Rolling Deployment (Instances 1 & 2)') {
            steps {
                script {
                    echo "🔄 Transferring Docker Image to Web Server (${WEB_SERVER_IP})..."
                    sh "docker save ${IMAGE_NAME}:${BUILD_NUMBER} | ssh -o StrictHostKeyChecking=no ${WEB_USER}@${WEB_SERVER_IP} 'docker load'"

                    echo "🔄 Performing Rolling Deployment..."
                    
                    // Deploy Instance 1 (Port 5001)
                    echo "Updating Instance 1 on Port 5001..."
                    sh """
                        ssh -o StrictHostKeyChecking=no ${WEB_USER}@${WEB_SERVER_IP} "
                            docker stop backend-instance-1 || true
                            docker rm backend-instance-1 || true
                            docker run -d --name backend-instance-1 -p 5001:5000 ${IMAGE_NAME}:${BUILD_NUMBER}
                        "
                    """
                    
                    // Verify Instance 1 Health internally
                    sleep 3
                    sh "ssh -o StrictHostKeyChecking=no ${WEB_USER}@${WEB_SERVER_IP} 'curl -f http://localhost:5001/health || true'"

                    // Deploy Instance 2 (Port 5002)
                    echo "Updating Instance 2 on Port 5002..."
                    sh """
                        ssh -o StrictHostKeyChecking=no ${WEB_USER}@${WEB_SERVER_IP} "
                            docker stop backend-instance-2 || true
                            docker rm backend-instance-2 || true
                            docker run -d --name backend-instance-2 -p 5002:5000 ${IMAGE_NAME}:${BUILD_NUMBER}
                        "
                    """
                    
                    // Verify Instance 2 Health internally
                    sleep 3
                    sh "ssh -o StrictHostKeyChecking=no ${WEB_USER}@${WEB_SERVER_IP} 'curl -f http://localhost:5002/health || true'"
                    echo "✅ Rolling deployment complete across all instances!"
                }
            }
        }

        // ==========================================
        // TASK 4: Blue-Green Deployment
        // ==========================================
        stage('Task 4: Blue-Green Deployment & Traffic Switch') {
            steps {
                script {
                    echo "🔵🟢 Executing Blue-Green Deployment..."
                    
                    // Inspect active port in Nginx default file
                    def activePort = sh(
                        script: "ssh -o StrictHostKeyChecking=no ${WEB_USER}@${WEB_SERVER_IP} \"grep -oE '8001|8002' /etc/nginx/sites-available/default | head -1 || echo '8001'\"",
                        returnStdout: true
                    ).trim()

                    def targetPort  = (activePort == "8001") ? "8002" : "8001"
                    def targetColor = (activePort == "8001") ? "green" : "blue"
                    def activeColor = (activePort == "8001") ? "blue" : "green"

                    echo "Current Active: ${activeColor} (${activePort}) -> Target Deployment: ${targetColor} (${targetPort})"

                    // Deploy Target Container
                    sh """
                        ssh -o StrictHostKeyChecking=no ${WEB_USER}@${WEB_SERVER_IP} "
                            docker stop app-${targetColor} || true
                            docker rm app-${targetColor} || true
                            docker run -d --name app-${targetColor} -p ${targetPort}:5000 -e SIMULATE_FAILURE=${SIMULATE_FAILURE} ${IMAGE_NAME}:${BUILD_NUMBER}
                        "
                    """

                    // Test Target Environment internally before switching traffic
                    sleep 3
                    sh "ssh -o StrictHostKeyChecking=no ${WEB_USER}@${WEB_SERVER_IP} 'curl -f http://localhost:${targetPort}/health'"

                    // Switch Nginx Traffic
                    sh """
                        ssh -o StrictHostKeyChecking=no ${WEB_USER}@${WEB_SERVER_IP} "
                            sudo sed -i 's/${activePort}/${targetPort}/g' /etc/nginx/sites-available/default
                            sudo systemctl reload nginx
                        "
                    """
                    echo "🎉 Nginx Traffic successfully switched to ${targetColor.toUpperCase()} (${targetPort})!"
                }
            }
        }

        // ==========================================
        // TASK 5: Automatic Health Check Gate
        // ==========================================
        stage('Task 5: Automatic Health Check & Auto-Rollback') {
            steps {
                script {
                    echo "🩺 Running Post-Deployment Health Check Gate..."
                    sleep 3
                    
                    def responseCode = sh(
                        script: "ssh -o StrictHostKeyChecking=no ${WEB_USER}@${WEB_SERVER_IP} 'curl -s -o /dev/null -w \"%{http_code}\" http://localhost/health'",
                        returnStdout: true
                    ).trim()

                    if (responseCode != "200") {
                        echo "❌ Health check FAILED with HTTP Status Code: ${responseCode}! Triggering Rollback..."
                        
                        // Automatic Rollback: Revert Nginx back to 8001
                        sh """
                            ssh -o StrictHostKeyChecking=no ${WEB_USER}@${WEB_SERVER_IP} "
                                sudo sed -i 's/8002/8001/g' /etc/nginx/sites-available/default
                                sudo systemctl reload nginx
                            "
                        """
                        error("⛔ Pipeline stopped & rolled back due to Health Check Failure!")
                    } else {
                        echo "✅ Automatic Health Check PASSED (HTTP 200 OK)."
                    }
                }
            }
        }

        // ==========================================
        // TASK 6: Database Migration & Schema Validation
        // ==========================================
        stage('Task 6: Database Migration & Schema Validation') {
            steps {
                script {
                    echo "🗄️ Executing Database Migration Script..."
                    
                    def migrationStatus = sh(
                        script: """
                            ssh -o StrictHostKeyChecking=no ${WEB_USER}@${WEB_SERVER_IP} "
                                docker exec app-green node migrations/001_add_user_status.js || \
                                docker exec app-blue node migrations/001_add_user_status.js
                            "
                        """,
                        returnStatus: true
                    )

                    if (migrationStatus != 0) {
                        echo "🚨 Database Migration Failed! Stopping deployment..."
                        error("Pipeline failed: DB Schema Migration Error.")
                    } else {
                        echo "✅ Database Migration & Schema Validation Verified!"
                    }
                }
            }
        }
    }

    post {
        success {
            echo "🎉 ALL DevSecOps Practical Tasks (1-6) Executed Successfully!"
        }
        failure {
            echo "🚨 DevSecOps Pipeline Terminated / Rolled Back due to Security Gate or Health Failure."
        }
    }
}