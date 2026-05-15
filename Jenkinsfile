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
                // استخدام bash -c بيحل مشكلة pipefail
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
                echo "--- Executing AI Analysis ---"
                
                // 1. تجميع الـ logs بذكاء
                def combinedLogs = sh(
                    script: "cat npm-install.log build.log 2>/dev/null | tail -n 50 || echo 'No logs available'",
                    returnStdout: true
                ).trim()

                // 2. تنظيف الـ logs تماماً
                def safeLogs = combinedLogs.replace('"', '\\"').replace('\n', '\\n').replace('\r', '')

                // 3. نداء الـ API بالموديل الصح والـ URL الصح
                sh """
                curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}" \
                -H "Content-Type: application/json" \
                -d '{
                    "contents": [{
                        "parts": [{
                            "text": "Analyze these Jenkins CI logs and provide: 1. Root Cause 2. Suggested Fix 3. Severity.\\n\\nLogs:\\n${safeLogs}"
                        }]
                    }]
                }' > ai_report.json
                """

                // 4. قراءة الرد وعرضه بشكل واضح
                def report = readFile('ai_report.json')
                echo "--- AI ANALYSIS RESULT ---"
                echo report
            }
        }
    }
}