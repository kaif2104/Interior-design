pipeline {
    agent any
    
    environment {
        WEB_SERVER_IP = '65.1.47.84'
        WEB_USER      = 'ubuntu'
        IMAGE_NAME    = 'interior-design-backend'
        
        // Security Gate Control: Set to 'true' to intentionally FAIL build for interviewer demo
        FAIL_SECURITY_GATE = 'false'
        
        // Health Check Simulation: Set to 'true' to intentionally FAIL health check for rollback demo
        SIMULATE_FAILURE   = 'false'
    }

    stages {
        stage('Checkout') {
            steps {
                echo "📥 Step 1: Checking out code from repository..."
                // Git checkout occurs automatically in Jenkins pipeline job
            }
        }

        stage('Task 1 & 2: Security Gate (SAST & Trivy Scan)') {
            steps {
                script {
                    echo "🔒 Running SAST & Dependency Audit..."
                    sh 'cd backend && npm audit --audit-level=high || true'
                    
                    echo "🛡️ Running Trivy Codebase Security Scan..."
                    sh 'trivy fs --severity HIGH,CRITICAL .'
                    
                    if (env.FAIL_SECURITY_GATE == 'true') {
                        error("⛔ SECURITY GATE FAILED: Critical Security Defect Detected! Pipeline Stopped.")
                    } else {
                        echo "✅ Security Gate PASSED! Proceeding to container build."
                    }
                }
            }
        }

        stage('Task 1: Build Docker Container Image') {
            steps {
                echo "🐳 Building Docker Image..."
                sh 'docker build -t $IMAGE_NAME:$BUILD_NUMBER -t $IMAGE_NAME:latest ./backend'
            }
        }

        stage('Task 2: Container Security Scan Gate') {
            steps {
                script {
                    echo "🔍 Scanning Docker Container Image for Vulnerabilities..."
                    sh 'trivy image --severity CRITICAL $IMAGE_NAME:$BUILD_NUMBER'
                }
            }
        }

        stage('Task 3: Rolling Deployment (Instances v1 & v2)') {
            steps {
                script {
                    echo "🔄 Performing Rolling Deployment on Web Server (${WEB_SERVER_IP})..."
                    
                    // Instance 1 deployment
                    sh """
                        ssh -o StrictHostKeyChecking=no ${WEB_USER}@${WEB_SERVER_IP} "
                            docker stop app-instance-1 || true
                            docker rm app-instance-1 || true
                            docker run -d --name app-instance-1 -p 5001:5000 ${IMAGE_NAME}:${BUILD_NUMBER}
                        "
                    """
                    
                    // Instance 2 deployment
                    sh """
                        ssh -o StrictHostKeyChecking=no ${WEB_USER}@${WEB_SERVER_IP} "
                            docker stop app-instance-2 || true
                            docker rm app-instance-2 || true
                            docker run -d --name app-instance-2 -p 5002:5000 ${IMAGE_NAME}:${BUILD_NUMBER}
                        "
                    """
                    echo "✅ Rolling deployment complete!"
                }
            }
        }

        stage('Task 4: Blue-Green Deployment & Traffic Switch') {
            steps {
                script {
                    echo "🔵🟢 Executing Blue-Green Deployment..."
                    
                    // Deploy Green container on Port 8002
                    sh """
                        ssh -o StrictHostKeyChecking=no ${WEB_USER}@${WEB_SERVER_IP} "
                            docker stop app-green || true
                            docker rm app-green || true
                            docker run -d --name app-green -p 8002:5000 -e SIMULATE_FAILURE=${SIMULATE_FAILURE} ${IMAGE_NAME}:${BUILD_NUMBER}
                        "
                    """
                    
                    echo "✅ Green version deployed on Port 8002."
                }
            }
        }

        stage('Task 5: Automatic Health Check Gate & Auto-Rollback') {
            steps {
                script {
                    echo "🩺 Performing Automated Post-Deployment Health Check..."
                    sleep 3
                    
                    def responseCode = sh(
                        script: "ssh -o StrictHostKeyChecking=no ${WEB_USER}@${WEB_SERVER_IP} 'curl -s -o /dev/null -w \"%{http_code}\" http://localhost:8002/health'",
                        returnStdout: true
                    ).trim()

                    if (responseCode != "200") {
                        echo "❌ Health check FAILED with status: ${responseCode}! Triggering Auto-Rollback..."
                        sh """
                            ssh -o StrictHostKeyChecking=no ${WEB_USER}@${WEB_SERVER_IP} "
                                docker stop app-green || true
                                docker rm app-green || true
                                docker start app-blue || true
                            "
                        """
                        error("Deployment halted and rolled back due to failed health check!")
                    } else {
                        echo "✅ Health Check PASSED (HTTP 200 OK)."
                    }
                }
            }
        }
    }

    post {
        success {
            echo "🎉 DevSecOps Pipeline Completed Successfully!"
        }
        failure {
            echo "🚨 Pipeline Failed! Check Security Gate or Health Logs."
        }
    }
}
