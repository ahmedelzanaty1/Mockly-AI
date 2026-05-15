pipeline {
    agent any

    tools {
        nodejs 'NodeJS 18'
    }

    environment {
        // تأكد أنك مسمي الـ ID في الـ Jenkins Credentials بـ gemini-api-key
        GEMINI_API_KEY = credentials('gemini-api-key')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                // استخدام 2>&1 | tee بيسجل الـ logs في ملف وبالوقت نفسه بيعرضها في الـ console
                sh 'npm install 2>&1 | tee npm-install.log'
            }
        }

        stage('Build React App') {
            steps {
                sh 'npm run build 2>&1 | tee build.log'
            }
        }
    }

    post {
        failure {
            script {
                echo "❌ Pipeline Failed. Starting AI Analysis..."

                // 1. تجميع الـ Logs المتاحة فقط وتجنب الـ Errors لو ملف مش موجود
                def logContent = sh(
                    script: """
                        cat npm-install.log build.log 2>/dev/null | tail -n 50 > failure_logs.txt || true
                        cat failure_logs.txt
                    """,
                    returnStdout: true
                ).trim()

                if (!logContent) {
                    logContent = "No specific logs found in files. Please check Jenkins Console."
                }

                // 2. معالجة الـ Logs عشان متكسرش الـ JSON (Escaping)
                // بنشيل الـ Double quotes والـ New lines عشان الـ Curl يبعتها صح
                def escapedLogs = logContent.replace('"', '\\"').replace('\n', '\\n').replace('\r', '')

                // 3. إرسال الطلب لـ Gemini
                echo "🤖 Requesting AI Analysis from Gemini..."
                
                def response = sh(
                    script: """
                        curl -s -X POST "[https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$](https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$){GEMINI_API_KEY}" \
                        -H "Content-Type: application/json" \
                        -d '{
                            "contents": [{
                                "parts": [{
                                    "text": "Analyze these React CI/CD logs and provide a concise summary including: 1. Root Cause, 2. Suggested Fix, 3. Severity. Logs: ${escapedLogs}"
                                }]
                            }]
                        ```

---

### ليه التعديلات دي مهمة؟

1.  **`cleanWs()`**:}'
                    """,
                    returnStdout: true
                )

                // 4. عرض النتيجة في الـ Jenkins Console
                echo "--- AI ANALYSIS REPORT ---"
                echo response
                echo "--------------------------"
            }
        }
        
        success {
            echo "✅ Pipeline مهم جداً في الـ DevOps عشان تضمن إن ملفات الـ `log` اللي بتتحلل هي بتاعة الـ Run الحالي مش اللي فات.
2.  **`escapedLogs`**: دي أهم خطوة. الـ `curl` هيفشل لو الـ logs فيها علامات تن Succeeded! No AI analysis needed."
        }
    }
}