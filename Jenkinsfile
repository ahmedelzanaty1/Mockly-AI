```groovy
pipeline {
    agent any

    tools {
        nodejs 'NodeJS 18'
    }

    stages {

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build React App') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t a7medelzanaty/ai-log-demo:latest .'
            }
        }
    }
}
```
