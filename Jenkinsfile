pipeline {
    agent any

    tools {
        nodejs 'NodeJS 18'
    }

    environment {
        GEMINI_API_KEY = credentials('gemini-api-key')
        DOCKER_IMAGE = "a7medelzanaty/mockly-ai"
    }

    stages {

        stage('Checkout') {
            steps {
                git 'https://github.com/ahmedelzanaty1/Mockly-AI.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build React App') {
            steps {
                script {
                    try {
                        sh 'npm run build'
                    } catch (Exception e) {
                        env.BUILD_STATUS = "FAILED"
                        error "Build failed, starting AI Analysis..."
                    }
                }
            }
        }

        stage('Docker Build') {
            when {
                expression { env.BUILD_STATUS != "FAILED" }
            }

            steps {
                sh "docker build -t ${DOCKER_IMAGE}:latest ."
            }
        }
    }

    post {
        failure {
            script {

                def rawLogs = currentBuild.rawBuild.getLog(50).join('\n')

                def cleanLogs = rawLogs
                    .replaceAll('"', '\\\\"')
                    .replaceAll('\n', '\\\\\\\\n')

                def response = sh(script: """
                    curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}" \
                    -H "Content-Type: application/json" \
                    -d '{
                        "contents": [{
                            "parts": [{
                                "text": "Analyze the following CI/CD failure logs and provide: 1. Root Cause 2. Suggested Fix 3. Severity. Logs: ${cleanLogs}"
                            }]
                        }]
                    }'
                """, returnStdout: true)

                echo "========== AI ANALYSIS REPORT =========="
                echo response
            }
        }
    }
}