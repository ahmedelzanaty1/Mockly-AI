pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS 18'
    }

    environment {
        // تأكد أنك وضعت الـ API Key الجديد في الـ Credentials بـ ID: gemini-api-key
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
                echo "--- Executing AI Analysis (Free Tier Mode) ---"
                
                // 1. تجميع الـ logs
                def combinedLogs = sh(
                    script: "cat npm-install.log build.log 2>/dev/null | tail -n 50 || echo 'No logs available'",
                    returnStdout: true
                ).trim()

                // 2. تنظيف الـ logs تماماً من أي علامات تخرب الـ JSON
                def safeLogs = combinedLogs.replace('"', '\\"').replace('\n', '\\n').replace('\r', '')

                // 3. نداء الـ API (استخدام موديل gemini-pro لأنه الأكثر استقراراً في الـ v1beta حالياً)
                sh """
                curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}" \
                -H "Content-Type: application/json" \
                -d '{
                    "contents": [{
                        "parts": [{
                            "text": "Analyze these Jenkins CI logs and provide: 1. Root Cause 2. Suggested Fix 3. Severity.\\n\\nLogs:\\n${safeLogs}"
                        }]
                    }]
                }' > ai_report.json
                """

                // 4. قراءة الرد وعرضه
                def report = readFile('ai_report.json')
                
                // التأكد من أن الرد يحتوي على تحليل وليس خطأ API
                if (report.contains("error")) {
                    echo "--- AI API ERROR ---"
                    echo report
                    echo "Trying fallback model (gemini-1.5-flash)..."
                    
                    sh """
                    curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}" \
                    -H "Content-Type: application/json" \
                    -d '{
                        "contents": [{
                            "parts": [{
                                "text": "Quick analysis for: ${safeLogs}"
                            }]
                        }]
                    }' > ai_report_fallback.json
                    """
                    def fallbackReport = readFile('ai_report_fallback.json')
                    echo fallbackReport
                } else {
                    echo "--- AI ANALYSIS RESULT ---"
                    echo report
                }
            }
        }
    }
}