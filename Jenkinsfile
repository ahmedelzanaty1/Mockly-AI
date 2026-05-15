pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS 18' // تأكد أن هذا الاسم مطابق لما هو موجود في الـ Global Tool Configuration في Jenkins
    }

    environment {
        GEMINI_API_KEY = credentials('gemini-api-key')
    }

    stages {
        stage('Install Dependencies') {
            steps {
                // استخدمنا bash -c لضمان عمل الـ pipefail وفشل المرحلة إذا فشل الـ npm
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
                echo "--- Starting AI Log Analysis ---"
                
                // 1. تجميع آخر 50 سطر من ملفات الـ logs
                def combinedLogs = sh(
                    script: "cat npm-install.log build.log 2>/dev/null | tail -n 50 || echo 'No logs available'",
                    returnStdout: true
                ).trim()

                // 2. تنظيف الـ logs وتجهيزها لـ JSON payload
                // بنعمل escape للـ quotes والـ newlines عشان الـ curl يبعتها صح
                def safeLogs = combinedLogs.replace('"', '\\"').replace('\n', '\\n').replace('\r', '')

                // 3. نداء الـ API الخاص بـ Gemini
                // لاحظ استخدام الموديل gemini-1.5-flash والـ URL الصحيح
                sh """
                curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}" \
                -H "Content-Type: application/json" \
                -d '{
                    "contents": [{
                        "parts": [{
                            "text": "Analyze these Jenkins CI/CD logs and provide a clear report including: 1. Root Cause 2. Suggested Fix 3. Severity.\\n\\nLogs:\\n${safeLogs}"
                        }]
                    }]
                }' > ai_report.json
                """

                // 4. عرض التقرير النهائي في الـ Console Output
                def report = readFile('ai_report.json')
                echo "--- GEMINI AI ANALYSIS REPORT ---"
                echo report
            }
        }
        
        success {
            echo "Build successful! Your code is clean."
        }
    }
}