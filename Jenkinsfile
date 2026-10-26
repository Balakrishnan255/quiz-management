pipeline {
    agent any

    environment {
        // ── Credentials stored in Jenkins Credentials Manager ──────────────
        DB_HOST         = credentials('PROD_DB_HOST')
        DB_USER         = credentials('PROD_DB_USER')
        DB_PASSWORD     = credentials('PROD_DB_PASSWORD')
        DB_NAME         = credentials('PROD_DB_NAME')
        JWT_SECRET      = credentials('PROD_JWT_SECRET')
        ANSIBLE_HOST    = credentials('PROD_ANSIBLE_HOST')   // e.g. user@1.2.3.4
        ANSIBLE_KEY     = credentials('PROD_SSH_KEY')        // SSH private-key file
        NODE_ENV        = 'production'
    }

    tools {
        nodejs 'NodeJS-20'   // name of the NodeJS installation in Jenkins Global Tools
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
                    sh 'npm ci'
                    // .env.production is committed; VITE_API_URL is already set there.
                    // Override here if you need a dynamic URL from Jenkins:
                    // sh "VITE_API_URL=https://api.yourdomain.com/api npm run build"
                    sh 'npm run build'
                }
            }
        }

        // ── 4. Test (add your test runner here) ────────────────────────────
        stage('Test') {
            steps {
                echo 'No automated tests configured yet – add your test runner here.'
                // Example: dir('backend') { sh 'npm test' }
            }
        }

        // ── 5. Deploy via Ansible ──────────────────────────────────────────
        stage('Deploy') {
            when {
                branch 'main'   // only deploy from the main branch
            }
            steps {
                withCredentials([sshUserPrivateKey(
                        credentialsId: 'PROD_SSH_KEY',
                        keyFileVariable: 'SSH_KEY_FILE')]) {
                    sh """
                        ansible-playbook ansible/deploy.yml \
                          -i ansible/inventory.ini \
                          --private-key "\$SSH_KEY_FILE" \
                          --extra-vars "db_host=\$DB_HOST \
                                        db_user=\$DB_USER \
                                        db_password=\$DB_PASSWORD \
                                        db_name=\$DB_NAME \
                                        jwt_secret=\$JWT_SECRET"
                    """
                }
            }
        }
    }

    // ── Post-pipeline notifications ────────────────────────────────────────
    post {
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed – check the console output above.'
        }
        always {
            cleanWs()   // wipe workspace after every run
        }
    }
}
