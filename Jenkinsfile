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
        // إضافة set -o pipefail بتخلي الفشل في npm يوقف الـ pipeline
        sh '''
            set -o pipefail
            npm install 2>&1 | tee npm-install.log
        '''
    }
        }

        stage('Build React App') {
            steps {
        sh '''
           #!/bin/bash
           set -o pipefail
          npm install 2>&1 | tee npm-install.log
        '''
    }
        }
    }

    post {
        failure {
            script {
                echo "--- Executing AI Analysis ---"
                
                // 1. تجميع الـ logs
                def combinedLogs = sh(
                    script: "cat npm-install.log build.log 2>/dev/null | tail -n 50 || echo 'No logs available'",
                    returnStdout: true
                ).trim()

                // 2. تأمين الـ logs من أي علامات تخرب الـ JSON
                def safeLogs = combinedLogs.replace('"', '\\"').replace('\n', '\\n').replace('\r', '')

                // 3. نداء الـ API مع هروب علامة الـ $ في الـ shell
                // استخدمنا ' ' لعنوان الـ URL عشان نمنع Groovy من تفسير أي علامة $
                sh """
                curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}" \
                -H "Content-Type: application/json" \
                -d '{
                    "contents": [{
                        "parts": [{
                            "text": "Analyze these Jenkins CI logs and provide: 1. Root Cause 2. Suggested Fix 3. Severity.\\n\\nLogs:\\n${safeLogs}"
                        }]
                    }]
                }' > ai_report.json
                """

                // 4. طباعة التقرير في الـ Console
                def report = readFile('ai_report.json')
                echo "--- AI ANALYSIS RESULT ---"
                echo report
            }
        }
    }
}