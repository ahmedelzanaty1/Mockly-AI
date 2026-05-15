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
                // تنفيذ الأمر باستخدام bash لضمان عمل الـ pipefail
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
                echo "--- STEP 1: Diagnostic - Checking Available Models ---"
                
                // هذا الأمر سيكشف لنا الأسماء الصحيحة للموديلات المتاحة لحسابك
                sh """
                curl -s -X GET "https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}" > models_list.json
                echo "--- LIST OF MODELS START ---"
                cat models_list.json
                echo "--- LIST OF MODELS END ---"
                """

                echo "--- STEP 2: Attempting AI Analysis ---"
                
                // تجميع الـ logs وتنظيفها
                def combinedLogs = sh(
                    script: "cat npm-install.log build.log 2>/dev/null | tail -n 50 || echo 'No logs available'",
                    returnStdout: true
                ).trim()

                def safeLogs = combinedLogs.replace('"', '\\"').replace('\n', '\\n').replace('\r', '')

                // محاولة نداء الموديل (استخدمنا هنا gemini-1.5-flash كافتراضي)
                // لو فشل، بص على اللستة اللي طلعت في الخطوة الأولى وغير الاسم للاسم اللي هتلاقيه هناك
                sh """
                curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}" \
                -H "Content-Type: application/json" \
                -d '{
                    "contents": [{
                        "parts": [{
                            "text": "Analyze these logs and provide Root Cause and Fix: ${safeLogs}"
                        }]
                    }]
                }' > ai_report.json
                """

                def report = readFile('ai_report.json')
                echo "--- AI ANALYSIS RESULT ---"
                echo report
            }
        }
    }
}