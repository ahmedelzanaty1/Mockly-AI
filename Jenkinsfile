pipeline {
    agent any
    
    tools {
        // تأكد أن الاسم مطابق للي متعرف عندك في Jenkins Global Tool Configuration
        nodejs 'NodeJS 18'
    }

    environment {
        GEMINI_API_KEY = credentials('gemini-api-key')
    }

    stages {
        stage('Install Dependencies') {
            steps {
                // استخدام pipefail عشان لو npm وقع الـ stage يدي failure فوراً
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
                
                // 1. تجميع الـ logs وتهيئة النص للـ JSON
                def combinedLogs = sh(
                    script: "cat npm-install.log build.log 2>/dev/null | tail -n 50 || echo 'No logs available'",
                    returnStdout: true
                ).trim()

                // تنظيف النصوص من أي علامات قد تكسر الـ JSON
                def safeLogs = combinedLogs.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n').replace('\r', '')

                // 2. إرسال الطلب لـ Gemini باستخدام الطريقة الأكثر أماناً (Single Quotes للـ Shell)
                sh '''
                curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}" \
                -H "Content-Type: application/json" \
                -d "{
                    \\"contents\\": [{
                        \\"parts\\": [{
                            \\"text\\": \\"Analyze these Jenkins logs and provide: 1. Root Cause 2. Suggested Fix 3. Severity.\\\\n\\\\nLogs:\\\\n''' + safeLogs + '''\\"
                        }]
                    }]
                }" > ai_report.json
                '''

                // 3. عرض النتيجة في الـ Console
                def report = readFile('ai_report.json')
                echo "--- AI ANALYSIS RESULT ---"
                echo report
            }
        }
    }
}