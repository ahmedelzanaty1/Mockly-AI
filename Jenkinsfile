pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS 18'
    }

    environment {
        GEMINI_API_KEY = credentials('gemini-api-key')
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'bash -c "set -o pipefail; npm install 2>&1 | tee npm-install.log"'
            }
        }

        stage('Build React App') {
            steps {
                sh 'bash -c "set -o pipefail; npm run build 2>&1 | tee build.log"'
            }
        }
    }

    post {
        failure {
            script {
                echo "--- Preparing AI Logs Analysis ---"
                
                // 1. تجميع الـ logs وتنظيفها
                def combinedLogs = sh(
                    script: "cat npm-install.log build.log 2>/dev/null | tail -n 50 || echo 'No logs available'",
                    returnStdout: true
                ).trim()

                def safeLogs = combinedLogs.replace('"', '\\"').replace('\n', '\\n').replace('\r', '')

                // 2. نداء الـ API باستخدام الموديل المتاح في حسابك (Gemini 2.0 Flash)
                // لاحظ استخدام الاسم بالظبط من اللستة بتاعتك
                sh """
                curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}" \
                -H "Content-Type: application/json" \
                -d '{
                    "contents": [{
                        "parts": [{
                            "text": "Analyze these Jenkins logs and provide: 1. Root Cause 2. Suggested Fix 3. Severity.\\n\\nLogs:\\n${safeLogs}"
                        }]
                    }]
                }' > ai_report.json
                """

                // 3. قراءة النتيجة وعرضها
                def report = readFile('ai_report.json')
                
                if (report.contains("error")) {
                    echo "--- Model 2.0 Failed, Trying Flash Latest ---"
                    sh """
                    curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}" \
                    -H "Content-Type: application/json" \
                    -d '{
                        "contents": [{
                            "parts": [{
                                "text": "Quick fix for these logs: ${safeLogs}"
                            }]
                        }]
                    }' > ai_report.json
                    """
                    report = readFile('ai_report.json')
                }

                echo "--- AI ANALYSIS RESULT ---"
                echo report
            }
        }
    }
}