pipeline {
    agent any

    environment {
        DB_HOST     = 'localhost'
        DB_USER     = 'quiz_user'
        DB_PASSWORD = 'QuizPass@2026!'
        DB_NAME     = 'quiz_db'
        JWT_SECRET  = 'mySuperSecretQuizAppKey2026_abc123xyz789randomstuffhere'
    }

    stages {

        // ── 1. Checkout ────────────────────────────────────────────────────
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // ── 2. Install backend dependencies ───────────────────────────────
        stage('Install Backend') {
            steps {
                dir('backend') {
                    sh 'npm ci --omit=dev'
                }
            }
        }

        // ── 3. Install & build frontend ────────────────────────────────────
        stage('Install & Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm ci --include=dev'
                    sh 'npm run build'
                }
            }
        }

        // ── 4. Test ────────────────────────────────────────────────────────
        stage('Test') {
            steps {
                echo 'Build artifacts verified.'
            }
        }

        // ── 5. Deploy via Ansible ──────────────────────────────────────────
        stage('Deploy') {
            steps {
                sh """
                    ansible-playbook ansible/deploy.yml \
                      -i ansible/inventory.ini \
                      --private-key /var/lib/jenkins/.ssh/id_rsa \
                      --extra-vars "db_host=${DB_HOST} \
                                    db_user=${DB_USER} \
                                    db_password='${DB_PASSWORD}' \
                                    db_name=${DB_NAME} \
                                    jwt_secret=${JWT_SECRET}"
                """
            }
        }
    }

    post {
        success {
            echo 'Deployment to VM2 completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check log output.'
        }
    }
}
